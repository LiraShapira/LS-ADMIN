import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
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
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});

  const toggleStand = (id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  return (
    <div>
      <h2>Compost Report Stats (last {period} days)</h2>
      {stats.map((standStatsObject) => (
        <div key={standStatsObject.compostStandId} style={{ marginBottom: '1.5rem' }}>
          <h3
            onClick={() => toggleStand(standStatsObject.compostStandId)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {openMap[standStatsObject.compostStandId] ? '▼' : '▶'} {standStatsObject.standName}
          </h3>
          {openMap[standStatsObject.compostStandId] && (
            <>
              <div>
                {(['cleanAndTidy', 'full', 'scalesProblem', 'bugs', 'compostSmell'] as const).map(prop => {
                  if (standStatsObject[prop].missing === standStatsObject.total) {
                    return (
                      <div key={prop} style={{ width: '30%' }}>
                        <h4>{prop}</h4>
                        <p>No data available</p>
                      </div>
                    );
                  }
                  const data = [
                    { name: 'true', value: (standStatsObject)[prop].true },
                    { name: 'false', value: (standStatsObject)[prop].false }
                  ];
                  const colors = data.map(entry => {
                    // cleanAndTidy is "good": true=green, false=red
                    if (prop === 'cleanAndTidy') return entry.name === 'true' ? 'green' : 'red';
                    // others are "bad" props: true=red, false=green
                    return entry.name === 'true' ? 'red' : 'green';
                  });

                  return (
                    <div key={prop} style={{ width: '30%' }}>
                      <h4>{prop}</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            dataKey="value"
                            data={data}
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                          >
                            {data.map((_, idx) => (
                              <Cell key={idx} fill={colors[idx]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ))
      }
    </div >
  );
}
