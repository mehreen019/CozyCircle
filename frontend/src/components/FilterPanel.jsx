import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: parseFloat(value) });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value ? parseInt(value) : null });
  };

  const handleDateChange = (name, date) => {
    onFilterChange({ [name]: date });
  };

  const categories = ['All', 'Concert', 'Conference', 'Festival', 'Sports', 'Workshop', 'Music', 'Tech', 'Other'];

  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      
      <div className="filter-section">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={filters.name}
          onChange={handleInputChange}
          placeholder="Search events..."
        />
      </div>

      <div className="filter-section">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleInputChange}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={filters.city}
          onChange={handleInputChange}
          placeholder="Filter by city"
        />
      </div>

      <div className="filter-section">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          value={filters.country}
          onChange={handleInputChange}
          placeholder="Filter by country"
        />
      </div>

      <div className="filter-section">
        <label>Rating Range</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            name="minRating"
            value={filters.minRating}
            onChange={handleRatingChange}
          />
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            name="maxRating"
            value={filters.maxRating}
            onChange={handleRatingChange}
          />
          <div className="rating-values">
            <span>{filters.minRating}</span>
            <span>{filters.maxRating}</span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <label>Date Range</label>
        <div className="date-pickers">
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            placeholderText="Start Date"
            className="date-picker"
          />
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            placeholderText="End Date"
            className="date-picker"
            minDate={filters.startDate}
          />
        </div>
      </div>

      <div className="filter-section">
        <label>Capacity</label>
        <div className="capacity-inputs">
          <input
            type="number"
            name="minCapacity"
            value={filters.minCapacity || ''}
            onChange={handleNumberChange}
            placeholder="Min"
          />
          <span>to</span>
          <input
            type="number"
            name="maxCapacity"
            value={filters.maxCapacity || ''}
            onChange={handleNumberChange}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="sortBy">Sort By</label>
        <select
          id="sortBy"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleInputChange}
        >
          <option value="rating">Highest Rating</option>
          <option value="date">Date (Upcoming)</option>
          <option value="capacity">Capacity</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      <div className="filter-buttons">
        <button className="apply-btn" onClick={onApplyFilters}>
          Apply Filters
        </button>
        <button className="reset-btn" onClick={onResetFilters}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// Add PropTypes validation
FilterPanel.propTypes = {
  filters: PropTypes.shape({
    name: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    minRating: PropTypes.number,
    maxRating: PropTypes.number,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    minCapacity: PropTypes.number,
    maxCapacity: PropTypes.number,
    sortBy: PropTypes.string,
    category: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired
};

export default FilterPanel;