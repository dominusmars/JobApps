import React, { useEffect, Dispatch } from 'react';
import './ClipboardNotification.css'; // Import your CSS file for styling

const ClipboardNotification = ({ message, setIsVisible }: {message:string, setIsVisible:Dispatch<React.SetStateAction<string | boolean>>}) => {

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000); // Hide the notification after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, setIsVisible]);

  return (
    <div className={`clipboard-notification ${message ? 'visible' : ''}`}>
      {message}
    </div>
  );
};

export default ClipboardNotification;
