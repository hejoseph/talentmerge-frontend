import React, { useState } from 'react';

function ResumeUpload() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        // This logic will be implemented in the next step (Manage Component State)
        if (selectedFile) {
            console.log('Uploading file:', selectedFile.name);
            // Call resumeService.uploadResume(selectedFile) here later
        } else {
            alert('Please select a file first!');
        }
    };

    return (
        <div>
            <h2>Upload Resume</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!selectedFile}>
                Upload
            </button>
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </div>
    );
}

export default ResumeUpload;