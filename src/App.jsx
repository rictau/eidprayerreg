import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CircularProgress, ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const GelombangNolPage = lazy(() => import("./pages/GelombangNolPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CheckInPage = lazy(() => import("./pages/CheckInPage"));

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
            path="/gelombangnol"
            element={<Layout showKBRILogo={false}><GelombangNolPage /></Layout>}
          />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Layout maxWidth="lg"><AdminPage /></Layout>} />
            <Route path="/checkin" element={<Layout maxWidth="lg"><CheckInPage /></Layout>} />
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
