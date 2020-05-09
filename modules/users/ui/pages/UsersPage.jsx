import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";
import { toast } from "react-toastify";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
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

import EditUserModal from "../components/AddEditUserModal";
import RemoveUserModal from "../components/RemoveUserModal";
import LoadingBar from "../../../layouts/components/LoadingBar";

const useStyles = makeStyles({
  paper: {
    padding: "32px",
    paddingTop: "16px"
  }
});

function UsersPage({ ready, users }) {
  const classes = useStyles();

  const [removeUser, setRemoveUser] = React.useState();
  const [showAddEditUserModal, setShowAddEditUserModal] = React.useState(false);
  const [editUser, setEditUser] = React.useState();

  if (!ready) {
    return <LoadingBar />;
  }

  function onRemoveModalClose() {
    setRemoveUser(undefined);
  }

  function onAddEditModalClose() {
    setShowAddEditUserModal(false);
    setEditUser(undefined);
  }

  function onRemoveUser() {
    if (removeUser) {
      onRemoveModalClose();

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

  function onUserSave(userProps) {
    onAddEditModalClose();

    if (editUser) {
      Meteor.call("editUser", editUser._id, userProps, (err, res) => {
        if (err) {
          return toast.error("Failed to update the user");
        }
        return toast.success("Successfully updated the user");
      });
    } else {
      Meteor.call("addUser", userProps, (err, res) => {
        if (err) {
          return toast.error("Failed to save the user");
        }
        return toast.success("Successfully saved the user");
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
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => {
              setShowAddEditUserModal(true);
              setEditUser(user);
            }}
          >
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
      <Paper className={classes.paper}>
        <Typography variant="h6">Users List</Typography>
        <List>{usersList}</List>

        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setEditUser(undefined);
            setShowAddEditUserModal(true);
          }}
        >
          Add user
        </Button>

        <RemoveUserModal
          open={removeUser !== undefined}
          user={removeUser}
          onClose={onRemoveModalClose}
          onRemove={onRemoveUser}
        />
        <EditUserModal
          open={showAddEditUserModal}
          user={editUser}
          onClose={onAddEditModalClose}
          onSave={onUserSave}
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
