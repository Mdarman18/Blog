import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// FormData mein tags string aata hai, validator se pehle array bana do
export const parseTags = (req, res, next) => {
  const { tags } = req.body;
  if (typeof tags === "string") {
    try {
      req.body.tags = JSON.parse(tags);
    } catch {
      req.body.tags = tags.split(",").map((t) => t.trim());
    }
  }
  next();
};

export default upload;
