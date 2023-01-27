import React, { useState, useRef } from "react";
import { useRouter } from "next/router";

import { Avatar, IconButton } from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import MenuIcon from "@material-ui/icons/Menu";

import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  doc,
  setDoc,
  query,
  collection,
  orderBy,
  serverTimestamp,
  addDoc,
  where,
} from "firebase/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages, handleSidebarToggle }) => {
  const endOfMessagesRef = useRef(null);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");

  const messagesSnapRef = doc(db, "messages", router.query.id);

  const [messagesSnapshot] = useCollection(
    query(collection(messagesSnapRef, "messages"), orderBy("timestamp", "asc"))
  );

  const recipientSnapshotQuery = query(
    collection(db, "users"),
    where("email", "==", getRecipientEmail(chat.users, user))
  );

  const [recipientSnapshot] = useCollection(recipientSnapshotQuery);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={message}
        />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // updates last seen status
    setDoc(
      doc(db, "users", user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    const ref = doc(db, "messages", router.query.id);
    addDoc(collection(ref, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        <IconButton>
          <MenuContainer onClick={handleSidebarToggle}>
            <MenuIcon />
          </MenuContainer>
        </IconButton>
        {recipient ? (
          <RecipientAvatar src={recipient?.photoURL} />
        ) : (
          <RecipientAvatar>{recipientEmail[0]}</RecipientAvatar>
        )}
        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last Active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active status...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 6px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MenuContainer = styled.div`
  @media screen and (min-width: 900px) {
    display: none;
  }
`;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const RecipientAvatar = styled(Avatar)`
  text-transform: capitalize;
`;

const EndOfMessage = styled.div`
  bottom: 5px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  align-items: center;
  padding: 10px;
  position: sticky;
  z-index: 100;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
  outline: none;
  border: 1px solid whitesmoke;
`;
