# SoulSync Backend Documentation

## Project Overview
SoulSync is a backend service built with Node.js, Express, and TypeScript that provides chat functionality with AI integration and user management using Appwrite as the backend service.

## Technology Stack

### Core Technologies
- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **Appwrite** - Backend as a Service (BaaS)

### Key Dependencies
- `express` (v4.21.0) - Web application framework
- `appwrite` (v17.0.1) - Appwrite SDK
- `node-appwrite` (v15.0.1) - Appwrite Node.js SDK
- `cors` (v2.8.5) - Cross-Origin Resource Sharing middleware
- `express-rate-limit` (v7.5.0) - Rate limiting middleware
- `node-cron` (v3.0.3) - Task scheduler
- `axios` (v1.8.3) - HTTP client
- `dotenv` (v16.4.5) - Environment variable management

### AI/ML Dependencies
- `@azure-rest/ai-inference` - Azure AI services
- `@huggingface/inference` (v3.5.2) - Hugging Face inference
- `@xenova/transformers` (v2.17.2) - Transformers library

## Project Structure

```
src/
├── app.ts                 # Application entry point
├── error/                 # Error handling
├── interface/            # TypeScript interfaces
├── routes/               # API routes
├── services/            # Business logic
└── utils/               # Utility functions
```

## Core Components

### 1. Server Configuration (app.ts)
- Express server setup with CORS enabled
- Root route for health check
- Cron job setup to prevent server idle (runs every 10 minutes)

### 2. Data Models (interface/soul.interface.ts)

#### Key Interfaces:
- **IUser**
  ```typescript
  {
    name: string;
    email: string;
    userId: string;
    chatHistory: ChatMessage[];
    moodTrends: MoodTrend[];
    avatar: string;
    $id: string;
    $createdAt?: string;
    $updatedAt?: string;
  }
  ```

### 3. Routes (routes/soul.routes.ts)

#### API Endpoints:

1. **Chat Endpoint** - POST `/soul/chat`
   - Rate limited (50 requests per 15 minutes)
   - Processes user messages
   - Performs sentiment analysis
   - Updates chat and mood history

2. **User Management Endpoints**
   - Registration: POST `/soul/registration`
   - Login: POST `/soul/login`
   - User Data: GET `/soul/user/:userId`

3. **History Endpoints**
   - Chat History: GET `/soul/chat/:userId`
   - Mood History: GET `/soul/mood/:userId`
   - Specific Chat: GET `/soul/chats/:chatId`

### 4. Appwrite Service (services/appWrite.service.ts)

#### Key Functions:

1. **User Management**
   ```typescript
   createUsers(name: string, email: string, password: string)
   login(email: string, password: string)
   getCurrentUser(userId: string)
   signOut()
   ```

2. **Data Management**
   ```typescript
   updateUserData(appwriteId: string, 
                updateFields: Partial<{ chatHistory: any[], moodTrends: any[]}>)
   getHistoryChat(appwriteId: string)
   getHistorySentiment(appwriteId: string)
   getChatById(chatId: string)
   ```

## Security Features

1. **Rate Limiting**
   - Chat API limited to 50 requests per 15 minutes per IP
   
2. **Authentication**
   - API key requirements for AI services
   - Appwrite authentication integration
   - Session management

3. **Data Validation**
   - Input validation for all API endpoints
   - Error handling for invalid requests

## Environment Variables Required

```
APPWRITE_API_ENDPOINT=
APPWRITE_PROJECTID=
APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=
APPWRITE_COLLECTION_ID=
PORT=
```


## Error Handling

The application implements a comprehensive error handling system with:
- Custom error classes
- HTTP status code management
- Structured error responses

## Data Flow

1. **Chat Process**
   ```
   User Message → Rate Limit Check → AI Processing → 
   Sentiment Analysis → Update Chat History → 
   Update Mood Trends → Response to User
   ```

2. **User Registration**
   ```
   User Data → Create Appwrite Account → 
   Generate Avatar → Initialize User Document → 
   Return User Data
   ```

## API Response Formats

