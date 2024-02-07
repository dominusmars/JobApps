import React, { useState } from 'react';
import { applicationRequest } from '../database/datatypes';
import "./AddJobApp.css"
type Props = {
  onClose: () => void;
  onSubmit: (application: applicationRequest) => void;
};

const AddJobApplicationModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<applicationRequest>({
    company: '',
    position: '',
    job_type: 'full time',
    description: '',
    location: '',
    url: null,
    username: null,
    password: null,
    dateExpire: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add New Job Application</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Company:</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} required />
          </div>
          <div>
            <label>Position:</label>
            <input type="text" name="position" value={formData.position} onChange={handleChange} required />
          </div>
          <div>
            <label>Job Type:</label>
            <select name="job_type" value={formData.job_type} onChange={handleChange} required>
              <option value="part time">Part Time</option>
              <option value="full time">Full Time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div>
            <label>Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div>
            <label>URL:</label>
            <input type="url" name="url" value={formData.url || ''} onChange={handleChange} required={false} />
          </div>
          <div>
            <label>Username:</label>
            <input type="text" name="username" value={formData.username || ''} onChange={handleChange} required={false}/>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password || ''} onChange={handleChange}required={false} />
          </div>
          <div>
            <label>Date Expire:</label>
            <input type="date" name="dateExpire" value={formData.dateExpire || ''} onChange={handleChange} required={false}/>
          </div>
          <div className='model-button-container'>

          <button type="submit">Add Application</button>
          <button className="model-close-button" type='button' onClick={()=>onClose()}>Close</button>
          </div>
         

        </form>
      </div>
    </div>
  );
};

export default AddJobApplicationModal;
