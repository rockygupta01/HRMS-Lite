const NotificationBanner = ({ notification, onClose }) => {
  if (!notification) {
    return null;
  }

  return (
    <div className={`toast toast-${notification.type}`} role="status" aria-live="polite">
      <span>{notification.message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">
        Close
      </button>
    </div>
  );
};

export default NotificationBanner;
