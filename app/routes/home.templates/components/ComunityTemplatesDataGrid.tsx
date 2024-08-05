import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { MouseEventHandler, ReactElement } from "react";
import { useState } from "react";
import {
  MoreVert,
  PresentToAllOutlined,
  PreviewOutlined,
} from "@mui/icons-material";
import type { loader } from "../route";
import { useLoaderData } from "@remix-run/react";
import { calculateOriginCoordsPercentageFromElement } from "~/components/Animations";
import PreviewFormTemplateDialog from "../../../components/PreviewFormTemplateDialog";
import type { FormTemplateRow } from "~/supabase/supabase.types";
import RunSurveyWithFormTemplateDialog from "./dialogs/RunSurveyWithFormTemplateDialog";

const GridActions = ({ row }: { row: FormTemplateRow }) => {
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [currentOverlayAction, setCurrentOverlayAction] =
    useState<ReactElement | null>(null);

  const open = Boolean(anchorEl);
  const handleOpenMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleRunSurvey: MouseEventHandler<HTMLLIElement> = (e) => {
    const originElement = e.currentTarget;
    const originCoordsPercentage = calculateOriginCoordsPercentageFromElement({
      originElement,
    });
    setCurrentOverlayAction(
      <RunSurveyWithFormTemplateDialog
        open={true}
        row={row}
        originPercentage={originCoordsPercentage}
        onClose={() =>
          setCurrentOverlayAction(
            <RunSurveyWithFormTemplateDialog
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

  const handlePreview: MouseEventHandler<HTMLLIElement> = (e) => {
    const originElement = e.currentTarget;
    const originCoordsPercentage = calculateOriginCoordsPercentageFromElement({
      originElement,
    });
    setCurrentOverlayAction(
      <PreviewFormTemplateDialog
        open={true}
        formTemplateRow={row}
        originPercentage={originCoordsPercentage}
        onClose={() =>
          setCurrentOverlayAction(
            <PreviewFormTemplateDialog
              open={false}
              formTemplateRow={row}
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
          <MenuItem onClick={handleRunSurvey}>
            <ListItemIcon>
              <PresentToAllOutlined color="primary" />
            </ListItemIcon>
            <ListItemText>Run Survey</ListItemText>
          </MenuItem>
          <MenuItem onClick={handlePreview}>
            <ListItemIcon>
              <PreviewOutlined color="info" />
            </ListItemIcon>
            <ListItemText>Preview</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "updated_at",
    headerName: "Last Update",
    flex: 1,
    valueGetter: (value) => new Date(value),
    type: "dateTime",
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

export default function ComunityTemplatesDataGrid() {
  const loaderData = useLoaderData<typeof loader>();
  const rows = loaderData.comunityFormTemplates.data;
  return (
    <DataGrid
      sx={{ width: "100%" }}
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
