// src/components/Button.jsx
const Button = ({ text, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: "14px",
      marginTop: "12px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#ff5200",
      color: "#ffffff",
      fontWeight: 700,
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(255,82,0,0.25)",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#ff7130";
      e.target.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "#ff5200";
      e.target.style.transform = "translateY(0)";
    }}
  >
    {text}
  </button>
);

export default Button;