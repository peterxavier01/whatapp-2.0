import React from "react";
import { Circle } from "better-react-spinkit";

const Loading = () => {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="/whatsapp.svg"
          alt="whatsapp-logo"
          height={120}
          width={120}
          style={{ marginBottom: 10 }}
        />
        <Circle color="#3cbc28" size={60} />
      </div>
    </center>
  );
};

export default Loading;
