import { parseWithZod } from "@conform-to/zod";
import { ArrowUpward } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import { z } from "zod";
import { useSnackbar } from "notistack";

export const promptSchema = z.object({
  prompt: z.string({ required_error: "Prompt is required" }),
  _action: z.string({ required_error: "Action is required" }),
});

function ChatBox() {
  const isPhone = useMediaQuery("(min-width:600px)");
  const formRef = useRef<HTMLFormElement>(null);
  const chatFetcher = useFetcher({ key: "chat" });
  const publishFetcher = useFetcher({ key: "publish" });
  const resetFetcher = useFetcher({ key: "reset" });
  const { enqueueSnackbar } = useSnackbar();
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: promptSchema });
    },
  });

  const submitOnEnterInLargeScreens = useCallback(
    (e: KeyboardEvent) => {
      if (e.key == "Enter" && e.shiftKey == false && isPhone) {
        e.preventDefault();
        formRef.current?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    },
    [isPhone]
  );

  const isAddingPrompt = chatFetcher.state !== "submitting";

  const isPublishing = publishFetcher.state !== "idle";

  const isReseting = resetFetcher.state !== "idle";

  useEffect(() => {
    if (chatFetcher.data?.unnespectedError) {
      enqueueSnackbar({
        message: "Error during proccesing",
        variant: "error",
      });
    }
  }, [chatFetcher.data?.unnespectedError, enqueueSnackbar]);

  useEffect(() => {
    if (!isAddingPrompt) {
      formRef.current?.reset();
    }
  }, [isAddingPrompt]);

  return (
    <Box
      ref={formRef}
      width={"100%"}
      component={chatFetcher.Form}
      method="post"
      {...getFormProps(form)}
      sx={{ px: 2, position: "fixed", maxWidth: 500, bottom: 5, zIndex: 10 }}
    >
      <TextField
        {...getInputProps(fields.prompt, { type: "text" })}
        key={fields.prompt.key}
        disabled={!!chatFetcher.formAction || isPublishing || isReseting}
        sx={(theme) => ({
          bgcolor:
            theme.palette.mode === "light"
              ? "rgba(255, 255, 255, 0.4)"
              : "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(24px)",
        })}
        maxRows={5}
        required
        fullWidth
        multiline
        onKeyDownCapture={submitOnEnterInLargeScreens}
        InputProps={{
          endAdornment: !chatFetcher.formAction ? (
            <>
              <input name="_action" value="add-prompt" type="hidden" />
              <IconButton
                form={form.id}
                type="submit"
                size="medium"
                disabled={isPublishing || isReseting}
              >
                <ArrowUpward />
              </IconButton>
            </>
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
