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
  }
}));

export default function ImageRenderer({ message }) {
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
      <img src={message.image.previewImage} className={classes.previewPhoto} onClick={handleOpen} />
      <Modal
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <img src={message.image.image} />
      </Modal>
    </>
  );
}
