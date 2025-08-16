// Sidebar.jsx
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Pages from './Pages';

const Sidebar = ({ onDateChange, onPageChange, pages, onAddPage, onDeletePage, selectedDate }) => {
  const handleDateChange = (newDate) => {
    onDateChange(newDate);
  };

  const disablePastDates = ({ date }) => {
    const today = new Date();
    return date > today.setHours(0, 0, 0, 0);
  };
  
  return (
    <div className="w-3/12 p-3 font-mono">
      <div>
        <h1>Calendar</h1>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileDisabled={disablePastDates}
          className="w-full rounded-sm"
        />
      </div>
      <Pages 
        selectedDate={selectedDate}
        onPageSelect={onPageChange}
        pages={pages}
        onAddPage={onAddPage}
        onDeletePage={onDeletePage}
      />
    </div>
  );
};

Sidebar.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  pages: PropTypes.array.isRequired,
  onAddPage: PropTypes.func.isRequired,
  onDeletePage: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};

export default Sidebar;