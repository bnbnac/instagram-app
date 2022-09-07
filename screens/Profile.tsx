import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Button, Image, Text, View } from "react-native";
import styled from "styled-components/native";
import { ME_QUERY, SEE_PROFILE_QUERY } from "../components/UserRow";

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;
`;
const Column = styled.View`
  align-items: center;
`;

const FollowBtn = styled.TouchableOpacity`
  background-color: blue;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 4px;
`;
const FollowBtnText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 30px;
`;
const Avatar = styled.Image`
  width: 170px;
  height: 170px;
  border-radius: 90px;
  margin-right: 40px;
`;
const FOLLOW_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
    }
  }
`;
const UNFOLLOW_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
    }
  }
`;
export default function Profile({ navigation, route }: any) {
  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: `${route.params.username}'s Profile`,
      });
    }
  }, []);

  const userId = route.params.id;
  const username = route.params.username;
  const { data: myData } = useQuery(ME_QUERY);
  const myId = myData?.me?.id;

  const { data, loading, error } = useQuery(SEE_PROFILE_QUERY, {
    variables: { username },
    pollInterval: 100,
  });

  const updateUnfollowUser = (cache: any, result: any) => {
    const {
      data: {
        unfollowUser: { ok, error },
      },
    } = result;

    if (ok) {
      cache.modify({
        id: `User:${userId}`,
        fields: {
          isFollowing(prev: any) {
            return false;
          },
          totalFollowers(prev: any) {
            return prev - 1;
          },
        },
      });
      cache.modify({
        id: `User:${myId}`,
        fields: {
          totalFollowing(prev: any) {
            return prev - 1;
          },
        },
      });
    } else {
      return;
    }
  };
  const updateFollowUser = (cache: any, result: any) => {
    const {
      data: {
        followUser: { ok },
      },
    } = result;

    if (ok) {
      cache.modify({
        id: `User:${userId}`,
        fields: {
          isFollowing(prev: any) {
            return true;
          },
          totalFollowers(prev: any) {
            return prev + 1;
          },
        },
      });
      cache.modify({
        id: `User:${myId}`,
        fields: {
          totalFollowing(prev: any) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [unfollowUser] = useMutation(UNFOLLOW_MUTATION, {
    variables: {
      username: username + "",
    },
    update: updateUnfollowUser,
  });

  const [followUser] = useMutation(FOLLOW_MUTATION, {
    variables: {
      username: username + "",
    },
    update: updateFollowUser,
  });

  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Row>
        <Column>
          <Avatar source={{ uri: data?.seeProfile?.avatar }} />
          <Text style={{ color: "white", fontSize: 40 }}>
            {loading ? "loading" : username}
          </Text>
        </Column>
        {data?.seeProfile.isMe ? null : data?.seeProfile.isFollowing ? (
          <FollowBtn onPress={() => unfollowUser()}>
            <FollowBtnText>Unfollow</FollowBtnText>
          </FollowBtn>
        ) : (
          <FollowBtn onPress={() => followUser()}>
            <FollowBtnText>Follow</FollowBtnText>
          </FollowBtn>
        )}
      </Row>
      <Text style={{ color: "white", fontSize: 40 }}>
        follower: {data?.seeProfile?.totalFollowers}
      </Text>
      <Text style={{ color: "white", fontSize: 40 }}>
        following: {data?.seeProfile?.totalFollowing}
      </Text>
    </View>
  );
}
