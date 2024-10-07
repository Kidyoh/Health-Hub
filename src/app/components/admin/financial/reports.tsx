"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, TextInput } from "flowbite-react";

const FinancialReports = () => {
  interface FinancialData {
    teleconsultationId: number;
    userPaid: number;
    teleconsultorReceived: number;
    adminReceived: number;
    createdAt: string;
  }

  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teleconsultationId, setTeleconsultationId] = useState<number | null>(null);

  // Fetch financial reports
  const fetchFinancialReports = async () => {
    try {
      const res = await axios.get("/api/admin/reports/financial", {
        params: {
          startDate,
          endDate,
          teleconsultationId,
        },
      });
      setFinancialData(res.data.financialData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load financial reports");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialReports();
  }, []);

  // Conditional rendering based on loading or error state
  if (loading) return <p>Loading financial reports...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Financial Reports</h1>

      {/* Date and Teleconsultation Filters */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <TextInput
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mb-2 md:mb-0"
        />
        <TextInput
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mb-2 md:mb-0"
        />
        <TextInput
          type="number"
          placeholder="Teleconsultation ID"
          value={teleconsultationId || ""}
          onChange={(e) => setTeleconsultationId(parseInt(e.target.value))}
          className="mb-2 md:mb-0"
        />
        <Button onClick={fetchFinancialReports} className="bg-blue-500 text-white">
          Filter
        </Button>
      </div>

      {/* Financial Data Table */}
      <Table hoverable={true} className="w-full border-collapse border border-gray-300 shadow-lg">
        <Table.Head className="bg-gray-100">
          <Table.HeadCell>Teleconsultation ID</Table.HeadCell>
          <Table.HeadCell>User Paid</Table.HeadCell>
          <Table.HeadCell>Teleconsultor Received</Table.HeadCell>
          <Table.HeadCell>Admin Received</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {financialData.map((transaction) => (
            <Table.Row key={transaction.teleconsultationId} className="hover:bg-gray-50">
              <Table.Cell>{transaction.teleconsultationId}</Table.Cell>
              <Table.Cell>${transaction.userPaid}</Table.Cell>
              <Table.Cell>${transaction.teleconsultorReceived}</Table.Cell>
              <Table.Cell>${transaction.adminReceived}</Table.Cell>
              <Table.Cell>{new Date(transaction.createdAt).toLocaleDateString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default FinancialReports;