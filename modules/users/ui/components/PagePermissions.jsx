import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paper: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
    textAlign: "center"
  },

  container: {
    paddingTop: theme.spacing(5)
  }
}));

export function PagePermissions(PageComponent, permission) {
  return props => {
    const classes = useStyles();
    if (Roles.userIsInRole(Meteor.userId(), permission)) {
      return <PageComponent {...props} />;
    }
    return (
      <Container className={classes.container}>
        <Typography variant="h4">
          <Paper variant="elevation" className={classes.paper} elevation={3}>
            You don't have permission {permission} to access this page
          </Paper>
        </Typography>
      </Container>
    );
  };
}
