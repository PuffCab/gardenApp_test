import express from "express";
import {
  signup,
  login,
  uploadUserPicture,
  getProfile,
  updateUserImage,
  updateUserInfo,
} from "../controller/userController.js";
import jwt from "../middlewares/jwt.js";
import { multerUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/imageupload", multerUpload.single("image"), uploadUserPicture);
router.put("/updateuserimage", jwt, updateUserImage);
router.put("/updateuserinfo", jwt, updateUserInfo);
router.post("/signup", signup);
router.post("/login", login);
router.get("/myprofile", jwt, getProfile);

export default router;
