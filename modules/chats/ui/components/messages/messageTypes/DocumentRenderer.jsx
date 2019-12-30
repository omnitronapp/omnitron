import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
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
          primary={trimMessage(document.title, 27, 24)}
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
