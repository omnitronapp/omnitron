import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import { ListItem, TextField } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

const drawerWidth = "25%";

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    paddingTop: "64px"
  },
  toolbar: theme.mixins.toolbar,
  clearInputBtn: {
    margin: "auto 0",
    cursor: "pointer"
  }
}));

export default function CustomDrawer({ children, onSearchContact, searchContact }) {
  const classes = useStyles();

  const clearSearchInput = function() {
    onSearchContact("");
  };

  const onInputChange = function(event) {
    onSearchContact(event.target.value);
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
      anchor="left"
    >
      <ListItem>
        <TextField
          fullWidth
          name="search"
          placeholder="Search"
          value={searchContact}
          onChange={onInputChange}
          InputProps={{
            disableUnderline: true,
            endAdornment:
              searchContact.trim().length === 0 ? null : (
                <ClearIcon onClick={clearSearchInput} className={classes.clearInputBtn} />
              )
          }}
        />
      </ListItem>

      <Divider />
      {children}
    </Drawer>
  );
}
