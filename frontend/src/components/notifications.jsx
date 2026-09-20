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
      if (!notification.is_read) {
        const response = await fetch(
          `${API_URL}/read_notification/${notification.id}`,
          {
            method: "PATCH",
            credentials: "include",
          },
        );

        if (response.ok) {
          setNotifications((prev) =>
            prev.map((item) =>
              item.id === notification.id ? { ...item, is_read: true } : item,
            ),
          );

          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    setActiveComponent("Appointments");
    setShowNotifications(false);
  }

  async function handleDeleteNotification(e, notificationId) {
    e.stopPropagation();

    try {
      const response = await fetch(
        `${API_URL}/delete_notification/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        const deletedNotification = notifications.find(
          (notification) => notification.id === notificationId,
        );

        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId),
        );

        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  async function handleDeleteAll() {
    try {
      const response = await fetch(`${API_URL}/delete_all_notifications`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
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

          {notifications.length > 0 && (
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button onClick={handleReadAll}>Mark all as read</button>
              )}

              <button onClick={handleDeleteAll}>Delete all</button>
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

                  <button
                    className="notification-delete"
                    onClick={(e) =>
                      handleDeleteNotification(e, notification.id)
                    }
                  >
                    Delete
                  </button>
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
