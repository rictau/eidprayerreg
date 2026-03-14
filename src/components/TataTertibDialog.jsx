import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const TataTertibDialog = ({ open, onClose, onConfirm, readOnly = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const contentRef = useRef(null);

  const handleScroll = () => {
    if (readOnly) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setIsScrolled(true);
    }
  };

  const handleAgreeChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  const handleConfirm = () => {
    if (isAgreed) {
      onConfirm();
    }
  };
  
  const handleClose = () => {
    onClose();
    setIsAgreed(false);
    setIsScrolled(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Tata Tertib Salat Idul Fitri
      </DialogTitle>
      <DialogContent dividers ref={contentRef} onScroll={handleScroll}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Seluruh jamaah agar memperhatikan hal-hal sebagai berikut:
        </Typography>

        {/* Section I */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            I. UMUM
          </Typography>
          <Typography variant="body1" gutterBottom>
            1. Menjaga nama baik bangsa Indonesia di Jepang dengan mengedepankan 4K, Ketertiban, Keamanan, Kebersihan, dan Kenyamanan
          </Typography>
          <Typography variant="body1" gutterBottom>
            2. Menjaga ketertiban dan keamanan selama perjalanan dari rumah, selama di MIT/SIT, serta perjalanan kembali ke rumah
          </Typography>
          <Typography variant="body1" gutterBottom>
            3. Menjaga kebersihan seluruh area yang dilalui dalam pelaksanaan salat Idulfitri 1447 H
          </Typography>
          <Typography variant="body1" gutterBottom>
            4. Tidak merokok selain di area yang telah ditentukan oleh Pemerintah Jepang
          </Typography>
          <Typography variant="body1" gutterBottom>
            5. Menjaga kenyamanan dengan tidak berbicara terlalu keras di area publik; dan 
          </Typography>
          <Typography variant="body1" gutterBottom>
            6. Mengikuti petunjuk petugas di lapangan.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section II */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            II. KELENGKAPAN SALAT
          </Typography>
          <Typography variant="body1" gutterBottom>
            1. Menjaga wudu sejak dari rumah, sarana Wudu di MIT/SIT sangat terbatas
          </Typography>
          <Typography variant="body1" gutterBottom>
            2. Membawa tas untuk menyimpan sandal/sepatu
          </Typography>
          <Typography variant="body1" gutterBottom>
            3. Membawa sajadah/alas salat masing-masing
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section III */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            III. TEKNIS SALAT
          </Typography>
          <Typography variant="body1" gutterBottom>
            1. Lokasi salat adalah MIT dan Balai Indonesia 
          </Typography>
          <Typography variant="body1" gutterBottom>
            2. Jamaah Lansia dan Difabel salat di Balai Indonesia Lantai I
          </Typography>
          <Typography variant="body1" gutterBottom>
            3. Jamaah laki-laki salat di dalam MIT dan Balai Indonesia Lantai II
          </Typography>
          <Typography variant="body1" gutterBottom>
            4. Jamaah perempuan salat di Balai Indonesia Lantai II
          </Typography>
          <Typography variant="body1" gutterBottom>
            5. Jamaah mengisi saf salat dengan prinsip first come first served
          </Typography>
          <Typography variant="body1" gutterBottom>
            6. Jamaah agar antre dengan tertib menunggu gelombang salat yang tersedia
          </Typography>
          <Typography variant="body1" gutterBottom>
            7. Waktu keseluruhan salat adalah 30 menit
          </Typography>
          <Typography variant="body1" gutterBottom>
            8. Jeda waktu antargelombang adalah 30 menit
          </Typography>
          <Typography variant="body1" gutterBottom>
            9. Jamaah agar segera mengosongkan area salat seusai khutbah berakhir untuk memberi kesempatan jamaah berikutnya
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section IV */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            IV. KONSUMSI
          </Typography>
          <Typography variant="body1" gutterBottom>
            1. Panitia menyediakan snacks dan minum untuk seluruh jamaah
          </Typography>
          <Typography variant="body1" gutterBottom>
            2. Jamaah mengambil snacks dan minum seusai mengikuti salat
          </Typography>
          <Typography variant="body1" gutterBottom>
            3. Jamaah membawa sampah plastik/kotak snacks ke dalam tas masing-masing
          </Typography>
          <Typography variant="body1" gutterBottom>
            4. Jamaah dilarang membuang sampah plastik/kotak snacks di konbini
          </Typography>
        </Box>

        <Typography variant="h6" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
          Taqabbalallahu Minna Wa Minkum
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Mohon kerja sama demi kelancaran ibadah kita bersama.
        </Typography>

      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {readOnly ? (
           <Button onClick={handleClose} variant="contained" fullWidth>
             Tutup
           </Button>
         ) : (
        <Box sx={{ width: '100%' }}>
            <FormControlLabel
            sx={{ width: '100%', justifyContent: 'center', mb: 1, mx: 0 }} 
              control={
                <Checkbox
                  checked={isAgreed}
                  onChange={handleAgreeChange}
                  disabled={!isScrolled}
                  name="agree"
                />
              }
              label="Saya telah membaca dan menyetujui tata tertib di atas."
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, textAlign: 'center' }}>
                (Silakan scroll ke bawah dan baca semua aturan sebelum menyetujui.)
            </Typography>
            <Button
              onClick={handleConfirm}
              variant="contained"
              disabled={!isAgreed}
              fullWidth
              size="large"
            >
              Daftar (登録)
            </Button>
        </Box>
         )}
      </DialogActions>
    </Dialog>
  );
};

export default TataTertibDialog;
