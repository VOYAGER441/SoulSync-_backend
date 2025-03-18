import { InferenceClient } from "@huggingface/inference";

import axios from "axios";
import utils from "../utils";

// global variable
// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || "https://your-site.com"; // Optional
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || "Your Site Name"; // Optional
const modelName = "deepseek/deepseek-r1:free";

// function for calling the deepseek model
async function callDeepSeek(message: string, apiKey: string): Promise<string> {
  if (!apiKey) throw new Error("OpenRouter API key not configured");
  if (!message?.trim()) throw new Error("Empty message received");

  // Check for urgent safety issues
  if (utils.safety.containsCriticalKeywords(message)) {
    return "I'm deeply concerned about your safety. Please contact the National Suicide Prevention Lifeline immediately at 91-9820466726 or visit the nearest emergency room. You're not alone.";
  }

  // Call the OpenRouter API using axios
  const response = await axios.post(
    `${process.env.DEEPSEEK_API_BASE_URL}`,
    {
      model: modelName,
      messages: [
        { role: "system", content: utils.safety.psychologistPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.6,
      top_p: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": YOUR_SITE_URL, // Optional
        "X-Title": YOUR_SITE_NAME, // Optional
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10-second timeout
    }
  );

  if (response.status >= 400) {
    throw new Error(`OpenRouter API Error: ${response.statusText}`);
  }

  const reply = response.data.choices[0].message.content;

  // Final safety filter
  if (utils.safety.containsCriticalKeywords(reply)) {
    return "I want to ensure you receive appropriate support. Let me help you find local mental health resources. Could you share your general location?";
  }

  return reply;
}

// function to call the hugging face model for sentiment analysis
async function callSentimentAnalysis(message: string, apiKey: string): Promise<string> {
  // init client
  const client = new InferenceClient(apiKey);
  const output = await client.textClassification({
    model: "distilbert/distilbert-base-uncased-finetuned-sst-2-english",
    inputs: message,

    provider: "hf-inference",
  });
  // console.log(output);
  return output[0].label;
}


export default { callDeepSeek, callSentimentAnalysis };
