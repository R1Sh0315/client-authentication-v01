const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    const { username, password, mobileNumber } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { mobileNumber }] });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            mobileNumber
        });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Signin
router.post('/signin', async (req, res) => {
    const { identifier, password } = req.body; // identifier can be username or mobile number

    try {
        // Find the user by username or mobile number
        const user = await User.findOne({
            $or: [{ username: identifier }, { mobileNumber: identifier }]
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Logged in successfully", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
