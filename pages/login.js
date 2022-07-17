import React from "react";

import { signInWithPopup } from "firebase/auth";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import Head from "next/head";

import { auth, provider } from "../firebase";

const Login = () => {
  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="/whatsapp.svg" />
        <Button variant="outlined" onClick={signIn}>
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  padding: 100px;
  align-items: center;
  background-color: #fff;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 150px;
  width: 150px;
  margin-bottom: 50px;
`;
