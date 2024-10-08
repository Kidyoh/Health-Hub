"use client";
import React, { useState, useEffect } from "react";
import { Progress } from "flowbite-react";
import { Icon } from "@iconify/react";
import axios from "axios";

const NewCustomers = () => {
  interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }
  
  const [newCustomers, setNewCustomers] = useState<Customer[]>([]); // Store an array of customer objects
  const [goal, setGoal] = useState(100); // Example goal for new customers
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fetch the number of new customers (new users)
    const fetchNewCustomers = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/userGoals");
        const customers = response.data.newCustomers;
        setNewCustomers(customers); // Update with the array of customers
        const customerCount = customers.length; // Get the count of new customers
        const calculatedProgress = (customerCount / goal) * 100;
        setProgress(Math.min(calculatedProgress, 100)); // Limit to 100%
      } catch (error) {
        console.error("Error fetching new customers:", error);
      }
    };

    fetchNewCustomers();
  }, [goal]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-lightsecondary text-secondary p-3 rounded-md">
            <Icon icon="solar:football-outline" height={24} />
          </div>
          <p className="text-lg text-dark font-semibold">New Customers</p>
        </div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-dark">New goals</p>
          <p className="text-sm text-dark">{progress.toFixed(0)}%</p>
        </div>
        <Progress progress={progress} color="secondary" />
        <p className="text-sm text-dark mt-4">Total New Customers: {newCustomers.length}</p>

      </div>
    </>
  );
};

export default NewCustomers;
