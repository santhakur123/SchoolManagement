
const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();


router.get("/", auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const sortField = req.query.sortBy || "payment_time";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const { status, search, fromDate, toDate } = req.query;

    const matchConditions = {};
    if (status) {
      matchConditions["status.status"] = status;
    }
    if (search) {
      matchConditions.$or = [
        { custom_order_id: { $regex: search, $options: "i" } }, 
        { school_id: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate || toDate) {
      matchConditions["status.payment_time"] = {};
      if (fromDate) matchConditions["status.payment_time"]["$gte"] = new Date(fromDate);
      if (toDate) matchConditions["status.payment_time"]["$lte"] = new Date(toDate);
    }

    const transactions = await Order.aggregate([
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status",
        },
      },
      { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
      ...(Object.keys(matchConditions).length ? [{ $match: matchConditions }] : []),
      { $sort: { [`status.${sortField}`]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalCountAgg = await Order.aggregate([
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status",
        },
      },
      { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
      ...(Object.keys(matchConditions).length ? [{ $match: matchConditions }] : []),
      { $count: "total" },
    ]);

    const totalCount = totalCountAgg.length > 0 ? totalCountAgg[0].total : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ page, limit, totalPages, data: transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 
router.get("/school/:schoolId", auth, async (req, res) => {
  try {
    const transactions = await Order.aggregate([
      { $match: { school_id: req.params.schoolId } },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status",
        },
      },
      { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
    ]);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/status/:customOrderId", auth, async (req, res) => {
  try {
    const transactions = await Order.aggregate([
      { $match: { custom_order_id: req.params.customOrderId } },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status",
        },
      },
    ]);
    if (!transactions.length) return res.status(404).json({ msg: "Transaction not found" });
    res.json(transactions[0].status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
