import "./Notification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";

const typeStyles = {
  success: {
    backgroundColor: "#edfbef",
    color: "#3c8843",
  },
  error: {
    backgroundColor: "#fdf5f4",
    color: "#c84733",
  },
  warning: {
    backgroundColor: "#fdfade",
    color: "#c68a30",
  },
  info: {
    backgroundColor: "#eaf4fe",
    color: "#3f65af",
  },
};

function Notification({ id, type = "info", title, content, onClose }) {
  const { backgroundColor, color } = typeStyles[type] || typeStyles.info;
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setVisible(true);

    timeoutRef.current = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [id]);

  const handleClose = () => {
    setVisible(false);
    clearTimeout(timeoutRef.current);
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  return (
    <div className={`component-notification ${visible ? "show" : "hide"}`} style={{ backgroundColor }}>
      <span className="bar" style={{ backgroundColor: color }}></span>
      <div className="text">
        <p className="title" style={{ color }}>
          {title}
        </p>
        <p className="content" style={{ color }}>
          {content}
        </p>
      </div>
      <div>
        <FontAwesomeIcon icon={faXmark} className="close" style={{ color, cursor: "pointer" }} onClick={handleClose} />
      </div>
    </div>
  );
}

export default Notification;
