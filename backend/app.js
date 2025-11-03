// app.js
require("dotenv").config({ path: "./config.env" });
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

// allowed origins — add any production host(s) here
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://unify-chat-cmyl.vercel.app',
  'https://unifychat-2.onrender.com' // optional if frontend served there
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like curl/postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: origin not allowed'), false);
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Preflight handling (optional but reliable)
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

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
