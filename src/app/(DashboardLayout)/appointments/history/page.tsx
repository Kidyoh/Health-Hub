import AppointmentHistory from "@/app/components/appointments/AppointmentsHistory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointment Table and Full information",
  description:
    "This is the appointment page where users can find full information about their appointments and so",
};
const AppointmentHistorys = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <AppointmentHistory/>
      </div>
    </>
  );
};

export default AppointmentHistorys;
