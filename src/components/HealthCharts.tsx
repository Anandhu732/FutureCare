"use client";

import { useState, useEffect } from "react";

interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface HealthTrendChartProps {
  title: string;
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'area';
  color?: string;
  height?: number;
  showGrid?: boolean;
  unit?: string;
}

export function HealthTrendChart({
  title,
  data,
  type = 'line',
  color = '#000000',
  height = 200,
  showGrid = true,
  unit = ''
}: HealthTrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const svgWidth = 400;
  const svgHeight = height;
  const padding = 40;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  const getPointPosition = (index: number, value: number) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxValue - value) / range) * chartHeight;
    return { x, y };
  };

  const pathData = data.map((point, index) => {
    const pos = getPointPosition(index, point.value);
    return `${index === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`;
  }).join(' ');

  const areaPath = type === 'area' ?
    `${pathData} L ${padding + chartWidth} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z` :
    '';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible">
          {/* Grid lines */}
          {showGrid && (
            <g className="opacity-20">
              {[0, 1, 2, 3, 4].map(i => {
                const y = padding + (i / 4) * chartHeight;
                return (
                  <line
                    key={`grid-${i}`}
                    x1={padding}
                    y1={y}
                    x2={padding + chartWidth}
                    y2={y}
                    stroke="#666"
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          )}

          {/* Area fill for area charts */}
          {type === 'area' && (
            <path
              d={areaPath}
              fill={color}
              fillOpacity="0.1"
            />
          )}

          {/* Main line/path */}
          {(type === 'line' || type === 'area') && (
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Bars for bar charts */}
          {type === 'bar' && data.map((point, index) => {
            const pos = getPointPosition(index, point.value);
            const barHeight = ((point.value - minValue) / range) * chartHeight;
            const barWidth = chartWidth / data.length * 0.6;

            return (
              <rect
                key={`bar-${index}`}
                x={pos.x - barWidth / 2}
                y={padding + chartHeight - barHeight}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* Data points */}
          {(type === 'line' || type === 'area') && data.map((point, index) => {
            const pos = getPointPosition(index, point.value);
            return (
              <circle
                key={`point-${index}`}
                cx={pos.x}
                cy={pos.y}
                r={hoveredPoint === index ? "6" : "4"}
                fill="white"
                stroke={color}
                strokeWidth="3"
                className="cursor-pointer transition-all duration-200 hover:r-6"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* Tooltip */}
          {hoveredPoint !== null && (
            <g>
              <rect
                x={getPointPosition(hoveredPoint, data[hoveredPoint].value).x - 30}
                y={getPointPosition(hoveredPoint, data[hoveredPoint].value).y - 40}
                width="60"
                height="25"
                fill="black"
                rx="4"
                fillOpacity="0.9"
              />
              <text
                x={getPointPosition(hoveredPoint, data[hoveredPoint].value).x}
                y={getPointPosition(hoveredPoint, data[hoveredPoint].value).y - 22}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="500"
              >
                {data[hoveredPoint].value}{unit}
              </text>
            </g>
          )}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map(i => {
            const value = maxValue - (i / 4) * range;
            const y = padding + (i / 4) * chartHeight;
            return (
              <text
                key={`y-label-${i}`}
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#666"
              >
                {Math.round(value)}{unit}
              </text>
            );
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            if (index % Math.ceil(data.length / 4) === 0 || index === data.length - 1) {
              const pos = getPointPosition(index, point.value);
              return (
                <text
                  key={`x-label-${index}`}
                  x={pos.x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Chart stats */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>Min: {minValue}{unit}</span>
        <span>Max: {maxValue}{unit}</span>
        <span>Avg: {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}{unit}</span>
      </div>
    </div>
  );
}

interface HealthDashboardChartsProps {
  userId: string;
}

export function HealthDashboardCharts({ userId }: HealthDashboardChartsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const appointmentTrendData: ChartDataPoint[] = [
    { date: '2025-09-01', value: 2 },
    { date: '2025-09-15', value: 1 },
    { date: '2025-10-01', value: 3 },
    { date: '2025-10-15', value: 2 },
    { date: '2025-11-01', value: 1 },
  ];

  const healthScoreData: ChartDataPoint[] = [
    { date: '2025-08-01', value: 82 },
    { date: '2025-08-15', value: 84 },
    { date: '2025-09-01', value: 83 },
    { date: '2025-09-15', value: 85 },
    { date: '2025-10-01', value: 87 },
  ];

  const prescriptionData: ChartDataPoint[] = [
    { date: '2025-08-01', value: 2 },
    { date: '2025-08-15', value: 3 },
    { date: '2025-09-01', value: 3 },
    { date: '2025-09-15', value: 2 },
    { date: '2025-10-01', value: 3 },
  ];

  const bloodPressureData: ChartDataPoint[] = [
    { date: '2025-09-01', value: 130 },
    { date: '2025-09-08', value: 128 },
    { date: '2025-09-15', value: 125 },
    { date: '2025-09-22', value: 127 },
    { date: '2025-10-01', value: 128 },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Health Trends</h2>
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm">
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthTrendChart
          title="Appointment Frequency"
          data={appointmentTrendData}
          type="bar"
          color="#000000"
          unit=" appointments"
        />

        <HealthTrendChart
          title="Health Score Trend"
          data={healthScoreData}
          type="area"
          color="#10b981"
          unit="%"
        />

        <HealthTrendChart
          title="Active Prescriptions"
          data={prescriptionData}
          type="line"
          color="#3b82f6"
          unit=" medications"
        />

        <HealthTrendChart
          title="Blood Pressure (Systolic)"
          data={bloodPressureData}
          type="line"
          color="#ef4444"
          unit=" mmHg"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Health Score</p>
              <p className="text-lg font-bold text-green-900">87%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">Avg BP</p>
              <p className="text-lg font-bold text-blue-900">127/82</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-800">Next Checkup</p>
              <p className="text-lg font-bold text-purple-900">Oct 15</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}