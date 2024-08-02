import { forwardRef, useEffect, useRef, useState } from "react";
import type { GrowProps } from "@mui/material";
import {
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
import { useSnackbar } from "notistack";
import {
  calculateOriginCoordsPercentageFromElement,
  TransitionGrowFromElementId,
} from "~/components/Animations";

export const publishDialogActionContent = z.object({
  _action: z.literal("publish"),
  templateName: z.string().min(3),
});

const CurrentTransition = forwardRef(function CurrentTransition(
  props: GrowProps,
  ref
) {
  const [origin, setOrigin] = useState<null | {
    x: number;
    y: number;
  }>(null);

  useEffect(() => {
    const originElement = document.getElementById("publish-form-template");
    if (!originElement) return;

    const originCoordsPercentage = calculateOriginCoordsPercentageFromElement({
      originElement,
    });
    setOrigin(originCoordsPercentage);
  }, []);

  return (
    <TransitionGrowFromElementId
      {...props}
      ref={ref}
      originPercentage={origin}
    />
  );
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

  const { enqueueSnackbar } = useSnackbar();

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

  const handleCloseAction = useRef(() => {});
  handleCloseAction.current = () => {
    if (open) {
      handleClose();
      form.reset();
      enqueueSnackbar({
        message: "New Form Template created",
        variant: "success",
      });
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
      TransitionComponent={CurrentTransition}
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
              Are you sure that you want to publish the current form template.
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
            Cancel
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
