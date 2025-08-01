import React, { useState, useEffect } from 'react';
import { getUserAssignments } from '../../services/assignmentService';
import { getUserAIReports } from '../../services/aiDetectionService';
import { useAuth } from '../../contexts/AuthContext';
import { History, FileText, Shield, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionHistory = () => {
  const [assignments, setAssignments] = useState([]);
  const [aiReports, setAiReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [assignmentsResult, aiReportsResult] = await Promise.all([
        getUserAssignments(user.uid),
        getUserAIReports(user.uid)
      ]);

      if (assignmentsResult.success) {
        setAssignments(assignmentsResult.data);
      }

      if (aiReportsResult.success) {
        setAiReports(aiReportsResult.data);
      }
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <History className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Session History</h2>
      </div>

      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'assignments'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Assignments ({assignments.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('ai-reports')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'ai-reports'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>AI Reports ({aiReports.length})</span>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'assignments' && (
          <>
            {assignments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No assignment sessions found</p>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(assignment.timestamp)}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExpanded(assignment.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedItems.has(assignment.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {assignment.prompt}
                    </p>
                  </div>

                  {expandedItems.has(assignment.id) && (
                    <div className="mt-4 space-y-4">
                      {assignment.breakdown && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Breakdown:</h4>
                          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {assignment.breakdown.split('\n').slice(0, 3).map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {assignment.feedback && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Feedback:</h4>
                          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {assignment.feedback.split('\n').slice(0, 3).map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'ai-reports' && (
          <>
            {aiReports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No AI detection reports found</p>
            ) : (
              aiReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(report.timestamp)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(report.confidence)}`}>
                        {report.confidence} Risk
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExpanded(report.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedItems.has(report.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {report.text.substring(0, 150)}...
                    </p>
                  </div>

                  {expandedItems.has(report.id) && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Analysis:</h4>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {report.explanation.split('\n').slice(0, 5).map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Original Text:</h4>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                          {report.text}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SessionHistory;