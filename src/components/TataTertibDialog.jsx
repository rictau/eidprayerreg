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
        Tata Tertib Salat Idul Fitri<br/>
        <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          イード・アル＝フィトル礼拝の注意事項
        </Typography>
      </DialogTitle>
      <DialogContent dividers ref={contentRef} onScroll={handleScroll}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Seluruh jamaah agar memperhatikan hal-hal sebagai berikut:<br/>
          <Typography component="span" variant="body2" color="text.secondary">
            参列される皆さまは、以下のことにご注意ください：
          </Typography>
        </Typography>

        {/* Section I */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            I. UMUM <Typography variant="subtitle2" component="span">(一般事項)</Typography>
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              1. Menjaga nama baik bangsa Indonesia di Jepang dengan mengedepankan 4K, Ketertiban, Keamanan, Kebersihan, dan Kenyamanan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              秩序・安全・清潔・快適さを大切にして、日本でのインドネシア人の良い評判を守りましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              2. Menjaga ketertiban dan keamanan selama perjalanan dari rumah, selama di MIT/SIT, serta perjalanan kembali ke rumah
            </Typography>
            <Typography variant="body2" color="text.secondary">
              自宅から会場（MIT/SIT）への行き帰りや、会場内では秩序と安全に気をつけましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              3. Menjaga kebersihan seluruh area yang dilalui dalam pelaksanaan salat Idulfitri 1447 H
            </Typography>
            <Typography variant="body2" color="text.secondary">
              礼拝の行われるすべての場所を、きれいに保ちましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              4. Tidak merokok selain di area yang telah ditentukan oleh Pemerintah Jepang
            </Typography>
            <Typography variant="body2" color="text.secondary">
              日本の法律に基づき、指定された場所以外での喫煙は禁止されているのでやめましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              5. Menjaga kenyamanan dengan tidak berbicara terlalu keras di area publik; dan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              公共の場では大きな声で話さず、周りの人に配慮しましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              6. Mengikuti petunjuk petugas di lapangan.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              スタッフの指示には従いましょう。
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Section II */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            II. KELENGKAPAN SALAT <Typography variant="subtitle2" component="span">(礼拝の準備)</Typography>
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              1. Menjaga wudu sejak dari rumah, sarana Wudu di MIT/SIT sangat terbatas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              会場のウドゥ（小浄）施設は限られています。できるだけ自宅でウドゥを済ませてから来ましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              2. Membawa tas untuk menyimpan sandal/sepatu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              靴やサンダルを入れる袋を持参しましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              3. Membawa sajadah/alas salat masing-masing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              各自で礼拝用マット（サジャダ）を持参しましょう。
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Section III */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            III. TEKNIS SALAT <Typography variant="subtitle2" component="span">(礼拝の実施について)</Typography>
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              1. Lokasi salat adalah MIT dan Balai Indonesia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              礼拝会場はMITとバライ・インドネシアです。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              2. Jamaah Lansia dan Difabel salat di Balai Indonesia Lantai I
            </Typography>
            <Typography variant="body2" color="text.secondary">
              高齢者や障がいのある方は、バライ・インドネシアの1階をご利用ください。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              3. Jamaah laki-laki salat di dalam MIT dan Balai Indonesia Lantai II
            </Typography>
            <Typography variant="body2" color="text.secondary">
              男性はMIT内またはバライ・インドネシアの2階で礼拝します。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              4. Jamaah perempuan salat di Balai Indonesia Lantai II
            </Typography>
            <Typography variant="body2" color="text.secondary">
              女性はバライ・インドネシアの2階で礼拝します。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              5. Jamaah mengisi saf salat dengan prinsip first come first served
            </Typography>
            <Typography variant="body2" color="text.secondary">
              列（サフ）は先着順で埋めていきます。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              6. Jamaah agar antre dengan tertib menunggu gelombang salat yang tersedia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              各回の礼拝を待るときは、落ち着いて順番を守りましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              7. Waktu keseluruhan salat adalah 30 menit
            </Typography>
            <Typography variant="body2" color="text.secondary">
              各回の礼拝は30分ほどです。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              8. Jeda waktu antargelombang adalah 30 menit (kecuali jarak antara gelombang 4 dan 5 selama 15 menit)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              各回の間隔は30分（ただし、第4回と第5回の間隔は15分とする）
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              9. Jamaah agar segera mengosongkan area salat seusai khutbah berakhir untuk memberi kesempatan jamaah berikutnya
            </Typography>
            <Typography variant="body2" color="text.secondary">
              説教（フトバ）が終わったら、次の回の方のために速やかに会場を空けましょう。
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Section IV */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            IV. KONSUMSI <Typography variant="subtitle2" component="span">(飲食について)</Typography>
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              1. Panitia menyediakan snacks dan minum untuk seluruh jamaah
            </Typography>
            <Typography variant="body2" color="text.secondary">
              実行委員会から、軽食と飲み物を用意しています。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              2. Jamaah mengambil snacks dan minum seusai mengikuti salat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              それらは礼拝後に受け取りましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              3. Jamaah membawa sampah plastik/kotak snacks ke dalam tas masing-masing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              空き箱やプラスチックゴミは、自分の袋に持ち帰りましょう。
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              4. Jamaah dilarang membuang sampah plastik/kotak snacks di konbini
            </Typography>
            <Typography variant="body2" color="text.secondary">
              コンビニのゴミ箱には捨てないようにしましょう。
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" align="center" sx={{ mt: 3, fontWeight: 'bold' }}>
          Taqabbalallahu Minna Wa Minkum<br/>
          <Typography component="span" variant="body1">
            タカッバラッラーフ・ミンナ・ワ・ミンクム
          </Typography>
        </Typography>
        <Box sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            Mohon kerja sama demi kelancaran ibadah kita bersama.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            円滑な礼拝運営のため、皆様のご協力をお願いいたします。
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {readOnly ? (
           <Button onClick={handleClose} variant="contained" fullWidth>
             Tutup (閉じる)
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
              label={
                <Typography variant="body2">
                  Saya telah membaca dan menyetujui tata tertib di atas.<br/>
                  <Typography component="span" variant="caption" color="text.secondary">
                    上記の注意事項を読み、同意します。
                  </Typography>
                </Typography>
              }
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, textAlign: 'center' }}>
                (Silakan scroll ke bawah dan baca semua aturan sebelum menyetujui.)<br/>
                (同意する前に、下までスクロールしてすべての項目を確認してください。)
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
