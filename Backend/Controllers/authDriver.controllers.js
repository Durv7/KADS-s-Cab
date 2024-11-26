const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Driver = require("../Models/driver.model.js");
const { ExpressError } = require("../utils/expressError.js");


const getToken = (id) => {
  return jwt.sign({
    _id: id,
    role: 'driver',
  }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: '30d'
  })
}

const setToken = (res, token) => {
  res.cookie("kads_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none"
  })
}

const registerDriver = async (req, res) => {
  const { userName, email, fullName, city, password, phoneNo } = req.body;

  try {
    let isExists = await Driver.findOne({ userName });
    
    if (isExists) {
      return res.status(401).json({ message: "username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const driver = await Driver.create({
      userName,
      phoneNo,
      email,
      fullName,
      password: hashedPassword,
      city,
    })

    if (driver) {
      let token = getToken(driver._id);
      setToken(res, token);
      res.status(201).json({
        userName: driver.userName,
        email: driver.email,
        fullName: driver.fullName,
        phoneNo: driver.phoneNo,
        city: driver.city,
      })
    } else {
      res.status(401).json({ message: "Invalid User Data" })
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    }

    res.status(500).json({ message: "An internal server error occurred." });
  }
}

const loginDriver = async (req, res) => {
  const { userName, password } = req.body;

  try {
    if (!userName || !password) {
      return res.status(401).json({ message: "please provide all fields" });
    }

    const driver = await Driver.findOne({ userName });

    if (driver) {
      let token = getToken(driver._id);
      setToken(res, token);
      res.status(201).json(
        {
          userName: driver.userName,
          email: driver.email,
          fullName: driver.fullName,
          phoneNo: driver.phoneNo,
          city: driver.city,
        }
      )
    } else {
      console.log("here");
      res.status(401).json({ message: "Invalid username or password" });

    }
  } catch (err) {
    console.log(err);
  }
}

const logoutDriver = async (req, res) => {
  console.log("logout processing");
  res.clearCookie("kads_token");
  res.json({ message: "Logout Successfully" });
}


module.exports = { registerDriver, loginDriver, logoutDriver };