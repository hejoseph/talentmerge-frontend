import React, { useState, useEffect } from 'react';
import candidateService from '../services/candidateService';
import './CandidateList.css';

const CandidateList = ({ onEditCandidate, onViewCandidate }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDir: 'desc',
    totalElements: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalCandidates: 0 });

  useEffect(() => {
    loadCandidates();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.size, pagination.sortBy, pagination.sortDir]);

  useEffect(() => {
    // Debounced search
    const timeoutId = setTimeout(() => {
      if (pagination.page === 0) {
        loadCandidates();
      } else {
        setPagination(prev => ({ ...prev, page: 0 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await candidateService.getAllCandidates(
        pagination.page,
        pagination.size,
        pagination.sortBy,
        pagination.sortDir,
        searchTerm
      );
      
      setCandidates(response.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await candidateService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSort = (field) => {
    const newSortDir = pagination.sortBy === field && pagination.sortDir === 'asc' ? 'desc' : 'asc';
    setPagination(prev => ({
      ...prev,
      sortBy: field,
      sortDir: newSortDir,
      page: 0
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({
      ...prev,
      size: parseInt(newSize),
      page: 0
    }));
  };

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (!window.confirm(`Are you sure you want to delete ${candidateName}?`)) {
      return;
    }

    try {
      await candidateService.deleteCandidate(candidateId);
      
      // Refresh the list
      await loadCandidates();
      await loadStats();
      
      // Show success message
      alert('Candidate deleted successfully');
    } catch (err) {
      console.error('Error deleting candidate:', err);
      alert('Failed to delete candidate. Please try again.');
    }
  };


  const getSortIcon = (field) => {
    if (pagination.sortBy !== field) return '↕️';
    return pagination.sortDir === 'asc' ? '↑' : '↓';
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${pagination.page === i ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(0)}
          disabled={pagination.page === 0}
          className="pagination-button"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 0}
          className="pagination-button"
        >
          Previous
        </button>
        
        {pages}
        
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages - 1}
          className="pagination-button"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(pagination.totalPages - 1)}
          disabled={pagination.page >= pagination.totalPages - 1}
          className="pagination-button"
        >
          Last
        </button>
      </div>
    );
  };

  if (loading && candidates.length === 0) {
    return <div className="loading">Loading candidates...</div>;
  }

  return (
    <div className="candidate-list">
      {/* Header */}
      <div className="list-header">
        <div className="header-info">
          <h2>Candidates</h2>
          <p className="stats">Total: {stats.totalCandidates} candidates</p>
        </div>
        
        {/* Search and Controls */}
        <div className="list-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="page-size-container">
            <label>Show:</label>
            <select
              value={pagination.size}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="page-size-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={loadCandidates} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Candidates Table */}
      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {getSortIcon('email')}
              </th>
              <th>Phone</th>
              <th>Skills</th>
              <th>Experience</th>
              <th>Education</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {searchTerm ? 'No candidates found matching your search.' : 'No candidates available.'}
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="candidate-name">
                    <strong>{candidate.name}</strong>
                  </td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone || 'N/A'}</td>
                  <td className="skills-cell">
                    {candidate.skills ? (
                      <span className="skills-preview" title={candidate.skills}>
                        {candidate.skills.length > 50 
                          ? candidate.skills.substring(0, 50) + '...' 
                          : candidate.skills
                        }
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td>
                    {candidate.workExperiences?.length > 0 ? (
                      <span className="experience-count">
                        {candidate.workExperiences.length} position{candidate.workExperiences.length > 1 ? 's' : ''}
                      </span>
                    ) : 'None'}
                  </td>
                  <td>
                    {candidate.educations?.length > 0 ? (
                      <span className="education-count">
                        {candidate.educations.length} degree{candidate.educations.length > 1 ? 's' : ''}
                      </span>
                    ) : 'None'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {onViewCandidate && (
                        <button
                          onClick={() => onViewCandidate(candidate)}
                          className="action-button view-button"
                          title="View Details"
                        >
                          👁️
                        </button>
                      )}
                      {onEditCandidate && (
                        <button
                          onClick={() => onEditCandidate(candidate.id)}
                          className="action-button edit-button"
                          title="Edit Candidate"
                        >
                          ✏️
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCandidate(candidate.id, candidate.name)}
                        className="action-button delete-button"
                        title="Delete Candidate"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          {renderPagination()}
          <div className="pagination-info">
            Showing {pagination.page * pagination.size + 1} to{' '}
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
            {pagination.totalElements} candidates
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default CandidateList;