import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  previewPhoto: {
    width: "100%",
    maxWidth: "100px"
  },
  video: {
    width: "150px"
  }
}));

export default function VideoRenderer({ message }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <video
        className={classes.video}
        src={message.video.link}
        onClick={handleOpen}
        autoPlay={true}
        loop={true}
        muted={true}
      />
      <Modal
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <video src={message.video.link} controls />
      </Modal>
    </>
  );
}
