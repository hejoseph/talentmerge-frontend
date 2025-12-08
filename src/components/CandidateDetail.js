import React from 'react';
import './CandidateDetail.css';

const CandidateDetail = ({ candidate, onEdit, onBack }) => {
  if (!candidate) {
    return (
      <div className="candidate-detail">
        <div className="error-message">
          Candidate data not found.
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    
    if (diffYears > 0) {
      const remainingMonths = diffMonths % 12;
      if (remainingMonths > 0) {
        return `${diffYears} year${diffYears > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
      } else {
        return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
      }
    } else if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
      return 'Less than a month';
    }
  };

  return (
    <div className="candidate-detail">
      <div className="detail-container">
        
        {/* Basic Information Card */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Basic Information</h2>
            {onEdit && (
              <button onClick={onEdit} className="edit-button">
                ✏️ Edit
              </button>
            )}
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <span className="info-value">{candidate.name}</span>
            </div>
            
            <div className="info-item">
              <label>Email</label>
              <span className="info-value">
                <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
              </span>
            </div>
            
            <div className="info-item">
              <label>Phone</label>
              <span className="info-value">
                {candidate.phone ? (
                  <a href={`tel:${candidate.phone}`}>{candidate.phone}</a>
                ) : (
                  'Not provided'
                )}
              </span>
            </div>
            
            <div className="info-item full-width">
              <label>Skills</label>
              <div className="skills-container">
                {candidate.skills ? (
                  candidate.skills.split(',').map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <span className="no-data">No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Work Experience Card */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Work Experience</h2>
            <span className="item-count">
              {candidate.workExperiences?.length || 0} position{(candidate.workExperiences?.length || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          
          {candidate.workExperiences && candidate.workExperiences.length > 0 ? (
            <div className="experience-list">
              {candidate.workExperiences.map((experience, index) => (
                <div key={experience.id || index} className="experience-item">
                  <div className="experience-header">
                    <h3>{experience.jobTitle}</h3>
                    <div className="experience-meta">
                      <span className="company">{experience.company}</span>
                      <span className="duration">
                        {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                      </span>
                      {experience.startDate && (
                        <span className="duration-calc">
                          ({calculateDuration(experience.startDate, experience.endDate)})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {experience.description && (
                    <div className="experience-description">
                      <p>{experience.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              No work experience information available.
            </div>
          )}
        </div>

        {/* Education Card */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Education</h2>
            <span className="item-count">
              {candidate.educations?.length || 0} degree{(candidate.educations?.length || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          
          {candidate.educations && candidate.educations.length > 0 ? (
            <div className="education-list">
              {candidate.educations.map((education, index) => (
                <div key={education.id || index} className="education-item">
                  <div className="education-header">
                    <h3>{education.degree}</h3>
                    <div className="education-meta">
                      <span className="institution">{education.institution}</span>
                      <span className="graduation">
                        Graduated: {formatDate(education.graduationDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              No education information available.
            </div>
          )}
        </div>

        {/* Additional Information Card */}
        <div className="detail-card">
          <div className="card-header">
            <h2>Additional Information</h2>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Candidate ID</label>
              <span className="info-value">{candidate.id}</span>
            </div>
            
            <div className="info-item">
              <label>Data Source</label>
              <span className="info-value">
                {candidate.originalFilePath ? (
                  <span className="source-resume">Resume Upload</span>
                ) : (
                  <span className="source-manual">Manual Entry</span>
                )}
              </span>
            </div>
            
            {candidate.originalFilePath && (
              <div className="info-item full-width">
                <label>Original File</label>
                <span className="info-value file-path">
                  {candidate.originalFilePath.split('/').pop() || candidate.originalFilePath}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateDetail;