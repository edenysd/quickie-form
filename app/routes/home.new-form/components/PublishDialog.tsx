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
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const publishDialogActionContent = z.object({
  _action: z.literal("publish"),
  templateName: z.string().min(3),
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

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: publishDialogActionContent });
    },
  });

  const labelRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      labelRef.current?.focus();
    }
  }, [open]);

  // @TODO check for more explicit remix primitives for await actions executions
  const handleCloseAction = useRef(() => {});
  handleCloseAction.current = () => {
    if (open) {
      handleClose();
      form.reset();
    }
  };

  useEffect(() => {
    if (!isPublishing) {
      handleCloseAction.current();
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
      <Box
        {...getFormProps(form)}
        component={fetcher.Form}
        method="POST"
        sx={{
          m: 0,
        }}
      >
        <DialogTitle>{"Publish Form"}</DialogTitle>
        <DialogContent>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <DialogContentText id="alert-dialog-slide-description">
              Confirm that you want to publish current form.
            </DialogContentText>
            <TextField
              {...getInputProps(fields.templateName, { type: "text" })}
              key={fields.templateName.key}
              inputRef={labelRef}
              label="Template Name"
              required
              helperText={fields.templateName.errors?.at(0)}
              error={!!fields.templateName.errors?.length}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={isPublishing} onClick={handleClose}>
            Disagree
          </Button>

          <LoadingButton
            name="_action"
            value="publish"
            type="submit"
            loading={isPublishing}
            onSubmit={handleClose}
          >
            Publish
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
