import React, { useState } from 'react';
import { breakdownAssignment, suggestSources } from '../../services/academicService';
import { FileText, Lightbulb, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AssignmentBreakdown = ({ onBreakdownGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [breakdown, setBreakdown] = useState('');
  const [sources, setSources] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourcesLoading, setSourcesLoading] = useState(false);

  const handleBreakdown = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an assignment prompt');
      return;
    }

    setLoading(true);
    try {
      const result = await breakdownAssignment(prompt);
      if (result.success) {
        setBreakdown(result.data);
        onBreakdownGenerated(result.data);
        toast.success('Assignment breakdown generated!');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to generate breakdown');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestSources = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an assignment prompt first');
      return;
    }

    setSourcesLoading(true);
    try {
      const result = await suggestSources(prompt);
      if (result.success) {
        setSources(result.data);
        toast.success('Sources suggested!');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to suggest sources');
    } finally {
      setSourcesLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Assignment Analysis</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Prompt
          </label>
          <textarea
            id="prompt"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Paste your assignment prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleBreakdown}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            <span>{loading ? 'Analyzing...' : 'Break Down Assignment'}</span>
          </button>

          <button
            onClick={handleSuggestSources}
            disabled={sourcesLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sourcesLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4" />
            )}
            <span>{sourcesLoading ? 'Finding...' : 'Suggest Sources'}</span>
          </button>
        </div>

        {breakdown && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">📋 Assignment Breakdown</h3>
            <div className="bg-gray-50 rounded-md p-4">
              <div className="prose prose-sm max-w-none">
                {breakdown.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 text-gray-700">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {sources && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">📚 Suggested Sources</h3>
            <div className="bg-blue-50 rounded-md p-4">
              <div className="prose prose-sm max-w-none">
                {sources.split('\n').map((line, index) => (
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

export default AssignmentBreakdown;