import { useState, useEffect } from 'react';
import { fetchCompostReportData } from '../../apiServices/CompostStandAPI';

export interface ReportBooleanProperty {
  true: number;
  false: number;
  missing: number;
}

export interface StandStats {
  compostStandId: number;
  standName: string;
  total: number;
  compostSmell: ReportBooleanProperty;
  dryMatterPresent: ReportBooleanProperty;
  cleanAndTidy: ReportBooleanProperty;
  full: ReportBooleanProperty;
  scalesProblem: ReportBooleanProperty;
  bugs: ReportBooleanProperty;
  notes: Record<string, number>;
}

export default function CompostReportStats({ period = 30 }: { period?: number }) {
  const [stats, setStats] = useState<StandStats[]>([]);

  useEffect(() => {
    fetchCompostReportData({ period })
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        setStats(response.data)
      })
      .catch(console.error);
  }, [period]);

  const formatPropertyName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div>
      <h2>Compost Report Stats (last {period} days)</h2>
      {stats.map((standStatsObject) => (
        <div key={standStatsObject.compostStandId} style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{standStatsObject.standName}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Property</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>True</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>False</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Missing</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Total Reports</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }} colSpan={4}>
                  {standStatsObject.total}
                </td>
              </tr>
              {(['cleanAndTidy', 'full', 'scalesProblem', 'bugs', 'compostSmell', 'dryMatterPresent'] as const).map(prop => (
                <tr key={prop}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    {formatPropertyName(prop)}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    {standStatsObject[prop].true}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    {standStatsObject[prop].false}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    {standStatsObject[prop].missing}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    {standStatsObject[prop].true + standStatsObject[prop].false + standStatsObject[prop].missing}
                  </td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Notes</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  {standStatsObject.notes.with || 0} (with)
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  {standStatsObject.notes.without || 0} (without)
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }} colSpan={2}>
                  {standStatsObject.total}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
