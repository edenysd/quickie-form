import {
  Typography,
  Container,
  Box,
  Avatar,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import type { MetaFunction } from "@remix-run/react";
import { Link, useNavigate } from "@remix-run/react";
import Copyright from "~/components/Copyright";
import z from "zod";
import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { FormEvent } from "react";
import { useCallback, useContext, useReducer, useState } from "react";
import SupabaseClientContext from "~/supabase/SupabaseClientContext";
import { LoadingButton } from "@mui/lab";

export const meta: MetaFunction = () => {
  return [
    { title: "Quickie Form | Sign up" },
    {
      name: "description",
      content: "Sign up to Quickie Form",
    },
  ];
};

const formSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  password: z.string({ required_error: "Password is required" }).min(6),
});

export default function SignUp() {
  const supabaseClient = useContext(SupabaseClientContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useReducer((b) => !b, false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const tryToSignUp = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const authData = {
        email: data.get("email") as string,
        password: data.get("password") as string,
      };

      try {
        setIsLoading(true);
        setLoginErrorMessage("");

        const authResponse = await supabaseClient?.auth.signUp({
          ...authData,
          options: {
            emailRedirectTo: "https://quickieform.com/welcome",
          },
        });

        if (authResponse?.error) {
          setLoginErrorMessage(authResponse.error.message);
        } else {
          navigate("/validate-account");
        }
      } catch (e) {
        //@todo notify error
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [supabaseClient?.auth, navigate]
  );

  const [form, fields] = useForm({
    constraint: getZodConstraint(formSchema),
    // Then, revalidate field as user types again
    shouldRevalidate: "onInput",
    onSubmit: tryToSignUp,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: formSchema });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          noValidate
          component="form"
          name="sign-up"
          id={form.id}
          onSubmit={form.onSubmit}
          sx={{ mt: 3 }}
          alignContent={"center"}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                inputProps={{
                  ...getInputProps(fields.email, { type: "email" }),
                }}
                required
                error={!!fields.email.errors?.length}
                helperText={fields.email.errors?.at(0)}
                fullWidth
                label="Email Address"
                autoComplete="email"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                inputProps={{
                  ...getInputProps(fields.password, {
                    type: showPassword ? "text" : "password",
                  }),
                }}
                required
                error={!!fields.password.errors?.length}
                helperText={fields.password.errors?.at(0)}
                fullWidth
                label="Password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                sx={{ visibility: loginErrorMessage ? "visible" : "hidden" }}
                color={"error"}
              >
                {loginErrorMessage || "hidden text"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/sign-in">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Container>
  );
}
