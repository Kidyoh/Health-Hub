"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "flowbite-react";
import { Table } from "flowbite-react";
import SimpleBar from "simplebar-react";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

interface Teleconsultation {
  id: number;
  date: string;
  doctor: string;
  status: string;
  paymentStatus: string;
}

interface Facility {
  id: number;
  name: string;
}

interface Appointment {
  id: number;
  date: string;
  userId: number;
  facilityId?: number | null;
  teleconsultationId?: number | null;
  status: string;
  teleconsultation?: Teleconsultation | null;
  facility?: Facility | null;
}

const AppointmentsAvaialable: React.FC = () => {
  const [telemedicineAppointments, setTelemedicineAppointments] = useState<Appointment[]>([]);
  const [facilityAppointments, setFacilityAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments/get"); // Assuming your API endpoint is /api/appointments
        const data = await response.json();

        if (data.success) {
          setTelemedicineAppointments(data.telemedicineAppointments);
          setFacilityAppointments(data.facilityAppointments);
        } else {
          setError("Failed to load appointments.");
        }
      } catch (err) {
        setError("Error fetching appointments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray pt-6 px-0 relative w-full break-words">
        <div className="px-6">
          <h5 className="card-title mb-6">Telemedicine Appointments</h5>
        </div>
        <SimpleBar className="max-h-[450px]">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6">Doctor</Table.HeadCell>
                <Table.HeadCell>Appointment Date</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Payment Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder ">
                {loading
                  ? Array(3).fill(0).map((_, index) => (
                    <Table.Row key={index}>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <Skeleton width={150} />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton width={120} />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton width={80} />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton width={50} />
                      </Table.Cell>
                    </Table.Row>
                  ))
                  : telemedicineAppointments.map((appointment, index) => (
                    <Table.Row key={index}>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex items-center">
                          <div className="truncate line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">
                              Dr. {appointment.teleconsultation?.doctor}
                            </h6>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="me-5">
                          <p className="text-base">
                            {moment(appointment.date).format("MMM DD, YYYY h:mm A")}
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          className={`${
                            appointment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <h4>
                          {appointment.teleconsultation?.paymentStatus === "Paid"
                            ? "Paid"
                            : "Pending"}
                        </h4>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </SimpleBar>

        <div className="px-6 mt-10">
          <h5 className="card-title mb-6">Facility Appointments</h5>
        </div>
        <SimpleBar className="max-h-[450px]">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6">Facility</Table.HeadCell>
                <Table.HeadCell>Appointment Date</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder ">
                {loading
                  ? Array(3).fill(0).map((_, index) => (
                    <Table.Row key={index}>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <Skeleton width={150} />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton width={120} />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton width={80} />
                      </Table.Cell>
                    </Table.Row>
                  ))
                  : facilityAppointments.map((appointment, index) => (
                    <Table.Row key={index}>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex items-center">
                          <div className="truncate line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">{appointment.facility?.name}</h6>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="me-5">
                          <p className="text-base">
                            {moment(appointment.date).format("MMM DD, YYYY h:mm A")}
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          className={`${
                            appointment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </SimpleBar>
      </div>
    </>
  );
};

export default AppointmentsAvaialable;
