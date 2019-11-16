export function trimMessage(message) {
  if (message.length > 13) {
    return `${message.substring(0, 10)}...`;
  }
  return message;
}
