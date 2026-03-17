import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  CircularProgress, 
  Alert, 
  Card, 
  CardContent, 
  Divider,
  Grid,
  Chip
} from '@mui/material';
import { 
  QrCodeScanner, 
  Search, 
  CheckCircle, 
  Error as ErrorIcon, 
  Man, 
  Woman, 
  AccessTime,
  Badge,
  CameraAlt,
  ArrowBack
} from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { initialGelombangSalatOptions } from '../constants';

const CheckInPage = () => {
  const [registrationId, setRegistrationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isScannerRunning, setIsScannerRunning] = useState(false);
  
  const scannerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastScannedIdRef = useRef(null);

  // Audio feedback function
  const playSound = (type) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      
      // Resume context if suspended (common in mobile browsers)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'scan') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); 
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'checkin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleSearch = useCallback(async (idToSearch) => {
    const id = idToSearch || registrationId;
    if (!id) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const trimmedId = id.trim();
      const docRef = doc(db, "registrations", trimmedId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setRegistrationData({ id: docSnap.id, ...data });
        await stopScanner(); 
      } else {
        setError(`Registrasi tidak ditemukan untuk ID: ${trimmedId}. (登録が見つかりません)`);
        lastScannedIdRef.current = null; // Clear on error so they can try again
      }
    } catch (err) {
      console.error("Error fetching registration:", err);
      setError("Terjadi kesalahan saat mencari data. (データの検索中にエラーが発生しました)");
      lastScannedIdRef.current = null;
    } finally {
      setLoading(false);
    }
  }, [registrationId]);

  const onScanSuccess = useCallback((decodedText) => {
    let id = "";
    try {
      const data = JSON.parse(decodedText);
      id = data["ID Pendaftaran"] || decodedText;
    } catch (e) {
      id = decodedText;
    }

    // Use Ref to check last ID to avoid closure staleness
    if (id && id !== lastScannedIdRef.current) {
      lastScannedIdRef.current = id;
      playSound('scan');
      handleSearch(id);
    }
  }, [handleSearch]);

  const startScanner = useCallback(async () => {
    if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
    }
    
    if (scannerRef.current.isScanning) return;

    try {
      await scannerRef.current.start(
        { facingMode: "environment" }, 
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        onScanSuccess,
        () => {} 
      );
      setIsScannerRunning(true);
      setError(null);
    } catch (err) {
      console.error("Gagal memulai scanner:", err);
      setError("Kamera tidak ditemukan atau izin ditolak. (カメラが見つからないか、許可が拒否されました)");
    }
  }, [onScanSuccess]);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScannerRunning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Cleanup error:", err));
      }
    };
  }, [startScanner]);

  const handleCheckIn = async () => {
    if (!registrationData) return;

    setLoading(true);
    try {
      const docRef = doc(db, "registrations", registrationData.id);
      await updateDoc(docRef, {
        checkedIn: true,
        checkedInAt: serverTimestamp()
      });
      playSound('checkin');
      setSuccess("Check-in berhasil! (チェックインに成功しました)");
      setRegistrationData(prev => ({ ...prev, checkedIn: true }));
    } catch (err) {
      console.error("Error during check-in:", err);
      setError("Gagal melakukan check-in. (チェックインに失敗しました)");
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = async () => {
    lastScannedIdRef.current = null; // CRITICAL: Clear the ref
    setRegistrationData(null);
    setSuccess(null);
    setError(null);
    setRegistrationId('');
    
    // Restart logic is handled by the render effect of registrationData changing back to null
    // But we call startScanner explicitly to be sure
    setTimeout(() => {
        startScanner();
    }, 100);
  };

  const gelombang = registrationData ? initialGelombangSalatOptions.find(g => g.id === registrationData.kloter) : null;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>
          Check-in Jemaah
        </Typography>

        {error && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2, borderRadius: 2 }}>
            {error}
            </Alert>
        )}

        {success && (
            <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2, borderRadius: 2 }}>
            {success}
            </Alert>
        )}

        <Paper 
            elevation={3} 
            sx={{ 
                p: 2, 
                borderRadius: 3, 
                overflow: 'hidden', 
                position: 'relative',
                display: registrationData ? 'none' : 'block' 
            }}
        >
            <Box 
                id="reader" 
                sx={{ 
                    width: '100%', 
                    minHeight: '350px',
                    backgroundColor: '#000',
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            ></Box>
            
            {!isScannerRunning && !loading && (
                <Box sx={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: '#fff',
                    zIndex: 1,
                    borderRadius: 3
                }}>
                    <Button variant="contained" onClick={startScanner} startIcon={<CameraAlt />}>
                        Aktifkan Kamera
                    </Button>
                </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    label="ID Pendaftaran"
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    placeholder="Masukkan ID manual"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                    variant="contained" 
                    onClick={() => handleSearch()}
                    disabled={loading}
                    startIcon={<Search />}
                >
                    Cari
                </Button>
            </Box>
        </Paper>

        {registrationData && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 30px 0 rgba(0,0,0,0.12)', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Detail Pendaftaran
                </Typography>
                {registrationData.checkedIn ? (
                  <Chip 
                    label="Sudah Check-in" 
                    color="success" 
                    icon={<CheckCircle />} 
                    variant="filled"
                  />
                ) : (
                  <Chip 
                    label="Belum Check-in" 
                    color="warning" 
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Nama Jemaah
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge color="primary" variant="dot" /> {registrationData.nama}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1.5 }}>
                        <Man color="action" />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Ikhwan</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{registrationData.ikhwan}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1.5 }}>
                        <Woman color="action" />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Akhwat</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{registrationData.akhwat}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                   <Box sx={{ p: 2, backgroundColor: 'primary.light', borderRadius: 2, color: 'primary.contrastText' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {gelombang ? gelombang.name : `Sesi ${registrationData.kloter}`}
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {gelombang?.time}
                    </Typography>
                   </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 1 }}>
                  {!registrationData.checkedIn ? (
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleCheckIn}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <CheckCircle />}
                      sx={{ 
                        py: 2, 
                        borderRadius: 3, 
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 6px 20px 0 rgba(18, 76, 58, 0.4)'
                      }}
                    >
                      Konfirmasi Check-in
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={resetScanner}
                      startIcon={<QrCodeScanner />}
                      sx={{ py: 2, borderRadius: 3, fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                      Scan Berikutnya
                    </Button>
                  )}
                  <Button
                    fullWidth
                    variant="text"
                    onClick={resetScanner}
                    sx={{ mt: 1, color: 'text.secondary' }}
                    startIcon={<ArrowBack />}
                  >
                    Batal / Kembali
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {!registrationData && !loading && (
            <Box sx={{ textAlign: 'center', mt: 3, color: 'text.disabled' }}>
                <Typography variant="body2">
                    Arahkan kamera ke QR Code jemaah untuk memproses check-in secara otomatis.
                </Typography>
            </Box>
        )}
      </Box>
    </Container>
  );
};

export default CheckInPage;