### Success Response
```json
{
  "reply": "AI response",
  "sentiment": "sentiment analysis result"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Development and Deployment

### Development
```bash
npm run dev     # Start development server with nodemon
npm run build   # Build TypeScript to JavaScript
npm start       # Start production server
```

### Dependencies Installation
```bash
npm install
```

## Best Practices Implemented

1. **TypeScript Usage**
   - Strong typing for all interfaces
   - Type safety throughout the application

2. **Code Organization**
   - Modular architecture
   - Separation of concerns
   - Service-based structure

3. **Security**
   - Rate limiting
   - Input validation
   - Secure authentication

4. **Error Handling**
   - Comprehensive error management
   - Structured error responses

## Future Improvements

1. **Suggested Enhancements**
   - Implement WebSocket for real-time chat
   - Add user preferences storage
   - Enhance mood analysis visualization
   - Implement chat message encryption
   - Add message pagination
   - Implement user activity logging

2. **Performance Optimizations**
   - Implement caching
   - Optimize database queries
   - Add request compression

## Advanced Technical Analysis

### AI Integration Architecture

#### 1. DeepSeek Model Integration
- Uses OpenRouter API for advanced conversational AI
- Model: `deepseek/deepseek-r1:free`
- Features:
  - Context-aware responses
  - Mental health-focused conversation handling
  - Safety checks for sensitive content

#### 2. Sentiment Analysis Pipeline
- Utilizes HuggingFace's DistilBERT model
- Model: `distilbert-base-uncased-finetuned-sst-2-english`
- Provides real-time mood analysis
- Stores temporal mood trends

### Safety and Content Filtering

#### Critical Keywords Detection
```typescript
const dangerousPatterns = [
   /kill myself/gi,
   /suicide/gi,
   /harm myself/gi,
   /end my life/gi,
   /want to die/gi,
];
```
- Implements regex-based pattern matching
- Automatic escalation for critical messages
- Emergency response system integration

### Psychologist System Prompt
- Implements CBT (Cognitive Behavioral Therapy) principles
- Features:
  - Emotion validation
  - Active listening patterns
  - Evidence-based coping strategies
  - Cultural sensitivity (especially for Indian users)
  - Emergency response protocols

### Data Architecture

#### 1. User Data Structure
```typescript
interface IUser {
    name: string;
    email: string;
    userId: string;
    chatHistory: ChatMessage[];
    moodTrends: MoodTrend[];
    avatar: string;
    $id: string;
    $createdAt?: string;
    $updatedAt?: string;
}
```

#### 2. Chat Message Structure
```typescript
interface ChatMessage {
    id: string;
    message: string;
    reply: string;
    timestamp: string;
}
```

#### 3. Mood Tracking Structure
```typescript
interface MoodTrend {
    id: string;
    sentiment: {
        label: string;
        score: number;
    }[];
    timestamp: string;
}
```

### Performance Optimizations

#### 1. Rate Limiting Implementation
```typescript
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 50,                    // 50 requests per window
});
```

### Error Handling System

#### 1. Custom Error Classes
- AppError base class
- Operational vs Programming errors
- Stack trace capture

#### 2. Error Categories
```typescript
export const appErrors = {
    badRequest: new AppError('Bad request', 400),
    unauthorized: new AppError('Unauthorized access', 401),
    forbidden: new AppError('Forbidden', 403),
    notFound: new AppError('Resource not found', 404),
    conflict: new AppError('Conflict', 409),
    internalServerError: new AppError('Internal server error', 500),
    serviceUnavailable: new AppError('Service unavailable', 503),
};
```

### API Security Implementation

#### 1. Authentication Flow
```
Client Request → API Key Validation → Session Verification → 
Route Handler → Response
```

#### 2. Session Management
- Appwrite session handling
- Email-password authentication
- Session persistence
- Secure logout mechanism

### Development Guidelines

#### 1. Code Style
- Strict TypeScript configuration
- Consistent error handling
- Service-based architecture
- Interface-driven development

#### 2. Testing Strategy
- Unit tests for utilities
- Integration tests for API endpoints
- E2E tests for critical flows

### Monitoring and Logging

#### 1. Performance Metrics
- Response time monitoring
- Rate limit tracking
- Error frequency analysis

### Deployment Architecture

#### 1. Render.com Deployment
- **Service Type**: Web Service
- **Environment**: Node.js
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Auto-Deploy**: Enabled for main branch
- **Instance Type**: Standard Web Service
- **Region**: Singapore (Asia Pacific)
- **Environment Variables**: Configured in Render dashboard
  ```
  APPWRITE_API_ENDPOINT
  APPWRITE_PROJECTID
  APPWRITE_API_KEY
  APPWRITE_DATABASE_ID
  APPWRITE_COLLECTION_ID
  PORT
  ```
- **Health Check Path**: `/`
- **Production URL**: `https://soulsync-backend.onrender.com`
- **Auto-Scaling**: Enabled based on usage

#### 2. CI/CD Pipeline
- TypeScript compilation
- Environment validation
- Dependency checks
- Automated deployment

### API Documentation

#### 1. Authentication Endpoints
```typescript
POST /soul/registration
Body: {
    name: string;
    email: string;
    password: string;
}

POST /soul/login
Body: {
    email: string;
    password: string;
}
```

#### 2. Chat Endpoints
```typescript
POST /soul/chat
Headers: {
    authorization-openrouter: string;
    authorization-huggingface: string;
}
Body: {
    message: string;
    userId: string;
}

GET /soul/chat/:userId
Response: {
    result: ChatMessage[]
}
```

#### 3. Mood Analysis Endpoints
```typescript
GET /soul/mood/:userId
Response: {
    result: MoodTrend[]
}
```

### Third-Party Integration Details

#### 1. Appwrite Configuration
- Database setup
- Collection structure
- Authentication settings
- File storage configuration

#### 2. AI Service Configuration
- OpenRouter API setup
- HuggingFace API configuration
- Model selection criteria
- Response handling

### Scalability Considerations

#### 1. Current Limitations
- Rate limiting per IP
- Message length constraints
- Storage limitations
- Processing capacity

#### 2. Future Scaling Solutions
- Distributed rate limiting
- Caching implementation
- Database optimization
- Load balancing strategy