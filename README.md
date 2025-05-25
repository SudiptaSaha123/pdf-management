# PDF Management & Collaboration System

A modern web application for managing, sharing, and collaborating on PDF documents. The application provides a secure platform for users to upload, store, share, and comment on PDF files.

## Features

- 🔐 Secure user authentication (Register/Login)
- 📁 PDF file upload with drag-and-drop support
- 📋 PDF file management (rename, delete)
- 🔗 Secure PDF sharing with unique links
- 📧 Email notifications for shared PDFs
- 💬 Real-time commenting system
- 📱 Responsive design for all devices
- ⚡ Fast PDF rendering and preview

## Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Multer for file upload handling
- UploadThing for file storage
- Nodemailer for email notifications

## Live Demo

- Frontend: Deployed on Vercel
- Backend: Deployed on Render
- Database: MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/SudiptaSaha123/pdf-management.git
cd pdf-management-system
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Configure Environment Variables
Create a `.env` file in the backend directory with the following variables:
```env
PORT=
MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL= 
UPLOADTHING_SECRET = 
UPLOADTHING_APP_ID = 
```

4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

5. Configure Frontend Environment
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm run dev
```

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### PDF Management
- POST `/api/pdf/upload` - Upload PDF file
- GET `/api/pdf` - Get user's PDFs
- POST `/api/pdf/share` - Share PDF
- GET `/api/pdf/shared/:link` - Get shared PDF
- DELETE `/api/pdf/:id` - Delete PDF
- PUT `/api/pdf/:id/rename` - Rename PDF

### Comments
- POST `/api/comments` - Add comment
- GET `/api/comments/:pdfId` - Get PDF comments

## Security Features

- JWT-based authentication
- Secure file upload with size and type validation
- Protected API routes
- Secure sharing links with unique tokens

## File Upload Specifications

- Supported format: PDF only
- Maximum file size: 10MB
- Secure storage using UploadThing