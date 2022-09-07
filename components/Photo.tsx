import React, { useEffect, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import type { StackNavigationProp } from "@react-navigation/stack";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavFactoryParamList } from "../navigators/StackNavFactory";
import { gql, useMutation } from "@apollo/client";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View``;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
const File = styled.Image``;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  color: white;
  margin-left: 5px;
`;
const Likes = styled.Text`
  color: white;
  margin: 7px 0px;
  font-weight: 600;
`;
const ExtraContainer = styled.View`
  padding: 10px;
`;

export default function Photo({
  id,
  user,
  caption,
  file,
  isLiked,
  likes,
}: any) {
  const { width, height } = useWindowDimensions();
  const navigation: StackNavigationProp<StackNavFactoryParamList> =
    useNavigation();
  const [imageHeight, setImageHeight] = useState(height - 450);
  useEffect(() => {
    Image.getSize(file, (width, height) => {
      setImageHeight(height / 3);
    });
  }, [file]);

  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev: boolean) {
            return !prev;
          },
          likes(prev: number) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });

  return (
    <Container>
      <Header
        onPress={() =>
          navigation.navigate("Profile", {
            username: user.username,
            id: user.id,
          })
        }
      >
        <UserAvatar resizeMode="cover" source={{ uri: user.avatar }} />
        <Username>{user.username}</Username>
      </Header>
      <File
        resizeMode="cover"
        style={{
          width,
          height: imageHeight,
        }}
        source={{ uri: file }}
      />
      <ExtraContainer>
        <Actions>
          <Action onPress={toggleLikeMutation}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? "tomato" : "white"}
              size={22}
            />
          </Action>
          <Action onPress={() => navigation.navigate("Comments")}>
            <Ionicons name="chatbubble-outline" color="white" size={22} />
          </Action>
        </Actions>
        <TouchableOpacity
          onPress={() => navigation.navigate("Likes", { photoId: id })}
        >
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <Caption>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                username: user.username,
                id: user.id,
              })
            }
          >
            <Username>{user.username}</Username>
          </TouchableOpacity>
          <CaptionText>{caption}</CaptionText>
        </Caption>
      </ExtraContainer>
    </Container>
  );
}
