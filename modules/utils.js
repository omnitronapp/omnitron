import moment from "moment";

export function formatDate(date, format = "DD.MM.YYYY") {
  return moment(date).format(format);
}

export function trimMessage(message, maxLength = 13, length = 10) {
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
