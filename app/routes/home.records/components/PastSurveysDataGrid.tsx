import {
  Box,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { MouseEventHandler } from "react";
import { useMemo, useState } from "react";
import { DetailsOutlined, MoreVert } from "@mui/icons-material";
import type { loader } from "../route";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { FormTemplateRow } from "~/supabase/supabase.types";
import { SURVEY_CONFIGS } from "~/routes/home.templates/components/dialogs/RunSurveyWithFormTemplateDialog";
import dayjs from "dayjs";

const GridActions = ({ row }: { row: FormTemplateRow }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);

  const open = Boolean(anchorEl);
  const handleOpenMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDetails: MouseEventHandler<HTMLLIElement> = (e) => {
    handleCloseMenu();
    navigate(`/home/surveys/${row.id}`);
  };

  return (
    <>
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

export default function PastSurveysDataGrid() {
  const loaderData = useLoaderData<typeof loader>();
  const rows = loaderData.userClosedSurveys.data;
  const isPhone = useMediaQuery("(max-width: 600px)");

  const columns = useMemo(() => {
    const columns: GridColDef[] = [
      { field: "survey_label", headerName: "Name", flex: 1 },
      {
        field: "closed_at",
        headerName: "Closed At",
        flex: 1,
        valueGetter: (value) => dayjs(value).format("D/M/YYYY, h:mm:ss A"),
        type: "string",
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
        (value) => value.field == "closed_at"
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
