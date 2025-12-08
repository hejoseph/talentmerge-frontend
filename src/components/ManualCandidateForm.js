import React, { useState, useEffect } from 'react';
import candidateService from '../services/candidateService';
import './ManualCandidateForm.css';

const ManualCandidateForm = ({ candidateId = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    workExperiences: [],
    educations: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);

  const isEdit = Boolean(candidateId);

  // Load candidate data for editing
  useEffect(() => {
    if (candidateId) {
      loadCandidate(candidateId);
    }
  }, [candidateId]);

  const loadCandidate = async (id) => {
    try {
      setIsLoading(true);
      const candidate = await candidateService.getCandidateById(id);
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        skills: candidate.skills || '',
        workExperiences: candidate.workExperiences || [],
        educations: candidate.educations || []
      });
    } catch (error) {
      console.error('Error loading candidate:', error);
      setErrors({ general: 'Failed to load candidate data' });
    } finally {
      setIsLoading(false);
    }
  };

  // Check email availability (debounced)
  useEffect(() => {
    if (formData.email && formData.email.includes('@') && !isEdit) {
      const timeoutId = setTimeout(async () => {
        try {
          setEmailCheckLoading(true);
          const exists = await candidateService.checkEmailExists(formData.email);
          setEmailExists(exists);
        } catch (error) {
          console.error('Error checking email:', error);
        } finally {
          setEmailCheckLoading(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.email, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          jobTitle: '',
          company: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const removeWorkExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index)
    }));
  };

  const updateWorkExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));

    // Clear work experience errors
    const errorKey = `workExperiences[${index}].${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: undefined
      }));
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          institution: '',
          degree: '',
          graduationDate: ''
        }
      ]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));

    // Clear education errors
    const errorKey = `educations[${index}].${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    } else if (emailExists && !isEdit) {
      newErrors.email = 'Email address is already in use';
    }

    // Work experience validation
    formData.workExperiences.forEach((exp, index) => {
      if (exp.jobTitle && !exp.company) {
        newErrors[`workExperiences[${index}].company`] = 'Company is required when job title is provided';
      }
      if (exp.company && !exp.jobTitle) {
        newErrors[`workExperiences[${index}].jobTitle`] = 'Job title is required when company is provided';
      }
      if (exp.startDate && exp.endDate && new Date(exp.endDate) < new Date(exp.startDate)) {
        newErrors[`workExperiences[${index}].endDate`] = 'End date must be after start date';
      }
    });

    // Education validation
    formData.educations.forEach((edu, index) => {
      if (edu.institution && !edu.degree) {
        newErrors[`educations[${index}].degree`] = 'Degree is required when institution is provided';
      }
      if (edu.degree && !edu.institution) {
        newErrors[`educations[${index}].institution`] = 'Institution is required when degree is provided';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        workExperiences: formData.workExperiences.filter(exp => 
          exp.jobTitle.trim() || exp.company.trim()
        ),
        educations: formData.educations.filter(edu => 
          edu.institution.trim() || edu.degree.trim()
        )
      };

      let result;
      if (isEdit) {
        result = await candidateService.updateCandidate(candidateId, submitData);
      } else {
        result = await candidateService.createCandidate(submitData);
      }

      console.log(`Candidate ${isEdit ? 'updated' : 'created'} successfully:`, result);
      
      if (onSuccess) {
        onSuccess(result);
      }

      // Reset form if creating new candidate
      if (!isEdit) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          skills: '',
          workExperiences: [],
          educations: []
        });
      }

    } catch (error) {
      console.error('Error saving candidate:', error);
      
      if (error.fieldErrors) {
        // Handle validation errors from backend
        setErrors(error.fieldErrors);
      } else {
        setErrors({ 
          general: error.message || `Failed to ${isEdit ? 'update' : 'create'} candidate` 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEdit) {
    return <div className="loading">Loading candidate data...</div>;
  }

  return (
    <div className="manual-candidate-form">
      <div className="form-header">
        <h2>{isEdit ? 'Edit Candidate' : 'Add New Candidate'}</h2>
        <p>Fill in the candidate information below</p>
      </div>

      {errors.general && (
        <div className="error-banner">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="candidate-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter full name"
              required
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div className="email-input-container">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter email address"
                required
              />
              {emailCheckLoading && (
                <span className="email-check-loading">Checking...</span>
              )}
              {emailExists && !isEdit && (
                <span className="email-exists-warning">Email already exists</span>
              )}
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter phone number"
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className={errors.skills ? 'error' : ''}
              placeholder="Enter skills (e.g., Java, React, Python, etc.)"
              rows="3"
            />
            {errors.skills && <span className="field-error">{errors.skills}</span>}
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="form-section">
          <div className="section-header">
            <h3>Work Experience</h3>
            <button 
              type="button" 
              onClick={addWorkExperience}
              className="add-button"
            >
              + Add Experience
            </button>
          </div>

          {formData.workExperiences.map((experience, index) => (
            <div key={index} className="dynamic-item">
              <div className="item-header">
                <h4>Experience #{index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeWorkExperience(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={experience.jobTitle}
                    onChange={(e) => updateWorkExperience(index, 'jobTitle', e.target.value)}
                    placeholder="Enter job title"
                    className={errors[`workExperiences[${index}].jobTitle`] ? 'error' : ''}
                  />
                  {errors[`workExperiences[${index}].jobTitle`] && (
                    <span className="field-error">{errors[`workExperiences[${index}].jobTitle`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    placeholder="Enter company name"
                    className={errors[`workExperiences[${index}].company`] ? 'error' : ''}
                  />
                  {errors[`workExperiences[${index}].company`] && (
                    <span className="field-error">{errors[`workExperiences[${index}].company`]}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={experience.startDate}
                    onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                    className={errors[`workExperiences[${index}].startDate`] ? 'error' : ''}
                  />
                  {errors[`workExperiences[${index}].startDate`] && (
                    <span className="field-error">{errors[`workExperiences[${index}].startDate`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>End Date (leave empty if current)</label>
                  <input
                    type="date"
                    value={experience.endDate}
                    onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                    className={errors[`workExperiences[${index}].endDate`] ? 'error' : ''}
                  />
                  {errors[`workExperiences[${index}].endDate`] && (
                    <span className="field-error">{errors[`workExperiences[${index}].endDate`]}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={experience.description}
                  onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                  placeholder="Describe your role and responsibilities"
                  rows="3"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="form-section">
          <div className="section-header">
            <h3>Education</h3>
            <button 
              type="button" 
              onClick={addEducation}
              className="add-button"
            >
              + Add Education
            </button>
          </div>

          {formData.educations.map((education, index) => (
            <div key={index} className="dynamic-item">
              <div className="item-header">
                <h4>Education #{index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeEducation(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    value={education.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="Enter institution name"
                    className={errors[`educations[${index}].institution`] ? 'error' : ''}
                  />
                  {errors[`educations[${index}].institution`] && (
                    <span className="field-error">{errors[`educations[${index}].institution`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Degree</label>
                  <input
                    type="text"
                    value={education.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Enter degree (e.g., Bachelor of Science)"
                    className={errors[`educations[${index}].degree`] ? 'error' : ''}
                  />
                  {errors[`educations[${index}].degree`] && (
                    <span className="field-error">{errors[`educations[${index}].degree`]}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Graduation Date</label>
                <input
                  type="date"
                  value={education.graduationDate}
                  onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                  className={errors[`educations[${index}].graduationDate`] ? 'error' : ''}
                />
                {errors[`educations[${index}].graduationDate`] && (
                  <span className="field-error">{errors[`educations[${index}].graduationDate`]}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || (emailExists && !isEdit)}
          >
            {isLoading ? 'Saving...' : (isEdit ? 'Update Candidate' : 'Create Candidate')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualCandidateForm;