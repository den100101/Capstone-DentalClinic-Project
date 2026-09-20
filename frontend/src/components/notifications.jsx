import { useEffect, useState } from "react";
import "../styles/notifications.css";

function Notifications({ API_URL, setActiveComponent }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  async function fetchNotifications() {
    try {
      const response = await fetch(`${API_URL}/get_notifications`, {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function handleNotificationClick(notification) {
    try {
      await fetch(`${API_URL}/read_notification/${notification.id}`, {
        method: "PATCH",
        credentials: "include",
      });

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item,
        ),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    setActiveComponent("Appointments");
    setShowNotifications(false);
  }

  async function handleReadAll() {
    try {
      const response = await fetch(`${API_URL}/read_all_notifications`, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            is_read: true,
          })),
        );

        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }

  return (
    <div className="notification-container">
      <button
        className="notification-button"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <img
          src="/Images/notify.png"
          alt="notification-icon"
          className="notify-icon"
        />

        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h2>Notifications</h2>

            <span>{notifications.length} total</span>
          </div>

          {unreadCount > 0 && (
            <div className="notification-read-all">
              <button onClick={handleReadAll}>Mark all as read</button>
            </div>
          )}

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={
                    notification.is_read
                      ? "notification-item read"
                      : "notification-item"
                  }
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.is_read && (
                    <div className="notification-dot"></div>
                  )}

                  <div className="notification-content">
                    <h3>New Appointment Request</h3>

                    <p>{notification.message}</p>

                    <span>
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button
                onClick={() => {
                  setActiveComponent("Appointments");
                  setShowNotifications(false);
                }}
              >
                View All Appointments
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
