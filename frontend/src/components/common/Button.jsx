const Button = ({ children, type = "button", onClick, disabled = false }) => {
  return (
    <button
      className="common-button"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
