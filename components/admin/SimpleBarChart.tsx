import React from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
  barColor?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, barColor = '#3b82f6' }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No data to display.</div>;
  }

  const maxValue = Math.max(...data.map(item => item.value), 0);
  const chartHeight = 288; // h-72
  const barWidth = 40;
  const barMargin = 20;
  const totalWidth = data.length * (barWidth + barMargin);

  const yAxisLabels = [0, 0.25, 0.5, 0.75, 1].map(factor => Math.round(maxValue * factor));

  return (
    <div className="w-full h-full flex" style={{ fontFamily: 'sans-serif', fontSize: '12px' }}>
      <div className="flex flex-col justify-between h-full text-slate-500 pr-2 text-right">
        {yAxisLabels.reverse().map(label => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="relative flex-1 h-full border-l border-b border-slate-200">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox={`0 0 ${totalWidth} ${chartHeight}`}>
          {/* Y-axis grid lines */}
           {yAxisLabels.map(label => (
             <line
                key={`line-${label}`}
                x1="0"
                y1={chartHeight - (label / maxValue) * chartHeight}
                x2={totalWidth}
                y2={chartHeight - (label / maxValue) * chartHeight}
                stroke="#e2e8f0"
                strokeWidth="1"
             />
           ))}

          {data.map((item, index) => {
            const barHeight = item.value > 0 ? (item.value / maxValue) * chartHeight : 0;
            const x = index * (barWidth + barMargin) + barMargin / 2;
            const y = chartHeight - barHeight;
            return (
              <g key={item.name}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColor}
                  rx="4"
                  ry="4"
                />
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 w-full flex -mb-6">
            {data.map((item, index) => (
                 <div key={item.name} className="text-slate-600 text-center" style={{ minWidth: `${barWidth}px`, marginLeft: `${index === 0 ? barMargin/2 : barMargin}px` }}>
                     {item.name}
                 </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleBarChart;
