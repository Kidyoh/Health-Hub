"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import { Badge } from "flowbite-react";
import axios from "axios"; // For fetching transaction data
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalIncome = () => {
  const [userId, setUserId] = useState(null); // Store the userId fetched from session
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState<number[]>([]); // Store monthly earnings for the chart
  const [loading, setLoading] = useState(true);

  // Fetch the user ID from the session
  useEffect(() => {
    const fetchUserIdFromSession = async () => {
      try {
        const response = await axios.get('/api/auth/getUser'); // Assuming this API returns the user session details
        const user = response.data.user;

        setUserId(user.id); // Assign the user ID from the session
      } catch (error) {
        console.error('Error fetching user ID from session:', error);
      }
    };

    fetchUserIdFromSession();
  }, []);

  // Fetch transactions using the user ID
  useEffect(() => {
    const fetchUserTransactions = async () => {
      try {
        const response = await axios.get(`/api/admin/dashboard/${userId}/transactions`);
        const { totalIncome, monthlyEarnings } = response.data;

        setTotalIncome(totalIncome);

        // Convert the monthly earnings object to an array for the chart
        const monthlyData = Array.from({ length: 12 }, (_, month) => monthlyEarnings[month] || 0);
        setMonthlyEarnings(monthlyData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserTransactions();
    }
  }, [userId]);

  const ChartData: ApexOptions = {
    series: [
      {
        name: "monthly earnings",
        color: "var(--color-error)",
        data: monthlyEarnings, // Use fetched monthly earnings data
      },
    ],
    chart: {
      id: "total-income",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0,
        opacityTo: 0,
        stops: [20, 180],
      },
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-lighterror text-error p-3 rounded-md">
          <Icon icon="solar:box-linear" height={24} />
        </div>
        <p className="text-lg font-semibold text-dark">Total Income</p>
      </div>
      <div className="flex">
        <div className="flex-1">
          <p className="text-xl text-dark font-medium mb-2">${totalIncome}</p>
          <Badge className="bg-lightsuccess text-success">+18%</Badge>
          <p className="text-success text-xs"></p>
        </div>
        <div className="rounded-bars flex-1 md:ps-7">
          <Chart
            options={ChartData}
            series={ChartData.series}
            type="area"
            height="60px"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default TotalIncome;
