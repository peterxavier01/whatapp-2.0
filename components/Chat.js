import React from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

const Chat = ({ id, users, setIsSidebarOpen, screenWidth }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientSnapshotQuery = query(
    collection(db, "users"),
    where("email", "==", getRecipientEmail(users, user))
  );
  const recipientSnapshot = useCollection(recipientSnapshotQuery);

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  const enterChat = () => {
    router.push(`/chat/${id}`);
    if (screenWidth <= 900) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
  text-transform: capitalize;
`;
