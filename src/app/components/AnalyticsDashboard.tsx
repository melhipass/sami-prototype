'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft, Activity, Bell,
  Settings as SettingsIcon, Smartphone, ChevronDown,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ---------------------------------------------------------------------------
// Dummy data. None of this is real telemetry — it exists purely to mock up
// what an Amplitude dashboard answering Matt's questions could look like,
// using the events already defined (or proposed) in the Analytics Event
// Catalog & Metadata Confluence doc.
// ---------------------------------------------------------------------------

const COLORS = {
  primary: '#2F6FEB',
  primaryLight: '#A9C6FB',
  purple: '#7C5CFC',
  amber: '#F5A623',
  coral: '#E5534B',
  teal: '#3FB68E',
  grid: '#EEF1F6',
  axis: '#8A94A6',
};

const PIE_COLORS = [COLORS.primary, COLORS.purple, COLORS.amber, COLORS.teal, COLORS.coral];

function dayLabels(n: number) {
  return Array.from({ length: n }, (_, i) => `Day ${i}`);
}

// Long daily history (used by the Overview time-range picker) so ranges up to
// "1 Year" / "Ever" have real day-by-day dummy data to slice, instead of
// faking a longer range out of a 30-day array.
const LONG_RANGE_DAYS = 400;
function pastDates(n: number, endDate: string = '2026-07-30') {
  const end = new Date(`${endDate}T00:00:00`);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(end);
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
}
function lastNDays<T>(arr: T[], n: number): T[] {
  return arr.slice(-Math.min(n, arr.length));
}
const longDates = pastDates(LONG_RANGE_DAYS);

// --- Usage & Retention -------------------------------------------------

const retentionData = dayLabels(31).map((day, i) => {
  const decay = 100 * Math.pow(0.965, i) * (i === 0 ? 1 : 1) ;
  const noise = Math.sin(i / 3) * 2;
  const overall = i === 0 ? 100 : Math.max(24, Math.round((58 - i * 0.9 + noise) * (i < 3 ? 1.4 : 1) * 10) / 10);
  return {
    day,
    overall: i === 0 ? 100 : Math.max(24, Math.round(overall)),
    ios: i === 0 ? 100 : Math.max(27, Math.round(overall + 4)),
    android: i === 0 ? 100 : Math.max(19, Math.round(overall - 6)),
  };
});

// 400 days of history, ending "today" — supports the Overview time-range
// picker (7d/30d/60d/90d/1y/ever). Includes a slow growth trend so longer
// ranges look like plausible history rather than a flat repeat.
const nightlyActiveCameras = longDates.map((date, i) => {
  const progress = i / (LONG_RANGE_DAYS - 1);
  const trend = 300 + progress * 380;
  const weekly = Math.sin(i / 3.5) * 30;
  const weekend = i % 7 === 5 || i % 7 === 6 ? 25 : 0;
  const noise = Math.round(Math.random() * 20 - 10);
  return { date, cameras: Math.max(50, Math.round(trend + weekly + weekend + noise)) };
});

const usageConsistency = [
  { segment: 'Daily (6–7 days/wk)', count: 412 },
  { segment: 'Frequent (3–5 days/wk)', count: 268 },
  { segment: 'Occasional (1–2 days/wk)', count: 137 },
  { segment: 'No internet connection (7d)', count: 165 },
];

const reconnectionGaps = [
  { bucket: '1 day', count: 386 },
  { bucket: '2–3 days', count: 214 },
  { bucket: '4–7 days', count: 97 },
  { bucket: '8–30 days', count: 41 },
  { bucket: '31–60 days', count: 22 },
  { bucket: '61–90 days', count: 14 },
  { bucket: '90+ days / never', count: 27 },
];

const retentionTable = [
  { segment: 'All Cameras', cameras: 982, day0: '100%', day1: '54%', day7: '39%', day30: '27%' },
  { segment: 'iOS', cameras: 601, day0: '100%', day1: '58%', day7: '43%', day30: '31%' },
  { segment: 'Android', cameras: 381, day0: '100%', day1: '48%', day7: '32%', day30: '21%' },
];

// --- Alarms --------------------------------------------------------------

// Long daily history — combined with Recordings Created into a single
// 2-line trend chart, driven by the shared time-range picker. Scaled to
// roughly 1 alarm per ~20 recordings, so the gap between the two lines is
// visible rather than the two trends looking similar in size.
const alarmsOverTimeLong = longDates.map((date, i) => {
  const progress = i / (LONG_RANGE_DAYS - 1);
  const trend = 90 + progress * 100;
  const weekly = Math.sin(i / 3) * 15;
  const noise = Math.round(Math.random() * 10 - 5);
  return { date, alarms: Math.max(20, Math.round(trend + weekly + noise)) };
});

