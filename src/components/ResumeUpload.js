import React, { useState } from 'react';
import resumeService from '../services/resumeService';

function ResumeUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [candidateProfile, setCandidateProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDebugVisible, setIsDebugVisible] = useState(false); // State to toggle debug view

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setCandidateProfile(null);
        setError(null);
        setIsDebugVisible(false); // Hide debug on new file
    };

    const handleUpload = async () => {
        if (selectedFile) {
            setIsLoading(true);
            setError(null);
            try {
                const response = await resumeService.uploadResume(selectedFile);
                setCandidateProfile(response.data);
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

    const toggleDebug = () => {
        setIsDebugVisible(!isDebugVisible);
    };

    return (
        <div>
            <h2>Upload Resume</h2>
            <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
            <button onClick={handleUpload} disabled={!selectedFile || isLoading}>
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {candidateProfile && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <h3>Extracted Candidate Profile:</h3>
                    <div>
                        <strong>Name:</strong> {candidateProfile.name || 'N/A'}
                    </div>
                    <div>
                        <strong>Email:</strong> {candidateProfile.email || 'N/A'}
                    </div>
                    <div>
                        <strong>Phone:</strong> {candidateProfile.phone || 'N/A'}
                    </div>
                    {candidateProfile.skills && (
                        <div>
                            <strong>Skills:</strong> {candidateProfile.skills}
                        </div>
                    )}

                    {candidateProfile.workExperiences && candidateProfile.workExperiences.length > 0 && (
                        <div style={{ marginTop: '15px' }}>
                            <h4>Work Experience:</h4>
                            {candidateProfile.workExperiences.map((exp, index) => (
                                <div key={index} style={{ marginBottom: '10px', paddingLeft: '15px', borderLeft: '2px solid #eee' }}>
                                    <strong>{exp.jobTitle}</strong> at {exp.company}
                                    <br />
                                    <small>
                                        {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                                    </small>
                                    <p style={{ margin: '5px 0' }}>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {candidateProfile.educations && candidateProfile.educations.length > 0 && (
                        <div style={{ marginTop: '15px' }}>
                            <h4>Education:</h4>
                            {candidateProfile.educations.map((edu, index) => (
                                <div key={index} style={{ marginBottom: '10px', paddingLeft: '15px', borderLeft: '2px solid #eee' }}>
                                    <strong>{edu.degree}</strong>
                                    <br />
                                    {edu.institution}
                                    <br />
                                    <small>Graduated: {new Date(edu.graduationDate).toLocaleDateString()}</small>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Debug Section */}
                    {candidateProfile.rawText && (
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={toggleDebug}>
                                {isDebugVisible ? 'Hide' : 'Show'} Raw Text
                            </button>
                            {isDebugVisible && (
                                <details open style={{ marginTop: '10px' }}>
                                    <summary>Debug: Raw Extracted Text</summary>
                                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
                                        {candidateProfile.rawText}
                                    </pre>
                                </details>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ResumeUpload;
