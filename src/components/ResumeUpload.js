import React, { useState } from 'react';
import resumeService from '../services/resumeService';

function ResumeUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setExtractedText('');
        setError(null);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            setIsLoading(true);
            setError(null);
            try {
                const response = await resumeService.uploadResume(selectedFile);
                setExtractedText(response.data.text);
            } catch (err) {
                setError('Error uploading file. Please try again.');
                console.error('Upload error:', err);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please select a file first!');
        }
    };

    return (
        <div>
            <h2>Upload Resume</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!selectedFile || isLoading}>
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {extractedText && (
                <div>
                    <h3>Extracted Text:</h3>
                    <pre>{extractedText}</pre>
                </div>
            )}
        </div>
    );
}

export default ResumeUpload;