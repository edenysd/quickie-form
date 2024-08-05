import type { DialogProps, GrowProps } from "@mui/material";
import { Alert, Dialog, DialogContent } from "@mui/material";
import { forwardRef, useMemo } from "react";
import { TransitionGrowFromElementId } from "~/components/Animations";
import FormAssistedPreview from "~/components/FormAssistedPreview";
import type { FormTemplateRow } from "~/supabase/supabase.types";

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
      <Alert variant="filled" severity="info">
        This is a preview form templatea in safe enviroment
      </Alert>
      <DialogContent sx={{ p: 0 }}>
        <FormAssistedPreview formConfig={formTemplateRow.config} />
      </DialogContent>
    </Dialog>
  );
}
