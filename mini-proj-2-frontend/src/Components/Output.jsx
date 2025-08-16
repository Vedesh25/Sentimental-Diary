import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Output = ({ selectedPage }) => {
  const [pages, setPages] = useState([]);
  const [error, setError] = useState(null);

  Output.propTypes = {
    selectedPage: PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
      sentiment: PropTypes.string,
      sentiment_probability: PropTypes.arrayOf(PropTypes.number),
      emotion: PropTypes.string,
      emotion_probability: PropTypes.arrayOf(PropTypes.number),
      date: PropTypes.string,
    }),
  };

  useEffect(() => {
    if (!selectedPage) return;

    const source = axios.CancelToken.source();

    const fetchPages = async () => {
      try {
        console.log('Fetching pages from server...');
        const response = await axios.get('http://localhost:5000/pages', {
          params: {
            date: selectedPage.date
          },
          cancelToken: source.token,
        });
        console.log('Fetched pages:', response.data);
        setPages(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error('Error fetching pages:', error);
          setError('Failed to fetch pages');
        }
      }
    };

    fetchPages();

    return () => {
      source.cancel('Component unmounted');
    };
  }, [selectedPage]);

  const selectedPageData = pages.find(page => page._id === selectedPage?._id);

  return (
    <div>
      <article>
        <h1>Output</h1>
      </article>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        {selectedPageData ? (
          <div className="p-4 border-b border-gray-200">
            {/* Top row - Main results side by side */}
            <div className="flex space-x-8 mb-6">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">Sentiment Analysis:</p>
                <p className="text-sm">Result: {selectedPageData.sentiment}</p>
                {selectedPageData.sentiment_probability && (
                  <p className="text-sm">
                    Confidence: {(Math.max(...selectedPageData.sentiment_probability) * 100).toFixed(2)}%
                  </p>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">Emotion Analysis:</p>
                <p className="text-sm">Result: {selectedPageData.emotion}</p>
              </div>
            </div>

            {/* Bottom row - Emotion breakdown */}
            {selectedPageData.emotion_probability && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Emotion Breakdown:</p>
                <div className="grid grid-cols-6 gap-4">
                  <div>
                    <p>😢 Sadness</p>
                    <p>{(selectedPageData.emotion_probability[0] * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p>😊 Joy</p>
                    <p>{(selectedPageData.emotion_probability[1] * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p>❤️ Love</p>
                    <p>{(selectedPageData.emotion_probability[2] * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p>😡 Anger</p>
                    <p>{(selectedPageData.emotion_probability[3] * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p>😨 Fear</p>
                    <p>{(selectedPageData.emotion_probability[4] * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p>😲 Surprise</p>
                    <p>{(selectedPageData.emotion_probability[5] * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-90vh)] 
            text-slate-500 text-lg font-mono border-2 border-dashed rounded-md">
            <p className="text-sm">No prediction available. Please select a page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;