import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import { useEffect } from "react";
import { ContactsCollection } from "../../../../contacts/collections";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function DialogSelect() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [users, setUsers] = React.useState(null);

  useEffect(
    () => {
      Meteor.call("getUsers", (err, res) => {
        setUsers(res);
      });
    },
    [Meteor.userId()]
  );

  const handleChange = event => {
    console.log(`event: ${event}`);
    setUserId(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const usersRender = users.map(user => {
  //   return <MenuItem value={user._id}>{user.username}</MenuItem>;
  // });

  function UsersRender(params) {
    return params.users.map(user => <MenuItem value={user._id}>{user.username}</MenuItem>);
  }

  return (
    <>
      <Button onClick={handleClickOpen}>
        <CompareArrowsIcon />
      </Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Fill the form</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">User</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={userId}
                onChange={handleChange}
                input={<Input />}
              >
                <UsersRender users={users} />
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
