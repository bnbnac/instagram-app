import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import DissmissKeyboard from "../components/DismissKeyboard";
import { FEED_PHOTO_FRAGMENT } from "../fragment";
import { HeaderRightText } from "./SelectPhoto";
import { ReactNativeFile } from "apollo-upload-client";

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding: 0px 50px;
`;
const Photo = styled.Image`
  height: 350px;
`;
const CpationContainer = styled.View`
  margin-top: 30px;
`;
const Caption = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
`;

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhotoFragment
    }
  }
  ${FEED_PHOTO_FRAGMENT}
`;

export default function UploadForm({ route, navigation }: any) {
  const updateUploadPhoto = (cache: any, result: any) => {
    const {
      data: { uploadPhoto },
    } = result;
    if (uploadPhoto.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev: any) {
            return [uploadPhoto, ...prev];
          },
        },
      });
    }
    navigation.navigate("Tabs");
  };
  const [uploadPhotoMutation, { loading }] = useMutation(
    UPLOAD_PHOTO_MUTATION,
    { update: updateUploadPhoto }
  );

  const headerRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );
  const { register, handleSubmit, setValue } = useForm();
  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );

  useEffect(() => {
    register("caption");
  }, [register]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? headerRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  const onValid = ({ caption }: any) => {
    const file = new ReactNativeFile({
      uri: route.params.file,
      name: "1.jpg",
      type: "image/jpeg",
    });
    uploadPhotoMutation({
      variables: {
        caption,
        file,
      },
    });
  };

  return (
    <DissmissKeyboard>
      <Container>
        <Photo resizeMode="contain" source={{ uri: route.params.file }} />
        <CpationContainer>
          <Caption
            onChangeText={(text: string) => setValue("caption", text)}
            returnKeyType="done"
            placeholder="Write a caption.."
            placeholderColor="rgba(0,0,0,0.5)"
            onSubmitEditing={handleSubmit(onValid)}
          />
        </CpationContainer>
      </Container>
    </DissmissKeyboard>
  );
}
