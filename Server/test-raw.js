import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const tiny =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

const timestamp = Math.floor(Date.now() / 1000);
const params = { folder: "blogs", timestamp };
const signature = cloudinary.utils.api_sign_request(
  params,
  process.env.CLOUDINARY_API_SECRET,
);

const fd = new FormData();
fd.append("file", tiny);
fd.append("folder", "blogs");
fd.append("timestamp", String(timestamp));
fd.append("api_key", process.env.CLOUDINARY_API_KEY);
fd.append("signature", signature);

const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
const res = await fetch(url, { method: "POST", body: fd });

await res.text();
