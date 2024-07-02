import {
  Typography,
  Grid,
  Paper,
  Box,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "@remix-run/react";
import Copyright from "~/components/Copyright";
import type { FormEvent } from "react";
import { useCallback, useContext, useReducer, useState } from "react";
import SupabaseBrowserClientContext from "~/supabase/SupabaseBrowserClientContext";
import { LoadingButton } from "@mui/lab";
import z from "zod";
import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Quickie Form | Sign in" },
    {
      name: "description",
      content: "Sign in to Quickie Form",
    },
  ];
};

const formSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  password: z.string({ required_error: "Password is required" }),
});

export default function SignInSide() {
  const supabaseClient = useContext(SupabaseBrowserClientContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useReducer((b) => !b, false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const tryToSignIn = useCallback(
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

        const authResponse = await supabaseClient?.auth.signInWithPassword(
          authData
        );

        if (authResponse?.error) {
          setLoginErrorMessage(authResponse.error.message);
          setIsLoading(false);
        } else {
          navigate("/home");
        }
      } catch (e) {
        //@todo notify error
        console.error(e);
        setIsLoading(false);
      }
    },
    [supabaseClient?.auth, navigate]
  );

  const [form, fields] = useForm({
    id: "sign-in",
    constraint: getZodConstraint(formSchema),
    // Then, revalidate field as user types again
    shouldRevalidate: "onInput",
    onSubmit: tryToSignIn,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: formSchema });
    },
  });

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            noValidate
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            component="form"
            name="sign-in"
            id={form.id}
            onSubmit={form.onSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              id="email"
              inputProps={{
                ...getInputProps(fields.email, { type: "email" }),
              }}
              required
              error={!!fields.email.errors?.length}
              helperText={fields.email.errors?.at(0)}
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <TextField
              id="password"
              inputProps={{
                ...getInputProps(fields.password, {
                  type: showPassword ? "text" : "password",
                }),
              }}
              required
              error={!!fields.password.errors?.length}
              helperText={fields.password.errors?.at(0)}
              margin="normal"
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
            <Typography
              variant="body1"
              sx={{ visibility: loginErrorMessage ? "visible" : "hidden" }}
              color={"error"}
            >
              {loginErrorMessage || "hidden text"}
            </Typography>
            <LoadingButton
              loading={isLoading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link to="/reset-password">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link to="/sign-up">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
