import { parseWithZod } from "@conform-to/zod";
import { ArrowUpward } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { getInputProps, useForm } from "@conform-to/react";
import type { KeyboardEvent } from "react";
import { useCallback, useRef } from "react";
import { z } from "zod";

export const promptSchema = z.object({
  prompt: z.string({ required_error: "Prompt is required" }),
});

function ChatBox() {
  const isPhone = useMediaQuery("(min-width:600px)");
  const formRef = useRef(null);
  const submit = useSubmit();
  const { formAction } = useNavigation();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: promptSchema });
    },
  });

  const submitOnEnterInLargeScreens = useCallback(
    (e: KeyboardEvent) => {
      if (e.key == "Enter" && e.shiftKey == false && isPhone) {
        e.preventDefault();
        submit(formRef.current);
      }
    },
    [submit, isPhone]
  );

  return (
    <Box
      ref={formRef}
      width={"100%"}
      sx={{ px: 2, position: "fixed", maxWidth: 500, bottom: 5, zIndex: 10 }}
      component={Form}
      id={form.id}
      method="post"
      onSubmit={form.onSubmit}
    >
      <TextField
        disabled={!!formAction}
        sx={(theme) => ({
          bgcolor:
            theme.palette.mode === "light"
              ? "rgba(255, 255, 255, 0.4)"
              : "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(24px)",
        })}
        inputProps={{
          ...getInputProps(fields.prompt, { type: "text" }),
        }}
        maxRows={5}
        required
        fullWidth
        multiline
        onKeyDownCapture={submitOnEnterInLargeScreens}
        InputProps={{
          endAdornment: !formAction ? (
            <IconButton type="submit" size="medium">
              <ArrowUpward />
            </IconButton>
          ) : (
            <IconButton type="submit" disabled size="medium">
              <CircularProgress size={24} />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
}

export default ChatBox;
