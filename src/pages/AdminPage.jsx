import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, writeBatch, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { CSVLink } from 'react-csv';
import { styled } from '@mui/material/styles';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  tableCellClasses,
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip as MuiTooltip
} from '@mui/material';
import { 
    Logout, 
    Download, 
    Save, 
    People, 
    Man, 
    Woman, 
    EventSeat,
    InfoOutlined
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { initialGelombangSalatOptions } from '../constants';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.text.primary,
      fontWeight: 'bold',
      borderBottom: `2px solid ${theme.palette.divider}`,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', position: 'relative' }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 2 } }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: { xs: 32, sm: 48 }, 
                    height: { xs: 32, sm: 48 }, 
                    borderRadius: 2, 
                    backgroundColor: `${color}15`,
                    color: color,
                    mr: { xs: 1, sm: 1.5 }
                }}>
                    {icon}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.875rem' }, lineHeight: 1.2 }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '2.125rem' } }}>
                    {value}
                </Typography>
                {subtitle && (
                    <MuiTooltip title={subtitle}>
                        <IconButton size="small" sx={{ p: 0.5, display: { xs: 'none', sm: 'inline-flex' } }}>
                            <InfoOutlined sx={{ fontSize: 20 }} />
                        </IconButton>
                    </MuiTooltip>
                )}
            </Box>
        </CardContent>
    </Card>
);

