import { Line } from 'react-chartjs-2';
import { CompostStand } from '../../types/CompostStandTypes';

type ReportProperty =
  | 'bugs'
  | 'cleanAndTidy'
  | 'full'
  | 'scalesProblem'
  | 'compostSmell'
  | 'dryMatterPresent';

type ReportDataOverTime = Record<ReportProperty, Record<string, number>>;

const processData = (compostStand: CompostStand): ReportDataOverTime => {
  const conditions: ReportDataOverTime = {
    bugs: {},
    cleanAndTidy: {},
    full: {},
    scalesProblem: {},
    compostSmell: {},
    dryMatterPresent: {},
  };

  compostStand.reports.forEach((report) => {
    const date = new Date(report.date).toLocaleDateString();

    if (report.bugs) conditions.bugs[date] = (conditions.bugs[date] || 0) + 1;
    if (!report.cleanAndTidy)
      conditions.cleanAndTidy[date] = (conditions.cleanAndTidy[date] || 0) + 1;
    if (report.full) conditions.full[date] = (conditions.full[date] || 0) + 1;
    if (report.scalesProblem)
      conditions.scalesProblem[date] =
        (conditions.scalesProblem[date] || 0) + 1;
    if (report.compostSmell)
      conditions.compostSmell[date] = (conditions.compostSmell[date] || 0) + 1;
    if (report.dryMatterPresent === 'no')
      conditions.dryMatterPresent[date] =
        (conditions.dryMatterPresent[date] || 0) + 1;
  });

  return conditions;
};

const prepareDatasets = (conditions: ReportDataOverTime) => {
  const dates = Array.from(
    new Set(Object.values(conditions).flatMap(Object.keys))
  ).sort();

  const datasets = Object.keys(conditions).map((key) => {
    const data = dates.map(
      (date) => conditions[key as ReportProperty][date] || 0
    );
    return {
      label: key,
      data,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    };
  });

  return { labels: dates, datasets };
};

const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

interface CompostStandChartProps {
  stand: CompostStand;
}

const CompostStandChart = ({ stand }: CompostStandChartProps) => {
  const reportDataOverTime = processData(stand);
  const chartData = prepareDatasets(reportDataOverTime);

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default CompostStandChart;
