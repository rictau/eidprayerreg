# Blueprint: Salat Idul Fitri 1447H Registration App

## 1. Overview

This document outlines the architecture and features of the Salat Idul Fitri 1447H registration application. The primary goal is to provide a seamless and informative registration experience for congregants, culminating in an automated confirmation email that contains all necessary information for the event day.

**Live Application:** [https://indonesiaberlebaran.tokyo/](https://indonesiaberlebaran.tokyo/)

The application is a modern React-based web app built with Vite, styled with Material-UI (MUI), and powered by a Firebase backend.

---

## 2. Core Application Features

### Frontend (React + Vite)
- **Registration Form:** A user-friendly, single-page interface to register for the event.
    - **Fields:**
        - Nama (Name)
        - Email Address
        - Jumlah Ikhwan (Number of Male Attendees)
        - Jumlah Akhwat (Number of Female Attendees)
        - Kloter Salat (Prayer Slot Selection)
- **Rules & Regulations (`Tata Tertib`):**
    - A mandatory dialog (`TataTertibDialog`) appears before registration can be completed.
    - Users must scroll to the bottom and agree to the terms, ensuring they have read all rules.
    - The rules are provided in both Indonesian and Japanese.
- **Prayer Slot Selection:**
    - Users can choose from one of five available prayer sessions (`Gelombang Salat`).
    - The UI clearly displays the time for each slot.
- **QR Code Generation:**
    - Upon successful registration, the application displays a unique QR code.
    - The QR code encodes the registrant's details (Name, Attendees, Prayer Slot) for easy check-in at the venue.
- **Styling & UI:**
    - The application uses Material-UI (MUI) for a clean, modern, and responsive design.
    - The layout is centered and designed to be intuitive on both desktop and mobile devices.

### Backend (Firebase)
- **Firestore Database:**
    - A `registrations` collection stores all registration data.
    - Each document in the collection represents a single registration and includes the user's details and selected prayer slot.
- **Cloud Functions:**
    - A single, powerful function (`sendRegistrationEmail`) handles all email notifications.
    - **Trigger:** The function is triggered `onWrite` to the `registrations` collection, meaning it runs for both new registrations and any subsequent updates.
    - **Email Service:** It uses the Resend API to dispatch emails, ensuring high deliverability.

---

## 3. Automated Email Notification System

The email system is a critical component, designed to be comprehensive and professional.

### Email Configuration:
- **Sender:** `Idul Fitri <idulfitri@masjid.tokyo>`
- **Subject:** `Salat Idul Fitri 1447H`

### Email Content & Design:
- **Layout:** A centered, responsive HTML template that looks great on all devices.
- **Header:** A "Pendaftaran Berhasil!" (Registration Successful) confirmation message.
- **Prayer Slot:** The registrant's chosen `Gelombang Salat` and time are prominently displayed.
- **Registration Details:**
    - Name (Nama)
    - Male Attendees (Ikhwan)
    - Female Attendees (Akhwat)
    - All details are center-aligned for a clean, symmetrical look.
- **QR Code:** The unique QR code is embedded directly in the email for convenience.
- **Rules (`Tata Tertib`):**
    - The full, detailed list of rules and regulations (`Tata Tertib (注意事項)`) is included directly in the email body, with bilingual (Indonesian/Japanese) text. This ensures attendees have the rules on hand.
- **Location:**
    - The full address of Masjid Indonesia Tokyo is provided.
    - A direct link to the location on Google Maps is included for easy navigation.
- **Footer:** A standard "This is an automated message. Please do not reply" notice.

---

## 4. Development Plan & Execution Summary

This section outlines the iterative steps taken to build and refine the application based on user requests.

1.  **Initial Setup:** A basic React + Vite application was created.
2.  **Firebase Integration:** Firebase was added to the project for backend services.
3.  **Registration Form:** The core registration UI was built.
4.  **Cloud Function for Email:**
    - An initial Cloud Function was created to send a basic email upon registration.
    - **Iteration 1:** Modified the sender email, subject, and added a no-reply notice.
    - **Iteration 2:** Ensured the function triggers on updates as well as creations.
    - **Iteration 3:** Added the mosque's location and a Google Maps link to the email body.
    - **Iteration 4:** Added a placeholder for the `Tata Tertib`.
    - **Iteration 5:** Extracted the detailed rules from the `TataTertibDialog.jsx` component and embedded the fully formatted, bilingual text into the email.
    - **Iteration 6:** Updated the sender address, subject line, and the title of the `Tata Tertib` section based on final user feedback.
    - **Iteration 7:** Adjusted the sender name and `from` address for brand consistency.
    8.  **Iteration 8:** Corrected the text alignment of the registration details (Name, Ikhwan, Akhwat) to be centered, ensuring a polished and visually consistent email design.
    9.  **Iteration 9:** Revised the Japanese translation of the `Tata Tertib` (Rules & Regulations) in both the application dialog and the confirmation email to be more natural and simplified for Japanese-speaking users.
    10. **Iteration 10:** Created a new isolated registration page for "Gelombang Awal" (Slot 0: 05:50 - 06:30).
    - Added Slot 0 to `src/constants.js`.
    - Modified `Layout.jsx` to allow conditionally hiding the KBRI logo.
    - Created `src/pages/Gelombang0Page.jsx` specifically for Slot 0, removing the top banner and KBRI logo.
    - Updated `src/pages/HomePage.jsx` to exclude Slot 0 from the main registration flow.
    - Updated `functions/index.js` to include Slot 0 in the email confirmation logic.
    - Added the `/gelombang0` route to `src/App.jsx`.
11. **Iteration 11:** Updated the 'Tata Tertib' (Rules & Regulations) content in the confirmation email (`functions/index.js`) to strictly follow the latest definitions in `src/components/TataTertibDialog.jsx`. This included adding the specific 15-minute interval note for waves 4 and 5, as well as the bilingual closing prayer and cooperation message.
12. **Final Deployment:** The completed and fully tested application and Cloud Function were deployed.
