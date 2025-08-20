# Blood Bank Management System

A comprehensive, full-stack blood bank management application built with modern web technologies.

## 🚀 Features

### Core Functionality
- **User Authentication & Role Management** - Admin, Staff, Doctor, Nurse roles
- **Donor Management** - Complete donor lifecycle with health screening
- **Blood Inventory Tracking** - Real-time blood unit management with expiry alerts
- **Hospital Integration** - Blood request and transfusion management
- **Blood Drive Management** - Organize and track blood donation campaigns
- **Emergency Alerts** - Critical blood shortage notifications
- **Comprehensive Reporting** - Analytics and audit logging

### Technical Features
- **Real-time Dashboard** - Live statistics and charts
- **Advanced Search & Filtering** - Find donors, inventory, and requests quickly
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Secure API** - RESTful endpoints with proper validation
- **Database Management** - SQLite database with comprehensive schema

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - User interface library
- **React Router** - Navigation and routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization charts
- **Date-fns** - Date manipulation utilities

## 📁 Project Structure

```
blood-bank-project/
├── backend/                 # Node.js server
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── database/               # Database files
│   ├── schema.sql         # Database schema
│   └── sample_data.sql    # Sample data
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sambuddy007/BLOOD-BANK-DATABASE.git
   cd BLOOD-BANK-DATABASE
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm start
   ```
   The backend will run on http://localhost:5000

5. **Start the frontend application**
   ```bash
   cd ../frontend
   npm start
   ```
   The frontend will run on http://localhost:3000


   ![WhatsApp Image 2025-08-21 at 00 39 34_697e0ac9](https://github.com/user-attachments/assets/0ddf54ae-3261-40d8-a044-0dba2ff74c09)


## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Add new donor
- `GET /api/donors/:id` - Get donor by ID
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor

### Blood Inventory
- `GET /api/inventory` - Get all blood units
- `POST /api/inventory` - Add blood unit
- `PUT /api/inventory/:id` - Update blood unit
- `DELETE /api/inventory/:id` - Delete blood unit

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 📊 Database Schema

The application uses a comprehensive SQLite database with the following main tables:
- **Users** - User accounts and roles
- **Donors** - Donor information and medical history
- **BloodInventory** - Blood unit tracking
- **Hospitals** - Hospital information
- **BloodRequests** - Blood requests from hospitals
- **BloodDrives** - Blood donation campaigns
- **AuditLog** - System activity logging

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Create a new app on your preferred platform
2. Connect your GitHub repository
3. Set environment variables if needed
4. Deploy automatically on push to main branch

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Samyak Ramteke** - [GitHub Profile](https://github.com/Sambuddy007)
- **Email**: ramtekesamyak007@gmail.com

## 🙏 Acknowledgments

- Blood bank management best practices
- Modern web development standards
- Open source community contributions

---

⭐ **Star this repository if you find it helpful!**
