import React, { useState } from 'react';
import { reviewDraft } from '../../services/academicService';
import { detectAIContent, saveAIDetectionReport } from '../../services/aiDetectionService';
import { useAuth } from '../../contexts/AuthContext';
import { Edit3, Shield, Loader2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DraftReview = ({ onFeedbackGenerated }) => {
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [aiDetection, setAiDetection] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const { user } = useAuth();

  const handleReview = async () => {
    if (!draft.trim()) {
      toast.error('Please enter your draft');
      return;
    }

    setReviewLoading(true);
    try {
      const result = await reviewDraft(draft);
      if (result.success) {
        setFeedback(result.data);
        onFeedbackGenerated(result.data);
        toast.success('Feedback generated!');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to generate feedback');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAIDetection = async () => {
    if (!draft.trim()) {
      toast.error('Please enter your draft');
      return;
    }

    setAiLoading(true);
    try {
      const result = await detectAIContent(draft);
      if (result.success) {
        setAiDetection(result.data);
        
        // Save the AI detection report
        await saveAIDetectionReport(user.uid, draft, result.data);
        
        toast.success('AI analysis completed!');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to analyze content');
    } finally {
      setAiLoading(false);
    }
  };

  const getConfidenceIcon = (confidence) => {
    switch (confidence) {
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'High':
        return 'bg-red-50 border-red-200';
      case 'Medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Edit3 className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Draft Review & AI Detection</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="draft" className="block text-sm font-medium text-gray-700 mb-2">
            Your Essay Draft
          </label>
          <textarea
            id="draft"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Paste your essay draft here for review and AI detection..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Word count: {draft.trim().split(/\s+/).filter(word => word.length > 0).length}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleReview}
            disabled={reviewLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {reviewLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Edit3 className="h-4 w-4" />
            )}
            <span>{reviewLoading ? 'Reviewing...' : 'Get Feedback'}</span>
          </button>

          <button
            onClick={handleAIDetection}
            disabled={aiLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            <span>{aiLoading ? 'Analyzing...' : 'Detect AI Content'}</span>
          </button>
        </div>

        {aiDetection && (
          <div className={`mt-6 p-4 rounded-lg border-2 ${getConfidenceColor(aiDetection.confidence)}`}>
            <div className="flex items-center space-x-2 mb-3">
              {getConfidenceIcon(aiDetection.confidence)}
              <h3 className="text-md font-medium text-gray-900">
                AI Detection Result: {aiDetection.indicator}
              </h3>
            </div>
            <div className="prose prose-sm max-w-none">
              {aiDetection.explanation.split('\n').map((line, index) => (
                <p key={index} className="mb-2 text-gray-700">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">✅ Academic Feedback</h3>
            <div className="bg-gray-50 rounded-md p-4">
              <div className="prose prose-sm max-w-none">
                {feedback.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 text-gray-700">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftReview;