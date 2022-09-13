import {
  gql,
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import useUser from "../hooks/userUser";
import { Ionicons } from "@expo/vector-icons";

// modifying backend to contain isMine on a Message makes app faster

interface IView {
  outGoing: boolean;
}

const MessageContainer = styled.View<IView>`
  padding: 0px 10px;
  flex-direction: ${(props) => (props.outGoing ? "row-reverse" : "row")};
  align-items: flex-end;
`;
const Author = styled.View`
  margin: 0px 10px;
`;
const Avatar = styled.Image`
  height: 20px;
  width: 20px;
  border-radius: 25px;
`;
const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
  font-size: 16px;
`;
const MessageInput = styled.TextInput`
  width: 90%;
  padding: 10px 20px;
  border-radius: 1000px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  margin-right: 10px;
`;
const InputContainer = styled.View`
  width: 95%;
  margin-bottom: 50px;
  margin-top: 25px;
  flex-direction: row;
  align-items: center;
`;
const SendBtn = styled.TouchableOpacity``;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;
const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      id
      ok
    }
  }
`;
const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        avatar
        username
      }
      read
    }
  }
`;

export default function Room({ route, navigation }: any) {
  const { data: myData } = useUser();
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const updateSendMessage = (cache: any, result: any) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;
    if (ok && myData) {
      const { message } = getValues();
      setValue("message", "");
      const messageObj = {
        id,
        payload: message,
        user: {
          __typename: "User",
          username: myData.me.username,
          avatar: myData.me.avatar,
        },
        read: true,
        __typename: "Message",
      };
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: messageObj,
      });
      cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev: any) {
            const existingMessage = prev.find(
              (aMessage: any) => aMessage.__ref === messageFragment?.__ref
            );
            if (existingMessage) {
              return prev;
            }
            return [...prev, messageFragment];
          },
        },
      });
    }
  };
  const [sendMessageMutation, { loading: sending }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );
  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
  const client = useApolloClient();
  const updateQuery = (previousQuery: any, options: any) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;

    if (message.id) {
      const messageFragment = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: message,
      });

      client.cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev) {
            const existingMessage = prev.find(
              (aMessage: any) => aMessage.__ref === messageFragment?.__ref
            );
            if (existingMessage) {
              return prev;
            }
            return [...prev, messageFragment];
          },
        },
      });
    }
  };

  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    if (data?.seeRoom && !subscribed) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id: route?.params?.id,
        },
        updateQuery: updateQuery as any,
        // onError: (error) => {
        //   console.log(error);
        //   subscribeToMore({
        //     document: ROOM_UPDATES,
        //     variables: {
        //       id: route?.params?.id,
        //     },
        //     updateQuery: updateQuery as any,
        //   });
        // },
      });
      setSubscribed(true);
    }
  }, [data, subscribed]);
  const onValid = ({ message }: any) => {
    if (!sending) {
      sendMessageMutation({
        variables: { payload: message, roomId: route?.params?.id },
      });
    }
  };
  useEffect(() => {
    register("message", { required: true });
  }, [register]);
  useEffect(() => {
    navigation.setOptions({
      title: `${route?.params?.talkingTo?.username}`,
    });
  }, []);
  const renderItem = ({ item: message }: any) => (
    <MessageContainer
      outGoing={message.user.username !== route?.params?.talkingTo?.username}
    >
      <Author>
        <Avatar source={{ uri: message.user.avatar }} />
      </Author>
      <Message>{message.payload}</Message>
    </MessageContainer>
  );

  const messages = [...(data?.seeRoom?.messages ?? [])];
  messages.reverse();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          style={{ width: "100%", marginVertical: 10 }}
          inverted
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          data={messages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(message) => "" + message.id}
          renderItem={renderItem}
        />
        <InputContainer>
          <MessageInput
            placeholderTextColor="rgba(255,255,255,0.5)"
            placeholder="Write a message..."
            returnKeyLabel="Send Message"
            returnKeyType="send"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text: any) => setValue("message", text)}
            value={watch("message")}
          />
          <SendBtn
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch("message"))}
          >
            <Ionicons
              name="send"
              color={
                !Boolean(watch("message")) ? "rgba(255,255,255,0.5)" : "white"
              }
              size={22}
            />
          </SendBtn>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
