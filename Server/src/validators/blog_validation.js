import { body } from "express-validator";

// CREATE ke liye: jaisa tha waisa hi (sab required)
export const blogValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("tags")
    .optional()
    .isArray({ min: 0 })
    .withMessage("Tags must be an array of strings")
    .custom((tags) => tags.every((tag) => typeof tag === "string"))
    .withMessage("Each tag must be a string"),
  body("conclusion").trim().notEmpty().withMessage("Conclusion is required"),
  body("status")
    .optional()
    .isIn(["draft", "publish", "scheduled"])
    .withMessage("Status must be draft, publish, or scheduled"),
];

// FIX: UPDATE ke liye: koi field required nahi (sab optional)
export const updateBlogValidation = [
  body("title").optional().trim(),
  body("content").optional().trim(),
  body("conclusion").optional().trim(),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),
  body("status").optional(),
];
