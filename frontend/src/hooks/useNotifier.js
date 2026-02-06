import { useEffect, useState } from "react";

const useNotifier = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setNotification(null);
    }, 3200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [notification]);

  const clearNotification = () => setNotification(null);
  const showSuccess = (message) => setNotification({ type: "success", message });
  const showError = (message) => setNotification({ type: "error", message });

  return {
    notification,
    clearNotification,
    showSuccess,
    showError,
  };
};

export default useNotifier;
