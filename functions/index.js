
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
        { id: 1, name: "Gelombang Salat 1", time: "07:00 - 07:30" },
        { id: 2, name: "Gelombang Salat 2", time: "08:00 - 08:30" },
        { id: 3, name: "Gelombang Salat 3", time: "09:00 – 09:30" },
        { id: 4, name: "Gelombang Salat 4", time: "10:00 – 10:30" },
        { id: 5, name: "Gelombang Salat 5", time: "10:45 - 11:15" },
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
          <h3 style="font-size: 18px; color: #1a237e; margin-bottom: 12px; text-align: center;">TATA TERTIB</h3>
          <p style="margin-bottom: 16px;">Seluruh jamaah agar memperhatikan hal-hal sebagai berikut:</p>
          
          <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: bold; margin-bottom: 0.5rem;">I. UMUM</h4>
              <p style="margin: 0.3rem 0;">1. Menjaga nama baik bangsa Indonesia di Jepang dengan mengedepankan 4K, Ketertiban, Keamanan, Kebersihan, dan Kenyamanan</p>
              <p style="margin: 0.3rem 0;">2. Menjaga ketertiban dan keamanan selama perjalanan dari rumah, selama di MIT/SIT, serta perjalanan kembali ke rumah</p>
              <p style="margin: 0.3rem 0;">3. Menjaga kebersihan seluruh area yang dilalui dalam pelaksanaan salat Idulfitri 1447 H</p>
              <p style="margin: 0.3rem 0;">4. Tidak merokok selain di area yang telah ditentukan oleh Pemerintah Jepang</p>
              <p style="margin: 0.3rem 0;">5. Menjaga kenyamanan dengan tidak berbicara terlalu keras di area publik; dan</p>
              <p style="margin: 0.3rem 0;">6. Mengikuti petunjuk petugas di lapangan.</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: bold; margin-bottom: 0.5rem;">II. KELENGKAPAN SALAT</h4>
              <p style="margin: 0.3rem 0;">1. Menjaga wudu sejak dari rumah, sarana Wudu di MIT/SIT sangat terbatas</p>
              <p style="margin: 0.3rem 0;">2. Membawa tas untuk menyimpan sandal/sepatu</p>
              <p style="margin: 0.3rem 0;">3. Membawa sajadah/alas salat masing-masing</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: bold; margin-bottom: 0.5rem;">III. TEKNIS SALAT</h4>
              <p style="margin: 0.3rem 0;">1. Lokasi salat adalah MIT dan Balai Indonesia</p>
              <p style="margin: 0.3rem 0;">2. Jamaah Lansia dan Difabel salat di Balai Indonesia Lantai I</p>
              <p style="margin: 0.3rem 0;">3. Jamaah laki-laki salat di dalam MIT and Balai Indonesia Lantai II</p>
              <p style="margin: 0.3rem 0;">4. Jamaah perempuan salat di Balai Indonesia Lantai II</p>
              <p style="margin: 0.3rem 0;">5. Jamaah mengisi saf salat dengan prinsip first come first served</p>
              <p style="margin: 0.3rem 0;">6. Jamaah agar antre dengan tertib menunggu gelombang salat yang tersedia</p>
              <p style="margin: 0.3rem 0;">7. Waktu keseluruhan salat adalah 30 menit</p>
              <p style="margin: 0.3rem 0;">8. Jeda waktu antargelombang adalah 30 menit</p>
              <p style="margin: 0.3rem 0;">9. Jamaah agar segera mengosongkan area salat seusai khutbah berakhir untuk memberi kesempatan jamaah berikutnya</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
              <h4 style="font-weight: bold; margin-bottom: 0.5rem;">IV. KONSUMSI</h4>
              <p style="margin: 0.3rem 0;">1. Panitia menyediakan snacks dan minum untuk seluruh jamaah</p>
              <p style="margin: 0.3rem 0;">2. Jamaah mengambil snacks dan minum seusai mengikuti salat</p>
              <p style="margin: 0.3rem 0;">3. Jamaah membawa sampah plastik/kotak snacks ke dalam tas masing-masing</p>
              <p style="margin: 0.3rem 0;">4. Jamaah dilarang membuang sampah plastik/kotak snacks di konbini</p>
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
