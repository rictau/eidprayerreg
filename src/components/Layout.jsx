import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from "@mui/material";
import Footer from "./Footer";

function Layout({ children, maxWidth = "sm" }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
        backgroundImage: "url('/noise.png')", // Subtle noise texture
      }}
    >
      <AppBar 
        position="sticky" 
        color="primary" 
        elevation={0}
        sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: "0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)"
        }}
    >
        <Container maxWidth="md">
          <Toolbar sx={{ padding: "0 !important", minHeight: "64px" }}>
            <img
              src="/logo-kbri.png"
              alt="KBRI Logo"
              style={{ height: 64, marginRight: 0 }}
            />
            <img
              src="/logo-kmii.png"
              alt="KMII Logo"
              style={{ height: 64, marginRight: 10 }}
            />
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 'bold', lineHeight: 1.2 }}
              >
                Salat Idul Fitri 1447H
              </Typography>
              <Typography variant="subtitle2" component="div" sx={{ opacity: 0.9 }}>
                イード・アル＝フィトル礼拝
              </Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" maxWidth={maxWidth} sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}

export default Layout;
