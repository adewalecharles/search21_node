require("dotenv").config();
const express = require("express");
var bcrypt = require("bcryptjs");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({
        email: email,
      });

      if (!user) {
        return res
          .status(422)
          .json({ status: false, message: "Invalid Credentials" });
      }

      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          status: false,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
        expiresIn: 86400, // 24 hours
      });

      return res.status(200).json({
        status: true,
        data: {
          accessToken: token,
            user: {
                id: user._id,
                email: user.email
          }
        },
      });
    } catch (error) {
        return res.status(500).json({
          status: false,
          message: error,
        });
    }
  },

  async register(req, res) {
    try {
      const user = await userModel.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({
          status: false,
          message: "User with email already exist",
        });
      }

      const newUser = await userModel.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });

      var token = jwt.sign({ newUser }, process.env.JWT_SECRET_KEY, {
        expiresIn: 86400, // 24 hours
      });

      return res.status(200).json({
        status: true,
        data: {
          accessToken: token,
          user: {
            id: newUser._id,
            email: newUser.email,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: error });
    }
  },

  validateJwtToken(req, res) {
    // Tokens are generally passed in the header of the request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
      const token = req.header(tokenHeaderKey);

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {
        res
          .status(200)
          .json({ status: true, message: "Successfully Verified" });
      } else {
        // Access Denied
        res.status(401).json({ status: false, message: "Token is not valid" });
      }
    } catch (error) {
      // Access Denied
      res.status(401).json({ status: false, message: error });
    }
  },
};
