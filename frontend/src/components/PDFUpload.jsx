import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Spinner, Alert, Modal } from "react-bootstrap";

const PDFUpload = () => {
    const [file, setFile] = useState(null);
    const [charLimit, setCharLimit] = useState(200);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false); // 🆕 Controls Modal Visibility
    const [copyText, setCopyText] = useState("Copy");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        console.log("✅ Selected File:", e.target.files[0]);
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

        console.log("📤 Uploading File with Char Limit:", charLimit);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("✅ API Response:", response.data);
            setSummary(response.data.summary);
            setShowModal(true); // 🆕 Show the modal after success
            setError("");
        } catch (err) {
            console.log("❌ Upload Failed:", err.response ? err.response.data : err.message);
            setError("Upload failed. Try again.");
        }

        setLoading(false);
    };

     const handleCopy = () => {
        navigator.clipboard.writeText(summary); // Copy text to clipboard
        setCopyText("Copied!"); // Change button text 
    };

    return (
        <Container className="mt-5 text-center">
            <h2>Upload PDF for Summarization</h2>
            
            <Form.Group className="mt-3">
                <Form.Label>Choose a PDF File:</Form.Label>
                <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
            </Form.Group>

            <Form.Group className="mt-3">
                <Form.Label>Character Limit:</Form.Label>
                <Form.Control
                    type="number"
                    min="50"
                    max="1000"
                    value={charLimit}
                    onChange={(e) => setCharLimit(e.target.value)}
                />
            </Form.Group>

            <Button onClick={handleUpload} className="mt-3" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Generate Summary"}
            </Button>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            {/* 🆕 Modal for displaying summary */}
            <Modal  show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Summarized Text</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "600px", overflowY: "auto", fontSize: "1.2rem" }}>
                    <p>{summary}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button  variant="secondary" onClick={handleCopy}>{copyText}</Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PDFUpload;
