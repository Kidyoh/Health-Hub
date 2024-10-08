"use client";
import React, { useEffect, useState } from "react";
import { Badge, Table, Modal, Button } from "flowbite-react";
import moment from "moment";
import { Icon } from "@iconify/react";

// Interface Definitions
interface Consultation {
  id: number;
  date: string;
  doctor: string;
  status: string;
  notes: string;
  patientName: string;
}

const AppointmentHistory: React.FC = () => {
  const [telemedicineAppointments, setTelemedicineAppointments] = useState<Consultation[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Consultation | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("Fetching telemedicine appointment history...");
      try {
        const res = await fetch("/api/appointments/history");
        console.log("API response received:", res);
        const data = await res.json();
        console.log("Fetched appointments data:", data);

        if (data && data.success) {
          setTelemedicineAppointments(data.consultations || []); // Access the consultations array
          console.log("Set telemedicine appointments:", data.consultations);
        } else {
          setTelemedicineAppointments([]);
          console.log("No telemedicine appointments found.");
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to load appointment history.");
      } finally {
        setLoading(false);
        console.log("Finished fetching appointment history.");
      }
    };

    fetchHistory();
  }, []);

  const openModal = (appointment: Consultation) => {
    console.log("Opening modal for appointment:", appointment);
    setSelectedAppointment(appointment);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setSelectedAppointment(null);
  };

  // Skeleton Loader
  const renderSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Table.Row key={index}>
          <Table.Cell>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-32"></div>
          </Table.Cell>
          <Table.Cell>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
          </Table.Cell>
          <Table.Cell>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-16"></div>
          </Table.Cell>
          <Table.Cell>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-8"></div>
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );

  if (error) return <p>{error}</p>;

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Telemedicine Appointments</h2>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Doctor</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Details</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {loading ? (
            renderSkeleton() // Show skeleton if loading
          ) : telemedicineAppointments && telemedicineAppointments.length > 0 ? (
            telemedicineAppointments.map((appointment, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {moment(appointment.date).format("MMM DD, YYYY h:mm A")}
                </Table.Cell>
                <Table.Cell>Dr. {appointment.doctor}</Table.Cell>
                <Table.Cell>
                  <Badge
                    className={`${appointment.status === "Pending"
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
                  <Icon
                    icon="material-symbols:info-outline"
                    className="cursor-pointer text-xl"
                    onClick={() => openModal(appointment)}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center">
                No telemedicine appointments found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {/* Modal for showing detailed appointment information */}
      {selectedAppointment && (
        <Modal show={true} onClose={closeModal}>
          <Modal.Header>Appointment Details</Modal.Header>
          <Modal.Body>
            <p>
              <strong>Doctor:</strong> Dr. {selectedAppointment.doctor}
            </p>
            <p>
              <strong>Date:</strong> {moment(selectedAppointment.date).format("MMM DD, YYYY h:mm A")}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Doctor's Notes:</strong> {selectedAppointment.notes || "No notes available."}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default AppointmentHistory;
