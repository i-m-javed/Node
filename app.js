const express = require("express");
const { default: mongoose } = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const hostRouter = require("./routes/hostRouter");
const storeRouter = require("./routes/storeRouter");
const authRouter = require("./routes/authRouter");
const storeController = require("./controllers/storeController");

const db_path =
  "mongodb+srv://javed:javed123@airbnb.0sdrfzf.mongodb.net/airbnb?retryWrites=true&w=majority&appName=airbnb";

const app = express();

const store = new MongoDBStore({
  uri: db_path,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/host/uploads", express.static("uploads"));
app.use("/homes/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use(authRouter);
app.use(storeRouter);

app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use(hostRouter);

app.use(storeController.get404Page);

const port = 3002;

mongoose
  .connect(db_path)
  .then(() => {
    console.log("Connected to database");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to database", err);
    throw err;
  });
