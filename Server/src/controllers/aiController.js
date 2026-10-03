import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

// Basic rate limiting manually for the controller if we didn't want to use middleware,
// but the user asked for express-rate-limit which will be applied on the route.

export const generateBlogContent = catchAsync(async (req, res, next) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return next(new AppError("Title is required", 400));
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length > 150) {
    return next(new AppError("Title is too long (max 150 characters)", 400));
  }

  const rawApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!rawApiKey) {
    console.error("[Gemini API Error] API Key is missing in environment variables.");
    return next(new AppError("AI integration is not configured properly.", 500));
  }
  const apiKey = rawApiKey.trim();

  const rawModel = env.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const model = rawModel.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are a professional blog writer. Write a well-structured Markdown blog post for the given title with an intro, headings and a conclusion. Do not include the title as an H1."
            }
          ]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: `Title: ${trimmedTitle}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Gemini API Error Response]", response.status, errorData);

      const errorMessage = errorData?.error?.message || "AI service is temporarily unavailable.";

      if (response.status === 400 || response.status === 404) {
        return next(new AppError(`Gemini Error: ${errorMessage}`, response.status));
      }
      if (response.status === 401 || response.status === 403) {
        return next(new AppError(`Gemini Auth Error: ${errorMessage}`, response.status));
      }
      if (response.status === 429) {
        return next(new AppError("AI rate limit reached. Try again in a minute.", 429));
      }
      return next(new AppError(`Gemini Error: ${errorMessage}`, 502));
    }

    const data = await response.json();

    // Join all text parts
    const parts = data.candidates?.[0]?.content?.parts || [];
    const generatedContent = parts.map(part => part.text).join("");

    if (!generatedContent) {
      return next(new AppError("AI returned an empty response.", 500));
    }

    res.status(200).json({
      success: true,
      data: {
        content: generatedContent,
      },
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return next(new AppError("AI request timed out. Please try again.", 504));
    }
    console.error("[Gemini API Fetch Error]", error);
    return next(new AppError("AI service is temporarily unavailable.", 500));
  }
});
