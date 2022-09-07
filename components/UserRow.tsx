import { useNavigation } from "@react-navigation/native";
import { StackNavFactoryParamList } from "../navigators/StackNavFactory";
import { isLoggedInVar } from "../apollo";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import styled from "styled-components/native";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { PHOTO_FRAGMENT } from "../fragment";
import { View } from "react-native";

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
`;

const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin-right: 10px;
`;
const Username = styled.Text`
  font-weight: 600;
  color: white;
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
export const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
    }
  }
`;

export const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      avatar
      isMe
      isFollowing
      totalFollowing
      totalFollowers
    }
  }
`;

export default function UserRow({ avatar, id, username }: any) {
  const navigation: StackNavigationProp<StackNavFactoryParamList> =
    useNavigation();

  const { data: myData } = useQuery(ME_QUERY);
  const myId = myData?.me?.id;
  const {
    data: userData,
    loading,
    error,
  } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: username + "",
    },
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
        id: `User:${id}`,
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
        id: `User:${id}`,
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
    <Wrapper>
      <Column onPress={() => navigation.navigate("Profile", { username, id })}>
        <Avatar source={{ uri: avatar }} />
        <Username>{loading ? "loading" : username}</Username>
      </Column>
      {/* {userData?.seeProfile
        ? getButton(userData.seeProfile || undefined)
        : null} */}
      {userData?.seeProfile.isMe ? null : userData?.seeProfile.isFollowing ? (
        <FollowBtn onPress={() => unfollowUser()}>
          <FollowBtnText>Unfollow</FollowBtnText>
        </FollowBtn>
      ) : (
        <FollowBtn onPress={() => followUser()}>
          <FollowBtnText>Follow</FollowBtnText>
        </FollowBtn>
      )}
    </Wrapper>
  );
}

// {
//   userData?.seeProfile.isMe ? null : userData?.seeProfile.isFollowing ? (
//     <FollowBtn onPress={() => unfollowUser()}>
//       <FollowBtnText>Unfollow</FollowBtnText>
//     </FollowBtn>
//   ) : (
//     <FollowBtn onPress={() => followUser()}>
//       <FollowBtnText>Follow</FollowBtnText>
//     </FollowBtn>
//   );
// }
