import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  paper: {
    padding: "32px",
    paddingTop: "16px"
  }
});

function ProfilePage({ user }) {
  const classes = useStyles();

  const [credentials, setCredentials] = React.useState({ username: user.username, password: "" });

  function onChange(event) {
    const { name, value } = event.target;

    setCredentials({
      ...credentials,
      [name]: value
    });
  }

  function updateUser() {
    Meteor.call("updateUserCredentials", credentials);
  }

  return (
    <Container>
      <Paper className={classes.paper}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={credentials.username}
          onChange={onChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="New Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={onChange}
        />
        <Button type="submit" variant="contained" color="primary" onClick={updateUser}>
          Update user
        </Button>
      </Paper>
    </Container>
  );
}

export default withTracker(() => {
  return {
    user: Meteor.user() || {}
  };
})(ProfilePage);
