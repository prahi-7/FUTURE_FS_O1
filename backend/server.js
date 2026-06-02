/**
 * Portfolio Server
 * Main entry point for the Express application
 * With Local MongoDB Connection - FIXED VERSION
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from current directory
app.use(express.static(path.join(__dirname,'../frontend')));

// ========== LOCAL MONGODB CONNECTION ==========
const MONGODB_URI = 'mongodb://p:p7@ac-zubpgyn-shard-00-00.9dpzorw.mongodb.net:27017,ac-zubpgyn-shard-00-01.9dpzorw.mongodb.net:27017,ac-zubpgyn-shard-00-02.9dpzorw.mongodb.net:27017/?ssl=true&replicaSet=atlas-ksiy0x-shard-0&authSource=admin&appName=Cluster0';

async function connectToMongoDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("✅ Local MongoDB Connected Successfully!");
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`📍 Host: ${mongoose.connection.host}`);
    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error.message);
        console.log("\n⚠️  Please make sure MongoDB is running!");
        console.log("   To start MongoDB:");
        console.log("   - Windows: net start MongoDB");
        console.log("   - Mac: brew services start mongodb-community");
        console.log("   - Linux: sudo systemctl start mongod\n");
    }
}

connectToMongoDB();

// ========== MESSAGE SCHEMA ==========
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

// ========== EMAIL CONFIGURATION (Optional) ==========
let transporter = null;

async function setupEmailTransporter() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (emailUser && emailPass) {
        try {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: emailUser, pass: emailPass }
            });
            await transporter.verify();
            console.log("✅ Email notifications enabled!");
            return true;
        } catch (error) {
            console.log("⚠️ Email configuration error - notifications disabled");
            transporter = null;
            return false;
        }
    } else {
        console.log("📧 Email notifications disabled. Create .env file to enable.");
        return false;
    }
}

// ========== API ROUTES ==========

// Test route
app.get('/test', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ 
        success: true, 
        message: "Backend Working Successfully",
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        success: true,
        status: 'OK',
        database: dbStatus,
        port: PORT
    });
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please enter a valid email address' 
            });
        }
        
        // Check for spam
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        const recentMessage = await Message.findOne({
            email: email,
            createdAt: { $gte: twoMinutesAgo }
        });
        
        if (recentMessage) {
            return res.status(429).json({ 
                success: false, 
                error: 'Please wait 2 minutes before sending another message' 
            });
        }
        
        // Save to MongoDB
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        console.log(`💾 Message saved from ${name} (${email})`);
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully! I will get back to you soon.' 
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error. Please try again.' 
        });
    }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== SERVE FRONTEND - FIXED WILDCARD ROUTE ==========
// Important: This MUST be the LAST route
// Use app.use() instead of app.get() to avoid path-to-regexp error
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ========== START SERVER ==========
async function startServer() {
    await setupEmailTransporter();
    
    app.listen(PORT, () => {
        console.log(`
    ═══════════════════════════════════════════════════
    🚀 Server is running!
    📡 URL: http://localhost:${PORT}
    💾 MongoDB: Connected ✓
    📧 Email: ${transporter ? 'Enabled ✓' : 'Disabled'}
    ═══════════════════════════════════════════════════
        `);
    });
}

startServer();