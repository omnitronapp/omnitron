export function trimMessage(message, options = {}) {
  const { maxLength = 13, length = 10 } = options;

  if (!message) {
    return "";
  }
  if (message.length > maxLength) {
    return `${message.substring(0, length)}...`;
  }
  return message;
}

export function getReadableSize(bytes) {
  const sufixes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const getBytes = bytes => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (!bytes && "0 Bytes") || (bytes / Math.pow(1024, i)).toFixed(2) + " " + sufixes[i];
  };

  return getBytes(bytes);
}
