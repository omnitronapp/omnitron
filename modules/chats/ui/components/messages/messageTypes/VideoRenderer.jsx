import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
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
