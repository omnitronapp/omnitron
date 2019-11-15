import { Meteor } from "meteor/meteor";

import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { toast } from "react-toastify";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
        Omnisend
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function LoginPage({ history }) {
  const classes = useStyles();

  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  function onChange(event) {
    const { name, value } = event.target;

    setCredentials({
      ...credentials,
      [name]: value
    });
  }

  function onLogin(event) {
    event.preventDefault();

    if (credentials.email === "" || credentials.password === "") {
      // TODO: throw notification error

      return toast.error("Введите email и пароль");
    }

    Meteor.loginWithPassword({ username: credentials.email }, credentials.password, err => {
      if (err) {
        return toast.error("Такого пользователя не существует");
      }

      history.push("/messaging");
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Войти в систему
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={onChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onLogin}
          >
            Войти
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Забыли пароль?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default withRouter(LoginPage);
