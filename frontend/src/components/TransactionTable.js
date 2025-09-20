
import React from "react";

const TransactionTable = ({
  transactions,
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
  onSortChange = () => {},
  sortBy,
  sortOrder,
}) => {
  if (!transactions || transactions.length === 0) {
    return <p className="text-center p-4">No transactions found.</p>;
  }

  const handleSort = (field) => {
    let order = "asc";
    if (sortBy === field && sortOrder === "asc") {
      order = "desc";
    }
    onSortChange(field, order);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th
              className="p-2 border cursor-pointer"
              onClick={() => handleSort("_id")}
            >
              Order ID {sortBy === "_id" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => handleSort("order_amount")}
            >
              Order Amount{" "}
              {sortBy === "order_amount" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => handleSort("transaction_amount")}
            >
              Transaction Amount{" "}
              {sortBy === "transaction_amount" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2 border">Payment Mode</th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => handleSort("payment_time")}
            >
              Payment Time{" "}
              {sortBy === "payment_time" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => {
            const orderAmount = t.order_amount || "-";
            const transactionAmount =
              t.transaction_amount || t.status?.transaction_amount || "-";
            const paymentMode = t.payment_mode || t.status?.payment_mode || "-";
            const status = t.status?.status || t.status || "N/A";
            const paymentTime =
              t.payment_time || t.status?.payment_time
                ? new Date(
                    t.payment_time || t.status?.payment_time
                  ).toLocaleString()
                : "N/A";

            return (
              <tr
                key={t._id}
                className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2 border">{t._id}</td>
                <td className="p-2 border">{orderAmount}</td>
                <td className="p-2 border">{transactionAmount}</td>
                <td className="p-2 border">{paymentMode}</td>
                <td className="p-2 border">{status}</td>
                <td className="p-2 border">{paymentTime}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
