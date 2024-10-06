import { Metadata } from "next";
import AppointmentsAvaialable from "@/app/components/appointments/AppointmentsAvaialable";

export const metadata: Metadata = {
  title: "Appointment Table and Full information",
  description:
    "This is the appointment page where users can find full information about their appointments and so",
};

const Appointment = () => {
  return (
      <div className="flex flex-col gap-10">
        <AppointmentsAvaialable />
      </div>
  );
};

export default Appointment;
