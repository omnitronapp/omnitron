import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

function UserPermissions({ userId, permissions, hasPermission, setPermission }) {
  return (
    <>
      <Typography>User Permissions</Typography>
      <List>
        {permissions.map(permission => {
          const labelId = `checkbox-list-label-${permission}`;

          return (
            <ListItem key={permission} dense button onClick={() => setPermission(permission)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  checked={hasPermission(permission)}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={permission} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
  return null;
}

export default UserPermissions;
