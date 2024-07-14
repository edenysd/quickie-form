import React, { useEffect, useRef } from "react";
import type { SlideProps } from "@mui/material";
import {
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFetcher } from "@remix-run/react";

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PublishDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const fetcher = useFetcher({ key: "publish" });
  const isPublishing =
    fetcher.state !== "idle" && fetcher.formData?.get("_action") === "publish";

  //Save handleClose but bypass reactivity
  const handleCloseRef = useRef(handleClose);
  handleCloseRef.current = handleClose;

  useEffect(() => {
    if (!isPublishing) {
      handleCloseRef.current();
    }
  }, [isPublishing]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={!isPublishing ? handleClose : () => {}}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Publish Form"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Confirm that you want to publish current form.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isPublishing} onClick={handleClose}>
          Disagree
        </Button>
        <Box
          component={fetcher.Form}
          method="POST"
          sx={{
            m: 0,
          }}
        >
          <LoadingButton
            name="_action"
            value="publish"
            type="submit"
            loading={isPublishing}
            onSubmit={handleClose}
          >
            Publish
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
