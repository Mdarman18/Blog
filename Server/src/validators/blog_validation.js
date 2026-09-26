import { body } from "express-validator";

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
    .isIn(["draft", "publish"])
    .withMessage("Status must be either draft or publish"),
];
