export function PermissionHoc({ permission, children }) {
  if (Roles.userIsInRole(Meteor.userId(), permission)) {
    console.log("asdasdasd");
    return children;
  } else {
    return null;
  }
}
