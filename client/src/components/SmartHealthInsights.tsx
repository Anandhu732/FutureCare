'use client';

import React, { useState, useEffect } from 'react';
import { AccessibleButton } from '../utils/accessibilityUtils';

interface HealthInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'trend' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'heart' | 'blood_pressure' | 'diabetes' | 'weight' | 'sleep' | 'exercise' | 'medication' | 'general';
  actionable: boolean;
  suggestedAction?: string;
  relatedAppointments?: string[];
  dataPoints?: { metric: string; value: number; trend: 'up' | 'down' | 'stable' }[];
}

interface SmartHealthInsightsProps {
  className?: string;
}

export const SmartHealthInsights: React.FC<SmartHealthInsightsProps> = ({ className = '' }) => {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<HealthInsight | null>(null);
  const [filter, setFilter] = useState<'all' | 'recommendations' | 'alerts' | 'trends'>('all');

  // Generate AI-powered health insights
  const generateHealthInsights = (): HealthInsight[] => {
    const insights: HealthInsight[] = [
      {
        id: '1',
        type: 'alert',
        title: 'Blood Pressure Trend Alert',
        description: 'Your blood pressure readings have been consistently elevated over the past 2 weeks.',
        confidence: 89,
        priority: 'high',
        category: 'blood_pressure',
        actionable: true,
        suggestedAction: 'Schedule a follow-up with your cardiologist within the next week.',
        relatedAppointments: ['apt-001', 'apt-004'],
        dataPoints: [
          { metric: 'Systolic BP', value: 145, trend: 'up' },
          { metric: 'Diastolic BP', value: 92, trend: 'up' }
        ]
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Exercise Optimization',
        description: 'Based on your recent activity levels and heart rate data, increasing cardio intensity could improve your cardiovascular health.',
        confidence: 78,
        priority: 'medium',
        category: 'exercise',
        actionable: true,
        suggestedAction: 'Aim for 30 minutes of moderate-intensity cardio 4-5 times per week.',
        dataPoints: [
          { metric: 'Weekly Active Minutes', value: 120, trend: 'stable' },
          { metric: 'Average Heart Rate', value: 68, trend: 'stable' }
        ]
      },
      {
        id: '3',
        type: 'trend',
        title: 'Weight Management Progress',
        description: 'Your weight loss journey shows steady progress with a healthy rate of 1.2 lbs per week.',
        confidence: 95,
        priority: 'low',
        category: 'weight',
        actionable: false,
        dataPoints: [
          { metric: 'Weight Loss', value: -4.8, trend: 'down' },
          { metric: 'BMI', value: 24.2, trend: 'down' }
        ]
      },
      {
        id: '4',
        type: 'prediction',
        title: 'Diabetes Risk Assessment',
        description: 'Current glucose levels and lifestyle factors suggest low diabetes risk. Continue current health practices.',
        confidence: 82,
        priority: 'low',
        category: 'diabetes',
        actionable: true,
        suggestedAction: 'Maintain current diet and exercise routine. Schedule annual HbA1c test.',
        dataPoints: [
          { metric: 'Fasting Glucose', value: 95, trend: 'stable' },
          { metric: 'HbA1c', value: 5.4, trend: 'stable' }
        ]
      },
      {
        id: '5',
        type: 'alert',
        title: 'Medication Adherence',
        description: 'Missed doses detected for blood pressure medication. Consistency is crucial for optimal results.',
        confidence: 91,
        priority: 'high',
        category: 'medication',
        actionable: true,
        suggestedAction: 'Set daily medication reminders and consider using a pill organizer.',
        relatedAppointments: ['apt-003']
      },
      {
        id: '6',
        type: 'recommendation',
        title: 'Sleep Quality Enhancement',
        description: 'Sleep pattern analysis suggests irregular sleep schedule affecting recovery and energy levels.',
        confidence: 73,
        priority: 'medium',
        category: 'sleep',
        actionable: true,
        suggestedAction: 'Establish consistent bedtime routine and aim for 7-8 hours of sleep nightly.',
        dataPoints: [
          { metric: 'Average Sleep Duration', value: 6.2, trend: 'down' },
          { metric: 'Sleep Quality Score', value: 72, trend: 'down' }
        ]
      }
    ];

    return insights;
  };

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      const generatedInsights = generateHealthInsights();
      setInsights(generatedInsights);
      setLoading(false);
    };

    loadInsights();
  }, []);

  const filteredInsights = insights.filter(insight => {
    if (filter === 'all') return true;
    if (filter === 'recommendations') return insight.type === 'recommendation';
    if (filter === 'alerts') return insight.type === 'alert';
    if (filter === 'trends') return insight.type === 'trend' || insight.type === 'prediction';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return '⚠️';
      case 'recommendation': return '💡';
      case 'trend': return '📈';
      case 'prediction': return '🔮';
      default: return '📊';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'heart': return '❤️';
      case 'blood_pressure': return '🩸';
      case 'diabetes': return '🍯';
      case 'weight': return '⚖️';
      case 'sleep': return '😴';
      case 'exercise': return '🏃‍♂️';
      case 'medication': return '💊';
      default: return '🏥';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mr-3"></div>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🧠</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Smart Health Insights</h2>
              <p className="text-sm text-gray-600">AI-powered health analysis and recommendations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              AI Active
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All Insights', count: insights.length },
            { key: 'alerts', label: 'Alerts', count: insights.filter(i => i.type === 'alert').length },
            { key: 'recommendations', label: 'Recommendations', count: insights.filter(i => i.type === 'recommendation').length },
            { key: 'trends', label: 'Trends', count: insights.filter(i => i.type === 'trend' || i.type === 'prediction').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as 'all' | 'recommendations' | 'alerts' | 'trends')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-pressed={filter === tab.key}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedInsight(insight)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedInsight(insight);
                }
              }}
              aria-label={`View details for ${insight.title}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-lg">{getTypeIcon(insight.type)}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{insight.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(insight.priority)}`}>
                        {insight.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{getCategoryIcon(insight.category)}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{insight.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Confidence: {insight.confidence}%</span>
                      <span className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                      </span>
                    </div>

                    {insight.actionable && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Actionable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInsights.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🤖</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
            <p className="text-gray-600">Try adjusting your filter or check back later for new insights.</p>
          </div>
        )}
      </div>

      {/* Detailed Insight Modal */}
      {selectedInsight && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedInsight(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="insight-modal-title"
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{getTypeIcon(selectedInsight.type)}</span>
                  <div>
                    <h2 id="insight-modal-title" className="text-2xl font-semibold text-gray-900">
                      {selectedInsight.title}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedInsight.priority)}`}>
                        {selectedInsight.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-sm text-gray-500">
                        {getCategoryIcon(selectedInsight.category)} {selectedInsight.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <AccessibleButton
                  onClick={() => setSelectedInsight(null)}
                  variant="secondary"
                  size="sm"
                  ariaLabel="Close insight details"
                >
                  <span className="text-xl">×</span>
                </AccessibleButton>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis</h3>
                  <p className="text-gray-700">{selectedInsight.description}</p>
                </div>

                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-sm text-gray-500">Confidence Level</span>
                    <div className="flex items-center mt-1">
                      <div className="w-32 h-3 bg-gray-200 rounded-full mr-3">
                        <div
                          className="h-3 bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedInsight.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">{selectedInsight.confidence}%</span>
                    </div>
                  </div>
                </div>

                {selectedInsight.dataPoints && selectedInsight.dataPoints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Key Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedInsight.dataPoints.map((point, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{point.metric}</span>
                            <span className={`text-sm ${
                              point.trend === 'up' ? 'text-red-500' :
                              point.trend === 'down' ? 'text-green-500' :
                              'text-gray-500'
                            }`}>
                              {point.trend === 'up' ? '↗️' : point.trend === 'down' ? '↘️' : '➡️'}
                            </span>
                          </div>
                          <div className="text-xl font-semibold text-gray-900 mt-1">
                            {point.value}{point.metric.includes('BP') ? ' mmHg' : point.metric.includes('Weight') ? ' lbs' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedInsight.suggestedAction && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Recommended Action</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">{selectedInsight.suggestedAction}</p>
                    </div>
                  </div>
                )}

                {selectedInsight.relatedAppointments && selectedInsight.relatedAppointments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Related Appointments</h3>
                    <div className="space-y-2">
                      {selectedInsight.relatedAppointments.map((aptId) => (
                        <div key={aptId} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Appointment #{aptId}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <AccessibleButton
                  onClick={() => setSelectedInsight(null)}
                  variant="secondary"
                >
                  Close
                </AccessibleButton>
                {selectedInsight.actionable && (
                  <AccessibleButton
                    onClick={() => {
                      // Handle action implementation
                      setSelectedInsight(null);
                    }}
                    variant="primary"
                  >
                    Take Action
                  </AccessibleButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartHealthInsights;