import {
  Box,
  Chip,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { MouseEventHandler, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ContentCopyOutlined,
  DetailsOutlined,
  DoneAllOutlined,
  DoneOutlined,
  ExpandLess,
  ExpandMore,
  LinkOutlined,
  MoreVert,
  SendOutlined,
} from "@mui/icons-material";
import type { loader } from "../route";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { calculateOriginCoordsPercentageFromElement } from "~/components/Animations";
import type { FormTemplateRow } from "~/supabase/supabase.types";
import { SURVEY_CONFIGS } from "~/routes/home.templates/components/dialogs/RunSurveyWithFormTemplateDialog";
import { useSnackbar } from "notistack";
import CloseSurveyDialog from "../../../components/CloseSurveyDialog";

const GridActions = ({ row }: { row: FormTemplateRow }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [openSend, setOpenSend] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [currentOverlayAction, setCurrentOverlayAction] =
    useState<ReactElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const surveyShareLink =
    window.location.origin + `/home/surveys/answer/${row.id}`;

  const open = Boolean(anchorEl);
  const handleOpenMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCopiedToClipboard(false);
  };

  const handleDetails: MouseEventHandler<HTMLLIElement> = (e) => {
    handleCloseMenu();
    navigate(`/home/surveys/${row.id}`);
  };

  useEffect(() => {
    if (openSend === false) {
      setCopiedToClipboard(false);
    }
  }, [openSend]);

  const handleSend: MouseEventHandler<HTMLButtonElement> = async (e) => {
    setCopiedToClipboard(true);

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(surveyShareLink);
      enqueueSnackbar({
        message: "Link coppied to clipboard",
        variant: "info",
      });
    }
  };

  const handleClose: MouseEventHandler<HTMLLIElement> = (e) => {
    const originElement = e.currentTarget;
    const originCoordsPercentage = calculateOriginCoordsPercentageFromElement({
      originElement,
    });
    setCurrentOverlayAction(
      <CloseSurveyDialog
        open={true}
        row={row}
        originPercentage={originCoordsPercentage}
        onClose={() =>
          setCurrentOverlayAction(
            <CloseSurveyDialog
              open={false}
              row={row}
              originPercentage={originCoordsPercentage}
            />
          )
        }
      />
    );
    handleCloseMenu();
  };

  return (
    <>
      {currentOverlayAction}
      <Box
        height={"100%"}
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        gap={1}
      >
        <IconButton onClick={handleOpenMenu}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => setOpenSend(!openSend)}>
            <ListItemIcon>
              <SendOutlined color="success" />
            </ListItemIcon>
            <ListItemText>Send</ListItemText>

            {openSend ? <ExpandLess /> : <ExpandMore />}
          </MenuItem>
          <Collapse in={openSend} timeout="auto">
            <MenuItem sx={{ pl: 4 }} disableRipple>
              <ListItemIcon>
                <LinkOutlined color="action" />
              </ListItemIcon>
              <TextField
                size="small"
                value={surveyShareLink}
                inputProps={{
                  style: {
                    fontSize: "12px",
                    // width: `${surveyShareLink.length}ch`,
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
          </Collapse>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <DoneAllOutlined color="primary" />
            </ListItemIcon>
            <ListItemText>Close Survey</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDetails}>
            <ListItemIcon>
              <DetailsOutlined color="info" />
            </ListItemIcon>
            <ListItemText>Details</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default function SurveysDataGrid() {
  const loaderData = useLoaderData<typeof loader>();
  const rows = loaderData.userRunningSurveys.data;
  const isPhone = useMediaQuery("(max-width: 600px)");

  const columns = useMemo(() => {
    const columns: GridColDef[] = [
      { field: "survey_label", headerName: "Name", flex: 1 },
      {
        field: "created_at",
        headerName: "Created At",
        flex: 1,
        valueGetter: (value) => new Date(value),
        type: "dateTime",
      },
      {
        field: "survey_variant",
        headerName: "Variant",
        renderCell: ({ value }) => (
          <Box height={"100%"} display={"flex"} alignItems={"center"}>
            <Chip variant="outlined" label={SURVEY_CONFIGS[value]} />
          </Box>
        ),
        flex: 1,
      },
      {
        field: "actions",
        headerName: "",
        width: 60,
        renderCell({ row }) {
          return <GridActions row={row} />;
        },
      },
    ];
    if (isPhone) {
      const indexOfCreatedAt = columns.findIndex(
        (value) => value.field == "created_at"
      );
      columns.splice(indexOfCreatedAt, 1);
    }
    return columns;
  }, [isPhone]);

  return (
    <DataGrid
      sx={(theme) => ({
        width: "100%",
        "& .MuiDataGrid-cell": {
          [theme.breakpoints.down("md")]: {
            px: 0.5,
          },
        },
      })}
      autoHeight
      rows={rows || undefined}
      columns={columns}
      disableAutosize
      disableColumnResize
      disableRowSelectionOnClick
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      disableColumnSorting
      disableDensitySelector
      hideFooter
    />
  );
}
