
import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Spinner, Alert, Modal } from "react-bootstrap";
import "./Pdfupload.css";

const PDFUpload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("Choose a PDF File"); // For displaying selected file name
    const [charLimit, setCharLimit] = useState(200);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");
    const [error, setError] = useState(""); // Error message
    const [showModal, setShowModal] = useState(false);
    const [copyText, setCopyText] = useState("Copy");
     const [fontColor, setFontColor] = useState('#000000'); // Default color: black

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Check if a file is selected
        if (!selectedFile) {
            setError("No file selected.");
            return;
        }

        // Check if the file type is PDF
        if (selectedFile.type !== "application/pdf") {
            setError("Please upload a valid PDF file.");
            setFile(null); // Reset file state
            setFileName("Choose a PDF File"); // Reset file name
            return;
        }

        // If the file is valid
        setFile(selectedFile);
        setFileName(selectedFile.name); // Display the selected file name
        setError(""); // Clear any previous error
        console.log("✅ Selected File:", selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF file.");
            return;
        }

        setError("");
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("char_limit", charLimit);
        formData.append('font_color', fontColor);

        console.log("📤 Uploading File with Char Limit:", charLimit);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("✅ API Response:", response.data);
            setSummary(response.data.summary);
            setShowModal(true);
            setError("");
        } catch (err) {
            console.log("❌ Upload Failed:", err.response ? err.response.data : err.message);
            setError("Upload failed. Try again.");
        }

        setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        setCopyText("Copied!");
    };

     const handleFontColorChange = (e) => {
        setFontColor(e.target.value);
    };

    return (
        <div className="home_main">
            {/* Main Heading */}
            <div className="Main_heading">
                <div className="typewriter">
                    <h1>Upload. Process. Summarize. Simple!</h1>
                </div>
            </div>

            {/* Background Video */}
            <video autoPlay loop muted playsInline className="background-video">
                <source src="/assets/background_vedio_2.mp4" type="video/mp4" />
            </video>

            {/* Content */}
            <Container className="mt-5 text-center" style={{ maxWidth: "50rem", margin: "auto" }} >
                <h2 style={{ fontFamily: "monospace" }}>Upload your PDF file</h2>
                <div className="upload_cont">
                {/* Custom File Input Button */}
                {/* <br></br> */}
                <img style={{"height":"50%"}} src="/assets/file-upload.png"></img>
                <div className="mt-4">
                    <input
                        type="file"
                        accept="application/pdf"
                        id="file-input"
                        style={{ display: "none" }} // Hide the default input
                        onChange={handleFileChange}
                    />
                    <Button 
                        onClick={() => document.getElementById("file-input").click()} // Trigger file input click
                        variant="dark"
                        className="me-2"
                        size="lg"
                    >
                        
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
  <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
</svg>  Upload


                    </Button>
                    <span>{fileName}</span> {/* Display the selected file name */}
                </div>
                </div>

                {/* Character Limit Input */}
                <div className="mt-3" >
                    <label style={{"fontFamily":"monospace","fontSize":"1.3rem"}}>Enter The character Limit </label>
                    <input
                        placeholder="Input within a range of 50-1000"
                        type="number"
                        className="form-control  mx-auto mt-2"
                        min="50"
                        max="1000"
                        value={charLimit}
                        onChange={(e) => setCharLimit(e.target.value)}
                    />
                </div>

                {/* Generate Summary Button */}
                <Button variant="dark" onClick={handleUpload} className="mt-3" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Generate Summary"}
                </Button>

                {/* Error Alert */}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                {/* Summary Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Summarized Text</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: "600px", overflowY: "auto", fontSize: "1.2rem" }}>
                        <p>{summary}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCopy}>
                            {copyText}
                        </Button>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default PDFUpload;
