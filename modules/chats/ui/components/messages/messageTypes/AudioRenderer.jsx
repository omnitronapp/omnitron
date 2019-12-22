import React from "react";

export default function AudioPlayer({ message }) {
  const { voice } = message;
  return (
    <audio controls>
      <source src={voice.link} type={voice.type} />
      Your browser does not support the audio element.
    </audio>
  );
}
