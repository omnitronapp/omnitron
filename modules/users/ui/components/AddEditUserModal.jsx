import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { toast } from "react-toastify";
import UserPermissions from "./UserPermissions";
import { permissions } from "../../permissions";

export default function EditUserModal({ open, user, onClose, onSave }) {
  if (!open) {
    return <></>;
  }

  const [userState, setUserState] = React.useState({
    username: user ? user.username : "",
    password: ""
  });

  const initialRoles = permissions.filter(permission => Roles.userIsInRole(user._id, [permission]));
  const [userPermissions, setUserPermission] = React.useState(initialRoles);

  function hasPermission(permission) {
    console.log(userPermissions, permission, userPermissions.includes(permission));
    return userPermissions.includes(permission);
  }

  function setPermission(permission) {
    if (userPermissions.includes(permission)) {
      const newPermissions = userPermissions.filter(item => item !== permission);
      setUserPermission(newPermissions);
    } else {
      setUserPermission([...userPermissions, permission]);
    }
  }

  function onUserChange(event) {
    const { name, value } = event.target;

    setUserState({
      ...userState,
      [name]: value
    });
  }

  function onUserSave() {
    if (userState.password === "") {
      delete userState.password;
    }

    // we are adding a user: password is required
    if (!user && !userState.password) {
      toast.error("Password is required if you are adding a user");
      return;
    }

    onSave({ user, permissions: userPermissions });
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{user ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please, fill in the following fields in order to add/edit user. In edit user: password
          field is optional, previous password will remain if you don't change it
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="username"
          label="Username"
          type="text"
          fullWidth
          value={userState.username}
          onChange={onUserChange}
        />
        <TextField
          margin="dense"
          name="password"
          label="Password"
          type="password"
          fullWidth
          value={userState.password}
          onChange={onUserChange}
        />
        <UserPermissions
          userId={user._id}
          hasPermission={hasPermission}
          setPermission={setPermission}
          permissions={permissions}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onUserSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
