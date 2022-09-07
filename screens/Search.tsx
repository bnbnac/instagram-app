import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  View,
  useWindowDimensions,
  FlatList,
  Image,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import DissmissKeyboard from "../components/DismissKeyboard";

const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 1);
  width: ${(props) => props.width / 1.5}px;
  color: black;
  padding: 5px 10px;
  border-radius: 10px;
`;
const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const MessageText = styled.Text`
  margin-top: 15px;
  color: white;
  font-weight: 600;
`;

const SEARCH_PHOTOS = gql`
  query searchPhotos($keyword: String!, $page: Int!) {
    searchPhotos(keyword: $keyword, page: $page) {
      id
      file
    }
  }
`;

export default function Search({ navigation }: any) {
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const { setValue, register, watch, handleSubmit } = useForm();
  const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PHOTOS);
  const onValid = ({ keyword }: any) => {
    startQueryFn({
      variables: {
        keyword,
        page: 1,
      },
    });
  };
  const SearchBox = () => (
    <Input
      width={width}
      style={{ backgroundColor: "white" }}
      placeholderTextColor="rgba(0,0,0,0.8)"
      placeholder="Search photos"
      autoCapitalize="none"
      returnKeyLabel="Search"
      returnKeyType="search"
      onChangeText={(text) => setValue("keyword", text)}
      onSubmitEditing={handleSubmit(onValid)}
    />
  );
  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword", {
      required: true,
      minLength: 2,
    });
  }, []);

  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Photo", { photoId: photo.id })}
    >
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / numColumns, height: 100 }}
      />
    </TouchableOpacity>
  );

  return (
    <DissmissKeyboard>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {loading ? (
          <MessageContainer>
            <ActivityIndicator size="large" />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null}
        {called ? null : (
          <MessageContainer>
            <MessageText>Search by keyword</MessageText>
          </MessageContainer>
        )}
        {data?.searchPhotos !== undefined ? (
          data?.searchPhotos.length === 0 ? (
            <MessageContainer>
              <MessageText>Could not find anything</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              numColumns={numColumns}
              data={data?.searchPhotos}
              keyExtractor={(photo) => photo.id + ""}
              renderItem={renderItem}
            />
          )
        ) : null}
      </View>
    </DissmissKeyboard>
  );
}
