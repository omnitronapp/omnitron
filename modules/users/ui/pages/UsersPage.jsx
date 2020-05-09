import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";
import { toast } from "react-toastify";

import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";

import RemoveUserModal from "../components/RemoveUserModal";
import LoadingBar from "../../../layouts/components/LoadingBar";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  }
}));

function UsersPage({ ready, users }) {
  const [removeUser, setRemoveUser] = React.useState();

  const classes = useStyles();

  if (!ready) {
    return <LoadingBar />;
  }

  function onRemoveModalClose() {
    setRemoveUser(undefined);
  }

  function onRemoveUser() {
    if (removeUser) {
      setRemoveUser(undefined);

      if (Meteor.user()._id === removeUser._id) {
        toast.warn("You can't remove yourself!");
        return;
      }

      if (Meteor.users.find().count() === 1) {
        toast.warn("You can't remove the last user!");
        return;
      }

      Meteor.call("removeUser", removeUser._id, function(err, res) {
        console.log(err, res);
      });
    }
  }

  const usersList = users.map(user => {
    return (
      <ListItem key={user._id}>
        <ListItemAvatar>
          <Avatar>Hi</Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.username} />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="remove"
            onClick={() => {
              setRemoveUser(user);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  });

  return (
    <Container>
      <Paper>
        <Typography variant="h6" className={classes.title}>
          Users List
        </Typography>
        <List>{usersList}</List>
        <RemoveUserModal
          open={removeUser !== undefined}
          user={removeUser}
          onClose={onRemoveModalClose}
          onRemove={onRemoveUser}
        />
      </Paper>
    </Container>
  );
}

export default withTracker(() => {
  const subHandler = Meteor.subscribe("users");

  return {
    ready: subHandler.ready(),
    users: Meteor.users.find().fetch()
  };
})(UsersPage);
