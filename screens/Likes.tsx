import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import UserRow from "../components/UserRow";
import { USER_FRAGMENT } from "../fragment";

const LIKES_QUERY = gql`
  query seePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export default function Likes({ route }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(LIKES_QUERY, {
    variables: {
      id: route?.params?.photoId,
    },
    skip: !route?.params?.photoId,
  });

  const renderUser = ({ item }: any) => <UserRow {...item} />;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          ></View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={data?.seePhotoLikes}
        keyExtractor={(item, index) => index + ""}
        style={{ width: "100%" }}
        renderItem={renderUser}
      />
    </ScreenLayout>
  );
}
