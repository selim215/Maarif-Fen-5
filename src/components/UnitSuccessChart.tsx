import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import { StudentProgress, UnitThemeId } from '../types';
import { UNIT_THEMES } from '../utils/theme';
import { soundEngine } from '../utils/sound';

interface UnitSuccessChartProps {
  progress: StudentProgress;
  themeId: UnitThemeId;
  activeUnitFilter: string;
  onSelectUnit: (unitId: string) => void;
}

type ChartMetric = 'completion' | 'accuracy';

interface UnitChartDatum {
  unitId: string;
  unitNumber: number;
  label: string;
  shortTitle: string;
  fullTitle: string;
  solvedTests: number;
  totalTests: number;
  attemptedTests: number;
  completionRate: number;
  accuracyRate: number;
  color: string;
}

const UNIT_BAR_COLORS: Record<UnitThemeId, string> = {
  space: '#F59E0B',
  force: '#10B981',
  life: '#22D3EE',
  light: '#FB7185',
  matter: '#38BDF8',
  electric: '#FACC15',
  eco: '#2DD4BF',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: UnitChartDatum }>;
  metric: ChartMetric;
}

const UnitChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, metric }) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;

  return (
    <div className="max-w-[230px] rounded-xl border border-slate-700/90 bg-slate-950/95 px-3.5 py-2.5 text-xs text-slate-100 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 font-display font-bold text-white">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-xs"
          style={{ backgroundColor: item.color }}
        />
        <span className="truncate">
          {item.unitNumber}. Ünite · {item.shortTitle}
        </span>
      </div>

      <div className="mt-2 space-y-1 tabular-nums text-slate-300">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Geçilen Test</span>
          <span className="font-bold text-white">
            {item.solvedTests} / {item.totalTests}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Tamamlama</span>
          <span
            className="font-bold"
            style={{ color: metric === 'completion' ? item.color : '#E2E8F0' }}
          >
            %{item.completionRate}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Doğru Ortalaması</span>
          <span
            className="font-bold"
            style={{ color: metric === 'accuracy' ? item.color : '#E2E8F0' }}
          >
            {item.attemptedTests > 0 ? `%${item.accuracyRate}` : 'Henüz yok'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const UnitSuccessChart: React.FC<UnitSuccessChartProps> = ({
  progress,
  themeId,
  activeUnitFilter,
  onSelectUnit,
}) => {
  const theme = UNIT_THEMES[themeId];
  const [metric, setMetric] = useState<ChartMetric>('completion');

  const data = useMemo<UnitChartDatum[]>(() => {
    return CURRICULUM.map((unit) => {
      let totalTests = 0;
      let solvedTests = 0;
      let attemptedTests = 0;
      let bestScoreSum = 0;
      let totalQuestionsSum = 0;

      for (const topic of unit.topics) {
        for (const test of topic.tests) {
          totalTests += 1;
          const record = progress.completedTests[test.id];
          if (record) {
            attemptedTests += 1;
            bestScoreSum += record.bestScore;
            totalQuestionsSum += record.total;
            if (record.passed) {
              solvedTests += 1;
            }
          }
        }
      }

      const completionRate = totalTests > 0 ? Math.round((solvedTests / totalTests) * 100) : 0;
      const accuracyRate =
        totalQuestionsSum > 0 ? Math.round((bestScoreSum / totalQuestionsSum) * 100) : 0;

      return {
        unitId: unit.id,
        unitNumber: unit.number,
        label: `Ü${unit.number}`,
        shortTitle: unit.shortTitle,
        fullTitle: unit.title,
        solvedTests,
        totalTests,
        attemptedTests,
        completionRate,
        accuracyRate,
        color: UNIT_BAR_COLORS[unit.theme],
      };
    });
  }, [progress.completedTests]);

  const anyActivity = useMemo(
    () => data.some((d) => d.attemptedTests > 0 || d.solvedTests > 0),
    [data]
  );

  const dataKey = metric === 'completion' ? 'completionRate' : 'accuracyRate';

  const handleBarClick = (entry?: UnitChartDatum) => {
    if (!entry) return;
    soundEngine.playTap();
    onSelectUnit(activeUnitFilter === entry.unitId ? 'all' : entry.unitId);
  };

  return (
    <div className={`rounded-3xl border p-4 sm:p-5 space-y-4 ${theme.surface}`}>
      {/* Header + Metric Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${theme.primarySoft}`}>
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className={`font-display text-base font-extrabold leading-tight ${theme.textPrimary}`}>
              Ünite Bazlı Başarı Grafiği
            </h2>
            <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>
              {anyActivity
                ? 'Bir ünite sütununa dokunarak aşağıdaki test listesini o üniteye göre süzebilirsin.'
                : 'Testleri çözdükçe her ünitenin başarı sütunu burada canlı olarak yükselir.'}
            </p>
          </div>
        </div>

        {/* Interactive Segmented Control */}
        <div
          className={`inline-flex shrink-0 self-start rounded-xl border p-1 sm:self-auto ${theme.surfaceSubtle}`}
          role="tablist"
          aria-label="Grafik ölçütü"
        >
          <button
            type="button"
            role="tab"
            aria-selected={metric === 'completion'}
            onClick={() => {
              soundEngine.playTap();
              setMetric('completion');
            }}
            className={`min-h-[34px] whitespace-nowrap rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
              metric === 'completion' ? theme.primaryBtn : theme.textSecondary
            }`}
          >
            Tamamlama %
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={metric === 'accuracy'}
            onClick={() => {
              soundEngine.playTap();
              setMetric('accuracy');
            }}
            className={`min-h-[34px] whitespace-nowrap rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
              metric === 'accuracy' ? theme.primaryBtn : theme.textSecondary
            }`}
          >
            Doğru Oranı %
          </button>
        </div>
      </div>

      {/* Bar Chart Viewport */}
      <div className="h-[225px] w-full min-w-0 sm:h-[245px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 22, right: 8, left: -18, bottom: 4 }}
            barCategoryGap="22%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.14)"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#CBD5E1', fontSize: 12, fontWeight: 700 }}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `%${v}`}
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)', radius: 8 }}
              content={<UnitChartTooltip metric={metric} />}
            />
            <Bar
              dataKey={dataKey}
              radius={[8, 8, 2, 2]}
              maxBarSize={44}
              background={{ fill: 'rgba(148, 163, 184, 0.08)', radius: 8 }}
              onClick={(barData) => handleBarClick(barData?.payload as UnitChartDatum | undefined)}
              className="cursor-pointer"
            >
              {data.map((entry) => {
                const isSelected = activeUnitFilter === 'all' || activeUnitFilter === entry.unitId;
                return (
                  <Cell
                    key={entry.unitId}
                    fill={entry.color}
                    fillOpacity={isSelected ? 0.95 : 0.3}
                  />
                );
              })}
              <LabelList
                dataKey={dataKey}
                position="top"
                formatter={(val: unknown) => {
                  const num = typeof val === 'number' ? val : Number(val);
                  return num > 0 ? `%${num}` : '';
                }}
                style={{ fill: '#E2E8F0', fontSize: 11, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Interactive Unit Legend Strip */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-800/70 pt-3 text-[11px] tabular-nums">
        {data.map((item) => {
          const isActive = activeUnitFilter === item.unitId;
          const pctVal = metric === 'completion' ? item.completionRate : item.accuracyRate;
          return (
            <button
              key={item.unitId}
              type="button"
              onClick={() => handleBarClick(item)}
              className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-opacity ${
                activeUnitFilter === 'all' || isActive ? 'opacity-100' : 'opacity-45 hover:opacity-80'
              }`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-xs"
                style={{ backgroundColor: item.color }}
              />
              <span className={`font-bold ${theme.textPrimary}`}>{item.label}</span>
              <span className={theme.textMuted}>
                {item.solvedTests}/{item.totalTests} (%{pctVal})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
