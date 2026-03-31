# 🌟 Social Profile Marketplace

A **Full-Stack Social Profile Marketplace** built with **PERN Stack** (PostgreSQL, Express.js, React.js, Node.js) with **Redux** for state management.  
Users can **buy and sell social media profiles** online securely and efficiently.  

A big **thank you to GreatStack YouTube Channel** for the tutorials and guidance!  

---
[![Frontend](https://img.shields.io/badge/Frontend-ReactJS-blue?style=flat-square&logo=react)](https://reactjs.org/)  
[![Backend](https://img.shields.io/badge/Backend-NodeJS-green?style=flat-square&logo=node.js)](https://nodejs.org/)  
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)  
[![Payments](https://img.shields.io/badge/Payments-Stripe-purple?style=flat-square&logo=stripe)](https://stripe.com/)  
[![Authentication](https://img.shields.io/badge/Auth-Clerk-orange?style=flat-square)](https://clerk.com/)  
[![Email](https://img.shields.io/badge/Email-Nodemailer-red?style=flat-square)](https://nodemailer.com/)  
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

## 🎯 Features

- **User Authentication & Subscription:**  
  Managed with **Clerk**, supporting premium plans and free trials.  

- **Marketplace & Admin Panel:**  
  Users can list social media profiles. Admins can verify and update profile credentials.  

- **State Management:**  
  **Redux** for smooth state management across the app.  

- **Payments & Emails:**  
  Secure **Stripe** payments. **Nodemailer + Brevo** for order confirmation emails.  

- **Background Jobs:**  
  **Inngest** handles tasks and webhooks seamlessly.  

- **Database & Media Handling:**  
  **Neon PostgreSQL** for storing users, listings, and orders.  
  **ImageKit** for optimized images and videos.  

- **Chat System:**  
  Users can send messages to each other regarding listings.  

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Redux |
| Backend | Node.js, Express.js |
| Database | Neon PostgreSQL |
| Authentication | Clerk |
| Payment | Stripe |
| Email Notifications | Nodemailer + Brevo |
| Background Jobs | Inngest |
| Media Storage | ImageKit |

---


## ⚡ Getting Started

### Prerequisites

- Node.js
- npm or yarn  
- PostgreSQL account (Neon recommended)  

### Installation

**Frontend**
```bash
git clone https://github.com/mdsojibmiah/flipearn.git
cd client
npm install
npm run dev
