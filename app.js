const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const secret = "My Secret";
const User = require("./models/user");

const AuthRouter = require("./routers/auth");
const ShopRouter = require("./routers/shop");
const AdminRouter = require("./routers/admin");

const MONGODB_URI =
  "mongodb+srv://test1234:test1234@cluster0.uey5rx7.mongodb.net/asm3-nodejs?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const app = express();
app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: "none",
      // secure: process.env.NODE_ENV === "production",
      // secure: false,
      secure: true,
      maxAge: 1000 * 60 * 60,
      // httpOnly: true,
    },
  })
);

app.use(
  cors({
    // origin: [
    //   "https://front-end-client--nodejs.web.app",
    //   "https://front-end-admin--nodejs.web.app",
    //   // "https://front-end-client--nodejs.web.app/",
    //   // "http://localhost:3001/",
    //   // "http://localhost:3000/",
    // ],
    origin: "https://front-end-client--nodejs.web.app",
    // origin: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  console.log("isLogin: ", req.session.isLogin);
  console.log("isAdmin: ", req.session.isAdmin);
  console.log("isCounselor: ", req.session.isCounselor);
  if (req.session.isLogin) {
    User.findById(req.session.user._id).then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      // console.log(user);

      if (req.user.role === "ADMIN") req.session.isAdmin = true;
      if (req.user.role === "COUNSELOR") req.session.isCounselor = true;
      next();
    });
  } else next();
});

app.use("/auth", AuthRouter);
app.use("/", ShopRouter);
app.use("/admin", AdminRouter);

mongoose.connect(MONGODB_URI).then((result) => {
  const server = app.listen(5000);
  const io = require("./socket").init(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
});
