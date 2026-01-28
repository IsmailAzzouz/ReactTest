import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import type { Route } from "./+types/root";
import "./app.css";

const theme = createTheme({
  typography: {
    fontFamily:
      '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.5px",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.65,
    },
  },
});

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static" color="primary" elevation={0}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Movie Explorer
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            sx={{
              minHeight: "calc(100vh - 64px)",
              px: { xs: 2, md: 4 },
              py: 4,
            }}
          >
            {children}
          </Box>
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h3" component="h1">
            {message}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {details}
          </Typography>
          {stack && (
            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: (theme) => theme.palette.action.hover,
                overflowX: "auto",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {stack}
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
