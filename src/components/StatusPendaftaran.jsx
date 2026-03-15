import React, { useState } from "react";
import { Paper, Box, Typography, Container, Link } from "@mui/material";
import { QRCodeSVG as QRCode } from "qrcode.react";
import TataTertibDialog from "./TataTertibDialog";
import { initialGelombangSalatOptions } from "../constants";

function StatusPendaftaran({ registrationData }) {
  const [isTataTertibOpen, setIsTataTertibOpen] = useState(false);

  if (!registrationData) {
    return (
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
        >
          <Typography variant="h6">Loading registration data...</Typography>
        </Paper>
      </Container>
    );
  }

  const { id, nama, ikhwan, akhwat, kloter } = registrationData;
  const gelombang = initialGelombangSalatOptions.find((g) => g.id === kloter);
  const gelombangName = gelombang ? gelombang.name : "N/A";
  const gelombangTime = gelombang ? gelombang.time : "N/A";

  const qrCodeValue = JSON.stringify({
    "ID Pendaftaran": id,
    Nama: nama,
    Ikhwan: ikhwan,
    Akhwat: akhwat,
    Gelombang: gelombangName,
    Waktu: gelombangTime,
  });

  return (
    <Container maxWidth="sm">
      <Box 
        component="img"
        src="/banner.jpeg?v=1.1"
        alt="Banner"
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: 4,
          mb: 3,
          boxShadow: "0 10px 30px 0 rgba(0, 0, 0, 0.1)",
          display: "block",
          objectFit: "cover",
        }}
      />
      <Paper
        elevation={4}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, textAlign: "center" }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Pendaftaran Berhasil!
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Terima kasih telah mendaftar. Sampai jumpa di Masjid Indonesia Tokyo.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ご登録ありがとうございます。東京インドネシアモスクでお会いしましょう。
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
            {gelombangName}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            ({gelombangTime})
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body1">
            Nama (名前): <span style={{ fontWeight: "bold" }}>{nama}</span>
          </Typography>
          <Typography variant="body1">
            Ikhwan (男性): <span style={{ fontWeight: "bold" }}>{ikhwan}</span>
          </Typography>
          <Typography variant="body1">
            Akhwat (女性): <span style={{ fontWeight: "bold" }}>{akhwat}</span>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <QRCode value={qrCodeValue} size={150} />
        </Box>
        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 1.5, color: "text.secondary" }}
        >
          Silakan screenshot layar ini dan tunjukkan kepada panitia di lokasi.
          <br />
          この画面をスクリーンショットして、会場の係員にご提示ください。
        </Typography>
         <Link
          component="button"
          variant="body2"
          onClick={() => setIsTataTertibOpen(true)}
          sx={{ mt: 2 }}
        >
          Lihat Tata Tertib (規則を確認)
        </Link>
      </Paper>
        <TataTertibDialog
        open={isTataTertibOpen}
        onClose={() => setIsTataTertibOpen(false)}
        readOnly={true}
      />
    </Container>
  );
}

export default StatusPendaftaran;
