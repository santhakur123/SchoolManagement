
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Order = require("./models/Order");
const OrderStatus = require("./models/OrderStatus");

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected");

    
    await User.deleteMany({});
    await Order.deleteMany({});
    await OrderStatus.deleteMany({});

    
    const plainPassword = "123456";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      role: "user",
    });

    console.log(" User create:");
    console.log({ email: user.email, password: plainPassword });

   
    const orders = [];
    for (let i = 1; i <= 10; i++) {
      orders.push({
        school_id: `SCH00${i % 3}`, 
        trustee_id: `T00${i % 5}`, 
        userId: user._id,
        order_amount: Math.floor(Math.random() * 5000) + 1000,
        gateway_name: "PhonePe",
        custom_order_id: `ORDER${1000 + i}`,
        student_info: {
          name: `Student ${i}`,
          id: `STU${i}`,
          email: `student${i}@example.com`,
        },
      });
    }

    const insertedOrders = await Order.insertMany(orders);

    
    const statuses = insertedOrders.map((order, i) => ({
      collect_id: order._id,
      order_amount: order.order_amount,
      transaction_amount: order.order_amount - (i % 2 === 0 ? 0 : 50),
      payment_mode: ["UPI", "CARD", "NETBANKING"][i % 3],
      payment_details: `test${i}@upi`,
      bank_reference: `BANKREF${2000 + i}`,
      payment_message: "Payment processed",
      status: ["SUCCESS", "PENDING", "FAILED"][i % 3],
      error_message: i % 3 === 2 ? "Insufficient funds" : null,
      payment_time: new Date(Date.now() - i * 1000 * 60 * 60), 
    }));

    await OrderStatus.insertMany(statuses);

    console.log(" Seeded user + 10 orders + 10 statuses");
    process.exit();
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seedData();
