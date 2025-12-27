import React from 'react';
import  { useState, useEffect } from 'react';
import { Trash2, Edit2, Filter } from 'lucide-react';
import { paperAPI } from '../services/api';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'; // More icons
import { toast } from 'react-hot-toast';


const PaperLibrary = ({ refreshTrigger }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    reading_stage: [],
    research_domain: [],
    impact_score: [],
    date_filter: 'All time'
  });

  const readingStages = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
  const researchDomains = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
  const impactScores = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];
  const dateFilters = ['This Week', 'This Month', 'Last 3 Months', 'All time'];

  useEffect(() => {
    fetchPapers();
  }, [filters, refreshTrigger]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const response = await paperAPI.getPapers(filters);
      setPapers(response.data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'date_filter') {
        return { ...prev, date_filter: value };
      }
      
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({
      reading_stage: [],
      research_domain: [],
      impact_score: [],
      date_filter: 'All time'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      await paperAPI.deletePaper(id);
      fetchPapers();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Paper Library</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Filter className="w-5 h-5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
                Clear All
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reading Stage</label>
              <div className="flex flex-wrap gap-2">
                {readingStages.map(stage => (
                  <button
                    key={stage}
                    onClick={() => handleFilterChange('reading_stage', stage)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.reading_stage.includes(stage)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Research Domain</label>
              <div className="flex flex-wrap gap-2">
                {researchDomains.map(domain => (
                  <button
                    key={domain}
                    onClick={() => handleFilterChange('research_domain', domain)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.research_domain.includes(domain)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Impact Score</label>
              <div className="flex flex-wrap gap-2">
                {impactScores.map(score => (
                  <button
                    key={score}
                    onClick={() => handleFilterChange('impact_score', score)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.impact_score.includes(score)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Added</label>
              <div className="flex gap-2">
                {dateFilters.map(dateFilter => (
                  <button
                    key={dateFilter}
                    onClick={() => handleFilterChange('date_filter', dateFilter)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      filters.date_filter === dateFilter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {dateFilter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No papers found. Add your first paper or adjust filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Domain</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Stage</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Citations</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Impact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {papers.map((paper) => (
                  <tr key={paper._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{paper.paper_title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{paper.first_author_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{paper.research_domain}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {paper.reading_stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{paper.citation_count}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        paper.impact_score === 'High Impact' ? 'bg-green-100 text-green-800' :
                        paper.impact_score === 'Medium Impact' ? 'bg-yellow-100 text-yellow-800' :
                        paper.impact_score === 'Low Impact' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {paper.impact_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(paper.date_added).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDelete(paper._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          Showing {papers.length} paper{papers.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};
export default PaperLibrary