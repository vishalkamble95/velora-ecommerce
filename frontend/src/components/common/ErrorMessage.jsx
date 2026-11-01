import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="common-error-message" role="alert">
      <AlertCircle size={19} className="error-icon" />

      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
