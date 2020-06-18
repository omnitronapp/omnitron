export function PermissionHoc({ permission, children }) {
  if (Roles.userIsInRole(Meteor.userId(), permission)) {
    return children;
  } else {
    return null;
  }
}
