import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ScreenLayout from "../components/ScreenLayout";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragment";
import Photo from "../components/Photo";
import { Ionicons } from "@expo/vector-icons";

const FEED_QUERY = gql`
  query seeFeed($page: Int!) {
    seeFeed(page: $page) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export default function Feed({ navigation }: any) {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch, loading, fetchMore } = useQuery(FEED_QUERY, {
    variables: { page },
  });
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderPhoto = ({ item }: any) => {
    return <Photo {...item} />;
  };
  const MessagesButton = () => (
    <TouchableOpacity
      style={{ marginRight: 25 }}
      onPress={() => navigation.navigate("Messages")}
    >
      <Ionicons name="paper-plane" color="white" size={20} />
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({ headerRight: MessagesButton });
  }, []);
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.05}
        onEndReached={() => {
          fetchMore({ variables: { page: page + 1 } });
          setPage(page + 1);
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}