const alarmsPerCameraDistribution = [
  { bin: '0', count: 165 },
  { bin: '1–3', count: 401 },
  { bin: '4–6', count: 258 },
  { bin: '7–10', count: 104 },
  { bin: '10+', count: 54 },
];

// --- Recordings ------------------------------------------------------------

// Long daily "created" history so the combined Recordings chart can be
// totaled over whatever range the time-range picker selects. Watched/
// Shared/Locked/Alarmed are all derived from Created using fixed conversion
// rates (matching the original 30d baseline: 18,420 watched / 2,210 shared /
// 10,900 locked / 9,800 alarmed out of 104,820 created — Locked is a bit
// higher than Alarmed since an alarmed recording auto-locks, plus some
// recordings get locked manually even without an alarm).
const recordingsCreatedLong = longDates.map((date, i) => {
  const progress = i / (LONG_RANGE_DAYS - 1);
  const trend = 1800 + progress * 2000;
  const weekly = Math.sin(i / 4) * 400;
  const noise = Math.round(Math.random() * 250 - 125);
  return { date, created: Math.max(200, Math.round(trend + weekly + noise)) };
});
const RECORDINGS_WATCHED_RATE = 18420 / 104820;
const RECORDINGS_SHARED_RATE = 2210 / 104820;
const RECORDINGS_LOCKED_RATE = 10900 / 104820;
const RECORDINGS_ALARMED_RATE = 9800 / 104820;

// Recordings created + Alarms triggered, on the same daily axis, so both can
// share a single trend chart (2 lines) instead of 2 near-identical charts.
const recordingsAndAlarmsLong = longDates.map((date, i) => ({
  date,
  created: recordingsCreatedLong[i].created,
  alarms: alarmsOverTimeLong[i].alarms,
}));

// --- Feature Adoption --------------------------------------------------

const featureUsage = [
  { feature: 'Alarm threshold changed', count: 4210 },
  { feature: 'Record schedule set', count: 2870 },
  { feature: 'Night vision mode changed', count: 2340 },
  { feature: 'Border / detection zone adjusted', count: 1980 },
  { feature: 'Motion overlay toggled', count: 1710 },
  { feature: 'Clock mode used', count: 1490 },
  { feature: 'Screen locked (manual)', count: 1120 },
  { feature: 'IR illuminator mode changed', count: 860 },
  { feature: 'Smart Edge suppression', count: 640 },
].sort((a, b) => b.count - a.count);

const scheduleAdoption = [
  { name: 'Using a recording schedule', value: 356 },
  { name: 'No schedule set', value: 626 },
];

// --- Devices & Connectivity ---------------------------------------------

const connectivityTable = [
  { type: 'Wireless (Wi‑Fi)', cameras: 812, pct: '82.7%' },
  { type: 'Wired (Ethernet)', cameras: 170, pct: '17.3%' },
];

const deviceFamily = [
  { name: 'iPad', value: 401 },
  { name: 'iPhone', value: 200 },
  { name: 'Android Tablet', value: 231 },
  { name: 'Android Phone', value: 150 },
];

const osVersionTable = [
  { os: 'iOS 18', devices: 388, pct: '64.6%' },
  { os: 'iOS 17', devices: 176, pct: '29.3%' },
  { os: 'iOS 16 or earlier', devices: 37, pct: '6.1%' },
  { os: 'Android 15', devices: 210, pct: '55.1%' },
  { os: 'Android 14', devices: 129, pct: '33.9%' },
  { os: 'Android 13 or earlier', devices: 42, pct: '11.0%' },
];

// ---------------------------------------------------------------------------
// Small shared UI pieces
// ---------------------------------------------------------------------------

function Answers({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3">
      <span className="inline-block text-[11px] font-semibold tracking-wide text-[#2F6FEB] bg-[#EAF1FE] rounded px-2 py-1 uppercase">
        Answers
      </span>
      <p className="text-sm text-gray-600 mt-1.5 leading-snug">{children}</p>
    </div>
  );
}

function NewEventBadge({ eventName }: { eventName: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8A5A00] bg-[#FFF3D6] border border-[#F5D98B] rounded px-2 py-0.5 ml-2 align-middle"
      title="Not in the current Confluence catalog yet — proposed addition"
    >
      ⚠ Proposed event: <code className="font-mono">{eventName}</code>
    </span>
  );
}

