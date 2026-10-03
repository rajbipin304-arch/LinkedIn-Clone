import User from "../models/user.model.js";
import Profile from "../models/profile.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req, res) => {
    try {
        const { name, email, password, userName } = req.body;

        if (!name || !email || !password || !userName) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userName
        });

        await newUser.save();

        const profile = new Profile({
            userId: newUser._id
        });

        await profile.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        user.token = token;
        await user.save();

        res.json({ token });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const updateProfilePicture = async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        res.status(200).json({
            message: "Profile picture updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { userName, email } = newUserData;

        const existingUser = await User.findOne({
            $or: [
                { userName },
                { email }
            ]
        });

        if (
            existingUser &&
            existingUser._id.toString() !== user._id.toString()
        ) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        Object.assign(user, newUserData);

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const profile = await Profile.findOne({
            userId: user._id
        }).populate("userId", "name email username profilePicture");

        res.status(200).json({
            user,
            profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};