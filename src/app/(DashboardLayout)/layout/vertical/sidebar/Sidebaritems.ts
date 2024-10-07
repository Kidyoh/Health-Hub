import { uniqueId } from "lodash";

export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

const SidebarContent = {
  USER: [
    {
      heading: "HOME",
      children: [
        {
          name: "Dashboard",
          icon: "solar:widget-add-line-duotone",
          id: uniqueId(),
          url: "/",
        },
        {
          name: "My Appointments",
          icon: "solar:calendar-date-outline",
          id: uniqueId(),
          url: "/user/appointments",
          children: [
            {
              name: "Upcoming Appointments",
              id: uniqueId(),
              url: "/user/appointments/upcoming",
            },
            {
              name: "Appointment History",
              id: uniqueId(),
              url: "/user/appointments/history",
            },
          ],
        },
        {
          name: "Teleconsultations",
          icon: "carbon:ibm-telehealth",
          id: uniqueId(),
          url: "/user/teleconsultations",
        },
        {
          name: "Health Tips",
          icon: "solar:health-outline",
          id: uniqueId(),
          url: "/user/health-tips",
        },
        {
          name: "My Prescriptions",
          icon: "healthicons:medicines-outline",
          id: uniqueId(),
          url: "/user/prescriptions",
        },
        {
          name: "Symptopms Checker",
          icon: "healthicons:symptom-outline",
          id: uniqueId(),
          url: "/user/symptoms-checker",
        },
        {
          name: "Profile Settings",
          icon: "solar:settings-outline",
          id: uniqueId(),
          url: "/user/profile",
        },
      ],
    },
    {
      heading: "PAYMENTS",
      children: [
        {
          name: "My Transactions",
          icon: "solar:wallet-outline",
          id: uniqueId(),
          url: "/user/transactions",
          children: [
            {
              name: "Payment History",
              id: uniqueId(),
              url: "/user/transactions/history",
            },
            {
              name: "Payment Methods",
              id: uniqueId(),
              url: "/user/transactions/methods",
            },
          ],
        },
      ],
    },
    {
      heading: "SUPPORT",
      children: [
        {
          name: "Help Center",
          icon: "solar:help-outline",
          id: uniqueId(),
          url: "/user/support/help-center",
        },
        {
          name: "Submit a Ticket",
          icon: "solar:message-outline",
          id: uniqueId(),
          url: "/user/support/ticket",
        },
        // {
        //   name: "Live Chat",
        //   icon: "solar:chat-outline",
        //   id: uniqueId(),
        //   url: "/user/support/live-chat",
        // },
      ],
    },
  ],


  TELECONSULTER: [
    {
      heading: "DASHBOARD",
      children: [
        {
          name: "Teleconsultation Schedule",
          icon: "solar:call-outline",
          id: uniqueId(),
          url: "/teleconsultor/teleconsultations",
          children: [
            {
              name: "Upcoming Consultations",
              id: uniqueId(),
              url: "/teleconsultor/teleconsultations/upcoming",
            },
            {
              name: "Consultation History",
              id: uniqueId(),
              url: "/teleconsultor/teleconsultations/history",
            },
          ],
        },
        {
          name: "Patient Feedback",
          icon: "solar:feedback-outline",
          id: uniqueId(),
          url: "/teleconsultor/feedback",
        },
      ],
    },
    {
      heading: "SETTINGS",
      children: [
        {
          name: "Profile Settings",
          icon: "solar:settings-outline",
          id: uniqueId(),
          url: "/teleconsultor/settings/profile",
        },
        {
          name: "Availability",
          icon: "solar:clock-outline",
          id: uniqueId(),
          url: "/teleconsultor/settings/availability",
        },
      ],
    },
    {
      heading: "PAYMENTS",
      children: [
        // {
        //   name: "Consultation Fees",
        //   icon: "solar:wallet-outline",
        //   id: uniqueId(),
        //   url: "/teleconsultor/payments/consultation-fees",
        // },
        {
          name: "Payment History",
          icon: "solar:wallet-outline",
          id: uniqueId(),
          url: "/teleconsultor/payments/history",
        },
        {
          name: "Payment Methods",
          id: uniqueId(),
          url: "/teleconsultor/payments/methods",
        },
      ],
    },
  ],


  HEALTHCARE_FACILITY: [
    {
      heading: "FACILITY MANAGEMENT",
      children: [
        {
          name: "Facility Overview",
          icon: "solar:buildings-outline",
          id: uniqueId(),
          url: "/facility-overview",
        },
        {
          name: "Manage Appointments",
          icon: "solar:calendar-date-outline",
          id: uniqueId(),
          url: "/manage-appointments",
          children: [
            {
              name: "Upcoming Appointments",
              id: uniqueId(),
              url: "/appointments/upcoming",
            },
            {
              name: "Appointment History",
              id: uniqueId(),
              url: "/appointments/history",
            },
          ],
        },
        {
          name: "Services Management",
          icon: "solar:services-outline",
          id: uniqueId(),
          url: "/services-management",
        }
      ],
    },
    {
      heading: "PAYMENTS",
      children: [
        {
          name: "Facility Payments",
          icon: "solar:wallet-outline",
          id: uniqueId(),
          url: "/facility-payments",
        },
        {
          name: "Billing & Invoices",
          icon: "solar:file-invoice-outline",
          id: uniqueId(),
          url: "/billing-invoices",
        },
      ],
    },
  ],

  ADMIN: [
    {
      heading: "ADMINISTRATION",
      children: [
        {
          name: "User Management",
          icon: "solar:users-outline",
          id: uniqueId(),
          url: "/user-management",
          children: [
            {
              name: "View All Users",
              id: uniqueId(),
              url: "/admin/user/viewall",
            },
            {
              name: "Add New User",
              id: uniqueId(),
              url: "/admin/user/adduser",
            },
          ],
        },
        {
          name: "Facility Management",
          icon: "solar:buildings-outline",
          id: uniqueId(),
          url: "/admin/facilities",
        },
        {
          name: "Teleconsultor Management",
          icon: "solar:call-outline",
          id: uniqueId(),
          url: "/admin/teleconsultors",
        },
      ],
    },
    {
      heading: "REPORTS",
      children: [
        {
          name: "Financial Reports",
          icon: "solar:report-outline",
          id: uniqueId(),
          url: "/admin/reports/financial",
        },
        // {
        //   name: "User Activity Reports",
        //   icon: "solar:activity-outline",
        //   id: uniqueId(),
        //   url: "/admin/reports/activity",
        // },
        // {
        //   name: "Consultation Reports",
        //   icon: "solar:report-outline",
        //   id: uniqueId(),
        //   url: "/admin/reports/consultations",
        // },
        {
          name: "System Logs",
          icon: "solar:logs-outline",
          id: uniqueId(),
          url: "/system-logs",
        },
      ],
    },
    {
      heading: "TRANSACTIONS",
      children: [
        {
          name: "Transaction Overview",
          icon: "solar:transaction-outline",
          id: uniqueId(),
          url: "/transaction-overview",
        },
        {
          name: "Refund Requests",
          icon: "solar:refund-outline",
          id: uniqueId(),
          url: "/refund-requests",
        },
        {
          name: "System Invoices",
          icon: "solar:file-invoice-outline",
          id: uniqueId(),
          url: "/system-invoices",
        },
      ],
    },
    {
      heading: "SUPPORT",
      children: [
        {
          name: "Admin Support",
          icon: "solar:help-outline",
          id: uniqueId(),
          url: "/admin/support/ticket",
        },
        {
          name: "Issue Tracker",
          icon: "solar:issue-outline",
          id: uniqueId(),
          url: "/issue-tracker",
        },
      ],
    },
  ],
};


export default SidebarContent;

