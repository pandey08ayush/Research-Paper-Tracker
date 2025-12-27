
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

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getAnalytics();
      if (response.success) {
        // Transform data for charts
        const data = response.data;
        
        // Process reading stages for funnel
        const stageOrder = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
        const readingStagesData = data.readingStages.map((item, index) => ({
          stage: item.stage,
          value: item.count,
          fill: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'][index]
        }));
        
        setAnalytics({
          readingStages: readingStagesData,
          citationByImpact: data.citationByImpact,
          domainByStage: data.domainByStage,
          summary: data.summary
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reading Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Papers</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.summary.totalPapers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Fully Read</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.summary.fullyReadCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.summary.completionRate}%</p>
        </div>
      </div>

      {/* Funnel Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Stage Funnel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <FunnelChart>
            <Tooltip />
            <Funnel dataKey="value" data={analytics.readingStages} isAnimationActive>
              <LabelList position="right" fill="#000" stroke="none" dataKey="stage" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter Plot */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Citation Count by Impact Score</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="citation_count" name="Citations" />
            <YAxis type="category" dataKey="impact_score" name="Impact Score" hide />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {analytics.citationByImpact.map((group, index) => (
              <Scatter
                key={group.impact_score}
                name={group.impact_score}
                data={group.papers.map(p => ({ ...p, impact_score: group.impact_score }))}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Papers by Domain and Reading Stage</h3>
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
      </div>

      {/* Average Citations by Domain */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Citations by Domain</h3>
        <div className="space-y-3">
          {Object.entries(analytics.summary.avgCitationsByDomain).map(([domain, avg]) => (
            <div key={domain} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{domain}</span>
              <div className="flex items-center space-x-3">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min((avg / 500) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-16 text-right">{avg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Analytics