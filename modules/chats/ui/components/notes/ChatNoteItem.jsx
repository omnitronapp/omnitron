import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from "../../../../utils";

const useStyles = makeStyles({
  chatNoteItem: {
    margin: "10px"
  }
});

export default function ChatNoteItem({ note }) {
  const classes = useStyles();
  return (
    <Card className={classes.chatNoteItem}>
      <CardHeader
        avatar={<Avatar>A</Avatar>}
        title={note.username}
        subheader={formatDate(note.createdAt, "MMMM DD, YYYY")}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {note.text}
        </Typography>
      </CardContent>
    </Card>
  );
}