const AdminPage = () => {
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editedLimits, setEditedLimits] = useState({});
  const [exportData, setExportData] = useState([]);
  const [exporting, setExporting] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const csvLinkRef = useRef(null);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(true);
        
        const timeslotCollection = collection(db, 'timeslot');
        const timeslotUnsubscribe = onSnapshot(timeslotCollection, (timeslotSnapshot) => {
            const timeslotData = timeslotSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            timeslotData.sort((a, b) => a.slot - b.slot);
            setTimeslots(timeslotData);
            
            const initialLimits = {};
            timeslotData.forEach(slot => {
                initialLimits[slot.id] = slot.limit;
            });
            setEditedLimits(initialLimits);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching timeslot data: ", error);
            setLoading(false);
        });

        return () => timeslotUnsubscribe();
      } else {
        navigate('/login');
      }
    });

    return () => authUnsubscribe();
  }, [navigate]);

  const handleLimitChange = (id, value) => {
    setEditedLimits(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdateLimits = async () => {
    const batch = writeBatch(db);
    let hasChanges = false;
    timeslots.forEach(slot => {
      const originalLimit = slot.limit;
      const editedLimit = editedLimits[slot.id];
      if (editedLimit !== undefined) {
        const newLimit = parseInt(editedLimit, 10);
        if (!isNaN(newLimit) && newLimit !== originalLimit) {
            const slotRef = doc(db, "timeslot", slot.id);
            batch.update(slotRef, { limit: newLimit });
            hasChanges = true;
        }
      }
    });

    if (hasChanges) {
        try {
            await batch.commit();
        } catch (error) {
            console.error("Error updating limits: ", error);
            alert("Gagal memperbarui batas.");
        }
    }
  };

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
        const registrationSnapshot = await getDocs(collection(db, 'registrations'));
        
        const dataToExport = registrationSnapshot.docs.map(d => {
            const data = d.data();

            let registrationTimestamp = 'N/A';
            if (data.timestamp && typeof data.timestamp.toDate === 'function') {
                registrationTimestamp = data.timestamp.toDate().toLocaleString('id-ID', { timeZone: 'Asia/Tokyo' });
            }

            const gelombang = initialGelombangSalatOptions.find(g => g.id === data.kloter);
            const gelombangName = gelombang ? gelombang.name : (data.kloter || 'N/A');

            return {
                Nama: data.nama || 'N/A',
                Email: data.email || 'N/A',
                'Nomor Telepon': data.nomorTelepon || 'N/A',
                'Kode Pos': data.kodePos || 'N/A',
                'Jumlah Ikhwan': data.ikhwan || 0,
                'Jumlah Akhwat': data.akhwat || 0,
                Sesi: gelombangName,
                Timestamp: registrationTimestamp,
            };
        });

        setExportData(dataToExport);
        setTimeout(() => {
            if (csvLinkRef.current) {
                csvLinkRef.current.link.click();
            }
            setExporting(false);
            setExportData([]);
        }, 500);

    } catch (error) {
        console.error('Error during data export preparation:', error);
        alert("Gagal mempersiapkan data ekspor. Silakan coba lagi.");
        setExporting(false);
    }
  }
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const totalIkhwan = timeslots.reduce((acc, curr) => acc + (curr.registered_ikhwan || 0), 0);
  const totalAkhwat = timeslots.reduce((acc, curr) => acc + (curr.registered_akhwat || 0), 0);
  const grandTotal = totalIkhwan + totalAkhwat;

  const chartData = timeslots.map(slot => {
    const gelombang = initialGelombangSalatOptions.find(g => g.id === slot.slot);
    return {
      name: gelombang ? gelombang.name.replace('Gelombang Salat ', 'Sesi ') : `Sesi ${slot.slot}`,
      Ikhwan: slot.registered_ikhwan || 0,
      Akhwat: slot.registered_akhwat || 0,
    };
  });

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3}}>
            <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Admin Panel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Panel kendali jemaah Salat Idul Fitri 1447H
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button 
                    variant="outlined" 
                    color="inherit"
                    startIcon={<Logout />} 
                    onClick={handleLogout}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Keluar
                </Button>
                <Button 
                    variant="contained" 
                    disableElevation
                    startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : <Download />} 
                    onClick={handleExport} 
                    disabled={exporting}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Export CSV
                </Button>
                {exportData.length > 0 && <CSVLink data={exportData} filename={"pendaftaran-idulfitri-tokyo.csv"} ref={csvLinkRef} style={{display: 'none'}} />}
            </Box>
        </Box>

        <Grid container spacing={{ xs: 1, sm: 3 }} sx={{ mb: 4 }}>
            <Grid item xs={4}>
                <StatCard 
                    title="Total Jemaah" 
                    value={grandTotal} 
                    icon={<People sx={{ fontSize: { xs: 18, sm: 24 } }} />} 
                    color={theme.palette.primary.main}
                    subtitle="Gabungan Ikhwan dan Akhwat dari semua sesi"
                />
            </Grid>
            <Grid item xs={4}>
                <StatCard 
                    title="Jemaah Ikhwan" 
                    value={totalIkhwan} 
                    icon={<Man sx={{ fontSize: { xs: 18, sm: 24 } }} />} 
                    color="#8884d8"
                />
            </Grid>
            <Grid item xs={4}>
                <StatCard 
                    title="Jemaah Akhwat" 
                    value={totalAkhwat} 
                    icon={<Woman sx={{ fontSize: { xs: 18, sm: 24 } }} />} 
                    color="#82ca9d"
                />
            </Grid>
        </Grid>

        <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Kapasitas per Sesi
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<Save />} 
                            onClick={handleUpdateLimits}
                            disableElevation
                            sx={{ borderRadius: 1.5, textTransform: 'none' }}
                        >
                            Simpan Perubahan
                        </Button>
                    </Box>
                    <Divider />
                    <TableContainer>
                        <Table size={isMobile ? 'small' : 'medium'}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Sesi</StyledTableCell>
                                    {!isMobile && (
                                        <>
                                            <StyledTableCell align="right">Ikhwan</StyledTableCell>
                                            <StyledTableCell align="right">Akhwat</StyledTableCell>
                                        </>
                                    )}
                                    <StyledTableCell align="right">Total</StyledTableCell>
                                    <StyledTableCell align="right">Batas</StyledTableCell>
                                    <StyledTableCell align="right">Sisa</StyledTableCell>
                                    <StyledTableCell align="center">Ubah Batas</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {timeslots.map((slot) => {
                                    const totalRegistered = (slot.registered_ikhwan || 0) + (slot.registered_akhwat || 0);
                                    const currentLimit = editedLimits[slot.id] !== undefined ? parseInt(editedLimits[slot.id], 10) : slot.limit;
                                    const remaining = currentLimit - totalRegistered;
                                    const gelombang = initialGelombangSalatOptions.find(g => g.id === slot.slot);
                                    
                                    return (
                                        <StyledTableRow key={slot.id}>
                                            <StyledTableCell sx={{ fontWeight: 600 }}>
                                                {gelombang ? gelombang.name.replace('Gelombang Salat ', '') : slot.slot}
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    {gelombang?.time || ''}
                                                </Typography>
                                            </StyledTableCell>
                                            {!isMobile && (
                                                <>
                                                    <StyledTableCell align="right">{slot.registered_ikhwan || 0}</StyledTableCell>
                                                    <StyledTableCell align="right">{slot.registered_akhwat || 0}</StyledTableCell>
                                                </>
                                            )}
                                            <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                {totalRegistered}
                                            </StyledTableCell>
                                            <StyledTableCell align="right" color="text.secondary">
                                                {slot.limit}
                                            </StyledTableCell>
                                            <StyledTableCell 
                                                align="right" 
                                                sx={{ 
                                                    color: remaining < 10 && remaining > 0 ? 'orange' : remaining <= 0 ? 'red' : 'success.main', 
                                                    fontWeight: 'bold' 
                                                }}
                                            >
                                                {remaining < 0 ? 0 : remaining}
                                            </StyledTableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    value={editedLimits[slot.id] || ''}
                                                    onChange={(e) => handleLimitChange(slot.id, e.target.value)}
                                                    sx={{ 
                                                        width: isMobile ? '70px' : '90px',
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 1.5
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Visualisasi Data
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Perbandingan Ikhwan & Akhwat per Sesi
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                                <Bar dataKey="Ikhwan" stackId="a" fill="#8884d8" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="Akhwat" stackId="a" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Card>
            </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPage;
