import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraProps, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar, Text, TouchableOpacity, View, Image } from "react-native";
import styled from "styled-components/native";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;
const Actions = styled.View`
  flex: 0.35;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 50px;
`;
const TakePhotoBtn = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50px;
`;
const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
`;
const PhotoAction = styled.TouchableOpacity`
  background-color: white;
  padding: 5px 10px;
  border-radius: 4px;
`;
const PhotoActionText = styled.Text`
  font-weight: 600;
`;

export default function TakePhoto({ navigation }: any) {
  const camera = useRef(new Camera({}));
  const [takenPhoto, setTakenPhoto] = useState("");
  const [camReady, setCamReady] = useState(false);
  const [ok, setOk] = useState(false);
  const [camType, setCamType] = useState(CameraType.front);
  const getPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setOk(true);
    }
  };
  useEffect(() => {
    getPermissions();
  }, []);

  // tab 왔다갔다와 useEffect  //// useFocus
  // tab 왔다갔다와 useEffect
  // tab 왔다갔다와 useEffect
  // tab 왔다갔다와 useEffect

  const onCamSwitch = () => {
    if (camType === CameraType.front) {
      setCamType(CameraType.back);
    } else {
      setCamType(CameraType.front);
    }
  };
  const onCamReady = () => setCamReady(true);
  const takePhoto = async () => {
    if (camera.current && camReady) {
      const { uri } = await camera.current.takePictureAsync({
        quality: 1,
        exif: true,
        skipProcessing: true,
      });
      const asset = await MediaLibrary.createAssetAsync(uri);
      setTakenPhoto(uri);
    }
  };
  const onDismiss = () => setTakenPhoto("");
  const isFocused = useIsFocused();

  return (
    <Container>
      {isFocused ? <StatusBar hidden={true} /> : null}
      {takenPhoto === "" ? (
        <Camera
          ref={camera}
          type={camType}
          style={{ flex: 1 }}
          onCameraReady={onCamReady}
        >
          <CloseBtn onPress={() => navigation.navigate("Tabs")}>
            <Ionicons color="white" name="close" size={30} />
          </CloseBtn>
        </Camera>
      ) : (
        <Image source={{ uri: takenPhoto }} style={{ flex: 1 }} />
      )}
      {takenPhoto === "" ? (
        <Actions>
          <View />
          <TakePhotoBtn onPress={takePhoto} />
          <TouchableOpacity onPress={onCamSwitch}>
            <Ionicons color="white" size={30} name="camera-reverse" />
          </TouchableOpacity>
        </Actions>
      ) : (
        <Actions>
          <PhotoAction onPress={onDismiss}>
            <PhotoActionText>Dismiss</PhotoActionText>
          </PhotoAction>
          <PhotoAction
            onPress={() =>
              navigation.navigate("UploadForm", { file: takenPhoto })
            }
          >
            <PhotoActionText>Upload</PhotoActionText>
          </PhotoAction>
        </Actions>
      )}
    </Container>
  );
}
