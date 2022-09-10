import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components/native";
import {
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { colors } from "../colors";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;
const Top = styled.View`
  flex: 1;
  background-color: black;
`;
const Bottom = styled.View`
  flex: 1;
  background-color: black;
`;
const ImageContainer = styled.TouchableOpacity``;
const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;
export const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

export default function SelectPhoto({ navigation }: any) {
  const numColumns = 4;
  const { width } = useWindowDimensions();

  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [chosenPhoto, setChosenPhoto] = useState("");

  const getPhotos = async () => {
    const { assets } = await MediaLibrary.getAssetsAsync({
      sortBy: ["creationTime"],
    });
    setPhotos(assets);
    setChosenPhoto(assets[0]?.uri);
  };
  const getPermissions = async () => {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
    if (status !== "granted" && canAskAgain) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        setOk(true);
        getPhotos();
      }
    } else if (status === "granted") {
      setOk(true);
      getPhotos();
    }
  };
  const HeaderRight = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate("UploadForm", { file: chosenPhoto })}
    >
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );
  useEffect(() => {
    getPermissions();
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [chosenPhoto]);
  const choosePhoto = (uri: string) => {
    setChosenPhoto(uri);
  };
  const renderItem = ({ item: photo }: any) => (
    <TouchableOpacity>
      <ImageContainer onPress={() => choosePhoto(photo.uri)}>
        <Image
          source={{ uri: photo.uri }}
          style={{ width: width / numColumns, height: 100 }}
        />
        <IconContainer>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={photo.uri === chosenPhoto ? colors.blue : "white"}
          />
        </IconContainer>
      </ImageContainer>
    </TouchableOpacity>
  );

  return (
    <Container>
      <Top>
        {chosenPhoto === "" ? null : (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          numColumns={numColumns}
          keyExtractor={(photo) => photo.id}
          renderItem={renderItem}
        />
      </Bottom>
    </Container>
  );
}
