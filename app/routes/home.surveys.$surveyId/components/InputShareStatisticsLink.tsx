import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useLoaderData, useParams } from "@remix-run/react";
import type { MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import {
  CancelScheduleSend,
  ContentCopyOutlined,
  DoneOutlined,
  LinkOutlined,
  SendOutlined,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import type { loader } from "../route";

export default function InputShareStatisticsLink(componentParams) {
  const loaderData = useLoaderData<typeof loader>();
  const isResultShared = !!loaderData.surveyDetails.data?.is_statistics_shared;
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCopiedToClipboard(false);
  };

  useEffect(() => {
    const surveyShareLink =
      window.location.origin + `/surveys/statistics/${params.surveyId}`;
    setShareLink(surveyShareLink);
  }, [params.surveyId]);

  const handleSend: MouseEventHandler<HTMLButtonElement> = async (e) => {
    setCopiedToClipboard(true);

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareLink!);
      enqueueSnackbar({
        message: "Link coppied to clipboard",
        variant: "info",
      });
    }
  };

  return (
    <>
      <IconButton
        {...componentParams}
        size="small"
        color="primary"
        disabled={!isResultShared}
        onClick={handleOpenMenu}
      >
        {isResultShared ? (
          <SendOutlined fontSize="small" color="primary" />
        ) : (
          <CancelScheduleSend fontSize="small" />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disableRipple>
          <ListItemIcon>
            <LinkOutlined />
          </ListItemIcon>
          <TextField
            size="small"
            value={shareLink}
            inputProps={{
              style: {
                fontSize: "12px",
              },
            }}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={handleSend}
                  disabled={copiedToClipboard}
                >
                  {copiedToClipboard ? (
                    <DoneOutlined fontSize="small" />
                  ) : (
                    <ContentCopyOutlined fontSize="small" />
                  )}
                </IconButton>
              ),
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
