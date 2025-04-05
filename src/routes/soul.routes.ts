import express, { Request, Response } from "express";
// import error from "../error";
import rateLimit from "express-rate-limit";
import services from "../services";
import utils from "../utils";
import * as Interface from "../interface/soul.interface"
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
router.use(express.json());

// rate limit for chat api
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per window
  message: "Too many requests, please try again later",
});

// route for chat api
// route for chat API
router.post("/chat", chatLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, userId } = req.body;
    // console.log("Chat request:", message, userId);

    if (!userId) {
      res.status(utils.HttpStatusCodes.BAD_REQUEST).json({ error: "User ID is required" });
      return;
    }

    const openRouterApiKey = req.headers["authorization-openrouter"] as string;
    const huggingFaceApiKey = req.headers["authorization-huggingface"] as string;

    // console.log(openRouterApiKey, huggingFaceApiKey);


    if (!openRouterApiKey || !huggingFaceApiKey) {
      res.status(utils.HttpStatusCodes.BAD_REQUEST).json({ error: "Both API keys are required" });
      return;
    }

    if (!message || !message.trim()) {
      res.status(utils.HttpStatusCodes.BAD_REQUEST).json({ error: "Please provide a meaningful message" });
      return;
    }

    // Get user document from Appwrite using userId
    const user = await services.appWriteService.getCurrentUser(userId) as unknown as Interface.IUser;
    if (!user) {
      res.status(utils.HttpStatusCodes.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    // const user = userDocs.documents[0] as unknown as Interface.IUser;
    const appwriteId = user.$id; // Get correct Appwrite document ID
    // console.log("Updating chat for user:", appwriteId);

    // Call AI models
    const reply = await services.soulService.callDeepSeek(message.trim(), openRouterApiKey);
    const sentiment = await services.soulService.callSentimentAnalysis(message.trim(), huggingFaceApiKey);

    // console.log("Sentiment analysis result:", sentiment);


    // Update chat history
    const updatedChatHistory = [
      ...user.chatHistory,
      JSON.stringify({ id: uuidv4(), message, reply, timestamp: new Date().toISOString() })
    ];

    // Update sentiment history
    const updatedSentimentHistory = [
      ...user.moodTrends,
      JSON.stringify({ id: uuidv4(), sentiment, timestamp: new Date().toISOString() })
    ];


    await services.appWriteService.updateUserData(appwriteId, { chatHistory: updatedChatHistory });
    await services.appWriteService.updateUserData(appwriteId, { moodTrends: updatedSentimentHistory });

    res.status(utils.HttpStatusCodes.OK).json({ reply, sentiment, chatHistory: updatedChatHistory });
  } catch (er) {
    console.error("Error in /chat route:", er);
    res.status(utils.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});




// route for creating a new user
router.post('/registration', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // console.log('Creating user:', name, email, password);


    if (!name || !email || !password) {
      res.status(utils.HttpStatusCodes.BAD_REQUEST).json({ error: "Please provide all required fields" });
      return;
    }

    const user = await services.appWriteService.createUsers(name, email, password);
    console.log(user);

    res.status(utils.HttpStatusCodes.CREATED).json(user);

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(utils.HttpStatusCodes.CONFLICT).json({ error: "Internal Server Error" });

  }
})

// login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // console.log('Logging in user:', email, password);

    if (!email || !password) {
      res.status(utils.HttpStatusCodes.BAD_REQUEST).json({ error: "Please provide all required fields" });
      return;
    }
    const session = await services.appWriteService.login(email, password);
    res.status(utils.HttpStatusCodes.OK).json(session);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(utils.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });

  }
});

// route for login with google
router.post('/login/google', async (req: Request, res: Response) => {
    
})




// route for fetch user data
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    // console.log(userId);
    const result = await services.appWriteService.getCurrentUser(userId);
    res.status(utils.HttpStatusCodes.OK).json(result);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(utils.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });

  }
});

// route for get chat history
router.get('/chat/:userId', async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const user = await services.appWriteService.getCurrentUser(userId) as unknown as Interface.IUser;
    if (!user) {
      res.status(utils.HttpStatusCodes.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    // const user = userDocs.documents[0] as unknown as Interface.IUser;
    const appwriteId = user.$id;

    const result = await services.appWriteService.getHistoryChat(appwriteId);
    res.status(utils.HttpStatusCodes.OK).json(result);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(utils.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });

  }
})

// route for get sentiment history
router.get('/mood/:userId', async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const user = await services.appWriteService.getCurrentUser(userId) as unknown as Interface.IUser;
    if (!user) {
      res.status(utils.HttpStatusCodes.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    // const user = userDocs.documents[0] as unknown as Interface.IUser;
    const appwriteId = user.$id;

    const result = await services.appWriteService.getHistorySentiment(appwriteId);
    res.status(utils.HttpStatusCodes.OK).json(result);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(utils.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });

  }
});


router.get("/chats/:chatId", async (req: Request, res: Response) => {
  try {
    const chatId: string = req.params.chatId;
    const result = await services.appWriteService.getChatById(chatId);
    res.status(utils.HttpStatusCodes.OK).json(result);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(utils.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});




// route for hugging face sentiment analysis model
export { router as SoulRouter };
