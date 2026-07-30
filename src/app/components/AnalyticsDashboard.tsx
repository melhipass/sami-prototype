'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft, Search, Share2, SlidersHorizontal, Home, Activity, Bell, Video,
  Settings as SettingsIcon, Smartphone, ChevronDown, HelpCircle,
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

const nightlyActiveCameras = Array.from({ length: 30 }, (_, i) => {
  const base = 640 + Math.round(Math.sin(i / 4) * 40);
  const weekend = i % 7 === 5 || i % 7 === 6 ? 35 : 0;
  return { date: `Jul ${i + 1}`, cameras: base + weekend + Math.round(Math.random() * 20 - 10) };
});

const usageConsistency = [
  { segment: 'Nightly (6–7 nights/wk)', count: 412 },
  { segment: 'Frequent (3–5 nights/wk)', count: 268 },
  { segment: 'Occasional (1–2 nights/wk)', count: 137 },
  { segment: 'Inactive (0 in last 7 days)', count: 165 },
];

const churnVsAlarms = [
  { group: 'Retained\n(active 30d+)', avgAlarmsPerNight: 1.8 },
  { group: 'Churned\n(inactive after setup)', avgAlarmsPerNight: 6.4 },
];

const retentionTable = [
  { segment: 'All Cameras', cameras: 982, day0: '100%', day1: '54%', day7: '39%', day30: '27%' },
  { segment: 'iOS', cameras: 601, day0: '100%', day1: '58%', day7: '43%', day30: '31%' },
  { segment: 'Android', cameras: 381, day0: '100%', day1: '48%', day7: '32%', day30: '21%' },
];

// --- Alarms --------------------------------------------------------------

const alarmsOverTime = Array.from({ length: 30 }, (_, i) => ({
  date: `Jul ${i + 1}`,
  alarms: 2100 + Math.round(Math.sin(i / 3) * 300 + Math.random() * 150),
}));

const alarmsPerCameraDistribution = [
  { bin: '0', count: 165 },
  { bin: '1–3', count: 401 },
  { bin: '4–6', count: 258 },
  { bin: '7–10', count: 104 },
  { bin: '10+', count: 54 },
];

// --- Recordings ------------------------------------------------------------

const recordingsCreatedOverTime = Array.from({ length: 30 }, (_, i) => ({
  date: `Jul ${i + 1}`,
  created: 3400 + Math.round(Math.sin(i / 4) * 500 + Math.random() * 300),
}));

const recordingsFunnel = [
  { stage: 'Created', count: 104820 },
  { stage: 'Watched', count: 18420 },
  { stage: 'Shared', count: 2210 },
];

const recordingsDuringAlarm = [
  { name: 'During an active alarm', value: 21730 },
  { name: 'Routine (motion / continuous)', value: 83090 },
];

const recordingsTagged = [
  { tag: 'Locked', count: 8340 },
  { tag: 'Marked Alarmed', count: 12680 },
  { tag: 'Shared', count: 2210 },
];

const recordingsByCameraTable = [
  { camera: 'B8:27:EB:1A:2B:3C', created: 412, watched: 61, locked: 14, alarmed: 22, shared: 3 },
  { camera: 'B8:27:EB:4F:9C:11', created: 388, watched: 40, locked: 6, alarmed: 15, shared: 1 },
  { camera: 'B8:27:EB:7A:2D:88', created: 205, watched: 22, locked: 2, alarmed: 8, shared: 0 },
  { camera: 'B8:27:EB:C3:0E:56', created: 601, watched: 95, locked: 31, alarmed: 47, shared: 9 },
  { camera: 'B8:27:EB:9B:44:2A', created: 97, watched: 12, locked: 1, alarmed: 3, shared: 0 },
];

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
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'usage', label: 'Usage & Retention', icon: Activity },
  { id: 'alarms', label: 'Alarms', icon: Bell },
  { id: 'recordings', label: 'Recordings', icon: Video },
  { id: 'features', label: 'Feature Adoption', icon: SettingsIcon },
  { id: 'devices', label: 'Devices & Connectivity', icon: Smartphone },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

