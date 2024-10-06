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
          url: "/appointments",
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
          name: "Teleconsultations",
          icon: "solar:call-outline",
          id: uniqueId(),
          url: "/teleconsultations",
        },
        {
          name: "Health Tips",
          icon: "solar:health-square-outline",
          id: uniqueId(),
          url: "/health-tips",
        },
        {
          name: "Profile Settings",
          icon: "solar:settings-outline",
          id: uniqueId(),
          url: "/profile",
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
          url: "/transactions",
          children: [
            {
              name: "Payment History",
              id: uniqueId(),
              url: "/transactions/history",
            },
            {
              name: "Payment Methods",
              id: uniqueId(),
              url: "/transactions/methods",
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
          url: "/support/help-center",
        },
        {
          name: "Submit a Ticket",
          icon: "solar:message-outline",
          id: uniqueId(),
          url: "/support/ticket",
        },
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
          url: "/teleconsultations",
          children: [
            {
              name: "Upcoming Consultations",
              id: uniqueId(),
              url: "/teleconsultations/upcoming",
            },
            {
              name: "Consultation History",
              id: uniqueId(),
              url: "/teleconsultations/history",
            },
          ],
        },
        {
          name: "Patient Feedback",
          icon: "solar:feedback-outline",
          id: uniqueId(),
          url: "/feedback",
        },
      ],
    },
    {
      heading: "APPOINTMENTS",
      children: [
        {
          name: "Manage Teleconsultations",
          icon: "solar:call-outline",
          id: uniqueId(),
          url: "/manage-teleconsultations",
        },
      ],
    },
    {
      heading: "PAYMENTS",
      children: [
        {
          name: "Consultation Fees",
          icon: "solar:wallet-outline",
          id: uniqueId(),
          url: "/consultation-fees",
        },
        {
          name: "Payment History",
          icon: "solar:transaction-outline",
          id: uniqueId(),
          url: "/payment-history",
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
          url: "/profile",
        },
        {
          name: "Availability",
          icon: "solar:clock-outline",
          id: uniqueId(),
          url: "/availability",
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
        },
        {
          name: "Staff Management",
          icon: "solar:users-outline",
          id: uniqueId(),
          url: "/staff-management",
        },
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

  PHARMACY: [
    {
      heading: "PRESCRIPTIONS",
      children: [
        {
          name: "Prescription Requests",
          icon: "solar:prescription-outline",
          id: uniqueId(),
          url: "/prescriptions",
        },
        {
          name: "Processed Prescriptions",
          icon: "solar:check-circle-outline",
          id: uniqueId(),
          url: "/prescriptions/processed",
        },
      ],
    },
    {
      heading: "MANAGEMENT",
      children: [
        {
          name: "Manage Inventory",
          icon: "solar:boxes-outline",
          id: uniqueId(),
          url: "/inventory-management",
        },
        {
          name: "Supplier Management",
          icon: "solar:truck-outline",
          id: uniqueId(),
          url: "/supplier-management",
        },
        {
          name: "Order History",
          icon: "solar:history-outline",
          id: uniqueId(),
          url: "/order-history",
        },
      ],
    },
    {
      heading: "PAYMENTS",
      children: [
        {
          name: "Pharmacy Payments",
          icon: "solar:wallet-outline",
          id: uniqueId(),
          url: "/pharmacy-payments",
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
              url: "/user-management/view-all",
            },
            {
              name: "Add New User",
              id: uniqueId(),
              url: "/user-management/add-user",
            },
            {
              name: "User Permissions",
              id: uniqueId(),
              url: "/user-management/permissions",
            },
          ],
        },
        {
          name: "Facility Management",
          icon: "solar:buildings-outline",
          id: uniqueId(),
          url: "/facility-management",
        },
        {
          name: "Teleconsultor Management",
          icon: "solar:call-outline",
          id: uniqueId(),
          url: "/teleconsultor-management",
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
          url: "/reports/financial",
        },
        {
          name: "User Activity Reports",
          icon: "solar:activity-outline",
          id: uniqueId(),
          url: "/reports/activity",
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
      ],
    },
  ],
};

export default SidebarContent;
