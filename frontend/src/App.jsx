import React, { useState } from "react";
import PDFUpload from "./components/PDFUpload";
import Heading from "./components/header/Heading";
import Footer from "./components/footer/footer";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Function to handle dark mode toggle
  const handleToggle = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? "#ffffff" : "#212529"; // Light or dark background
    document.body.style.color = darkMode ? "#000000" : "#ffffff"; // Light or dark text
  };

  return (
    <div>
   
      {/* Passing darkMode and handleToggle to Heading */}
      <Heading darkMode={darkMode} handleToggle={handleToggle} />
      {/* PDFUpload gets darkMode for styling */}
      <PDFUpload />
      {/* Footer gets darkMode for styling */}
      <Footer darkMode={darkMode} />
  
    </div>
  );
}

export default App;
