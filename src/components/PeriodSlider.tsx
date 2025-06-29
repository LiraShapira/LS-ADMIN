import React from 'react';
import { formatDate } from '../utils/timeAndDate';

interface PeriodSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const PeriodSlider = ({ value, onChange, min = 1, max = 365 }: PeriodSliderProps) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
        <span>{formatDate(startDate)}</span>
        <span>{formatDate(today)} (Today)</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        style={{ width: '100%' }}
      />
      <div style={{ textAlign: 'center', marginTop: 4 }}>{value} days</div>
    </div>
  );
};

export default PeriodSlider;