function ChartCard({
  title,
  answers,
  badge,
  children,
  footer,
  className,
}: {
  title: string;
  answers: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-[#E5E9F2] rounded-xl shadow-sm p-5${className ? ` ${className}` : ''}`}>
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
        {badge}
      </div>
      <Answers>{answers}</Answers>
      {children}
      {footer && <div className="mt-4 pt-4 border-t border-[#EEF1F6]">{footer}</div>}
    </div>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-[#E5E9F2] rounded-xl shadow-sm p-5">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{label}</div>
      <div className="text-3xl font-semibold text-[#111827]">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E9F2]">
            {columns.map((c) => (
              <th key={c} className="text-left font-medium text-gray-500 py-2 pr-4 whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#F3F5F9] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 text-[#1F2937] whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-gray-400">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-[#E5E9F2] rounded-lg pl-3 pr-7 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#2F6FEB] cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </label>
  );
}

// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'usage', label: 'Usage & Connectivity', icon: Activity },
  { id: 'alarms', label: 'Alarms & Recordings', icon: Bell },
  { id: 'features', label: 'Feature Adoption', icon: SettingsIcon },
  { id: 'devices', label: 'Devices', icon: Smartphone },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

// Shown for Usage & Connectivity, Alarms, and Recordings only — their
// time-series/summable charts (Active Cameras, Alarms Triggered, the
// Recordings funnel) share the same daily axis, so a range picker is
// meaningful there. It doesn't extend to other charts (cohort retention,
// snapshot tables, distributions), same reasoning as why the Platform
// filter isn't wired to everything either.
const TIME_RANGES = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '60 Days', days: 60 },
  { label: '90 Days', days: 90 },
  { label: '1 Year', days: 365 },
  { label: 'Ever', days: LONG_RANGE_DAYS },
] as const;

export function AnalyticsDashboard({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('usage');
  const [platformFilter, setPlatformFilter] = useState('All Platforms');
  const [timeRange, setTimeRange] = useState('30 Days');
  const timeRangeDays = TIME_RANGES.find((r) => r.label === timeRange)?.days ?? 30;
  // Keep roughly ~8 x-axis labels visible regardless of how many days are shown.
  const timeTickInterval = Math.max(0, Math.ceil(timeRangeDays / 8) - 1);

  // Platform filter applies globally, but only to metrics that are genuinely
  // platform-scoped (counts of events/cameras, or device/OS breakdowns).
  // It intentionally does NOT touch: retention/adoption rates or ratios
  // (scaling a percentage by a headcount multiplier would corrupt it), the
  // churn-vs-alarms comparison (a rate, not a count), or camera-level data
  // like Recordings-by-Camera / Connectivity (a camera's recordings and its
  // own Wi-Fi connection aren't tied to which platform happens to view it).
  const platformMultiplier = platformFilter === 'iOS' ? 0.61 : platformFilter === 'Android' ? 0.39 : 1;
  const scaleCount = (n: number) => Math.round(n * platformMultiplier);

  // Overview-only, range-picker-aware versions (sliced from the long 400-day
  // datasets according to the selected range, then platform-scaled).
  const scaledNightly = useMemo(
    () => lastNDays(nightlyActiveCameras, timeRangeDays).map((d) => ({ ...d, cameras: scaleCount(d.cameras) })),
    [platformMultiplier, timeRangeDays]
  );

  // Single source of truth for Created/Watched/Shared/Locked/Alarmed —
  // summed over the selected time range, then scaled by the Platform filter
  // (all 5 are counts of things that happen via the app, same as each other).
  const recordingsStageTotals = useMemo(() => {
    const createdTotal = lastNDays(recordingsCreatedLong, timeRangeDays).reduce((sum, d) => sum + d.created, 0);
    const created = scaleCount(createdTotal);
    const watched = Math.round(created * RECORDINGS_WATCHED_RATE);
    const shared = Math.round(created * RECORDINGS_SHARED_RATE);
    const locked = Math.round(created * RECORDINGS_LOCKED_RATE);
    const alarmed = Math.round(created * RECORDINGS_ALARMED_RATE);
    return [
      { stage: 'Created', count: created },
      { stage: 'Watched', count: watched },
      { stage: 'Locked', count: locked },
      { stage: 'Alarmed', count: alarmed },
      { stage: 'Shared', count: shared },
    ];
  }, [platformMultiplier, timeRangeDays]);

  // A per-day distribution snapshot, not a real time series — unaffected by
  // the time-range picker (same reasoning as camera-level/rate metrics
  // elsewhere not being scaled by filters that don't conceptually apply).
  const scaledAlarmsDistribution = useMemo(
    () => alarmsPerCameraDistribution.map((d) => ({ ...d, count: scaleCount(d.count) })),
    [platformMultiplier]
  );

  const scaledRecordingsAndAlarms = useMemo(
    () =>
      lastNDays(recordingsAndAlarmsLong, timeRangeDays).map((d) => ({
        date: d.date,
        created: scaleCount(d.created),
        alarms: scaleCount(d.alarms),
      })),
    [platformMultiplier, timeRangeDays]
  );

  const scaledUsageConsistency = useMemo(
    () => usageConsistency.map((d) => ({ ...d, count: scaleCount(d.count) })),
    [platformMultiplier]
  );

  const scaledFeatureUsage = useMemo(
    () => featureUsage.map((d) => ({ ...d, count: scaleCount(d.count) })),
    [platformMultiplier]
  );

  const scaledScheduleAdoption = useMemo(
    () => scheduleAdoption.map((d) => ({ ...d, value: scaleCount(d.value) })),
    [platformMultiplier]
  );

  // Retention: pick the right line/table row directly from the global
  // Platform filter instead of a separate local toggle.
  const retentionKey = platformFilter === 'iOS' ? 'ios' : platformFilter === 'Android' ? 'android' : 'overall';
  const retentionSegmentLabel = platformFilter === 'iOS' ? 'iOS' : platformFilter === 'Android' ? 'Android' : 'All Cameras';
  const retentionLineName = platformFilter === 'iOS' ? 'iOS' : platformFilter === 'Android' ? 'Android' : 'All Cameras';
  const retentionLineColor = platformFilter === 'iOS' ? COLORS.purple : platformFilter === 'Android' ? COLORS.teal : COLORS.primary;

  // Device Family / OS Version: filter rows to the selected platform.
  const filteredDeviceFamily = deviceFamily.filter((d) => {
    if (platformFilter === 'iOS') return d.name === 'iPad' || d.name === 'iPhone';
    if (platformFilter === 'Android') return d.name === 'Android Tablet' || d.name === 'Android Phone';
    return true;
  });
  const filteredOsVersionTable = osVersionTable.filter((d) => {
    if (platformFilter === 'iOS') return d.os.startsWith('iOS');
    if (platformFilter === 'Android') return d.os.startsWith('Android');
    return true;
  });

  return (
    <div className="w-screen h-screen bg-[#F7F8FB] text-[#111827] flex overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-[#E5E9F2] flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center gap-2 px-4 border-b border-[#E5E9F2]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2F6FEB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="px-3 py-2 flex-1 overflow-y-auto">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3 mb-1 mt-2">
            Sami Analytics
          </div>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                  active ? 'bg-[#EAF1FE] text-[#2F6FEB] font-medium' : 'text-gray-600 hover:bg-[#F7F8FB]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#E5E9F2]">
          <button className="w-full text-sm text-center text-gray-500 border border-[#E5E9F2] rounded-lg py-1.5 hover:bg-[#F7F8FB]">
            Export Data
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-16 border-b border-[#E5E9F2] bg-white flex items-center justify-between px-6 flex-shrink-0">
          <div className="text-lg font-semibold">
            {CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </div>
        </div>

        {/* Filters row */}
        <div className="h-14 border-b border-[#E5E9F2] bg-white flex items-center gap-4 px-6 flex-shrink-0">
          <Dropdown label="Platform" options={['All Platforms', 'iOS', 'Android']} value={platformFilter} onChange={setPlatformFilter} />
          {(activeCategory === 'usage' || activeCategory === 'alarms') && (
            <Dropdown
              label="Time range"
              options={TIME_RANGES.map((r) => r.label)}
              value={timeRange}
              onChange={setTimeRange}
            />
          )}
          <span className="text-xs text-gray-400 ml-auto">All figures below are illustrative / dummy data</span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeCategory === 'usage' && (
            <div className="space-y-6">
              <ChartCard
                title="Online Cameras Over Time"
                answers="How many cameras are online each day?"
              >
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={scaledNightly}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.axis }} interval={timeTickInterval} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="cameras" stroke={COLORS.primary} fill={COLORS.primaryLight} fillOpacity={0.5} name="Online cameras" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Internet Connection Retention"
                answers="Are cameras still connecting to the internet weeks after setup?"
                footer={
                  <SimpleTable
                    columns={['Segment', 'Cameras', 'Day 0', 'Day 1', 'Day 7', 'Day 30']}
                    rows={retentionTable
                      .filter((r) => r.segment === retentionSegmentLabel)
                      .map((r) => [r.segment, r.cameras, r.day0, r.day1, r.day7, r.day30])}
                  />
                }
              >
                <p className="text-xs text-gray-500 -mt-1 mb-3">
                  % of newly paired cameras still online, day by day since setup. Sami cameras can run fully offline over local network. This measures internet connectivity, not real-world usage.
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={retentionData}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: COLORS.axis }} interval={2} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={retentionKey} name={retentionLineName} stroke={retentionLineColor} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="grid grid-cols-2 gap-6">
                <ChartCard
                  title="Connection Consistency"
                  answers="Consistent vs. sporadic internet check-ins — how many cameras connect daily vs. only occasionally?"
                >
                  <p className="text-xs text-gray-500 -mt-1 mb-3">
                    Cameras grouped by how many days a week they are online.
                  </p>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={scaledUsageConsistency}>
                      <CartesianGrid stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="segment" tick={{ fontSize: 10, fill: COLORS.axis }} interval={0} angle={-15} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.primary} radius={[6, 6, 0, 0]} name="Cameras" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Days Until Reconnection"
                  answers="When a camera goes quiet, how long does it typically take to reconnect?"
                >
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={reconnectionGaps}>
                      <CartesianGrid stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <Tooltip />
                      <Bar dataKey="count" name="Cameras" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-500 mt-2">
                    Comparing consecutive connection timestamps per camera and measuring the gap whenever one exceeds a day. &quot;90+ days / never&quot; includes cameras that may simply be in ongoing offline-only use.
                  </p>
                </ChartCard>
              </div>

              <ChartCard
                title="Camera Connectivity"
                answers="Connectivity: how many cameras connect wirelessly vs. wired?"
              >
                <SimpleTable
                  columns={['Connection type', 'Cameras', '% of fleet']}
                  rows={connectivityTable.map((r) => [r.type, r.cameras, r.pct])}
                />
              </ChartCard>
            </div>
          )}

          {activeCategory === 'alarms' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ChartCard
                  title="Recordings Created Over Time"
                  answers="How many recordings are being made?"
                  badge={<NewEventBadge eventName="recording_created" />}
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={scaledRecordingsAndAlarms}>
                      <CartesianGrid stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.axis }} interval={timeTickInterval} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="created" stroke={COLORS.primary} fill={COLORS.primaryLight} fillOpacity={0.5} name="Recordings created" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Alarms Triggered Over Time"
                  answers="How many alarms are being triggered?"
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={scaledRecordingsAndAlarms}>
                      <CartesianGrid stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.axis }} interval={timeTickInterval} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="alarms" stroke={COLORS.coral} strokeWidth={2} dot={false} name="Alarms triggered" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <ChartCard
                title="Alarms per Camera per Day"
                answers="How many alarms are triggered per camera per day — are they concentrated on a few cameras, or spread evenly across all of them?"
              >
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={scaledAlarmsDistribution}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="bin" tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.amber} radius={[6, 6, 0, 0]} name="Cameras" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Recordings: Created, Watched, Locked, Alarmed, Shared"
                answers="How many recordings are being made, watched, locked, marked alarmed, and shared?"
                badge={<NewEventBadge eventName="recording_created" />}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={recordingsStageTotals} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: '#111827' }} width={70} />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-3">
                  This is not a live snapshot, so a recording locked then unlocked still counts here.
                </p>
              </ChartCard>
            </div>
          )}

          {activeCategory === 'features' && (
            <div className="space-y-6">
              <ChartCard
                title="Feature Usage"
                answers="What features are being used? How many times do people utilize a given feature?"
              >
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={scaledFeatureUsage} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: '#111827' }} width={220} />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary} radius={[0, 6, 6, 0]} name="Events (30d)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Recording Schedule Adoption"
                answers="How many cameras are setting recording schedules?"
              >
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={scaledScheduleAdoption} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                      {scaledScheduleAdoption.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? COLORS.teal : COLORS.grid} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {activeCategory === 'devices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 max-w-md">
                <ChartCard
                  title="Device Family"
                  answers="Apple device: what device type is being used to monitor?"
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={filteredDeviceFamily} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                        {filteredDeviceFamily.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12 }} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-500 mt-2">From Amplitude&apos;s auto-captured <code className="font-mono">device_model</code>.</p>
                </ChartCard>
              </div>

              <ChartCard
                title="OS Version Breakdown"
                answers="What iOS / Android version are monitoring devices running?"
              >
                <SimpleTable
                  columns={['OS Version', 'Devices', '% of platform']}
                  rows={filteredOsVersionTable.map((r) => [r.os, r.devices, r.pct])}
                />
                <p className="text-xs text-gray-500 mt-3">From Amplitude&apos;s auto-captured <code className="font-mono">os_name</code> / <code className="font-mono">os_version</code>.</p>
              </ChartCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
