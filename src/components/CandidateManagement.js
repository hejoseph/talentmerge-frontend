import React, { useState } from 'react';
import ManualCandidateForm from './ManualCandidateForm';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';
import './CandidateManagement.css';

const CandidateManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit', 'view'
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleShowAddForm = () => {
    setCurrentView('add');
    setSelectedCandidateId(null);
  };

  const handleEditCandidate = (candidateId) => {
    setCurrentView('edit');
    setSelectedCandidateId(candidateId);
  };

  const handleViewCandidate = (candidate) => {
    setCurrentView('view');
    setSelectedCandidate(candidate);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCandidateId(null);
    setSelectedCandidate(null);
  };

  const handleFormSuccess = (savedCandidate) => {
    // Show success message
    const action = currentView === 'edit' ? 'updated' : 'created';
    alert(`Candidate ${action} successfully!`);
    
    // Return to list
    handleBackToList();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'add':
        return (
          <ManualCandidateForm
            onSuccess={handleFormSuccess}
            onCancel={handleBackToList}
          />
        );
      
      case 'edit':
        return (
          <ManualCandidateForm
            candidateId={selectedCandidateId}
            onSuccess={handleFormSuccess}
            onCancel={handleBackToList}
          />
        );
      
      case 'view':
        return (
          <CandidateDetail
            candidate={selectedCandidate}
            onEdit={() => handleEditCandidate(selectedCandidate.id)}
            onBack={handleBackToList}
          />
        );
      
      case 'list':
      default:
        return (
          <CandidateList
            onEditCandidate={handleEditCandidate}
            onViewCandidate={handleViewCandidate}
          />
        );
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'add':
        return 'Add New Candidate';
      case 'edit':
        return 'Edit Candidate';
      case 'view':
        return 'Candidate Details';
      case 'list':
      default:
        return 'Candidate Management';
    }
  };

  const showBackButton = currentView !== 'list';
  const showAddButton = currentView === 'list';

  return (
    <div className="candidate-management">
      {/* Navigation Header */}
      <div className="management-header">
        <div className="header-left">
          {showBackButton && (
            <button onClick={handleBackToList} className="back-button">
              ← Back to List
            </button>
          )}
          <h1 className="page-title">{getPageTitle()}</h1>
        </div>
        
        <div className="header-right">
          {showAddButton && (
            <button onClick={handleShowAddForm} className="add-candidate-button">
              + Add New Candidate
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="management-content">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default CandidateManagement;