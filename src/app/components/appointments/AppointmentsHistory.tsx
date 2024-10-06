"use client";
import React, { useEffect, useState } from "react";
import { Badge, Table, Modal, Button } from "flowbite-react";
import SimpleBar from "simplebar-react";
import moment from "moment";
import { Icon } from "@iconify/react";

// Interface Definitions
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

interface Prescription {
  medicines: string;
  dosage: string;
}

interface Appointment {
  id: number;
  date: string;
  userId: number;
  facilityId?: number | null;
  teleconsultationId?: number | null;
  status: string;
  doctorNotes?: string | null;
  teleconsultation?: Teleconsultation | null;
  facility?: Facility | null;
  prescription?: Prescription | null;
}

const AppointmentHistory: React.FC = () => {
  const [telemedicineAppointments, setTelemedicineAppointments] = useState<Appointment[]>([]);
  const [facilityAppointments, setFacilityAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("Fetching appointment history..."); // Log before fetching
      try {
        const res = await fetch("/api/appointments/history"); // Your API endpoint
        console.log("API response received:", res); // Log the raw response
        const data = await res.json();
        console.log("Fetched appointments data:", data); // Log the full response

        if (data && data.success) {
          setTelemedicineAppointments(data.telemedicineAppointments);
          setFacilityAppointments(data.facilityAppointments);
          console.log("Set telemedicine appointments:", data.telemedicineAppointments); // Log after setting appointments
          console.log("Set facility appointments:", data.facilityAppointments); // Log after setting appointments
        } else {
          setTelemedicineAppointments([]);
          setFacilityAppointments([]);
          console.log("No appointments found in the response"); // Log if appointments not present in response
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to load appointment history.");
      } finally {
        setLoading(false);
        console.log("Finished fetching appointment history"); // Log after fetching
      }
    };

    fetchHistory();
  }, []);

  const openModal = (appointment: Appointment) => {
    console.log("Opening modal for appointment:", appointment); // Log the selected appointment
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
          ) : telemedicineAppointments.length > 0 ? (
            telemedicineAppointments.map((appointment, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {moment(appointment.date).format("MMM DD, YYYY h:mm A")}
                </Table.Cell>
                <Table.Cell>Dr. {appointment.teleconsultation?.doctor}</Table.Cell>
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
                  {/* Icon to open the modal */}
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

      <h2 className="text-xl font-bold mt-8 mb-4">Facility Appointments</h2>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Facility</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Details</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {loading ? (
            renderSkeleton() // Show skeleton if loading
          ) : facilityAppointments.length > 0 ? (
            facilityAppointments.map((appointment, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {moment(appointment.date).format("MMM DD, YYYY h:mm A")}
                </Table.Cell>
                <Table.Cell>{appointment.facility?.name}</Table.Cell>
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
                  {/* Icon to open the modal */}
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
                No facility appointments found.
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
              <strong>Doctor:</strong> Dr. {selectedAppointment.teleconsultation?.doctor}
            </p>
            <p>
              <strong>Date:</strong> {moment(selectedAppointment.date).format("MMM DD, YYYY h:mm A")}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Doctor's Notes:</strong>{" "}
              {selectedAppointment.doctorNotes || "No notes available."}
            </p>
            {selectedAppointment.prescription && (
              <>
                <h5 className="mt-4">Prescription</h5>
                <p>
                  <strong>Medicines:</strong> {selectedAppointment.prescription.medicines}
                </p>
                <p>
                  <strong>Dosage:</strong> {selectedAppointment.prescription.dosage}
                </p>
              </>
            )}
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