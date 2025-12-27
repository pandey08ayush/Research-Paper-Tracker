import React, { useState } from 'react';
import { paperAPI } from '../services/api';
import { CheckCircle, AlertCircle } from 'lucide-react';


const AddPaperForm = ({ onPaperAdded }) => {
  const [formData, setFormData] = useState({
    paper_title: '',
    first_author_name: '',
research_domain: '',
    reading_stage: '',
    citation_count: '',
    impact_score: '',
    date_added: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const researchDomains = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
  const readingStages = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
  const impactScores = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

     try {
      const response = await paperAPI.addPaper({
        ...formData,
        citation_count: parseInt(formData.citation_count),
      });

      if (response.success) {
        setMessage({ type: 'success', text: response.message || 'Paper added successfully!' });
        setFormData({
          paper_title: '',
          first_author_name: '',
          research_domain: '',
          reading_stage: '',
          citation_count: '',
          impact_score: '',
          date_added: new Date().toISOString().split('T')[0],
        });
        onPaperAdded();
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to add paper' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to add paper' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Research Paper</h2>

        {message.text && (
          <div className={`mb-6 p-4 rounded-md flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paper Title *</label>
            <input
              type="text"
              name="paper_title"
              value={formData.paper_title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter paper title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Author Name *</label>
            <input
              type="text"
              name="first_author_name"
              value={formData.first_author_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first author name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Research Domain *</label>
            <select
              name="research_domain"
              value={formData.research_domain}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select domain</option>
              {researchDomains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reading Stage *</label>
            <select
              name="reading_stage"
              value={formData.reading_stage}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select stage</option>
              {readingStages.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Citation Count *</label>
            <input
              type="number"
              name="citation_count"
              value={formData.citation_count}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter citation count"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Impact Score *</label>
            <select
              name="impact_score"
              value={formData.impact_score}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select impact score</option>
              {impactScores.map((score) => (
                <option key={score} value={score}>{score}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Added *</label>
            <input
              type="date"
              name="date_added"
              value={formData.date_added}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
          >
            {loading ? 'Adding Paper...' : 'Add Paper'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPaperForm