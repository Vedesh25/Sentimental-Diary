// Pages.jsx
import PropTypes from 'prop-types';

const PageBox = ({ title, onClick, onDelete }) => (
  <div 
    className="bg-white rounded-md shadow-sm p-2 m-2 w-full h-24 cursor-pointer hover:shadow-md border-b-4 relative"
    onClick={onClick}
  >
    <p className="text-sm">{title}</p>
    <button
      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      ×
    </button>
  </div>
);

const Pages = ({ selectedDate, onPageSelect, pages, onAddPage, onDeletePage }) => {
  // Filter pages for selected date
  const filteredPages = pages.filter(
    page => page.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div>
      <h1 className='mt-4 flex justify-between flex-row px-1'>
        <article>Pages</article>
        <article 
          className="cursor-pointer hover:text-blue-500"
          onClick={onAddPage}
        >
          +
        </article>
      </h1>
      <div className='p-2 h-[300px] overflow-y-auto flex flex-wrap gap-2 border-s-4 hide-scrollbar rounded-md'>
        {filteredPages.map((page) => (
          <PageBox 
            key={page._id} 
            title={page.title} 
            onClick={() => onPageSelect(page)}
            onDelete={() => onDeletePage(page._id)}
          />
        ))}
      </div>
    </div>
  );
};

PageBox.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

Pages.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    date: PropTypes.string.isRequired,
    sentiment: PropTypes.string,
    emotion: PropTypes.string,
    sentiment_probability: PropTypes.arrayOf(PropTypes.number),
    emotion_probability: PropTypes.arrayOf(PropTypes.number)
  })).isRequired,
  onPageSelect: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onAddPage: PropTypes.func.isRequired,
  onDeletePage: PropTypes.func.isRequired,
};

export default Pages;