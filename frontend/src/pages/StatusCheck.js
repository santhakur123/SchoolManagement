import { useState } from "react";
import API from "../api";

export default function StatusCheck() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);

  const checkStatus = () => {
    if (!orderId) return alert(" Please enter Order ID");
    API.get(`/transactions/status/${orderId}`)
      .then((res) => setStatus(res.data))
      .catch(() => alert(" Could not fetch status. Invalid Order ID?"));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transaction Status Check</h1>

      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={checkStatus}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Check
      </button>

      {status && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p><b>Status:</b> {status.status}</p>
          <p><b>Message:</b> {status.payment_message}</p>
          <p><b>Amount:</b> {status.transaction_amount}</p>
        </div>
      )}
    </div>
  );
}
