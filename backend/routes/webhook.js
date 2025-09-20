
const express = require("express");
const mongoose = require("mongoose");
const OrderStatus = require("../models/OrderStatus");
const WebhookLog = require("../models/WebhookLog");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const payload = req.body;

   
    await WebhookLog.create({ payload });

    const { order_info } = payload;
    if (!order_info) {
      return res.status(400).json({ error: "Missing order_info in payload" });
    }

    let orderId;
    try {
      orderId = new mongoose.Types.ObjectId(order_info.order_id);
    } catch {
      return res.status(400).json({ error: "Invalid order_id format" });
    }

    
    const paymentDetails =
      order_info.payment_details || order_info.payemnt_details || null;

    const paymentMessage =
      order_info.payment_message || order_info.Payment_message || null;

    const updateData = {
      collect_id: orderId,
      order_amount: order_info.order_amount,
      transaction_amount: order_info.transaction_amount,
      payment_mode: order_info.payment_mode,
      payment_details: paymentDetails,
      bank_reference: order_info.bank_reference,
      payment_message: paymentMessage,
      status: order_info.status,
      error_message: order_info.error_message,
      payment_time: order_info.payment_time
        ? new Date(order_info.payment_time)
        : new Date(),
    };

    await OrderStatus.findOneAndUpdate(
      { collect_id: orderId },
      updateData,
      { upsert: true, new: true }
    );

    res.json({ message: "Webhook processed successfully" });
  } catch (err) {
    console.error(" Webhook error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
