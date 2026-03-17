# Eid Prayer Registration App - Masjid Indonesia Tokyo

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

This web application is designed to manage registrations for the Eid prayer at the Masjid Indonesia Tokyo. It provides a simple and efficient way for the community to sign up for specific prayer slots, helping to manage crowd flow and ensure a smooth and organized event.

**Live Application:** [https://indonesiaberlebaran.tokyo/](https://indonesiaberlebaran.tokyo/)

Upon successful registration, each user receives a unique QR code that serves as their digital ticket for entry and a comprehensive confirmation email.

## Table of Contents

- [Project Summary](#project-summary)
- [Why a Custom App vs. Google Forms?](#why-a-custom-app-vs-google-forms)
- [Key Features](#key-features)
- [Automated Email Notification System](#automated-email-notification-system)
- [Admin Portal](#admin-portal)
- [Digital Check-in System](#digital-check-in-system)
- [Technical Stability & Resilience](#technical-stability--resilience)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Firestore Rules](#firestore-rules)
- [License](#license)

## Project Summary

This application addresses the challenge of managing large crowds during Eid prayers by providing a pre-registration system. Users can register themselves and their family members, choose a convenient prayer time, and receive a digital QR code ticket. This system helps event organizers anticipate attendance, enforce capacity limits, and streamline the check-in process on the day of the event. The interface is designed to be intuitive and accessible, with bilingual support in Indonesian and Japanese to serve the entire community.

## Strategic Advantages: Custom Engineering vs. Generic Forms

While generic tools like Google Forms are suitable for simple surveys, managing a high-capacity religious event requires a level of precision, security, and brand authority that only a custom-engineered solution can provide.

| Feature | Custom Engineered Solution | Generic Form Tools | The Impact on Your Event |
| :--- | :--- | :--- | :--- |
| **Atomic Slot Management** | **Yes.** Uses Firestore Transactions to ensure capacity limits are never exceeded, even with concurrent registrations. | **No.** Requires manual oversight; prone to overbooking during peak registration times. | Eliminates the risk of venue overcrowding and the logistical nightmare of "un-inviting" registered guests. |
| **Instant QR Ticketing** | **Yes.** Generates a unique, data-embedded digital ticket immediately upon registration and sends it via automated email. | **No.** Requires manual generation or complex, fragile third-party integrations. | Provides a professional "airline-style" experience that drastically reduces administrative work before the event. |
| **QR Check-in Scanning** | **Integrated.** A dedicated, high-speed scanner with audio feedback and real-time validation against the live database. | **None.** Requires manual name searches in a spreadsheet or fragmented third-party scanner apps. | Drastically reduces entrance queues and prevents duplicate entries with sub-second validation at the door. |
| **Brand Authority & Trust** | **Yes.** A bespoke, bilingual (ID/JP) interface that reflects the Masjid's identity and professional standards. | **No.** Limited to generic templates; often perceived as less secure or unofficial. | Builds community trust and ensures that clear, translated instructions are respected by all attendees. |
| **Advanced Admin Insights** | **Yes.** A secure, real-time dashboard with data visualization and live capacity controls. | **No.** Raw data in a spreadsheet; requires manual analysis and lacks real-time visualization. | Empowers organizers to make data-driven decisions on the fly (e.g., reallocating capacity between sessions). |
| **Data Integrity & UX** | **Yes.** Smart email verification prevents duplicate entries and allows users to update their own data securely. | **Clunky.** Users often lose "edit links"; results in fragmented data and manual cleanup for staff. | Ensures your attendee list is accurate and clean, reducing administrative overhead by 90%. |

## Key Features

- **User-Friendly Registration:** A user-friendly, single-page interface to register for the event.
    - **Fields:** Nama (Name), Email Address, Nomor Telepon, Kode Pos, Jumlah Ikhwan, Jumlah Akhwat, Kloter Salat.
- **Rules & Regulations (`Tata Tertib`):**
    - A mandatory dialog (`TataTertibDialog`) appears before registration can be completed.
    - Users must scroll to the bottom and agree to the terms, ensuring they have read all rules.
    - Exact Indonesian text synchronized between the UI and automated emails.
- **Real-Time Slot Availability:** Prayer slots (Gelombang Salat) are updated in real-time. Users can see the current progress and availability for each slot.
- **Email Verification & Editing:** Users verify their email to begin. If an email is already registered, the system loads their existing data, allowing them to safely modify their attendee counts or switch prayer slots without losing their spot in full sessions.
- **Dynamic QR Code Generation:** Upon successful registration, a unique QR code is displayed and embedded in the confirmation email for easy check-in.
- **Digital Check-in System:** A dedicated, camera-ready interface for event staff to scan guest QR codes and manage attendance in real-time.
- **Bilingual Support:** Interface and critical instructions provided in Bahasa Indonesia and Japanese.

## Automated Email Notification System

The email system is a critical component, designed to be comprehensive and professional.

### Email Configuration:
- **Sender:** `noreply@indonesiaberlebaran.tokyo`
- **Subject:** `Salat Idul Fitri 1447H`
- **Provider:** Resend API via Cloud Functions.

### Email Content & Design:
- **Layout:** A centered, responsive HTML template.
- **Header:** A "Pendaftaran Berhasil!" confirmation message.
- **Prayer Slot:** The registrant's chosen `Gelombang Salat` and time are prominently displayed.
- **Registration Details:** Name (Nama), Male Attendees (Ikhwan), Female Attendees (Akhwat).
- **QR Code:** The unique QR code is embedded directly in the email.
- **Exact Rules (`Tata Tertib`):** Comprehensive Indonesian rules included in the email body, matching the registration dialog perfectly.
- **Location:** Full address of Masjid Indonesia Tokyo with a Google Maps link.

## Admin Portal

The application includes a secure, professional admin portal with:

-   **Dashboard Summary:** Real-time cards showing total jemaah, ikhwan, and akhwat counts.
-   **Live Data Table:** View registration progress across all sessions with automatic updates.
-   **Capacity Management:** Admins can change the limit for each prayer slot directly from the dashboard.
-   **Data Export:** One-click CSV export of all registration data, including timestamps and contact info.
-   **Visualizations:** Interactive charts showing the distribution of jemaah per session.

## Digital Check-in System

To ensure a smooth entry process on the day of the event, the app features a high-performance check-in interface:

-   **QR Scanner:** Built-in camera scanner (powered by `html5-qrcode`) for instant ticket validation.
-   **Audio Feedback:** Distinctive sound effects for successful scans and completed check-ins to assist staff in high-traffic environments.
-   **Real-time Validation:** Instantly fetches registration details from Firestore, displaying attendee counts (Ikhwan/Akhwat) and the assigned prayer session.
-   **Manual Search:** Fallback option to search by Registration ID if a user's QR code is unavailable.
-   **Attendance Tracking:** Automatically logs the exact timestamp of entry, preventing duplicate check-ins and providing accurate attendance data.

## Technical Stability & Resilience

- **Dynamic Document IDs:** The system dynamically identifies and manages Firestore `timeslot` documents based on actual IDs, eliminating brittle dependencies on hardcoded document names.
- **Atomic Transactions:** All registration updates use Firestore transactions to ensure data consistency and prevent overcapacity.
- **Index Management:** Explicit Firestore index definitions (`firestore.indexes.json`) ensure high-performance queries across all environments.
- **Optimized Assets:** Custom-generated, combined favicon featuring both KBRI and KMII logos for brand consistency.

## Tech Stack

-   **Frontend:**
    -   **React 19:** Modern functional components and hooks.
    -   **Vite:** High-performance build tool.
    -   **Material-UI (MUI):** Professional and responsive component library.
    -   **Recharts:** For data visualization in the admin portal.
-   **Backend:**
    -   **Firebase Firestore:** Real-time NoSQL database.
    -   **Firebase Cloud Functions (Node 20):** For server-side logic and email triggers.
    -   **Firebase Authentication:** Securing the admin portal.
-   **Email:**
    -   **Resend API:** High-deliverability email service.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20.x or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone and Install:**
    ```sh
    git clone <repository-url>
    cd idulfitri1447h
    npm install
    ```

2.  **Firebase Setup:**
    Create a `.env` file in the root with your Firebase config (see VITE_ prefix for Vite):
    ```
    VITE_FIREBASE_API_KEY="..."
    VITE_FIREBASE_AUTH_DOMAIN="..."
    VITE_FIREBASE_PROJECT_ID="..."
    VITE_FIREBASE_STORAGE_BUCKET="..."
    VITE_FIREBASE_MESSAGING_SENDER_ID="..."
    VITE_FIREBASE_APP_ID="..."
    VITE_FIREBASE_MEASUREMENT_ID="..."
    ```

3.  **Resend API Key:**
    Set the Resend API key in Firebase Functions config:
    ```sh
    firebase functions:config:set resend.key="YOUR_API_KEY"
    ```

4.  **Development:**
    ```sh
    npm run dev
    ```

## Deployment

```sh
npm run build
firebase deploy
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
