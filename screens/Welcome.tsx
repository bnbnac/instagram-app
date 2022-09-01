import React from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { colors } from "../colors";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: black;
`;

const Logo = styled.Image`
  max-width: 50%;
  height: 100px;
`;

const CreateAccount = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 7px 10px;
  border-radius: 5px;
`;
const CreateAccountText = styled.Text`
  color: white;
  font-weight: 600;
`;

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 600;
  margin-top: 10px;
`;

export default function Welcome(props: any) {
  const goToCreateAccount = () => props.navigation.navigate("CreateAccount");
  const goToLogin = () => props.navigation.navigate("Login");
  return (
    <Container>
      <Logo resizeMode="center" source={require("../assets/logo.png")} />
      <CreateAccount onPress={goToCreateAccount}>
        <CreateAccountText>Create Account</CreateAccountText>
      </CreateAccount>
      <TouchableOpacity onPress={goToLogin}>
        <LoginLink>Login</LoginLink>
      </TouchableOpacity>
    </Container>
  );
}
