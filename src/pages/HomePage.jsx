import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  runTransaction,
  query,
  where,
  getDoc,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Checkbox,
  FormControlLabel,
  Card,
  CardActionArea,
  RadioGroup,
  Radio,
  FormLabel,
  Select,
  MenuItem,
  Link,
  Alert,
  LinearProgress,
  InputAdornment,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { FaMale, FaFemale } from "react-icons/fa";
import StatusPendaftaran from "../components/StatusPendaftaran";
import TataTertibDialog from "../components/TataTertibDialog";
import { initialGelombangSalatOptions } from "../constants";

function HomePage() {
  const [gelombangSalatData, setGelombangSalatData] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    nomorTelepon: "",
    kodePos: "",
    ikhwan: 0,
    akhwat: 0,
  });
  
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailNotification, setEmailNotification] = useState(null);

  const [selectedGelombangSalat, setSelectedGelombangSalat] = useState(null);
  const [open, setOpen] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalAttendees = formData.ikhwan + formData.akhwat;

  const totalAvailability = gelombangSalatData.reduce(
    (sum, g) => sum + (g.availability > 0 ? g.availability : 0),
    0
  );

  useEffect(() => {
    const timeslotCollection = collection(db, 'timeslot');
    const unsubscribe = onSnapshot(timeslotCollection, (timeslotSnapshot) => {
        const timeslotData = {};
        timeslotSnapshot.forEach((doc) => {
          timeslotData[doc.data().slot] = { docId: doc.id, ...doc.data() };
        });

        const mergedData = initialGelombangSalatOptions
          .filter(option => option.id !== 0)
          .map((option) => {
            const data = timeslotData[option.id] || {};
            const limit = data.limit || 0;
            const currentRegistered =
              (data.registered_ikhwan || 0) + (data.registered_akhwat || 0);
            const availability = limit - currentRegistered;
            const progress = limit > 0 ? (currentRegistered / limit) * 100 : 0;

            return {
              ...option,
              docId: data.docId,
              availability,
              limit,
              progress,
            };
          });
        setGelombangSalatData(mergedData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching timeslot data: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedGelombangSalat !== null) {
      const selectedGelombang = gelombangSalatData.find(g => g.id === selectedGelombangSalat);
      if (selectedGelombang) {
        const isCurrentKloter = existingRegistration && existingRegistration.kloter === selectedGelombang.id;
        const effectiveAvailability = isCurrentKloter 
          ? selectedGelombang.availability + (existingRegistration.ikhwan + existingRegistration.akhwat)
          : selectedGelombang.availability;

        if (effectiveAvailability < totalAttendees) {
          setSelectedGelombangSalat(null);
        }
      }
    }
  }, [totalAttendees, gelombangSalatData, selectedGelombangSalat, existingRegistration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "email") {
      setIsEmailVerified(false);
      setEmailNotification(null);
      
      if (existingRegistration) {
        setExistingRegistration(null);
        setFormData((prev) => ({
          ...prev,
          email: value,
          nama: "",
          nomorTelepon: "",
          kodePos: "",
          ikhwan: 0,
          akhwat: 0,
        }));
        setSelectedGelombangSalat(null);
        return;
      }
    }

    if (name === "ikhwan" || name === "akhwat") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckEmail = async () => {
    if (!formData.email) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailNotification({
        severity: "error",
        message: "Format email tidak valid. (無効なメール形式です)"
      });
      return;
    }

    setEmailCheckLoading(true);
    setEmailNotification(null);

    try {
      const q = query(
        collection(db, "registrations"),
        where("email", "==", formData.email),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        
        setExistingRegistration({ id: doc.id, ...data });
        setFormData({
          nama: data.nama || "",
          email: data.email || "",
          nomorTelepon: data.nomorTelepon || "",
          kodePos: data.kodePos || "",
          ikhwan: data.ikhwan || 0,
          akhwat: data.akhwat || 0,
        });
        const currentKloterExists = gelombangSalatData.some(g => g.id === data.kloter);
        setSelectedGelombangSalat(currentKloterExists ? data.kloter : null);
        
        setEmailNotification({
          severity: "info",
          message: currentKloterExists 
            ? "Email ini sudah digunakan untuk registrasi. Silakan ubah data registrasi jika diperlukan. (このメールアドレスは登録に使用されています。必要に応じて登録データを変更してください。)"
            : data.kloter === 0
              ? "Email ini sudah terdaftar di Gelombang 0. Anda dapat memindahkan pendaftaran Anda ke Gelombang 1-5 di sini. (このメールは早期時間帯に登録されています。ここで第1〜5回の登録に変更できます。)"
              : "Email ini sudah digunakan untuk registrasi. Silakan ubah data registrasi jika diperlukan. (このメールアドレスは登録に使用されています。必要に応じて登録データを変更してください。)"
        });
      } else {
        setExistingRegistration(null);
        setEmailNotification({
          severity: "success",
          message: "Silakan lengkapi formulir di bawah ini. (以下のフォームにご記入ください。)"
        });
      }
      setIsEmailVerified(true);
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailNotification({
        severity: "error",
        message: "Terjadi kesalahan saat mengecek email. Silakan coba lagi. (エラーが発生しました。もう一度お試しください。)"
      });
    } finally {
      setEmailCheckLoading(false);
    }
  };
  
  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (formData.email && !loading && !emailCheckLoading && !isEmailVerified) {
        handleCheckEmail();
      }
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (totalAttendees > 5) {
      alert(
        "Jumlah ikhwan dan akhwat tidak boleh lebih dari 5. (男性と女性の合計は5名を超えることはできません。)",
      );
      return;
    }
    if (totalAttendees === 0) {
      alert(
        "Jumlah ikhwan dan akhwat tidak boleh 0. (男性と女性の数を入力してください。)",
      );
      return;
    }
    if (selectedGelombangSalat === null) {
      alert(
        "Silakan pilih gelombang salat terlebih dahulu. (礼拝の時間帯を選択してください。)",
      );
      return;
    }

    const userRegistration = existingRegistration;
    
    const selectedGelombangSalatData = gelombangSalatData.find(
      (k) => k.id === selectedGelombangSalat,
    );

    if (!selectedGelombangSalatData) {
      alert(
        "Silakan pilih gelombang salat terlebih dahulu. (礼拝の時間帯を選択してください。)",
      );
      return;
    }

    let availability = selectedGelombangSalatData.availability;
    if (userRegistration && userRegistration.kloter === selectedGelombangSalat) {
        availability += userRegistration.ikhwan + userRegistration.akhwat;
    }

    if (availability < totalAttendees) {
      alert(
        `Maaf, sisa kuota untuk gelombang salat ini adalah ${availability}, tidak mencukupi untuk ${totalAttendees} orang. (申し訳ありませんが、この時間帯の残りの定員は${availability}名ですので、${totalAttendees}名様ではご案内できません。)`
      );
      return;
    }

    setOpen(true);
  };


  const confirmRegistration = async () => {
    setOpen(false);
    try {
      let finalRegistrationId;
      
      const selectedSlot = gelombangSalatData.find(g => g.id === selectedGelombangSalat);
      if (!selectedSlot || !selectedSlot.docId) {
        throw new Error("Data gelombang salat tidak ditemukan! (時間帯データが見つかりません)");
      }

      if (existingRegistration) {
        const registrationDocRef = doc(
          db,
          "registrations",
          existingRegistration.id,
        );
        const newSlotDocRef = doc(
          db,
          "timeslot",
          selectedSlot.docId,
        );
        
        const oldSlot = gelombangSalatData.find(g => g.id === existingRegistration.kloter);
        const oldSlotDocRef = (oldSlot && oldSlot.docId) ? doc(db, "timeslot", oldSlot.docId) : null;

        await runTransaction(db, async (transaction) => {
          const newSlotDoc = await transaction.get(newSlotDocRef);
          const oldSlotDoc = oldSlotDocRef ? await transaction.get(oldSlotDocRef) : null;

          if (!newSlotDoc.exists())
            throw new Error("Gelombang salat baru tidak ditemukan!");
          
          if (existingRegistration.kloter !== selectedGelombangSalat) {
            if (oldSlotDoc && oldSlotDoc.exists()) {
              const oldSlotData = oldSlotDoc.data();
              transaction.update(oldSlotDocRef, {
                registered_ikhwan:
                  (oldSlotData.registered_ikhwan || 0) -
                  existingRegistration.ikhwan,
                registered_akhwat:
                  (oldSlotData.registered_akhwat || 0) -
                  existingRegistration.akhwat,
              });
            }

            const newSlotData = newSlotDoc.data();
            if (
              (newSlotData.limit || 0) <
              (newSlotData.registered_ikhwan || 0) +
                (newSlotData.registered_akhwat || 0) +
                totalAttendees
            ) {
              throw new Error(
                "Maaf, kuota untuk gelombang salat baru ini sudah penuh.",
              );
            }
            transaction.update(newSlotDocRef, {
              registered_ikhwan:
                (newSlotData.registered_ikhwan || 0) + formData.ikhwan,
              registered_akhwat:
                (newSlotData.registered_akhwat || 0) + formData.akhwat,
            });
          } else {
            const newSlotData = newSlotDoc.data();
            const diffIkhwan = formData.ikhwan - existingRegistration.ikhwan;
            const diffAkhwat = formData.akhwat - existingRegistration.akhwat;
            if (
              (newSlotData.limit || 0) <
              (newSlotData.registered_ikhwan || 0) +
                (newSlotData.registered_akhwat || 0) +
                diffIkhwan +
                diffAkhwat
            ) {
              throw new Error(
                "Maaf, perubahan jumlah pendaftar melebihi kuota.",
              );
            }
            transaction.update(newSlotDocRef, {
              registered_ikhwan:
                (newSlotData.registered_ikhwan || 0) + diffIkhwan,
              registered_akhwat:
                (newSlotData.registered_akhwat || 0) + diffAkhwat,
            });
          }

          transaction.update(registrationDocRef, {
            ...formData,
            kloter: selectedGelombangSalat,
            timestamp: new Date(),
          });
        });
        finalRegistrationId = existingRegistration.id;
      } else {
        const slotDocRef = doc(db, "timeslot", selectedSlot.docId);
        const newRegistrationRef = await runTransaction(
          db,
          async (transaction) => {
            const slotDoc = await transaction.get(slotDocRef);
            if (!slotDoc.exists())
              throw new Error("Gelombang salat tidak ditemukan!");
            const slotData = slotDoc.data();
            if (
              (slotData.limit || 0) <
              (slotData.registered_ikhwan || 0) +
                (slotData.registered_akhwat || 0) +
                totalAttendees
            ) {
              throw new Error(
                "Maaf, kuota untuk gelombang salat ini sudah penuh.",
              );
            }
            transaction.update(slotDocRef, {
              registered_ikhwan:
                (slotData.registered_ikhwan || 0) + formData.ikhwan,
              registered_akhwat:
                (slotData.registered_akhwat || 0) + formData.akhwat,
            });
            const registrationDocRef = doc(collection(db, "registrations"));
            transaction.set(registrationDocRef, {
              ...formData,
              kloter: selectedGelombangSalat,
              email: formData.email,
              timestamp: new Date(),
            });
            return registrationDocRef;
          },
        );
        finalRegistrationId = newRegistrationRef.id;
      }

      const regDoc = await getDoc(
        doc(db, "registrations", finalRegistrationId),
      );
      if (regDoc.exists()) {
        setRegistrationData({ id: regDoc.id, ...regDoc.data() });
      }
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Error during transaction: ", error);
      alert(error.message);
    }
  };

  const handleClose = () => setOpen(false);

  if (registrationSuccess) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <StatusPendaftaran registrationData={registrationData} />
        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Kembali
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Box 
        component="img"
        src="/banner.jpeg?v=1.1"
        alt="Banner"
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: 4, // Match theme Paper/Card borderRadius (16px)
          mb: 3,
          boxShadow: "0 10px 30px 0 rgba(0, 0, 0, 0.1)",
          display: "block",
          objectFit: "cover",
        }}
      />



      <Box sx={{ mb: 3, textAlign: "left" }}>
        <Typography
          variant="h6"
          component="h1"
          sx={{ fontWeight: "bold" }}
        >
          Silakan isi formulir di bawah ini untuk mendaftarkan diri dan keluarga.
        </Typography>
        <Typography variant="body2" component="h2" color="text.secondary">
          下記フォームにご記入の上、ご自身とご家族の登録をお願いします。
        </Typography>
      </Box>

      {!loading && !existingRegistration && totalAvailability <= 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Maaf, seluruh kuota pendaftaran Salat Idul Fitri telah penuh. Kami memohon pengertian Anda untuk mencari masjid lain yang mengadakan Salat Idul Fitri.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            申し訳ありませんが、イード礼拝のすべての定員が満席となりました。ご理解のほどよろしくお願いいたします。イード礼拝を開催している他のモスクをお探しになることをお勧めします。
          </Typography>
        </Alert>
      )}

      <form onSubmit={handleRegistration}>
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 4, mb: 3 }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: emailNotification ? 2 : 3, alignItems: 'center' }}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleEmailKeyDown}
              disabled={loading || emailCheckLoading}
            />
            <Button
              variant="contained"
              color={isEmailVerified ? "success" : "primary"}
              onClick={handleCheckEmail}
              disabled={!formData.email || loading || emailCheckLoading || isEmailVerified}
              sx={{ minWidth: '80px', height: '56px' }}
            >
              {emailCheckLoading ? <CircularProgress size={24} color="inherit" /> : (isEmailVerified ? "Ok" : "Check")}
            </Button>
          </Box>

          {emailNotification && (
            <Alert 
              severity={emailNotification.severity} 
              sx={{ mb: 3 }}
              action={
                existingRegistration && (
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={() => {
                      setRegistrationData(existingRegistration);
                      setRegistrationSuccess(true);
                    }}
                  >
                    Lihat Tiket
                  </Button>
                )
              }
            >
              {emailNotification.message}
            </Alert>
          )}
          
          <TextField
            required
            fullWidth
            label="Nama (名前)"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            sx={{ mb: 3 }}
            disabled={loading || !isEmailVerified || !!existingRegistration}
          />
          
          {!existingRegistration && (
            <>
              <TextField
                required
                fullWidth
                label="Nomor Telepon (電話番号)"
                name="nomorTelepon"
                value={formData.nomorTelepon}
                onChange={handleChange}
                sx={{ mb: 3 }}
                disabled={loading || !isEmailVerified}
              />
              <TextField
                required
                fullWidth
                label="Kode Pos Domisili (郵便番号)"
                name="kodePos"
                value={formData.kodePos}
                onChange={handleChange}
                placeholder="153-0063"
                sx={{ mb: 3 }}
                disabled={loading || !isEmailVerified}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontWeight: 'bold' }}>〒</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
          
          <Box sx={{ mb: 5 }}>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 2, fontWeight: "small" }}>
               *Anak di bawah 4 tahun tidak perlu didaftarkan.<br/>
               <br/>
            </Typography>
            <FormControl
              component="fieldset"
              sx={{ mb: 4 }}
              disabled={loading || !isEmailVerified}
            >
              <FormLabel component="legend">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FaMale style={{ marginRight: '8px' }} />
                  Jumlah Ikhwan (男性)
                </Box>
              </FormLabel>
              <RadioGroup
                row
                name="ikhwan"
                value={formData.ikhwan}
                onChange={handleChange}
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <FormControlLabel
                    key={n}
                    value={n}
                    control={<Radio />}
                    label={n}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" disabled={loading || !isEmailVerified}>
            <FormLabel component="legend">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FaFemale style={{ marginRight: '8px' }} />
                  Jumlah Akhwat (女性)
                </Box>
              </FormLabel>
              <RadioGroup
                row
                name="akhwat"
                value={formData.akhwat}
                onChange={handleChange}
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <FormControlLabel
                    key={n}
                    value={n}
                    control={<Radio />}
                    label={n}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Paper>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Pilih Gelombang Salat
          </Typography>

          <Typography variant="body2" color="text.secondary">
            時間帯を選択
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              mb: 3,
            }}
          >
            {gelombangSalatData.map((gelombang) => {
              const isCurrentKloter = existingRegistration && existingRegistration.kloter === gelombang.id;
              const effectiveAvailability = isCurrentKloter 
                ? gelombang.availability + (existingRegistration.ikhwan + existingRegistration.akhwat)
                : gelombang.availability;
                
              const isFull = gelombang.availability <= 0;
              const hasQuotaForSelection = effectiveAvailability >= totalAttendees;
              const isDisabled = !isEmailVerified || (totalAttendees > 0 && !hasQuotaForSelection) || (isFull && !isCurrentKloter);

              return (
                  <Card
                  key={gelombang.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 4,
                    ...(selectedGelombangSalat === gelombang.id && {
                      borderColor: "primary.main",
                      borderWidth: 2,
                      backgroundColor: "rgba(18, 76, 58, 0.1)",
                    }),
                    ...(isDisabled && selectedGelombangSalat !== gelombang.id && {
                        backgroundColor: "#f5f5f5",
                        color: "#bdbdbd",
                        cursor: "not-allowed",
                      }),
                  }}
                >
                  <CardActionArea
                    disabled={isDisabled}
                    onClick={() => setSelectedGelombangSalat(gelombang.id)}
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}> 
                          {gelombang.name}
                        </Typography>
                        <Typography variant="body2">{gelombang.time}</Typography> 
                      </Box>
                      {isFull && (
                        <Typography variant="caption" color="error" sx={{ fontWeight: "bold", mt: 0.5 }}>
                          Penuh<br/>(満席)
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ width: "100%", mt: 1.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={gelombang.progress}
                        color={isFull ? "error" : "primary"}
                        sx={{ 
                            mb: 0.5, 
                            height: 6, 
                            borderRadius: 3,
                            backgroundColor: isFull ? "rgba(211, 47, 47, 0.1)" : "rgba(18, 76, 58, 0.1)", 
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: isFull ? "error.main" : "primary.light"
                            }
                        }}
                      />
                    </Box>
                  </CardActionArea>
                </Card>
              )
          })}
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={
            loading ||
            !isEmailVerified ||
            selectedGelombangSalat === null ||
            totalAttendees === 0
          }
        >
          {existingRegistration ? "Ubah Pendaftaran (登録内容の変更)" : "Daftar (登録)"}
        </Button>
      </form>
      <TataTertibDialog
        open={open}
        onClose={handleClose}
        onConfirm={confirmRegistration}
      />
    </Box>
  );
}

export default HomePage;
