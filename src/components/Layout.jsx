import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from "@mui/material";
import Footer from "./Footer";

function Layout({ children, maxWidth = "sm", showAppBar = true }) {
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
      {showAppBar && (
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Container maxWidth="md">
            <Toolbar sx={{ 
              padding: "0 !important", 
              minHeight: { xs: "56px", sm: "64px" },
              display: "flex",
              justifyContent: "space-between"
            }}>
              <Box 
                component="img"
                src="/logo-kbri.png"
                alt="KBRI Logo"
                sx={{ height: { xs: 40, sm: 48 } }}
              />
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ 
                    fontWeight: 'bold', 
                    lineHeight: 1.2, 
                    color: 'primary.main',
                    fontSize: { xs: '0.9rem', sm: '1.1rem' }
                  }}
                >
                  Salat Idul Fitri 1447H
                </Typography>
                <Typography 
                  variant="subtitle2" 
                  component="div" 
                  sx={{ 
                    opacity: 0.8, 
                    color: 'text.secondary',
                    fontSize: { xs: '0.65rem', sm: '0.75rem' }
                  }}
                >
                  イード・アル＝フィトル礼拝
                </Typography>
              </Box>
              <Box 
                component="img"
                src="/logo-kmii.png"
                alt="KMII Logo"
                sx={{ height: { xs: 40, sm: 48 } }}
              />
            </Toolbar>
          </Container>
        </AppBar>
      )}
      <Container component="main" maxWidth={maxWidth} sx={{ flexGrow: 1, py: { xs: 2, sm: 4 } }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}

export default Layout;
