import React, { useState } from "react";

import ChatsList from "./ChatsList";

export default function ChatsListWrapper({ chats, chatId, onChatSelect, searchChat }) {
  const [page, setPage] = useState(0);

  const incrementPage = function(myPage) {
    setPage(++myPage);
  };

  return (
    <ChatsList
      page={page}
      chats={chats}
      chatId={chatId}
      onChatSelect={onChatSelect}
      incrementPage={incrementPage}
      searchChat={searchChat}
    />
  );
}
