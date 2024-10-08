"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Select } from "flowbite-react";
import { ApexOptions } from "apexcharts";
import axios from "axios";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RevenueForecast = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("This Week");
  const [transactionData, setTransactionData] = useState<any[]>([]); // Transaction data array

  // Fetch transaction data from the backend
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/transactions"); // Adjust your API endpoint
        // Check if response is valid and is an array
        if (Array.isArray(response.data.transactions)) {
          setTransactionData(response.data.transactions);
        } else {
          console.error("Invalid transaction data format", response.data);
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchTransactionData();
  }, []);

  // Helper function to get the date range for filtering
  const getPeriodDateRange = (period: string) => {
    const today = new Date();
    switch (period) {
      case "April 2024":
        return { startDate: new Date("2024-04-01T00:00:00"), endDate: new Date("2024-04-30T23:59:59") };
      case "May 2024":
        return { startDate: new Date("2024-05-01T00:00:00"), endDate: new Date("2024-05-31T23:59:59") };
      case "June 2024":
        return { startDate: new Date("2024-06-01T00:00:00"), endDate: new Date("2024-06-30T23:59:59") };
      case "This Week":
      default:
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of this week
        startOfWeek.setHours(0, 0, 0, 0); // Reset to the start of the day
        return { startDate: startOfWeek, endDate: new Date() };
    }
  };
  
  // Helper function to format transaction data for chart (grouped by hour)
  const getChartData = (period: string) => {
    const { startDate, endDate } = getPeriodDateRange(period);

    // Filter transaction data by date range
    const filteredData = transactionData.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Group by hour and calculate total amount for each hour
    const groupedData = filteredData.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const hourKey = transactionDate.toLocaleString("en-US", {
        hour: "2-digit",
        hour12: false, // 24-hour format
      });
      acc[hourKey] = (acc[hourKey] || 0) + transaction.amount;
      return acc;
    }, {});

    const categories = Object.keys(groupedData); // Hours of the day
    const dataSeries = Object.values(groupedData) as number[];

    return {
      series: [
        {
          name: "Revenue",
          data: dataSeries, // Total amounts grouped by hour
        },
      ],
      categories,
    };
  };

  const optionsBarChart: ApexOptions = {
    chart: {
      offsetX: 0,
      offsetY: 10,
      stacked: true,
      animations: {
        speed: 500,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["var(--color-primary)"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: "#90A4AE50",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "15%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    xaxis: {
      categories: [], // Dynamic categories (hours)
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: Math.max(...getChartData(selectedPeriod).series[0].data, 0) + 10, // Adjust max dynamically
      tickAmount: 5,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const barChartData = getChartData(selectedPeriod);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <div className="flex justify-between items-center">
        <h5 className="card-title">Revenue Forecast (Hourly)</h5>
        <Select
          id="periods"
          className="select-md"
          value={selectedPeriod}
          onChange={handleSelectChange}
          required
        >
          <option value="This Week">This Week</option>
          <option value="April 2024">April 2024</option>
          <option value="May 2024">May 2024</option>
          <option value="June 2024">June 2024</option>
        </Select>
      </div>

      <div className="-ms-4 -me-3 mt-2">
        <Chart
          options={{
            ...optionsBarChart,
            xaxis: {
              ...optionsBarChart.xaxis,
              categories: barChartData.categories,
            },
          }}
          series={barChartData.series}
          type="bar"
          height="315px"
          width="100%"
        />
      </div>
    </div>
  );
};

export default RevenueForecast;
