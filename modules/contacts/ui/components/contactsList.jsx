import { Meteor } from "meteor/meteor";
import React, { useState } from "react";

import ShowContacts from "./ShowContacts";

export default function ContactsList({ contacts, contactId, onContactSelect }) {
  const [page, setPage] = useState(0);

  const incrementPage = function(myPage) {
    setPage(++myPage);
  };

  return (
    <ShowContacts
      page={page}
      contacts={contacts}
      contactId={contactId}
      onContactSelect={onContactSelect}
      incrementPage={incrementPage}
    />
  );
}