export function AnalyticsDashboard({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('overview');
  const [platformFilter, setPlatformFilter] = useState('All Platforms');

  // Platform filter applies globally, but only to metrics that are genuinely
  // platform-scoped (counts of events/cameras, or device/OS breakdowns).
  // It intentionally does NOT touch: retention/adoption rates or ratios
  // (scaling a percentage by a headcount multiplier would corrupt it), the
  // churn-vs-alarms comparison (a rate, not a count), or camera-level data
  // like Recordings-by-Camera / Connectivity (a camera's recordings and its
  // own Wi-Fi connection aren't tied to which platform happens to view it).
  const platformMultiplier = platformFilter === 'iOS' ? 0.61 : platformFilter === 'Android' ? 0.39 : 1;
  const scaleCount = (n: number) => Math.round(n * platformMultiplier);

  const scaledNightly = useMemo(
    () => nightlyActiveCameras.map((d) => ({ ...d, cameras: scaleCount(d.cameras) })),
    [platformMultiplier]
  );

  const scaledAlarmsOverTime = useMemo(
    () => alarmsOverTime.map((d) => ({ ...d, alarms: scaleCount(d.alarms) })),
    [platformMultiplier]
  );

  const scaledAlarmsDistribution = useMemo(
    () => alarmsPerCameraDistribution.map((d) => ({ ...d, count: scaleCount(d.count) })),
    [platformMultiplier]
  );

  const scaledRecordingsCreatedOverTime = useMemo(
    () => recordingsCreatedOverTime.map((d) => ({ ...d, created: scaleCount(d.created) })),
    [platformMultiplier]
  );

  const scaledRecordingsFunnel = useMemo(
    () => recordingsFunnel.map((d) => ({ ...d, count: scaleCount(d.count) })),
    [platformMultiplier]
  );

  const scaledRecordingsDuringAlarm = useMemo(
    () => recordingsDuringAlarm.map((d) => ({ ...d, value: scaleCount(d.value) })),
    [platformMultiplier]
  );

  const scaledRecordingsTagged = useMemo(
    () => recordingsTagged.map((d) => ({ ...d, count: scaleCount(d.count) })),
    [platformMultiplier]
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

        <div className="px-4 py-3 border-b border-[#E5E9F2]">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F7F8FB] cursor-pointer">
            <div className="w-6 h-6 rounded bg-[#7C5CFC] text-white text-xs font-bold flex items-center justify-center">D</div>
            <span className="text-sm font-medium truncate">[Dev] Sami Analytics</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto" />
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-[#F3F5F9] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Search</span>
          </div>
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
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Cameras Tracked</span>
            <span className="font-medium text-gray-700">982 / 1,500</span>
          </div>
          <div className="w-full h-1.5 bg-[#F3F5F9] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-[#F5A623] rounded-full" style={{ width: '65%' }} />
          </div>
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
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-[#E5E9F2]">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-[#E5E9F2]">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-1.5 text-sm text-white bg-[#2F6FEB] hover:bg-[#2F6FEB]/90 px-3 py-1.5 rounded-lg font-medium">
              <SlidersHorizontal className="w-4 h-4" />
              Customize
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="h-14 border-b border-[#E5E9F2] bg-white flex items-center gap-4 px-6 flex-shrink-0">
          <Dropdown label="Platform" options={['All Platforms', 'iOS', 'Android']} value={platformFilter} onChange={setPlatformFilter} />
          <span className="text-xs text-gray-400 ml-auto">All figures below are illustrative / dummy data</span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeCategory === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ChartCard
                  title="Nightly Active Cameras"
                  answers="How many cameras are being used every night?"
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={scaledNightly}>
                      <CartesianGrid stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.axis }} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="cameras" stroke={COLORS.primary} fill={COLORS.primaryLight} fillOpacity={0.5} name="Active cameras" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard
                  title="Alarms Triggered Over Time"
                  answers="How many alarms are being triggered?"
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={scaledAlarmsOverTime}>
                      <CartesianGrid stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.axis }} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="alarms" stroke={COLORS.coral} fill={COLORS.coral} fillOpacity={0.15} name="Alarms triggered" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard
                  title="Recordings: Created vs. Watched vs. Shared"
                  answers="How many recordings are being made, how many were watched, and how many were shared?"
                  badge={<NewEventBadge eventName="recording_created" />}
                  className="col-span-2"
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={scaledRecordingsFunnel} layout="vertical" margin={{ left: 24 }}>
                      <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: '#111827' }} width={70} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.primary} radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          )}

          {activeCategory === 'usage' && (
            <div className="space-y-6">
              <ChartCard
                title="Overall Retention"
                answers="What does usage look like over time? Are cameras still being used weeks after setup?"
                footer={
                  <SimpleTable
                    columns={['Segment', 'Cameras', 'Day 0', 'Day 1', 'Day 7', 'Day 30']}
                    rows={retentionTable
                      .filter((r) => r.segment === retentionSegmentLabel)
                      .map((r) => [r.segment, r.cameras, r.day0, r.day1, r.day7, r.day30])}
                  />
                }
              >
                <p className="text-xs text-gray-500 -mt-1 mb-3">Controlled by the Platform filter above.</p>
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
                  title="Usage Consistency"
                  answers="Consistent vs. sporadic usage — how many cameras are used nightly vs. only occasionally?"
                >
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
                  title="Drop-off vs. Nightly Alarm Volume"
                  answers="Can we correlate drop-off with anything? e.g. do cameras that get abandoned tend to have had many more alarms per night beforehand?"
                >
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={churnVsAlarms}>
                      <CartesianGrid stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="group" tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <Tooltip />
                      <Bar dataKey="avgAlarmsPerNight" name="Avg alarms / night" radius={[6, 6, 0, 0]}>
                        {churnVsAlarms.map((_, i) => (
                          <Cell key={i} fill={i === 1 ? COLORS.coral : COLORS.teal} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-500 mt-2">
                    Illustrative only — computed by joining last-activity date per camera against average nightly <code className="font-mono">alarm_triggered</code> count in the prior week. Not a built-in event; requires a cross-event query in Snowflake.
                  </p>
                </ChartCard>
              </div>
            </div>
          )}

          {activeCategory === 'alarms' && (
            <div className="space-y-6">
              <ChartCard
                title="Alarms Triggered Over Time"
                answers="How many alarms are being triggered?"
              >
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={scaledAlarmsOverTime}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.axis }} interval={4} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="alarms" stroke={COLORS.coral} strokeWidth={2} dot={false} name="alarm_triggered events" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Alarms per Camera per Night"
                answers="How many alarms are being triggered — broken down by how concentrated they are on individual cameras (relevant to the drop-off correlation above)."
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
            </div>
          )}

          {activeCategory === 'recordings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ChartCard
                  title="Recordings Created Over Time"
                  answers="How many recordings are being made? (Matt: 'we make a ton and most are probably not actual events')"
                  badge={<NewEventBadge eventName="recording_created" />}
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={scaledRecordingsCreatedOverTime}>
                      <CartesianGrid stroke={COLORS.grid} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.axis }} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="created" stroke={COLORS.primary} fill={COLORS.primaryLight} fillOpacity={0.5} name="Recordings created" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Recordings Made During an Active Alarm"
                  answers="How many recordings were made during an alarm, vs. routine motion/continuous recording?"
                  badge={<NewEventBadge eventName="recording_created.was_during_alarm" />}
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={scaledRecordingsDuringAlarm} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                        {scaledRecordingsDuringAlarm.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? COLORS.coral : COLORS.primaryLight} />
                        ))}
                      </Pie>
                      <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12 }} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <ChartCard
                title="Recordings Tagged by Caregivers"
                answers="How many recordings does each user have tagged as alarmed or locked manually? How many were shared?"
              >
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={scaledRecordingsTagged} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <YAxis type="category" dataKey="tag" tick={{ fontSize: 12, fill: '#111827' }} width={110} />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.purple} radius={[0, 6, 6, 0]} name="recording_action events" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2">
                  From <code className="font-mono">recording_action</code> events where <code className="font-mono">action</code> is <code className="font-mono">lock</code>, <code className="font-mono">mark_alarmed</code>, or <code className="font-mono">share</code>. This counts actions taken, not a live snapshot — a recording locked then unlocked won&apos;t show as currently locked; see the per-camera breakdown below for a point-in-time view.
                </p>
              </ChartCard>

              <ChartCard
                title="Recordings by Camera"
                answers="How many recordings does each of our cameras have — created, watched, locked, alarmed, and shared?"
                badge={<NewEventBadge eventName="recording_created" />}
              >
                <SimpleTable
                  columns={['Camera (MAC)', 'Created', 'Watched', 'Locked', 'Alarmed', 'Shared']}
                  rows={recordingsByCameraTable.map((r) => [r.camera, r.created, r.watched, r.locked, r.alarmed, r.shared])}
                />
                <p className="text-xs text-gray-500 mt-3">
                  Not affected by the Platform filter — a camera&apos;s recordings belong to the camera itself, not to whichever device happens to view them.
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
                <p className="text-xs text-gray-500 mt-2">
                  From <code className="font-mono">setting_changed</code> / <code className="font-mono">camera_setting_changed</code> (grouped by <code className="font-mono">setting</code>) plus the Live Monitoring toggle events. Dropbox / Google Drive backup are intentionally omitted — not being built right now.
                </p>
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
                <p className="text-xs text-gray-500 mt-2">
                  From <code className="font-mono">camera_setting_changed</code> where <code className="font-mono">setting = record_schedule</code>.
                </p>
              </ChartCard>
            </div>
          )}

          {activeCategory === 'devices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ChartCard
                  title="Camera Connectivity"
                  answers="Connectivity: how many cameras connect wirelessly vs. wired?"
                >
                  <SimpleTable
                    columns={['Connection type', 'Cameras', '% of fleet']}
                    rows={connectivityTable.map((r) => [r.type, r.cameras, r.pct])}
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    From <code className="font-mono">camera_setting_changed</code> (<code className="font-mono">setting: camera_wifi</code>), taking the most recent value per camera. Not affected by the Platform filter — this is the camera&apos;s own connection, not the viewing device&apos;s. Network name (SSID) is intentionally not tracked — dropped for privacy, per team decision.
                  </p>
                </ChartCard>

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
