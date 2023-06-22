// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require("express");
const mongoose = require("mongoose");
const PORT = 8000;
const DB_URL = "mongodb://127.0.0.1:27017/bill_sub";
const cors = require("cors");
const saltRounds = 10;
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/users");
const Bill = require("./models/bills");
const { ObjectId } = require('mongodb');

const app = express();

// mongod --dbpath /mnt/c/data/db to start mongodb
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log(`Error connecting to database: ${error}`);
  });
const store = new MongoDBStore({ uri: DB_URL });

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
// enable CORS

app.use(
  session({
    secret: "c3627c34e68ae02a2eef4d1a8494c66fb2b570ebd49dd5e6a046754d1a91fc55",
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Server closed. Database instance disconnected.");
    process.exit(0);
  });
});


app.get("/bills", async (req, res) => {
  const account_name = req.session.account_name;
  try{
    const user = await User.findOne({account_name: account_name}).populate("bills");
    const bills = user.bills;
    console.log(bills);
    res.status(200).send(bills);
  }catch(err){
    console.log(err);
    res.status(500).send("Internal Server Error");
  }

});

app.get("/bills/:id", async (req, res) => {
  const billId = req.params.id;
  console.log(billId);
  try{
    const bill = await Bill.findById(billId);
    console.log(bill);
    res.status(200).send(bill);
  }catch(err){
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/post_bill", async (req, res) => {
  console.log("post_bill", req.body);
  const { patientName, address,hospitalName, dateOfService, billAmount } = req.body;
  try {
    console.log("post question session:", req.session);
    account_name = req.session.account_name;
    console.log(account_name);
    const user = await User.findOne({ account_name: account_name });
    console.log("user find:", user);
    const newBill = await new Bill({
      patient: patientName,
      address, 
      hospital: hospitalName,
      date: dateOfService,
      amount: billAmount,
    });
    await newBill.save();

    user.bills.push(newBill);
    await user.save();

    res.status(200).send(newBill);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");  
  }
});

app.post("/modify_bill/:id", async (req, res) => {
  console.log("modify_bill", req.body);
  const { patientName, address,hospitalName, dateOfService, billAmount } = req.body;
  const billId = req.params.id;
  try {
    const bill = await Bill.findById(billId);
    bill.patient = patientName;
    bill.address = address;
    bill.hospital = hospitalName;
    bill.date = dateOfService;
    bill.amount = billAmount;
    await bill.save();
    res.status(200).send(bill);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});




app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let emailExists = await User.exists({ account_name: email });
  if (emailExists) {
    res.status(400).json({ message: "Email already exists" });
  } else {
    // Create user
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return res.status(400);
      let user = new User({
        username: username,
        account_name: email,
        password: hash,
      });
      user.save();
      res.status(200).json({ message: "Registration successful" });
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //Check if logged in via session
  if (req.session.account_name) {
    let user = await User.findOne({
      account_name: req.session.account_name,
    }).lean();
    res.status(200).json({ status: "SESSION", user: user.username });
  } else {
    if (email == null)
      return res.status(200).json({ message: "waiting for login" });
    //console.log(email);
    //console.log(password);
    let user = await User.findOne({ account_name: email });
    if (user == null) return res.status(400).json({ message: "No such user" });
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result)
        res.status(400).json({ message: "Incorrect Password" });
      else {
        req.session.username = user.username;
        req.session.account_name = user.account_name;
        //console.log(req.session);
        res.status(200).json({ user: user.username });
      }
    });
  }
});

app.post("/logout", (req, res) => {
  //console.log(req.session);
  if (req.session.account_name) {
    req.session.destroy();
    res.status(200).json({ status: "OK" });
  } else {
    res.status(400).json({ message: "No user to log out" });
  }
});
