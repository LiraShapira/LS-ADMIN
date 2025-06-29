import React from 'react';
import { formatDate } from '../utils/timeAndDate';

interface PeriodSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const PeriodSlider = ({ value, onChange, min = 1, max = 180 }: PeriodSliderProps) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - value);

  const handleChange = React.useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(newValue);
      }, 100);
    };
  }, [onChange]);

  return (
    <div style={{ margin: '10px 10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.9rem' }}>
        <span>Select or enter the number of days from today to display data</span>
        <span>Date Span: {formatDate(startDate)} - {formatDate(today)} (Today)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          style={{
            width: '100%',
            direction: 'rtl',
            height: '32px',
          }}
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={e => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue) && newValue >= min && newValue <= max) {
              onChange(newValue);
            }
          }}
          style={{ width: 60 }}
        />
      </div>
      <div style={{ textAlign: 'center', marginTop: 4 }}>{value} days</div>
    </div>
  );
};

export default PeriodSlider;
