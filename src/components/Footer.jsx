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
          Masjid Indonesia Tokyo (インドネシア東京モスク)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          〒153-0063 東京都目黒区下目黒４丁目６−６
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
