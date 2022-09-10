import { makeVar, ApolloClient, InMemoryCache, split } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { HTTP_URI, WS_URL } from "react-native-dotenv";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const TOKEN = "token";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token: any) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar("");
};

// 1. setting headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

// 2. console.log error
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("gql Err", graphQLErrors);
  }
  if (networkError) {
    console.log("net Err", networkError);
  }
});

// 3. go to httpLink (should be final)
const uploadHttpLink = createUploadLink({
  uri: HTTP_URI,
});
const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

// 4. create WS link
const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
    connectionParams: {
      token: tokenVar(),
    },
  })
);

// 5. split to use wsLink only for subscription
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: {
          keyArgs: false,
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
