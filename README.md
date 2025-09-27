# Namaste-LBS: Hostel Washing Machine Booking App

**Project Link:** [https://github.com/durgesh-choubey/Namaste-LBS](https://github.com/durgesh-choubey/Namaste-LBS)  
**Live Demo:** [https://durgesh-choubey.github.io/Namaste-LBS/](https://durgesh-choubey.github.io/Namaste-LBS/)

---

## **Overview**

Namaste-LBS is a **web application designed for BHU LBS hostel students** to conveniently book washing machines and manage hostel services. The app provides **separate dashboards for Admins and Students**, with features designed to simplify scheduling, tracking, and maintenance.

This project was built using **TypeScript, JavaScript and HTML**, and hosted on **GitHub Pages**.

---

## **Project Features**

### **1. Student Dashboard**
- View available washing machines and time slots.  
- Book a washing machine for a specific date and time.  
- View booking history and upcoming schedules.  
- Receive notifications for scheduled maintenance or app downtime.  
- Cancel or reschedule bookings.  

### **2. Admin Dashboard**
- Add, remove, and manage washing machines.  
- View all student bookings in a single interface.  
- Approve or cancel student requests if needed.  
- Schedule maintenance windows for machines and notify students.  
- Track overall usage statistics and generate reports.  

### **3. Notifications**
- App-wide announcements (e.g., maintenance schedules).  
- Real-time updates on booking status.  

---


---

## **How It Works**

### **Admin**
1. Log in to the **Admin Dashboard**.  
2. Add washing machines and manage time slots.  
3. View all student bookings.  
4. Schedule maintenance and send notifications.

### **Student**
1. Log in to the **Student Dashboard**.  
2. Check available machines and time slots.  
3. Book a slot and view booking history.  
4. Receive notifications for maintenance and updates.

---

## **Technologies Used**
- HTML5 
- JavaScript
- TypeScript
- GitHub Pages (for hosting)  

---

## ✨ Core Features

### 👨‍🎓 For Students

*   **Secure Authentication:** Easy and secure signup and login process using a phone number.
*   **Intuitive Dashboard:** A clean home screen showing the user's next booking and recent announcements.
*   **Effortless Booking:** A simple modal to view available machines and time slots, and book a wash in just a few taps.
*   **Booking Management:** A dedicated section to view all upcoming and past bookings, with the option to cancel upcoming ones.
*   **Profile Management:** Students can view and edit their personal details and change their password.
*   **Announcements:** View important notices and updates from the hostel administration, complete with optional media attachments.
*   **Shared Documents:** Access and download important documents shared by the admin, such as laundry rules or schedules.
*   **PWA Ready:** The application can be installed on a mobile device for a native-app-like experience and offers basic offline accessibility.

### 🔑 For Administrators

*   **Secure Admin Login:** A separate, secure login for administrators using an email and password.
*   **Comprehensive Dashboard:** An at-a-glance overview of key metrics, including total bookings, active machines, user count, and upcoming bookings.
*   **Machine Management:** Full CRUD (Create, Read, Update, Delete) functionality for washing machines. Admins can add new machines, update their status (e.g., available, in-use, maintenance), and view maintenance history.
*   **Booking Oversight:** View a complete list of all student bookings, with search and filter capabilities. Admins can also cancel bookings if necessary.
*   **User Management:** A list of all registered students with their details.
*   **Document Sharing:** Upload and manage important documents (like PDFs or images) that students can access and download from their portal.
*   **Block Dates:** Prevent new bookings on specific dates (e.g., public holidays, maintenance days), which automatically cancels any existing bookings on that day.
*   **Reporting & Analytics:** Visualize weekly and monthly booking trends with simple bar charts and download a full booking history as a CSV file for record-keeping.
*   **Settings:** Manage the admin account, including changing the password.

## 🛠️ Technology Stack

*   **Frontend:**
    *   **Framework:** React.js with TypeScript
    *   **Styling:** Tailwind CSS
    *   **PWA:** Service Workers and Web App Manifest for offline capabilities and installability.

*   **Backend:**
    *   **Framework:** Node.js with Express.js
    *   **Database:** SQLite3
    *   **Authentication:** `bcrypt` for secure password hashing.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (comes with Node.js)

### 1. Backend Setup

The backend server handles all API requests and interacts with the SQLite database.

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Start the server
npm start

## **Project Structure**

├── components/
│   ├── admin/              # Components for the Admin Dashboard
│   ├── icons/              # Reusable SVG icon components
│   └── ...                 # Shared and student-facing components
├── server/
│   ├── node_modules/
│   ├── database.db         # SQLite database file (auto-generated)
│   ├── index.js            # Express server logic and API endpoints
│   └── package.json
├── App.tsx                 # Main application component, state management, routing
├── index.html              # The single HTML page shell
├── index.tsx               # Entry point for the React application
├── README.md               # This file
├── sw.js                   # Service worker for PWA functionality
└── ...


## **Future Enhancements**
- Expand to include **other hostel services** (e.g., mess bookings, room maintenance).  
- Integrate **authentication** for secure logins.  
- Add **real-time notifications** with Firebase or WebSockets.  
- Mobile-friendly responsive design.


