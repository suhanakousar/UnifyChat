// app.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./controllers/passController");

const userRouter = require("./routes/userRoutes");
const roomRoute = require("./routes/roomRoutes");
// Import your messageRoutes (the file with router.post("/rooms/:roomId/messages"))
const messageRoutes = require("./routes/messageRoutes");

const translate = require("./controllers/transController");
const app = express();

// Read allowed origins from an environment variable (comma-separated), with defaults for local dev
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://unify-chat1-lkam.vercel.app,https://unifychat-2.onrender.com';
const allowedOrigins = allowedOriginsEnv.split(',').map(s => s.trim()).filter(Boolean);

console.log('CORS allowed origins:', allowedOrigins);

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or same-origin requests)
    if (!origin) {
      // No Origin header (server-to-server or same-origin), allow
      return callback(null, true);
    }

    // Debug log to help with failing origins
    console.log('CORS check origin:', origin);

    if (allowedOrigins.includes(origin)) {
      // origin allowed
      return callback(null, true);
    }

    // origin not allowed -> do NOT throw an Error (that causes a 500).
    // Instead instruct CORS middleware to disallow by returning false.
    // The browser will block the request client-side.
    console.warn('CORS policy: origin not allowed:', origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Also ensure preflight OPTIONS are handled using the same options
app.options('*', cors(corsOptions));

// if you want to log the origin for debugging:
app.use((req, res, next) => {
  console.log('Request origin:', req.headers.origin, 'Path:', req.path);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers (optional)
// Note: COOP set to "unsafe-none" to allow Google OAuth popup communication
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  // COEP removed as it's not needed and can cause issues with external services
  next();
});

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true on HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Example homepage
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

// Example user routes => /auth/...
app.use("/auth", userRouter);

// Example room routes => /chatroom/...
app.use("/chatroom", roomRoute);

// Mount your message routes at root => /rooms/:roomId/messages
app.use("/", messageRoutes);

// If you need translation for testing
app.get("/testTrans", (req, res) => {
  translate("", "vi", "How are you?");
  res.send("ok");
});

module.exports = app;
