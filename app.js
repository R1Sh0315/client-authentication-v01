const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

const authRoutes = require('./routes/auth')

dotenv.config();

const app=express()

//middleware
app.use(express.json())

//db connect
mongoose.connect(
    process.env.MONGO_URI,{
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    }
).then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use('/api/auth', authRoutes)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});