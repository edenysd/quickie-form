import type { DialogProps, GrowProps } from "@mui/material";
import { Alert, Dialog, DialogContent, IconButton } from "@mui/material";
import { forwardRef, useMemo } from "react";
import { TransitionGrowFromElementId } from "~/components/Animations";
import type { FormTemplateRow } from "~/supabase/supabase.types";
import FullFormComponent from "./FullFormComponent";
import { CloseOutlined } from "@mui/icons-material";

export default function PreviewFormTemplateDialog({
  formTemplateRow,
  originPercentage,
  ...params
}: DialogProps & {
  formTemplateRow: FormTemplateRow;
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
    <Dialog
      {...params}
      TransitionComponent={CurrentTransition}
      maxWidth={"md"}
      fullWidth
    >
      <Alert
        variant="filled"
        severity="info"
        action={
          <IconButton
            size="small"
            onClick={() => params.onClose({}, "backdropClick")}
          >
            <CloseOutlined fontSize="small" />
          </IconButton>
        }
      >
        This is a preview form templatea in safe enviroment
      </Alert>
      <DialogContent sx={{ p: 0 }}>
        <FullFormComponent
          formConfig={formTemplateRow.config}
          onlyValidationNoSubmitAction={true}
        />
      </DialogContent>
    </Dialog>
  );
}
