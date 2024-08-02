import type { DialogProps, GrowProps } from "@mui/material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Form } from "@remix-run/react";
import { forwardRef, useMemo } from "react";
import { TransitionGrowFromElementId } from "~/components/Animations";

export default function RemoveFormTemplateDialog({
  row,
  originPercentage,
  ...params
}: DialogProps & {
  row: {
    id: string;
    name: "string";
    updated_at: string;
  };
  originPercentage: { x: number; y: number };
}) {
  const CurrentTransition = useMemo(
    () =>
      forwardRef(function CurrentTransition(props: GrowProps, ref) {
        return (
          <TransitionGrowFromElementId
            {...props}
            ref={ref}
            originPercentage={originPercentage}
          />
        );
      }),
    [originPercentage]
  );

  return (
    <Dialog {...params} TransitionComponent={CurrentTransition}>
      <Alert variant="filled" color="error">
        This action is not reversible
      </Alert>
      <DialogTitle>Remove Form Template</DialogTitle>
      <DialogContent>
        Are you sure that you want to remove the <b>{row.name}</b> form template
      </DialogContent>
      <DialogActions>
        <Box method="POST" component={Form} display={"flex"} gap={1} m={0}>
          <input type="hidden" name="formTemplateId" value={row.id} />
          <Button
            color="inherit"
            onClick={() => params.onClose!({}, "backdropClick")}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="outlined"
            type="submit"
            name="_action"
            value="remove_by_id"
          >
            Remove
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
