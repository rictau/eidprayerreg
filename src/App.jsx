import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CircularProgress, ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const GelombangAwalPage = lazy(() => import("./pages/GelombangAwalPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <CircularProgress
            sx={{ display: "block", margin: "auto", mt: 10 }}
          />
        }
      >
        <Routes>
          <Route 
            path="/"
            element={<Layout><HomePage /></Layout>}
          />
          <Route 
            path="/gelombangawal"
            element={<Layout showKBRILogo={false}><GelombangAwalPage /></Layout>}
          />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Layout maxWidth="lg"><AdminPage /></Layout>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

function Root() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

export default Root;
