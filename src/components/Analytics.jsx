import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { analyticsAPI } from '../services/api';
import { TrendingUp, BookOpen, CheckCircle2 } from 'lucide-react';

const Analytics = ({ refreshTrigger }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsAPI.getAnalytics();
      console.log('Analytics Response:', response); // Debug log
      
      if (response.success) {
        const data = response.data;
        
        // Transform readingStages: convert 'count' to 'value' for Funnel chart
        const readingStagesData = data.readingStages.map((item, index) => ({
          name: item.stage,  // Funnel needs 'name'
          value: item.count, // Funnel needs 'value'
          fill: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'][index]
        }));
        
        setAnalytics({
          readingStages: readingStagesData,
          citationByImpact: data.citationByImpact || [],
          domainByStage: data.domainByStage || [],
          summary: data.summary || {}
        });
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-800 font-semibold">Error Loading Analytics</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics || !analytics.summary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available. Add some papers first!</p>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reading Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Papers</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.summary.totalPapers || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Fully Read</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.summary.fullyReadCount || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.summary.completionRate || 0}%</p>
        </div>
      </div>

      {/* Funnel Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Stage Funnel</h3>
        {analytics.readingStages && analytics.readingStages.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <FunnelChart>
              <Tooltip />
              <Funnel 
                dataKey="value" 
                data={analytics.readingStages} 
                isAnimationActive
              >
                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No reading stage data available</p>
        )}
      </div>

      {/* Scatter Plot */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Citation Count by Impact Score</h3>
        {analytics.citationByImpact && analytics.citationByImpact.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="citation_count" name="Citations" />
              <YAxis type="category" dataKey="impact_score" name="Impact Score" width={120} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              {analytics.citationByImpact.map((group, index) => (
                <Scatter
                  key={group.impact_score}
                  name={group.impact_score}
                  data={group.papers.map(p => ({ 
                    ...p, 
                    impact_score: group.impact_score 
                  }))}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No citation data available</p>
        )}
      </div>

      {/* Stacked Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Papers by Domain and Reading Stage</h3>
        {analytics.domainByStage && analytics.domainByStage.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analytics.domainByStage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="domain" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Abstract Read" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Introduction Done" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="Methodology Done" stackId="a" fill="#ec4899" />
              <Bar dataKey="Results Analyzed" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Fully Read" stackId="a" fill="#10b981" />
              <Bar dataKey="Notes Completed" stackId="a" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No domain data available</p>
        )}
      </div>

      {/* Average Citations by Domain */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Citations by Domain</h3>
        {analytics.summary.avgCitationsByDomain && Object.keys(analytics.summary.avgCitationsByDomain).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(analytics.summary.avgCitationsByDomain).map(([domain, avg]) => (
              <div key={domain} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{domain}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((avg / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-16 text-right">{avg}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No citation data by domain available</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;