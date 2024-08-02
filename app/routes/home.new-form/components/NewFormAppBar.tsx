import * as React from "react";
import { Box, Button, Checkbox } from "@mui/material";
import PublishDialog from "./PublishDialog";
import { useFetcher } from "@remix-run/react";
import AppAppBar from "~/components/AppAppBar";
import { AutoAwesomeOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

function NewFormAppBar({ disablePublish }: { disablePublish: boolean }) {
  const [openDialog, setpenDialog] = React.useState(false);
  const publishFetcher = useFetcher({ key: "publish" });
  const resetFetcher = useFetcher({ key: "reset" });
  const isPublishing =
    publishFetcher.state !== "idle" &&
    publishFetcher.formData?.get("_action") === "publish";
  const isReseting =
    resetFetcher.state !== "idle" &&
    resetFetcher.formData?.get("_action") === "reset";

  const toggleDialog = React.useCallback(
    (newOpen: boolean) => () => {
      setpenDialog(newOpen);
    },
    []
  );

  return (
    <AppAppBar>
      <Box display={"flex"} justifyContent={"space-between"} flexGrow={1}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Checkbox
            disabled
            checked
            checkedIcon={
              <AutoAwesomeOutlined color="success" sx={{ opacity: 0.6 }} />
            }
            icon={<AutoAwesomeOutlined />}
            color="success"
          />
        </Box>
        <Box
          sx={{
            m: 0,
            display: "flex",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <Box component={resetFetcher.Form} method="POST" m={0}>
            <LoadingButton
              color="secondary"
              name="_action"
              value="reset"
              type="submit"
              loading={isReseting}
              disabled={isPublishing || disablePublish || isReseting}
            >
              Reset
            </LoadingButton>
          </Box>

          <Button
            id="publish-form-template"
            disabled={isPublishing || disablePublish || isReseting}
            onClick={toggleDialog(true)}
          >
            Publish
          </Button>
        </Box>
      </Box>

      <PublishDialog handleClose={toggleDialog(false)} open={openDialog} />
    </AppAppBar>
  );
}

export default NewFormAppBar;
