import express, { Request, Response } from "express";
// import error from "../error";
import rateLimit from "express-rate-limit";
import services from "../services";
import utils from "../utils";

const router = express.Router();
router.use(express.json());

// rate limit for chat api
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per window
  message: "Too many requests, please try again later",
});

router.post(
  "/chat",
  chatLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { message } = req.body;

      const openRouterApiKey = req.headers[
        "authorization-openrouter"
      ] as string;
      const huggingFaceApiKey = req.headers[
        "authorization-huggingface"
      ] as string;

      if (!openRouterApiKey || !huggingFaceApiKey) {
        res.status(400).json({ error: "Both API keys are required" });
      }

      if (!message || !message.trim()) {
        res
          .status(utils.HttpStatusCodes.BAD_REQUEST)
          .json({ error: "Please provide a meaningful message" });
        return; // Ensure function exits here
      }

      const reply = await services.soulService.callDeepSeek(
        message.trim(),
        openRouterApiKey
      );
      const sentiment = await services.soulService.callSentimentAnalysis(
        message.trim(),
        huggingFaceApiKey
      );

      res.status(utils.HttpStatusCodes.OK).json({ reply, sentiment });
    } catch (er) {
      console.error("Error in /chat route:", er); // Debugging log
      res
        .status(utils.HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  }
);

// route for hugging face sentiment analysis model
export { router as SoulRouter };
