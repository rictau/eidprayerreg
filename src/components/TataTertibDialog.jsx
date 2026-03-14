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
            参列者の皆様は、以下の事項を遵守してください：
          </Typography>
        </Typography>

        {/* Section I */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            I. UMUM <Typography variant="subtitle2" component="span">(一般事項)</Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            1. Menjaga nama baik bangsa Indonesia di Jepang dengan mengedepankan 4K, Ketertiban, Keamanan, Kebersihan, dan Kenyamanan<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              4K（秩序、安全、清潔、快適）を優先し、日本におけるインドネシア国民の良き評判を維持すること
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            2. Menjaga ketertiban dan keamanan selama perjalanan dari rumah, selama di MIT/SIT, serta perjalanan kembali ke rumah<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              自宅から会場（MIT/SIT）への往復路、および会場内での秩序と安全を確保すること
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            3. Menjaga kebersihan seluruh area yang dilalui dalam pelaksanaan salat Idulfitri 1447 H<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              イード・アル＝フィトル礼拝が行われる全エリアの清潔さを保つこと
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            4. Tidak merokok selain di area yang telah ditentukan oleh Pemerintah Jepang<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              日本の法律に基づき、指定された場所以外での喫煙は禁止です
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            5. Menjaga kenyamanan dengan tidak berbicara terlalu keras di area publik; dan<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              公共の場では大声で話さず、周囲への配慮を忘れないこと
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            6. Mengikuti petunjuk petugas di lapangan.<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              現場スタッフの指示に従うこと
            </Typography>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section II */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            II. KELENGKAPAN SALAT <Typography variant="subtitle2" component="span">(礼拝の準備)</Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            1. Menjaga wudu sejak dari rumah, sarana Wudu di MIT/SIT sangat terbatas<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              会場の小浄（ウドゥ）施設は限られているため、できるだけ自宅で済ませてから来場すること
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            2. Membawa tas untuk menyimpan sandal/sepatu<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              靴やサンダルを収納するための袋を持参すること
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            3. Membawa sajadah/alas salat masing-masing<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              各自で礼拝用マット（サジャダ）を持参すること
            </Typography>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section III */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            III. TEKNIS SALAT <Typography variant="subtitle2" component="span">(礼拝の実施について)</Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            1. Lokasi salat adalah MIT dan Balai Indonesia<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              礼拝会場はMITおよびバライ・インドネシア（インドネシア会館）です
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            2. Jamaah Lansia dan Difabel salat di Balai Indonesia Lantai I<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              高齢者および障がいをお持ちの方は、バライ・インドネシアの1階をご利用ください
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            3. Jamaah laki-laki salat di dalam MIT dan Balai Indonesia Lantai II<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              男性の方はMIT内またはバライ・インドネシアの2階です
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            4. Jamaah perempuan salat di Balai Indonesia Lantai II<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              女性の方はバライ・インドネシアの2階です
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            5. Jamaah mengisi saf salat dengan prinsip first come first served<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              礼拝の列（サフ）は先着順となります
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            6. Jamaah agar antre dengan tertib menunggu gelombang salat yang tersedia<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              各回の礼拝を待つ際は、秩序を守って列に並んでください
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            7. Waktu keseluruhan salat adalah 30 menit<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              各回の礼拝時間は30分です
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            8. Jeda waktu antargelombang adalah 30 menit<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              各回の間隔は30分です
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            9. Jamaah agar segera mengosongkan area salat seusai khutbah berakhir untuk memberi kesempatan jamaah berikutnya<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              次の回の方々のために、説教（フトバ）終了後は速やかに会場を空けてください
            </Typography>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section IV */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            IV. KONSUMSI <Typography variant="subtitle2" component="span">(飲食について)</Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            1. Panitia menyediakan snacks dan minum untuk seluruh jamaah<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              実行委員会より、参列者の皆様へ軽食と飲み物を提供します
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            2. Jamaah mengambil snacks dan minum seusai mengikuti salat<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              礼拝終了後に各自でお受け取りください
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            3. Jamaah membawa sampah plastik/kotak snacks ke dalam tas masing-masing<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              軽食の空き箱やプラスチックゴミは各自で持ち帰ってください
            </Typography>
          </Typography>
          <Typography variant="body2" gutterBottom>
            4. Jamaah dilarang membuang sampah plastik/kotak snacks di konbini<br/>
            <Typography component="span" variant="caption" color="text.secondary">
              コンビニのゴミ箱にゴミを捨てることは固く禁じられています
            </Typography>
          </Typography>
        </Box>

        <Typography variant="h6" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
          Taqabbalallahu Minna Wa Minkum<br/>
          <Typography component="span" variant="subtitle2">
            タカッバラッラーフ・ミンナ・ワ・ミンクム
          </Typography>
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Mohon kerja sama demi kelancaran ibadah kita bersama.<br/>
          <Typography component="span" variant="body2" color="text.secondary">
            円滑な礼拝運営のため、皆様のご協力をお願いいたします。
          </Typography>
        </Typography>

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
