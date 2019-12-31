import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ChatNoteItem from "./ChatNoteItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { ChatNotesCollection } from "../../../collections";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  chatNotesTitle: {
    color: "#999",
    textAlign: "center"
  },
  chatNoteItem: {
    margin: "10px"
  },
  chatNoteSubmit: {
    marginTop: "10px"
  }
});

function ChatNotesList({ chatId, chatNotes }) {
  const classes = useStyles();

  const [chatNote, setChatNote] = React.useState("");

  function onChange(event) {
    setChatNote(event.target.value);
  }

  function onSave() {
    Meteor.call("saveChatNote", { chatId, chatNote }, () => {
      setChatNote("");
    });
  }

  const notesRender = chatNotes.map(note => {
    return <ChatNoteItem key={note._id} note={note} />;
  });

  return (
    <div>
      <Typography variant="h5" className={classes.chatNotesTitle}>
        Chat notes
      </Typography>
      <Card className={classes.chatNoteItem}>
        <CardContent>
          <TextField
            label="Note"
            multiline
            rows="4"
            value={chatNote}
            onChange={onChange}
            variant="outlined"
            fullWidth
          />
          <Button
            className={classes.chatNoteSubmit}
            variant="contained"
            color="primary"
            onClick={onSave}
          >
            Save Note
          </Button>
        </CardContent>
      </Card>
      {notesRender}
    </div>
  );
}

export default withTracker(({ chatId }) => {
  const subHandle = Meteor.subscribe("chatNotes", chatId);
  const chatNotes = ChatNotesCollection.find({}, { sort: { createdAt: -1 } }).fetch();

  return {
    ready: subHandle.ready(),
    chatNotes
  };
})(ChatNotesList);
