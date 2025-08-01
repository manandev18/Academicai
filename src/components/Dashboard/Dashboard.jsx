import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveAssignmentData } from '../../services/assignmentService';
import AssignmentBreakdown from './AssignmentBreakdown';
import DraftReview from './DraftReview';
import SessionHistory from './SessionHistory';
import { Save, Download, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentBreakdown, setCurrentBreakdown] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveSession = async () => {
    if (!currentPrompt && !currentBreakdown && !currentFeedback) {
      toast.error('No session data to save');
      return;
    }

    setSaving(true);
    try {
      const result = await saveAssignmentData(
        user.uid,
        currentPrompt,
        currentBreakdown,
        currentFeedback
      );

      if (result.success) {
        toast.success('Session saved successfully!');
        // Reset current session
        setCurrentPrompt('');
        setCurrentBreakdown('');
        setCurrentFeedback('');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to save session');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    // This would integrate with your existing PDF export functionality
    toast.info('PDF export feature coming soon!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.fullName || user.email?.split('@')[0]}!
          </h1>
        </div>
        <p className="text-gray-600">
          Analyze assignments, review drafts, and ensure academic integrity with AI-powered tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AssignmentBreakdown 
          onBreakdownGenerated={(breakdown) => {
            setCurrentBreakdown(breakdown);
          }}
        />
        <DraftReview 
          onFeedbackGenerated={(feedback) => {
            setCurrentFeedback(feedback);
          }}
        />
      </div>

      {(currentBreakdown || currentFeedback) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Session</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleSaveSession}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Session'}</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      )}

      <SessionHistory />
    </div>
  );
};

export default Dashboard;