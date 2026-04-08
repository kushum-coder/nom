// src/components/InputField.jsx
const InputField = ({ type, placeholder, value, onChange, onKeyPress }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      style={{
        width: "96%",
        maxWidth: "100%",
        padding: "14px 14px",
        marginBottom: "14px",
        border: "1px solid #e2e7ef",
        borderRadius: "10px",
        outline: "none",
        backgroundColor: "#ffffff",
        color: "#222b46",
        fontSize: "0.96rem",
        boxShadow: "inset 0 1px 3px rgba(25,37,56,0.09)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#ff4900";
        e.target.style.boxShadow = "0 0 0 5px rgba(255,73,0,0.15)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e2e7ef";
        e.target.style.boxShadow = "inset 0 1px 3px rgba(25,37,56,0.09)";
      }}
    />
  );
};

export default InputField;