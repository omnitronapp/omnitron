import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";

export default function MessageInput({ sendMessage }) {
  const [message, setMessage] = useState();

  function onChange(event) {
    const { value } = event.target;
    setMessage(value);
  }

  function onSendMessage() {
    if (sendMessage) {
      sendMessage(message);
    }

    setMessage("");
  }

  return (
    <>
      <TextField
        id="outlined-multiline-static"
        label="Multiline"
        multiline
        rows="4"
        placeholder="Write your message"
        value={message}
        onChange={onChange}
        variant="outlined"
      />
      <Button variant="outlined" color="primary" onClick={onSendMessage}>
        Отправить
      </Button>
    </>
  );
}
