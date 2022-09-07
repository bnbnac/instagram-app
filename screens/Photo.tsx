import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { PHOTO_FRAGMENT, USER_FRAGMENT } from "../fragment";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";

const SEE_PHOTO = gql`
  query seePhoto($id: Int!) {
    seePhoto(id: $id) {
      ...PhotoFragment
      user {
        ...UserFragment
      }
      caption
    }
  }
  ${PHOTO_FRAGMENT}
  ${USER_FRAGMENT}
`;

export default function PhotoScreen({ navigation, route }: any) {
  const { data, loading } = useQuery(SEE_PHOTO, {
    variables: { id: route?.params?.photoId },
  });
  return (
    <ScreenLayout loading={loading}>
      <ScrollView
        style={{
          backgroundColor: "black",
        }}
        contentContainerStyle={{
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Photo {...data?.seePhoto} />
      </ScrollView>
    </ScreenLayout>
  );
}
