import React from "react";
import { Box, Typography, Container, Link, Paper } from "@mui/material";
import { LocationOn } from "@mui/icons-material";

function Footer() {
  return (
    <Box
      sx={{
        py: 4,
        backgroundColor: "rgba(18, 76, 58, 0.05)",
        borderTop: "1px solid rgba(18, 76, 58, 0.1)",
        mt: "auto",
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={0} 
          variant="outlined"
          sx={{ 
            p: 2, 
            borderRadius: 4, 
            backgroundColor: "background.paper",
            borderColor: "rgba(18, 76, 58, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.main",
              boxShadow: "0 4px 12px rgba(18, 76, 58, 0.08)"
            }
          }}
        >
          <Link
            href="https://maps.app.goo.gl/D7mX98kD6rpXMc5Z7"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOn sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  Masjid Indonesia Tokyo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  インドネシア東京モスク
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  4-6-6 Meguro, Meguro-ku, Tokyo 153-0063
                </Typography>
              </Box>
            </Box>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}

export default Footer;
