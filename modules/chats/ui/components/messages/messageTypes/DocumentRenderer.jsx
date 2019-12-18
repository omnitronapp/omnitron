import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  makeStyles,
  ListItemAvatar,
  Typography,
  Link
} from "@material-ui/core";
import { InsertDriveFile } from "@material-ui/icons";
import { trimMessage, getReadableSize } from "../../../../../utils";

const useStyles = makeStyles(theme => ({
  li: {
    margin: "-24px -20px"
  },
  socondary: {
    fontSize: "12px"
  },
  link: {
    marginLeft: "15px"
  }
}));

export default function DocumentRenderer({ message }) {
  const classes = useStyles();
  const { document } = message;

  return (
    <List>
      <ListItem className={classes.li}>
        <ListItemAvatar>
          <Avatar>
            <InsertDriveFile />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={trimMessage(document.title, { maxLength: 24, length: 21 })}
          secondary={
            <React.Fragment>
              <Typography className={classes.socondary} component="span" color="textSecondary">
                {getReadableSize(document.size)}
              </Typography>
              <Link className={classes.link} href={document.link}>
                Download
              </Link>
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
}
