import jwt from "jsonwebtoken";
import {
  dateConstructor,
  formatDate,
  formatError,
  imageValidator,
  uploadedFile,
} from "../helpers.js";
import { loginSchema, registerSchema } from "../validations/authValidations.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel.js";
import { google } from "googleapis";
import axios from "axios";

export const logIn = async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with this email. SignUp first." });
    }
    if (user.password == null) {
      return res.status(422).json({ message: "Login with google!" });
    }
    const passwordMatch = await bcrypt.compare(payload.password, user.password);
    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.secretKey
      );

      // Respond with success message and token
      return res.status(200).send({ msg: "Login Successful", token, user });
    } else {
      return res.status(401).send({ error: "Wrong Credentials!!!" });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid Data", errors });
      return;
    }
    // Handle errors
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const payload = registerSchema.parse(req.body);

    // Check if files Exist
    if (req.files?.image) {
      const image = req.files?.image;
      const validMsg = imageValidator(image.size, image.mimetype);
      if (validMsg) {
        return res.status(422).json({ error: { image: validMsg } });
      }
      payload.image = await uploadedFile(image);
    } else {
      return res
        .status(422)
        .json({ error: { image: "Image field is required." } });
    }

    let alreadyPresentUser = await UserModel.findOne({ email: payload.email });
    if (alreadyPresentUser) {
      return res.status(400).send({
        error: {
          message:
            "user by the same email is already present in the database. Use another email to signup.",
        },
      });
    }

    // Hash the password using bcrypt
    const hash = await bcrypt.hash(payload.password, 5);

    payload.password = hash;

    const timestamp = dateConstructor();
    const formattedDate = formatDate(timestamp);

    // Create a new user instance
    const user = new UserModel({
      name: payload.name,
      email: payload.email,
      password: hash,
      profile_image: payload.image,
      created_at: formattedDate,
    });

    // Save the user to the database
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.SECRETKEY
    );

    // Respond with success message
    return res
      .status(200)
      .send({ msg: "New user has been registered", token, user });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      return res.status(422).json({ message: "Invalid Data", error: errors });
    }
    // Handle errors
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const googleLogIn = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is missing" });
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const oauth2client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      "postmessage"
    );

    // Exchange code for tokens
    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    // Fetch user info
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;

    // Check if user exists; if not, create a new user
    let user = await UserModel.findOne({ email });

    const timestamp = dateConstructor();
    const formattedDate = formatDate(timestamp);

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        profile_image: picture,
        password: null,
        created_at: formattedDate,
      });
    }

    const token = jwt.sign({ userId: user._id, email }, process.env.SECRETKEY, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Error in googleLogin function:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
