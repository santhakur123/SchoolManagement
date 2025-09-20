import { useState } from "react";
import API from "../api";
import TransactionTable from "../components/TransactionTable";

export default function SchoolTransactions() {
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = () => {
    API.get(`/transactions/school/${schoolId}`)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions by School</h1>

      <input
        type="text"
        placeholder="Enter School ID"
        value={schoolId}
        onChange={(e) => setSchoolId(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={fetchTransactions}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Fetch
      </button>

      <TransactionTable transactions={transactions} />
    </div>
  );
}
