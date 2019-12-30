import React from "react";
import TextField from "@material-ui/core/TextField";

export default function TransportWebhooksInformation({ webhooks }) {
  const webhooksRender = webhooks.map(webhook => {
    return (
      <TextField
        key={webhook.key}
        value={webhook.url}
        label={webhook.title}
        readOnly={true}
        fullWidth
        helperText={`${webhook.method} method`}
      />
    );
  });

  return <>{webhooksRender}</>;
}
