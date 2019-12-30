import React from "react";

import { Box, InputBase, IconButton, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  }
}));

export default function ChatSearch({ onChatSearch, searchChat }) {
  const classes = useStyles();

  const onInputChange = function(event) {
    onChatSearch(event.target.value);
  };

  return (
    <Box className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        onChange={onInputChange}
        value={searchChat}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
