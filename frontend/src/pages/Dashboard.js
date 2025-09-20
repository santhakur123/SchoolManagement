
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import TransactionTable from "../components/TransactionTable";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const page = parseInt(searchParams.get("page")) || 1;
  const statusFilter = searchParams.getAll("status") || [];
  const search = searchParams.get("search") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const sortField = searchParams.get("sortBy") || "order_amount";
  const sortOrder = searchParams.get("order") || "asc";

  useEffect(() => {
    let url = `/transactions?limit=10&page=${page}&sortBy=${sortField}&order=${sortOrder}`;
    if (statusFilter.length > 0) {
      url += `&status=${statusFilter.join(",")}`;
    }
    if (search) url += `&search=${search}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;

    API.get(url)
      .then((res) => {
        setTransactions(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) handleLogout();
      });
  }, [page, statusFilter, search, fromDate, toDate, sortField, sortOrder]);

  const updateParams = (updates) => {
    const newParams = {
      page,
      search,
      fromDate,
      toDate,
      sortBy: sortField,
      order: sortOrder,
      ...updates,
    };

    const sp = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => sp.append(key, v));
      } else if (value) {
        sp.set(key, value);
      }
    });
    setSearchParams(sp);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Transactions Overview</h2>

     
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <select
            multiple
            value={statusFilter}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (opt) => opt.value
              );
              updateParams({ page: 1, status: values });
            }}
            className="border p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <input
            type="text"
            placeholder="Search by Custom Order ID / School ID"
            value={search}
            onChange={(e) => updateParams({ page: 1, search: e.target.value })}
            className="border p-2 flex-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          />

          <div className="flex gap-2 items-center">
            <label>From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => updateParams({ page: 1, fromDate: e.target.value })}
              className="border p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            />
            <label>To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => updateParams({ page: 1, toDate: e.target.value })}
              className="border p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        
        <TransactionTable
          transactions={transactions}
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => updateParams({ page: newPage })}
          onSortChange={(field, order) =>
            updateParams({ sortBy: field, order, page: 1 })
          }
          sortBy={sortField}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
}
