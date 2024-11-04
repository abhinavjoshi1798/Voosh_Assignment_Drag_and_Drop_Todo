import { supportMimes } from "./config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";


export const formatError = (error) => {
  let errors = {};
  error.errors?.map((issue) => {
    errors[issue.path?.[0]] = issue.message;
  });
  return errors;
};

export const imageValidator = (size, mime) => {
  if (bytesToMb(size) > 2) {
    return "Image size must be less than 2 MB";
  } else if (!supportMimes.includes(mime)) {
    return "Image must be of type png, jpg, jpeg, webp.";
  }
  return null;
};

export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

export const uploadedFile = (image) => {
  const imgExt = image?.name.split(".").pop();
  const imageName = `${uuidv4()}.${imgExt}`;
  const uploadPath = process.cwd() + "/public/images/" + imageName;
  image.mv(uploadPath, (err) => {
    if (err) {
      throw err;
    }
  });
  return imageName;
};

//Function to delete image from server public folder
export const removeImage = (imageName) => {
  const path = process.cwd() + "/public/images/" + imageName;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};

export const dateConstructor = () => {
  return new Date();
};




