# SoulSync Backend 🧠✨

<p align="center">
  <img src="./public/assets/logo.jpg" alt="SoulSync Logo" width="200"/>
</p>

## 🌟 Overview

SoulSync is a sophisticated AI-powered mental health support platform built with Node.js, Express, and TypeScript. It provides real-time chat functionality with advanced AI integration and secure user management using Appwrite as the backend service.

## 🚀 Features

- 🤖 AI-driven mental health support chat using DeepSeek model
- 🎭 Real-time sentiment analysis using DistilBERT
- 🔒 Secure user authentication and authorization
- 📊 Mood tracking and analysis
- 💾 Secure data storage with Appwrite
- ⚡ Real-time updates
- 🛡️ Rate limiting and security features
- 🎨 Custom avatar generation

## 🛠️ Technology Stack

### Core Technologies
- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **Appwrite** - Backend as a Service (BaaS)

### Key Dependencies
- `express` (v4.21.0)
- `appwrite` (v17.0.1)
- `node-appwrite` (v15.0.1)
- `cors` (v2.8.5)
- `express-rate-limit` (v7.5.0)
- `node-cron` (v3.0.3)
- `axios` (v1.8.3)
- `dotenv` (v16.4.5)

## 📦 Installation

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/yourusername/SoulSync.git
   cd SoulSync/SoulSync_backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory with:
   ```env
   APPWRITE_API_ENDPOINT=
   APPWRITE_PROJECTID=
   APPWRITE_API_KEY=
   APPWRITE_DATABASE_ID=
   APPWRITE_COLLECTION_ID=
   PORT=
   ```

4. **Start the development server:**
   ```powershell
   npm run dev
   ```

## 🔥 API Endpoints

### Authentication
- `POST /soul/registration` - Register a new user
- `POST /soul/login` - User login
- `POST /soul/signout` - User logout

### Chat & Analysis
- `POST /soul/chat` - Send message and get AI response
- `GET /soul/chat/:userId` - Get user's chat history
- `GET /soul/mood/:userId` - Get user's mood trends

## 🔒 Security Features

- Rate limiting (50 requests per 15 minutes)
- Secure authentication with Appwrite
- Input validation
- Error handling
- Session management
- Pattern matching for critical keywords

## 🌐 Deployment

The application is deployed on Render.com with the following configuration:
- **Environment**: Node.js
- **Auto-Deploy**: Enabled for main branch
- **Region**: Singapore (Asia Pacific)
- **Health Check Path**: `/`
- **Production URL**: `https://soulsync-backend.onrender.com`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Special thanks to the Appwrite team for their excellent BaaS platform
- DeepSeek for providing the AI conversation model
- HuggingFace for sentiment analysis capabilities

