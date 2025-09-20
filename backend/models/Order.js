const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  school_id: { type: String, required: true },
  trustee_id: { type: String, required: true },
  student_info: {
    name: { type: String, required: true },
    id: { type: String },
    email: { type: String },
  },
  gateway_name: { type: String, required: true },
  order_amount: { type: Number, required: true },
  custom_order_id: { type: String, required: true, unique: true }, 
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);

