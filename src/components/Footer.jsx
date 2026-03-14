import React from "react";
import { Box, Typography, Container } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        py: 2,
        textAlign: "center",
        backgroundColor: "background.paper",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary">
          Masjid Indonesia Tokyo
        </Typography>
        <Typography variant="caption" color="text.secondary">
          4-6-6 Meguro, Meguro-ku, Tokyo 153-0063
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
