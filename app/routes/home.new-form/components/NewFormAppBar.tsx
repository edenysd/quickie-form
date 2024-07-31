import * as React from "react";
import { Box, Button, Checkbox } from "@mui/material";
import PublishDialog from "./PublishDialog";
import { useFetcher } from "@remix-run/react";
import AppAppBar from "~/components/AppAppBar";
import { AutoAwesomeOutlined } from "@mui/icons-material";

function NewFormAppBar({ disablePublish }: { disablePublish: boolean }) {
  const [openDialog, setpenDialog] = React.useState(false);
  const fetcher = useFetcher({ key: "publish" });
  const isPublishing =
    fetcher.state !== "idle" && fetcher.formData?.get("_action") === "publish";

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
          }}
        >
          <Box display={"flex"}>
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
        </Box>
        <Box
          sx={{
            m: 0,
            display: "flex",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <Button
            disabled={isPublishing || disablePublish}
            onClick={toggleDialog(true)}
          >
            Publish
          </Button>
        </Box>

        <PublishDialog handleClose={toggleDialog(false)} open={openDialog} />
      </Box>
    </AppAppBar>
  );
}

export default NewFormAppBar;
