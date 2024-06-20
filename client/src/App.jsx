import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:3001", {
        withCredentials: true,
      }),
    []
  );
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiY29tcGFueV9pZCI6IjI3MzM0NjYiLCJpYXQiOjE3MTgxMDcyNTUsImV4cCI6Mjc2MTAxMDcyNTV9.kE_rSSiyu12BI_hl-nEo4jYmhJ8cFO3OWyyljuiG5p4";
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    // socket.on("messagea", (e) => {
    //   console.log(e);
    // });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    // // const socket = new WebSocket("ws://localhost:3001");
    // console.log(socket);
    // socket.onopen = () => {
    //   socket.send("Hello!");
    // };

    // socket.onmessage = (data) => {
    //   console.log(data);
    // };
    socket.on("connect", () => {
      console.log(socket);
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    socket.emit("online", { token });

    if (socket.current) {
      console.log("connected3", socket.current);
      // socket.current.on("msg-recieve", (msg) => {
      //   setArrivalMessage({ fromSelf: false, message: msg });
      // });
    }

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 500 }} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>
      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Container>
  );
};

export default App;
