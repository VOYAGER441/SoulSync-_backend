import express, { Request, Response } from "express";
import error from "../error";
import services from "../services";
import utils from "../utils";

const router = express.Router();

// route for call the open api
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const response = await services.soulService.callChatGPT(message);
    res.status(utils.HttpStatusCodes.OK).json(response);
  } catch (er) {
    error.errorHandler(er, res);
  }
});



export {router as SoulRouter};
