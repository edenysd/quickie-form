import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { MouseEventHandler } from "react";
import { useState } from "react";
import {
  DeleteOutline,
  MoreVert,
  PresentToAllOutlined,
  PreviewOutlined,
} from "@mui/icons-material";

const GridActions = ({
  row,
}: {
  row: {
    id: string;
    name: "string";
    updated_at: string;
  };
}) => {
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleRunSurvey = () => {
    handleCloseMenu();
    console.log(row.id);
  };
  const handlePreview = () => {
    handleCloseMenu();
    console.log(row.id);
  };
  const handleRemove = () => {
    handleCloseMenu();
    console.log(row.id);
  };
  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"flex-end"}
      gap={1}
    >
      <input name="formTemplateId" type="hidden" value={row.id} />
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
        <MenuItem onClick={handleRemove}>
          <ListItemIcon>
            <DeleteOutline color="error" />
          </ListItemIcon>
          <ListItemText>Remove</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "name", headerName: "Name", flex: 0.5 },
  { field: "updated_at", headerName: "Last Update", flex: 1, type: "dateTime" },
  {
    field: "actions",
    headerName: "",
    width: 60,
    renderCell({ row }) {
      return <GridActions row={row} />;
    },
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: "Hello",
    updated_at: new Date(),
  },
];

export default function TemplatesDataGrid() {
  return (
    <DataGrid
      sx={{ width: "100%" }}
      autoHeight
      rows={rows}
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
