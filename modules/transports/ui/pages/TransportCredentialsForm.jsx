import React from "react";
import TextField from "@material-ui/core/TextField";

export default function TransportCredentialsForm({ transport, onChange }) {
  const credentialsForm = (transport.requiredCredentials || []).map(item => {
    const value = transport.credentials[item.key];

    const key = `${transport.name}-${item.key}`;
    return (
      <TextField
        key={key}
        name={item.key}
        label={item.title}
        fullWidth
        onChange={onChange}
        value={value}
        type={item.type}
        required
      />
    );
  });

  return <>{credentialsForm}</>;
}
