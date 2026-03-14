
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// The Resend API key is now securely stored in Firebase Functions configuration
const RESEND_API_KEY = functions.config().resend.key;
const SENDER_EMAIL = "noreply@indonesiaberlebaran.tokyo";

exports.sendRegistrationEmail = functions.firestore
  .document("registrations/{docId}")
  .onWrite(async (change, context) => {
    const registrationData = change.after.exists ? change.after.data() : null;

    if (!registrationData) {
      console.log("Document deleted, no email to send.");
      return null;
    }

    const id = context.params.docId;
    const { nama, ikhwan, akhwat, kloter, email } = registrationData;

    if (!email) {
        console.log(`Registration ${id} has no email address. Cannot send email.`);
        return null;
    }

    const initialGelombangSalatOptions = [
        { id: 1, name: "Gelombang 1 (第1回)", time: "07:00 - 07:30" },
        { id: 2, name: "Gelombang 2 (第2回)", time: "08:00 - 08:30" },
        { id: 3, name: "Gelombang 3 (第3回)", time: "09:00 – 09:30" },
        { id: 4, name: "Gelombang 4 (第4回)", time: "10:00 – 10:30" },
        { id: 5, name: "Gelombang 5 (第5回)", time: "10:45 - 11:15" },
    ];

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

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeValue)}&size=150x150`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); color: #333;">
      <h2 style="margin-bottom: 8px; font-size: 24px; color: #1a237e; text-align: center;">Pendaftaran Berhasil!</h2>
      <p style="margin-bottom: 8px; font-size: 16px; text-align: center;">Terima kasih telah mendaftar. Sampai jumpa di Masjid Indonesia Tokyo.</p>
      <p style="color: #666; margin-bottom: 24px; font-size: 14px; text-align: center;">ご登録ありがとうございます。東京インドネシアモスクでお会いしましょう。</p>

      <div style="background-color: #e8eaf6; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <h1 style="margin: 0; font-weight: bold; font-size: 28px; color: #1a237e;">${gelombangName}</h1>
        <h3 style="margin: 4px 0 0; color: #3f51b5; font-size: 20px;">(${gelombangTime})</h3>
      </div>

      <div style="margin-bottom: 24px; text-align: center;">
        <p style="font-size: 16px; margin: 8px 0;"><strong>Nama (名前):</strong> ${nama}</p>
        <p style="font-size: 16px; margin: 8px 0;"><strong>Ikhwan (男性):</strong> ${ikhwan}</p>
        <p style="font-size: 16px; margin: 8px 0;"><strong>Akhwat (女性):</strong> ${akhwat}</p>
      </div>

      <div style="margin-bottom: 16px; text-align: center;">
        <img src="${qrCodeUrl}" alt="QR Code" style="width: 150px; height: 150px;" />
      </div>

      <p style="font-size: 12px; color: #666; text-align: center;">
        Silakan screenshot layar ini dan tunjukkan kepada panitia di lokasi.<br />
        この画面をスクリーンショットして、会場の係員にご提示ください。
      </p>

      <div style="border-top: 1px solid #e0e0e0; margin-top: 24px; padding-top: 24px; text-align: left;">
          <h3 style="font-size: 18px; color: #1a237e; margin-bottom: 12px; text-align: center;">
            TATA TERTIB SALAT IDUL FITRI<br/>
            <span style="font-size: 14px; color: #666; font-weight: normal;">イード・アル＝フィトル礼拝の注意事項</span>
          </h3>
          <p style="margin-bottom: 4px; font-size: 14px;">Seluruh jamaah agar memperhatikan hal-hal sebagai berikut:</p>
          <p style="margin-top: 0; margin-bottom: 16px; font-size: 12px; color: #666;">参列者の皆様は、以下の事項を遵守してください：</p>
          
          <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: bold; margin-bottom: 0.5rem; font-size: 15px;">I. UMUM <span style="font-size: 13px; font-weight: normal; color: #666;">(一般事項)</span></h4>
              
              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">1. Menjaga nama baik bangsa Indonesia di Jepang dengan mengedepankan 4K, Ketertiban, Keamanan, Kebersihan, dan Kenyamanan</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">4K（秩序、安全、清潔、快適）を優先し、日本におけるインドネシア国民の良き評判を維持すること</p>
              </div>
              
              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">2. Menjaga ketertiban dan keamanan selama perjalanan dari rumah, selama di MIT/SIT, serta perjalanan kembali ke rumah</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">自宅から会場（MIT/SIT）への往復路、および会場内での秩序と安全を確保すること</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">3. Menjaga kebersihan seluruh area yang dilalui dalam pelaksanaan salat Idulfitri 1447 H</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">イード・アル＝フィトル礼拝が行われる全エリアの清潔さを保つこと</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">4. Tidak merokok selain di area yang telah ditentukan oleh Pemerintah Jepang</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">日本の法律に基づき、指定された場所以外での喫煙は禁止です</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">5. Menjaga kenyamanan dengan tidak berbicara terlalu keras di area publik; dan</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">公共の場では大声で話さず、周囲への配慮を忘れないこと</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">6. Mengikuti petunjuk petugas di lapangan.</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">現場スタッフの指示に従うこと</p>
              </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: bold; margin-bottom: 0.5rem; font-size: 15px;">II. KELENGKAPAN SALAT <span style="font-size: 13px; font-weight: normal; color: #666;">(礼拝の準備)</span></h4>
              
              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">1. Menjaga wudu sejak dari rumah, sarana Wudu di MIT/SIT sangat terbatas</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">会場の小浄（ウドゥ）施設は限られているため、できるだけ自宅で済ませてから来場すること</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">2. Membawa tas untuk menyimpan sandal/sepatu</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">靴やサンダルを収納するための袋を持参すること</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">3. Membawa sajadah/alas salat masing-masing</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">各自で礼拝用マット（サジャダ）を持参すること</p>
              </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: bold; margin-bottom: 0.5rem; font-size: 15px;">III. TEKNIS SALAT <span style="font-size: 13px; font-weight: normal; color: #666;">(礼拝の実施について)</span></h4>
              
              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">1. Lokasi salat adalah MIT dan Balai Indonesia</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">礼拝会場はMITおよびバライ・インドネシア（インドネシア会館）です</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">2. Jamaah Lansia dan Difabel salat di Balai Indonesia Lantai I</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">高齢者および障がいをお持ちの方は、バライ・インドネシアの1階をご利用ください</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">3. Jamaah laki-laki salat di dalam MIT dan Balai Indonesia Lantai II</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">男性の方はMIT内またはバライ・インドネシアの2階です</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">4. Jamaah perempuan salat di Balai Indonesia Lantai II</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">女性の方はバライ・インドネシアの2階です</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">5. Jamaah mengisi saf salat dengan prinsip first come first served</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">礼拝の列（サフ）は先着順となります</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">6. Jamaah agar antre dengan tertib menunggu gelombang salat yang tersedia</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">各回の礼拝を待つ際は、秩序を守って列に並んでください</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">7. Waktu keseluruhan salat adalah 30 menit</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">各回の礼拝時間は30分です</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">8. Jeda waktu antargelombang adalah 30 menit</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">各回の間隔は30分です</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">9. Jamaah agar segera mengosongkan area salat seusai khutbah berakhir untuk memberi kesempatan jamaah berikutnya</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">次の回の方々のために、説教（フトバ）終了後は速やかに会場を空けてください</p>
              </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: bold; margin-bottom: 0.5rem; font-size: 15px;">IV. KONSUMSI <span style="font-size: 13px; font-weight: normal; color: #666;">(飲食について)</span></h4>
              
              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">1. Panitia menyediakan snacks dan minum untuk seluruh jamaah</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">実行委員会より、参列者の皆様へ軽食と飲み物を提供します</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">2. Jamaah mengambil snacks dan minum seusai mengikuti salat</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">礼拝終了後に各自でお受け取りください</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">3. Jamaah membawa sampah plastik/kotak snacks ke dalam tas masing-masing</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">軽食の空き箱やプラスチックゴミは各自で持ち帰ってください</p>
              </div>

              <div style="margin-bottom: 0.5rem;">
                <p style="margin: 0; font-size: 14px;">4. Jamaah dilarang membuang sampah plastik/kotak snacks di konbini</p>
                <p style="margin: 0 0 0 14px; font-size: 12px; color: #666;">コンビニのゴミ箱にゴミを捨てることは固く禁じられています</p>
              </div>
          </div>
      </div>

      <div style="border-top: 1px solid #e0e0e0; margin-top: 24px; padding-top: 24px; text-align: center;">
          <p style="font-size: 14px; color: #333; margin: 0;"><strong>Lokasi (場所):</strong></p>
          <p style="font-size: 14px; color: #555; margin: 4px 0;">Masjid Indonesia Tokyo (東京インドネシアモスク)</p>
          <p style="font-size: 12px; color: #777; margin: 4px 0;">4 Chome-6-6 Meguro, Meguro City, Tokyo 153-0063</p>
          <a href="https://maps.app.goo.gl/QgYA3PSS48UwSk8y6" style="font-size: 12px; color: #1a73e8; text-decoration: none;">Lihat di Google Maps</a>
      </div>

       <p style="font-size: 10px; color: #999; margin-top: 24px; text-align: center;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
    `;

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `IndonesiaBerlebaran <${SENDER_EMAIL}>`,
                to: email, // The recipient is the email from the registration data
                subject: "Pendaftaran Salat Idul Fitri 1447H",
                html: htmlContent,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`Email sent successfully to ${email}:`, data);
        } else {
            console.error(`Error sending email to ${email}:`, data);
        }
    } catch (error) {
        console.error("An error occurred while sending the email:", error);
    }
});
