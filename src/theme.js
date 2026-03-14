import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#124c3a", // Dark green
      light: "#4a7c59", // Lighter green
    },
    secondary: {
      main: "#f5a623", // Accent color - orange
    },
    background: {
      default: "#f0f2f5", // Light gray background
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 600,
    },
    subtitle2: {
        fontSize: "0.75rem",
        fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
    caption: {
        fontSize: "0.625rem",
        fontWeight: 400,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.15)",
          },
        },
        containedPrimary: {
            "&:hover": {
                boxShadow: "0 6px 20px 0 rgba(18, 76, 58, 0.4)",
            }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 10px 30px 0 rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 10px 30px 0 rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s ease-in-out",
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 35px 0 rgba(0, 0, 0, 0.1)",
            },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
