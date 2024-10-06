import { Badge, Dropdown } from "flowbite-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

// Define the structure of a notification based on your API response
interface NotificationItem {
  id: number;
  content: string; // Assuming the API returns 'content' as the message
  date: string; // Date the notification was created
  type: string; // 'order', 'message', etc. (optional based on your schema)
  userId: number; // Assuming notifications have userId
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications"); // Assuming your API endpoint is /api/notifications
        const data = await response.json();

        // Handle response data based on success flag
        if (data.success) {
          setNotifications(data.notifications);
        } else {
          setNotifications([]); // Set empty array if no notifications found
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative group/menu">
      <Dropdown label="" className="rounded-sm w-44 notification" dismissOnClick={false} renderTrigger={() => (
        <span
          className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer relative"
          aria-label="Notifications"
        >
          <Icon icon="solar:bell-linear" height={20} />
          {notifications.length > 0 && (
            <Badge className="h-2 w-2 rounded-full absolute end-2 top-1 bg-primary p-0" />
          )}
        </span>
      )}>
        {loading ? (
          <Dropdown.Item className="px-3 py-3 text-center">
            Loading...
          </Dropdown.Item>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Dropdown.Item
              key={notification.id}
              as={Link}
              href="#"
              className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark hover:bg-gray-100"
            >
              <div className="flex items-center gap-5">
                <Image
                  src={`/images/profile/user-${notification.userId}.jpg`} // Assuming images are linked to userId
                  alt={`Notification for user ${notification.userId}`}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <p className="text-black text-sm font-semibold">
                  {notification.content} <br />
                  <span className="text-xs text-gray-500">{new Date(notification.date).toLocaleString()}</span>
                </p>
              </div>
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item className="px-3 py-3 text-center">
            No notifications available
          </Dropdown.Item>
        )}
      </Dropdown>
    </div>
  );
};

export default Notification;
