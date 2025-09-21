
const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

router.post("/create-payment", auth, async (req, res) => {
  try {
    const { trustee_id, student_info, gateway_name, order_amount, custom_order_id } = req.body;

    if (!trustee_id || !student_info?.name || !order_amount || !custom_order_id) {
      return res.status(400).json({ msg: "Invalid request data" });
    }

    const order = new Order({
      school_id: process.env.SCHOOL_ID,
      trustee_id,
      student_info,
      gateway_name,
      order_amount,
      custom_order_id,
    });
    await order.save();

    const payload = {
      pg_key: process.env.PG_KEY,
      school_id: process.env.SCHOOL_ID,
      order_id: order._id.toString(),
      order_amount,
    };

    const signedToken = jwt.sign(payload, process.env.PAYMENT_API_KEY);

    // const response = await axios.post(
    //   "https://payment-gateway-url/create-collect-request",
    //   payload,
    //   { headers: { Authorization: `Bearer ${signedToken}` } }
    // );
    const response = await axios.post(
  "https://staging-payments.edviron.com/api/v1/payment/collect",  
  payload,
  { headers: { Authorization: `Bearer ${signedToken}`, "Content-Type": "application/json" } }
);

    res.json({
      redirect_url: response.data.redirect_url,
      order_id: order._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
