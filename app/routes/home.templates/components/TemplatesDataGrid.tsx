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
import type { MouseEventHandler } from "react";
import { useState } from "react";
import {
  DeleteOutline,
  MoreVert,
  PresentToAllOutlined,
  PreviewOutlined,
} from "@mui/icons-material";
import type { loader } from "../route";
import { useLoaderData } from "@remix-run/react";

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

export default function TemplatesDataGrid() {
  const loaderData = useLoaderData<typeof loader>();
  const rows = loaderData.userFormTemplates.data;
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
