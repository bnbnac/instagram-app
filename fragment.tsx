import { gql } from "@apollo/client";

export const PHOTO_FRAGMENT = gql`
  fragment PhotoFragment on Photo {
    id
    file
    likes
    commentsNumber
    isLiked
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    user {
      username
      avatar
    }
    payload
    isMine
    createdAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    username
    avatar
    isFollowing
    isMe
  }
`;

export const FEED_PHOTO_FRAGMENT = gql`
  fragment FeedPhotoFragment on Photo {
    ...PhotoFragment
    user {
      ...UserFragment
    }
    caption
    createdAt
    isMine
  }
  ${PHOTO_FRAGMENT}
  ${USER_FRAGMENT}
`;

export const ROOM_FRAGMENT = gql`
  fragment RoomParts on Room {
    id
    unreadTotal
    users {
      avatar
      username
    }
  }
`;
