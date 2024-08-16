import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../route";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { SurveyResponseRow } from "~/supabase/supabase.types";
import {
  CloseOutlined,
  DoubleArrowTwoTone,
  VisibilityOutlined,
} from "@mui/icons-material";
import type {
  fieldSchema,
  sectionSchema,
} from "~/generative-models/form-template/schemas";
import type { z } from "zod";

function FieldResponse({
  fieldContent,
  fieldConfig,
}: {
  fieldContent: string | [];
  fieldConfig: z.infer<typeof fieldSchema>;
}) {
  const ResponseRepresentation = () => {
    switch (fieldConfig.type) {
      case "file":
        return <Alert severity="warning">Currently not supported</Alert>;
      case "date":
        return (
          <Chip
            variant="outlined"
            color="success"
            label={dayjs(fieldContent).format("D MMM YYYY")}
          ></Chip>
        );

      case "rating":
        return (
          <Chip
            variant="outlined"
            label={
              <Rating
                value={fieldContent}
                sx={(theme) => ({
                  "& .MuiRating-iconFilled": {
                    color: theme.palette.success.main,
                  },
                })}
                readOnly
              ></Rating>
            }
          ></Chip>
        );
      case "slider":
      case "password":
      case "textarea":
      case "tel":
      case "email":
      case "url":
      case "time":
      case "number":
      case "text":
        return (
          <Chip variant="outlined" color="success" label={fieldContent}></Chip>
        );
      case "range":
        return (
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <Chip variant="outlined" color="success" label={fieldContent[0]} />
            <DoubleArrowTwoTone color="success" />
            <Chip color="success" label={fieldContent[1]} />
          </Box>
        );
      case "checkbox":
        return (
          <Box display={"flex"} gap={1}>
            {fieldContent.length ? (
              (fieldContent as string[]).map!((itemContent) => (
                <Chip color="success" label={itemContent} />
              ))
            ) : (
              <Chip
                fontStyle={"italic"}
                sx={{ borderRadius: 0 }}
                color="warning"
                label={
                  <Typography fontStyle={"italic"}>
                    NO OPTION SELECTED
                  </Typography>
                }
              ></Chip>
            )}
          </Box>
        );
      case "radio":
        return <Chip color="success" label={fieldContent} />;
    }
    return "No value";
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box mb={1}>
        <Typography color={"GrayText"} variant="h6">
          {fieldConfig.label}
        </Typography>
        <Typography variant="caption" color={"GrayText"}>
          {fieldConfig.placeholder}
        </Typography>
      </Box>
      <Box>
        <ResponseRepresentation />
      </Box>
    </Box>
  );
}

const GridActions = ({ row }: { row: SurveyResponseRow }) => {
  const loaderData = useLoaderData<typeof loader>();
  const formTemplateConfig = loaderData.formTemplate.data?.config;
  const [open, setOpen] = useState(false);

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
        <IconButton onClick={() => setOpen(true)}>
          <VisibilityOutlined />
        </IconButton>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          width={"100%"}
          justifyContent={"space-between"}
        >
          Response {row.id}
          <IconButton onClick={() => setOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={2}
          px={{ xs: 1, sm: 2 }}
          mb={2}
        >
          {formTemplateConfig?.map(
            (sectionConfig: z.infer<typeof sectionSchema>) => (
              <Box
                key={sectionConfig.name}
                component={Paper}
                variant="outlined"
                p={{ xs: 1, md: 2 }}
                display={"flex"}
                flexDirection={"column"}
                gap={3}
              >
                <Box>
                  <Typography variant="h5" color={"GrayText"}>
                    {sectionConfig.label}
                  </Typography>
                  <Typography variant="caption" color={"GrayText"}>
                    {sectionConfig.placeholder}
                  </Typography>
                </Box>
                <Divider></Divider>
                {sectionConfig.fields.map((fieldConfig) => {
                  return (
                    <Box key={fieldConfig.name} pl={{ xs: 0, md: 2 }}>
                      <FieldResponse
                        fieldConfig={fieldConfig}
                        fieldContent={
                          row.data_entry[sectionConfig.name][fieldConfig.name]
                        }
                      />
                    </Box>
                  );
                })}
              </Box>
            )
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default function SurveyResponses() {
  const loaderData = useLoaderData<typeof loader>();
  const surveyResponses = loaderData.surveyResponses.data;

  const columns = useMemo(() => {
    const columns: GridColDef[] = [
      { field: "id", headerName: "Id", flex: 0.3, maxWidth: 100 },
      {
        field: "created_at",
        headerName: "Responded At",
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueGetter: (value) => dayjs(value).format("D/M/YYYY, h:mm:ss A"),
        type: "string",
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
    return columns;
  }, []);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      width={"100%"}
      gap={1}
    >
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        gap={2}
      >
        <Typography
          variant="h4"
          fontFamily={"Virgil"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          Collected Data
        </Typography>
        {surveyResponses ? (
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
            rows={surveyResponses || undefined}
            columns={columns}
            disableAutosize
            disableColumnResize
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableColumnSorting
            disableDensitySelector
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          />
        ) : (
          <Alert severity="info">No data collected</Alert>
        )}
      </Box>
    </Box>
  );
}
