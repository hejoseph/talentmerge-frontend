import React, { useState } from 'react';
import resumeService from '../services/resumeService';
import './ResumeUpload.css';


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
        <div className="resume-uploader">
          <h2>Upload Resume</h2>

          <div className="file-upload">
            <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
            <button onClick={handleUpload} disabled={!selectedFile || isLoading}>
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {selectedFile && <p className="selected-file">Selected file: {selectedFile.name}</p>}
          {error && <p className="error-message">{error}</p>}

          {candidateProfile && (
            <div className="profile-card">
              <h3>Extracted Candidate Profile:</h3>

              <div className="profile-section">
                <div><strong>Name:</strong> {candidateProfile.name || 'N/A'}</div>
                <div><strong>Email:</strong> {candidateProfile.email || 'N/A'}</div>
                <div><strong>Phone:</strong> {candidateProfile.phone || 'N/A'}</div>
                {candidateProfile.skills && <div><strong>Skills:</strong> {candidateProfile.skills}</div>}
              </div>

              {candidateProfile.workExperiences?.length > 0 && (
                <div className="profile-section">
                  <h4>Work Experience:</h4>
                  {candidateProfile.workExperiences.map((exp, idx) => (
                    <div key={idx} className="experience-item">
                      <strong>{exp.jobTitle}</strong> at {exp.company}
                      <br />
                      <small>{new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}</small>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {candidateProfile.educations?.length > 0 && (
                <div className="profile-section">
                  <h4>Education:</h4>
                  {candidateProfile.educations.map((edu, idx) => (
                    <div key={idx} className="education-item">
                      <strong>{edu.degree}</strong>
                      <br />
                      {edu.institution}
                      <br />
                      <small>Graduated: {new Date(edu.graduationDate).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}

              {candidateProfile.rawText && (
                <div className="raw-text-container">
                  <button onClick={toggleDebug}>{isDebugVisible ? 'Hide' : 'Show'} Raw Text</button>
                  {isDebugVisible && (
                    <pre>{candidateProfile.rawText}</pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
    );
}

export default ResumeUpload;
