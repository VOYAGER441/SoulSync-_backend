export interface IUser {
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
  
  // Define types for chat history and mood trends
  interface ChatMessage {
    message: string;
    reply: string;
    timestamp: string;
  }
  
  interface MoodTrend {
    date: string;
    sentiment: string;
  }
  