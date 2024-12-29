import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import passport from "passport";
import session from "express-session";
import dotenv from 'dotenv';
import cors from "cors";
import path from "path";

import userRoutes from './routes/userRoute.js'
import exploreRoute from './routes/exploreRoute.js'
import authRoute from './routes/authRoute.js';

import connectDB from './config/db.js';

import './passport/githubAuth.js'

dotenv.config();
connectDB();
const app = express();
const __dirname = path.resolve();

app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(morgan("dev"));

app.use('/api/users', userRoutes)
app.use("/api/explore", exploreRoute);
app.use("/api/auth", authRoute);


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(
        `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
            .white
    );
});