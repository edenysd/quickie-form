import { parseWithZod } from "@conform-to/zod";
import { ArrowUpward } from "@mui/icons-material";
import { Box, IconButton, TextField, useMediaQuery } from "@mui/material";
import { Form, useSubmit } from "@remix-run/react";
import { formSchema } from "../route";
import { getInputProps, useForm } from "@conform-to/react";
import type { KeyboardEvent } from "react";
import { useCallback, useRef } from "react";

function ChatBox() {
  const isPhone = useMediaQuery("(min-width:600px)");
  const formRef = useRef(null);
  const submit = useSubmit();
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: formSchema });
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
      sx={{ px: 2, position: "fixed", maxWidth: 500, bottom: 5 }}
      component={Form}
      id={form.id}
      method="post"
      onSubmit={form.onSubmit}
    >
      <TextField
        inputProps={{
          ...getInputProps(fields.prompt, { type: "text" }),
        }}
        maxRows={5}
        required
        fullWidth
        multiline
        onKeyDownCapture={submitOnEnterInLargeScreens}
        InputProps={{
          endAdornment: (
            <IconButton type="submit">
              <ArrowUpward />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
}

export default ChatBox;
