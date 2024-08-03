import type { DialogProps, GrowProps } from "@mui/material";
import { Dialog } from "@mui/material";
import { forwardRef, useMemo } from "react";
import { TransitionGrowFromElementId } from "~/components/Animations";
import FormAssistedPreview from "~/components/FormAssistedPreview";
import type { FormTemplateRow } from "~/supabase/supabase.types";

export default function PreviewFormTemplateDialog({
  row,
  originPercentage,
  ...params
}: DialogProps & {
  row: FormTemplateRow;
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
      scroll="paper"
      maxWidth="lg"
    >
      <FormAssistedPreview formConfig={row.config} />
    </Dialog>
  );
}
