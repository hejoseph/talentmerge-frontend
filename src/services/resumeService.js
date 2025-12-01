import api from './api';

const uploadResume = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('api/resumes/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const resumeService = {
    uploadResume,
};

export default resumeService;