
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { DiseaseStat, CropStat } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import CropUploadCalendar from './CropUploadCalendar';

const MOCK_DISEASE_DATA: DiseaseStat[] = [
  { name: 'Leaf Blight', count: 45 },
  { name: 'Powdery Mildew', count: 32 },
  { name: 'Rust', count: 28 },
  { name: 'Leaf Spot', count: 19 },
  { name: 'Healthy', count: 60 },
];

const MOCK_CROP_DATA: CropStat[] = [
  { name: 'Tomato', value: 400 },
  { name: 'Potato', value: 300 },
  { name: 'Corn', value: 300 },
  { name: 'Grapes', value: 200 },
  { name: 'Apple', value: 278 },
];

const COLORS = ['#16a34a', '#84cc16', '#facc15', '#fb923c', '#f87171'];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Count ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const AnalyticsDashboard: React.FC = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const { t } = useTranslation();
    const onPieEnter = (_: any, index: number) => setActiveIndex(index);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-brand-green-dark mb-8 text-center">{t('analytics.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Disease Frequency Chart */}
        <div className="h-96">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">{t('analytics.diseases')}</h3>
          {MOCK_DISEASE_DATA.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DISEASE_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'rgba(22, 163, 74, 0.1)'}} />
                <Legend />
                <Bar dataKey="count" name={t('analytics.detectionCount')} fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              {t('analytics.noData')}
            </div>
          )}
        </div>

        {/* Affected Crops Chart */}
        <div className="h-96">
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">{t('analytics.crops')}</h3>
            {MOCK_CROP_DATA.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={MOCK_CROP_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                      >
                          {MOCK_CROP_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                      </Pie>
                  </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {t('analytics.noData')}
              </div>
            )}
        </div>
      </div>
      <div className="mt-10">
        <CropUploadCalendar />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
