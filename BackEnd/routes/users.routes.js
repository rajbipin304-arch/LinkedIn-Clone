import { Router } from "express";
import multer from "multer";

import {
    register,
    login,
    updateProfilePicture
} from "../controllers/user.controller.js";

const router = Router();

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage
});

router.post("/register", register);
router.post("/login", login);
router.post("/userUpdate", updateProfile);
router.post("/get_user_and_profile", getUserAndProfile);

router.post(
    "/updateProfilePicture",
    upload.single("profilePicture"),
    updateProfilePicture
);


export default router;