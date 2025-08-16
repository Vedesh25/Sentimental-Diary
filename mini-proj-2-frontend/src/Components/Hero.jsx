import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

const Hero = ({ selectedDate, selectedPage, onContentChange }) => {
  const [content, setContent] = useState(selectedPage?.content || '');

  useEffect(() => {
    setContent(selectedPage?.content || '');
  }, [selectedPage]);

  const debouncedContentChange = useCallback(
    debounce((id, value) => {
      onContentChange(id, value);
    }, 300),
    [onContentChange]
  );

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue);
    if (selectedPage) {
      debouncedContentChange(selectedPage._id, newValue);
    }
  };

  return (
    <div>
      <div name='heading' className='flex flex-row justify-between mr-6 font-mono text-xl text-slate-800'>
        <div>
          <h1>
            {selectedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h1>
        </div>
        <div>
          <h1>
            {selectedPage?.title || ''}
          </h1>
        </div>
      </div>
      <div className='p-1 my-3'>
        {selectedPage ? (
          <textarea 
            className='w-full p-4 border rounded-md shadow-sm 
            min-h-[24rem] h-[calc(100vh-24rem)] 
            focus:outline-none focus:ring-2 focus:ring-slate-500
            resize-none font-mono'
            value={content}
            onChange={handleTextChange}
            placeholder="Start typing..."
          />
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-24rem)] 
            text-slate-500 text-lg font-mono border-2 border-dashed rounded-md">
            Please select or create a page to start writing
          </div>
        )}
      </div>  
    </div>
  );
};

// Move PropTypes outside the component
Hero.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  selectedPage: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.string
  }),
  onContentChange: PropTypes.func.isRequired,
};

export default Hero;