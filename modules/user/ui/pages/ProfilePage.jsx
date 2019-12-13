import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import React from "react";
import { Container, Paper, TextField, Button } from "@material-ui/core";

function ProfilePage({ user }) {
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
      <Paper>
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
        <Button type="submit" fullWidth variant="contained" color="primary" onClick={updateUser}>
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
