'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft, Activity, Bell, RefreshCw, BookOpen, FileText,
  Settings as SettingsIcon, Smartphone, ChevronDown, Search, Info,
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

// Onboarding funnel — each step corresponds to a real screen-viewed event
// from the Event Catalog (Welcome → Disclaimers → Setup Guide → Verify
// Camera → Permissions → Connect), ending in onboarding_camera_added.
const onboardingFunnel = [
  { step: 'Welcome', count: 1000 },
  { step: 'Disclaimers', count: 927 },
  { step: 'Setup Guide', count: 861 },
  { step: 'Verify Camera', count: 803 },
  { step: 'Permissions', count: 758 },
  { step: 'Connect', count: 706 },
  { step: 'Completed', count: 642 },
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

// Which "setting" values on setting_changed / camera_setting_changed get
// changed most. Excludes not-yet-wired settings (border_size,
// recording_transfers_enabled, hide_shorter_than, google_drive_backup,
// disable_telemetry, always_allow_mobile_data) since they're no-op today —
// see Open Items in the Event Catalog.
const appSettingsUsage = [
  { setting: 'Alarm threshold', count: 3120 },
  { setting: 'Motion threshold', count: 2840 },
  { setting: 'Alarm volume', count: 2210 },
  { setting: 'Alarm disable time', count: 1860 },
  { setting: 'Screen timeout to clock', count: 1540 },
  { setting: 'Storage limit (GB)', count: 1290 },
  { setting: 'Alarm sound', count: 980 },
  { setting: 'Vibrate on alarm', count: 740 },
  { setting: 'Sensitivity boost', count: 610 },
  { setting: 'Selected device', count: 420 },
  // Not-yet-wired settings — present in the UI but no-op/local-only today, so
  // 0 real usage until they're implemented (see Open Items in the catalog).
  { setting: 'Border size (not wired)', count: 0 },
  { setting: 'Recording transfers enabled (not wired)', count: 0 },
  { setting: 'Hide shorter than (not wired)', count: 0 },
  { setting: 'Google Drive backup (not wired)', count: 0 },
  { setting: 'Disable telemetry (not wired)', count: 0 },
  { setting: 'Always allow mobile data (not wired)', count: 0 },
].sort((a, b) => b.count - a.count);

const cameraSettingsUsage = [
  { setting: 'Night vision mode', count: 2680 },
  { setting: 'Record mode', count: 2340 },
  { setting: 'Record threshold', count: 1920 },
  { setting: 'Camera Wi‑Fi', count: 1450 },
  { setting: 'Record schedule', count: 1180 },
  { setting: 'IR illuminator mode', count: 890 },
  { setting: 'Internet viewing', count: 560 },
  { setting: 'IP address', count: 310 },
  { setting: 'Power light flash on viewer', count: 240 },
  { setting: 'Camera password', count: 150 },
].sort((a, b) => b.count - a.count);

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
  chartId,
  onViewEvents,
}: {
  title: string;
  answers?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  chartId?: string;
  onViewEvents?: () => void;
}) {
  return (
    <div className={`bg-white border border-[#E5E9F2] rounded-xl shadow-sm p-5${className ? ` ${className}` : ''}`}>
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
        {badge}
      </div>
      {answers && <Answers>{answers}</Answers>}
      {children}
      {footer && <div className="mt-4 pt-4 border-t border-[#EEF1F6]">{footer}</div>}
      {chartId && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono tracking-wide">{chartId}</span>
          {onViewEvents && (
            <button onClick={onViewEvents} className="text-[11px] text-[#2F6FEB] hover:underline">
              View events used →
            </button>
          )}
        </div>
      )}
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

// Hover tooltip rendered via a portal to document.body, positioned from the
// icon's own bounding rect. Needed because the catalog table sits inside an
// `overflow-x-auto` wrapper — per the CSS spec, once one axis is non-visible
// the other is forced to `auto` too, so a plain absolutely-positioned
// tooltip gets clipped (worst when there are few rows, like a 1-row
// "View events used" filter result). Rendering to document.body sidesteps
// that clipping entirely.
function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLSpanElement>(null);

  const show = () => {
    const rect = iconRef.current?.getBoundingClientRect();
    if (rect) {
      setCoords({ top: rect.bottom + 6, left: Math.max(8, Math.min(rect.left, window.innerWidth - 300)) });
    }
    setOpen(true);
  };

  return (
    <span ref={iconRef} className="relative inline-flex" onMouseEnter={show} onMouseLeave={() => setOpen(false)}>
      <Info className="w-3.5 h-3.5 text-gray-400 cursor-help shrink-0" />
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed z-50 w-72 bg-[#111827] text-gray-100 text-xs font-sans normal-case whitespace-pre-line rounded-lg shadow-lg p-3 leading-snug pointer-events-none"
            style={{ top: coords.top, left: coords.left }}
          >
            {text}
          </div>,
          document.body
        )}
    </span>
  );
}

// Same idea as SimpleTable, but columns wrap (event descriptions run long)
// and the event-name column is monospaced. A handful of events
// (setting_changed, camera_setting_changed) have a documented `setting`
// enum reference — shown as a hover tooltip on an info icon next to the
// event name, rather than its own mostly-empty column.
function CatalogTable({ rows }: { rows: { category: string; event: string; when: string; data: string; reference?: string; isProposed?: boolean }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#E5E9F2]">
            <th className="text-left font-semibold text-[#111827] py-2 pr-4 align-top w-[160px]">Category</th>
            <th className="text-left font-semibold text-[#111827] py-2 pr-4 align-top w-[220px]">Event</th>
            <th className="text-left font-semibold text-[#111827] py-2 pr-4 align-top w-[240px]">When it fires</th>
            <th className="text-left font-semibold text-[#111827] py-2 align-top">Event-specific data</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[#F3F5F9] last:border-0 align-top">
              <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">{r.category}</td>
              <td className="py-2.5 pr-4 font-mono text-xs text-[#2F6FEB]">
                <span className="inline-flex items-center gap-1.5">
                  {r.isProposed && (
                    <span className="font-sans text-[9px] font-semibold text-[#8A5A00] bg-[#FFF3D6] border border-[#F5D98B] rounded px-1 py-0.5 tracking-wide">
                      CLAUDE
                    </span>
                  )}
                  {r.event}
                  {r.reference && <InfoTooltip text={r.reference} />}
                </span>
              </td>
              <td className="py-2.5 pr-4 text-[#1F2937]">{r.when}</td>
              <td className="py-2.5 text-gray-600">{r.data}</td>
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
// Event Catalog — transcribed from the "Analytics — Event Catalog &
// Metadata" Confluence doc (space: Engineering, page 352157699), last
// fetched live on the date this section was built. Unlike the rest of the
// dashboard, this is real documented content, not dummy data.
// ---------------------------------------------------------------------------

const CATALOG_CONVENTIONS = [
  'Event & property naming: snake_case (e.g. recording_deleted, camera_signal_strength).',
  'Analytics identity: the app has no user account/login (the camera is local), so the device is the analytics identity. There is no user_id.',
  'Value typing (Snowflake BI): mixed-type property values are avoided so each property maps to a single, castable column in the Amplitude → Snowflake export. new_value / previous_value on setting_changed and camera_setting_changed are sent as strings; cast per setting in SQL.',
];

const CATALOG_SHARED_PROPERTIES = {
  columns: ['Property', 'Type', 'Example', 'Source / Notes'],
  rows: [
    ['camera_status', 'enum', 'Online', 'CameraStatus: Offline / Connecting / BadPassword / NeedsReboot / Online'],
    ['camera_signal_strength', 'integer', '3', 'Signal level 1–4 from StreamHealth.Healthy.level (0 when degraded/disconnected)'],
    ['wifi_quality', 'enum', 'OK', 'WifiQualityLevel: UNKNOWN / POOR / OK / EXCELLENT (camera-reported SNR bucket)'],
    ['app_build', 'integer', '1420', 'Build number (versionCode / CFBundleVersion) — Amplitude only auto-captures the marketing version, so we send the build explicitly'],
    ['device_timezone', 'string', 'America/Los_Angeles', 'IANA tz ID from the device (not captured by default)'],
  ],
};

const CATALOG_IDENTITY_PROPERTIES = {
  columns: ['Property', 'Type', 'Example', 'Source / Notes'],
  rows: [
    ['camera_mac_address', 'string', 'B8:27:EB:1A:2B:3C', 'Camera HWADDR, uppercased — primary device key'],
    ['camera_model', 'string', 'SAMi3', 'Camera.model'],
    ['camera_firmware_version', 'string | null', '3.2.1', 'From the camera system-info raw fields (requires parsing — see open items)'],
  ],
};

const CATALOG_AUTO_CAPTURED = {
  columns: ['Field', 'Amplitude property', 'Example', 'Notes'],
  rows: [
    ['App version', 'version (Version)', '2.4.0', 'Marketing version only — see app_build above for the build number'],
    ['OS name', 'os_name', 'android', ''],
    ['OS version', 'os_version', '14', ''],
    ['Device manufacturer', 'device_manufacturer', 'Samsung', ''],
    ['Device model', 'device_model', 'SM-G991B', ''],
    ['Locale', 'language + country', 'English + US', 'Captured as two separate fields, not a single en-US'],
    ['Device identity', 'device_id', '7f3c…', 'SDK-generated per-install ID; serves as the analytics identity'],
    ['Session', 'session_id, event_time', '—', 'Session start/end auto-tracked by the SDK'],
  ],
};

type CatalogEvent = { event: string; when: string; data: string; reference?: string; isProposed?: boolean };
type CatalogSection = { title: string; description?: string; events: CatalogEvent[] };

const EVENT_CATALOG: CatalogSection[] = [
  {
    title: 'App & Session',
    description: 'App lifecycle and how long the app runs. Permission prompts live in Onboarding, not here. Running time is measured via a periodic heartbeat (survives crashes/kills) rather than relying on Amplitude’s built-in session length.',
    events: [
      { event: 'app_opened', when: 'App cold start / first launch into memory', data: 'permissions_already_granted (bool)' },
      { event: 'app_foregrounded', when: 'App returns to the foreground', data: '—' },
      { event: 'app_backgrounded', when: 'App sent to the background', data: 'active_screen (enum: live, recordings, settings, help), foreground_duration_seconds (int) — duration of the run just ended' },
      { event: 'app_heartbeat', when: 'Hourly while the app is active in the foreground', data: 'elapsed_seconds (int) — continuous foreground time so far; is_streaming (bool) — live video playing at heartbeat time; stream_elapsed_seconds (int) — continuous streaming time so far' },
    ],
  },
  {
    title: 'Onboarding — Welcome',
    description: 'Entry screen introducing the app, with Configure My Sami Camera and Learn More About Sami actions.',
    events: [
      { event: 'onboarding_welcome_viewed', when: 'Welcome screen is shown', data: '—' },
      { event: 'onboarding_welcome_option_selected', when: 'User taps one of the two buttons', data: 'option (enum: configure_camera, learn_more)' },
    ],
  },
  {
    title: 'Onboarding — Disclaimers',
    description: 'Lists safety/legal disclaimers as toggles, a Terms & Conditions / Privacy Policy checkbox, and Accept All / Cancel.',
    events: [
      { event: 'onboarding_disclaimers_viewed', when: 'Disclaimers step is shown', data: '—' },
      { event: 'onboarding_disclaimers_accepted', when: 'Accept All tapped', data: 'accepted_disclaimers (array of enum — toggles ON at accept, e.g. nocturnal_movement_monitor, no_guarantee_of_effectiveness; full list TBD), terms_agreed (bool)' },
      { event: 'onboarding_disclaimers_cancelled', when: 'Cancel tapped', data: '—' },
    ],
  },
  {
    title: 'Onboarding — Setup Guide',
    description: 'Recommends a setup guide based on connection method; an early signal of hardware configuration.',
    events: [
      { event: 'onboarding_guide_viewed', when: 'Setup Guide step is shown', data: '—' },
      { event: 'onboarding_guide_option_selected', when: 'User taps a guide card', data: 'guide (enum: complete_kit, camera_plus_hub, camera_only)' },
      { event: 'onboarding_guide_continued', when: 'Continue Setup tapped', data: '—' },
      { event: 'onboarding_guide_cancelled', when: 'Cancel tapped', data: '—' },
    ],
  },
  {
    title: 'Onboarding — Verify Camera',
    description: 'Confirms the camera power light is green and the device is on the same Wi-Fi network.',
    events: [
      { event: 'onboarding_camera_ready_viewed', when: 'Verify Camera is Ready screen is shown', data: '—' },
      { event: 'onboarding_camera_ready_option_selected', when: 'User taps a button', data: 'option (enum: light_green, having_trouble)' },
    ],
  },
  {
    title: 'Onboarding — Permissions',
    description: 'Requests Location, Local Network, and Notifications permissions, one event per permission.',
    events: [
      { event: 'onboarding_permissions_viewed', when: 'Permissions step is shown', data: '—' },
      { event: 'onboarding_permission_requested', when: 'A permission’s system prompt is presented', data: 'permission (enum: location, local_network, notifications)' },
      { event: 'onboarding_permission_result', when: 'User responds, or returns from system settings', data: 'permission (enum, same), granted (bool), location_precision (enum: precise, approximate, none — location only), trigger (enum: prompt, settings_return)' },
      { event: 'onboarding_permissions_continued', when: 'User advances to the Connect step', data: 'all_granted (bool)' },
    ],
  },
  {
    title: 'Onboarding — Connect',
    description: 'Camera discovery, selection, password configuration, and the onboarding-completion event. Password/hint text is never sent, only whether a hint was provided.',
    events: [
      { event: 'onboarding_connect_viewed', when: 'Connect step is shown (search starts automatically)', data: '—' },
      { event: 'onboarding_camera_search_started', when: 'Camera discovery begins (auto on display, or via Search Again)', data: 'trigger (enum: auto, search_again)' },
      { event: 'onboarding_camera_search_succeeded', when: 'One or more cameras found (list screen shown)', data: 'cameras_found (array of MAC addresses)' },
      { event: 'onboarding_camera_search_failed', when: 'Search ends with the error screen', data: 'error_reason (enum: no_cameras_found, network_error, timeout — full list TBD)' },
      { event: 'onboarding_camera_selected', when: 'User taps a camera in the found list', data: 'camera_mac_address (string)' },
      { event: 'onboarding_camera_password_viewed', when: 'Password configuration screen shown after a camera is selected', data: 'mode (enum: new_camera, existing), camera_mac_address (string)' },
      { event: 'onboarding_camera_password_submitted', when: 'User submits the password form', data: 'mode (enum, same), camera_mac_address (string), hint_provided (bool — new_camera only)' },
      { event: 'onboarding_camera_add_requested', when: 'Add Selected Camera tapped', data: 'camera_mac_address (string)' },
      { event: 'onboarding_camera_added', when: 'Camera successfully added / connected — onboarding complete', data: 'camera_mac_address (string)' },
      { event: 'onboarding_camera_add_failed', when: 'Add / connect attempt fails', data: 'camera_mac_address (string), error_reason (enum: e.g. bad_password, connection_failed — full list TBD)' },
      { event: 'onboarding_connect_back', when: 'Go Back tapped', data: '—' },
    ],
  },
  {
    title: 'App Settings',
    description: 'The Settings screen. All control changes are captured with one consolidated setting_changed event rather than one event per control. Sliders/steppers fire once on commit, not per drag.',
    events: [
      { event: 'settings_viewed', when: 'Settings screen is shown', data: '—' },
      {
        event: 'setting_changed',
        when: 'A setting is changed (on commit — see slider rule)',
        data: 'setting (enum — see reference), new_value (string), previous_value (string), section (enum: devices, alarms, schedule, audio, display, recordings, mobile_data)',
        reference:
          'The possible values of "setting", grouped by settings section:\n\n' +
          'Devices: selected_device\n' +
          'Alarms: alarm_enabled, motion_threshold, alarm_threshold, sensitivity_boost, max_pause_time, border_size (not wired), smart_edge, beep_camera_fault, beep_app_not_active\n' +
          'Schedule: schedule_enabled, alarm_enable_time, alarm_disable_time\n' +
          'Audio: alarm_volume, alarm_sound (values A–F), alarm_duration, vibrate_on_alarm, microphone_boost, noise_reduction\n' +
          'Display: screen_timeout_to_clock, screen_timeout_delay\n' +
          'Recordings: recording_transfers_enabled (not wired), storage_limit_gb, hide_shorter_than (not wired), google_drive_backup (not wired)\n' +
          'Mobile Data: disable_telemetry (not wired), always_allow_mobile_data (not wired)',
      },
      { event: 'settings_reset_viewed', when: 'Reset dialog is shown (Reset tapped)', data: '—' },
      { event: 'settings_reset', when: 'A reset option is confirmed', data: 'reset_type (enum: user_settings, app_settings, erase_all_content)' },
      { event: 'settings_reset_cancelled', when: 'Cancel tapped in the Reset dialog', data: '—' },
    ],
  },
  {
    title: 'Camera Settings',
    description: 'Reached via Camera Settings on the Settings screen. Every change is pushed to the camera over an HTTP REST call that can fail, so each event carries the call outcome.',
    events: [
      { event: 'camera_settings_viewed', when: 'Camera Settings screen is shown', data: '—' },
      {
        event: 'camera_setting_changed',
        when: 'A camera setting’s REST update completes (on commit)',
        data: 'setting (enum — see reference), new_value (string), previous_value (string), success (bool), error_reason (enum, when success=false — full list TBD)',
        reference:
          'The possible values of "setting", with what each value means:\n\n' +
          'camera_password: Edited — password value never sent\n' +
          'camera_wifi: Network changed (e.g. wired / Wi-Fi SSID)\n' +
          'night_vision_mode: off / on / auto / auto_plus\n' +
          'ir_illuminator_mode: off / on / auto\n' +
          'record_mode: never / motion_only / everything\n' +
          'record_threshold: Percentage (slider — commit only)\n' +
          'record_schedule: Edited schedule\n' +
          'internet_viewing: enabled / disabled\n' +
          'power_light_flash_on_internet_viewer: Toggle (bool)\n' +
          'ip_address: automatic / manual',
      },
      { event: 'camera_action_requested', when: 'An operation button is tapped (after any confirmation dialog)', data: 'action (enum: remove_camera, format_sd_card, firmware_update, reboot, factory_reset)' },
      { event: 'camera_action_result', when: 'The operation’s REST call completes', data: 'action (enum, same), success (bool), error_reason (enum, when success=false — full list TBD)' },
    ],
  },
  {
    title: 'Clock Mode',
    description: 'Replaces the live view with a dimmable clock, driven by the screen-timeout-to-clock display setting.',
    events: [
      { event: 'clock_mode_shown', when: 'Clock mode is displayed', data: 'trigger (enum: auto_timeout, manual)' },
      { event: 'clock_mode_hidden', when: 'Clock mode is dismissed', data: 'trigger (enum: manual, alarm_triggered)' },
      { event: 'clock_mode_brightness_adjusted', when: 'User swipes the screen to change brightness (fires once on swipe end, not per frame)', data: 'brightness (number 0–1), previous_brightness (number 0–1)' },
    ],
  },
  {
    title: 'Lock Screen',
    description: 'The live view can be manually locked to prevent accidental touches. Locking is always manual; there is no automatic unlock.',
    events: [
      { event: 'screen_locked', when: 'User taps lock (always manual)', data: '—' },
      { event: 'screen_unlocked', when: 'User unlocks (onUnlock)', data: 'reason (enum: manual, alarm_dismiss — alarm was triggered at unlock and this unlock also dismissed it)' },
    ],
  },
  {
    title: 'Live Monitoring',
    description: 'The live camera view: overlay toggles, monitored region, Smart Edge suppression, stream health, and streaming duration.',
    events: [
      { event: 'live_view_opened', when: 'Live view (video player) is shown', data: '—' },
      { event: 'live_border_toggled', when: 'Border / detection-zone overlay toggled', data: 'enabled (bool), coverage_percent (0–100), region_left / region_top / region_right / region_bottom (0–1)' },
      { event: 'live_detection_zone_changed', when: 'User adjusts the monitored region (debounced commit, not per drag)', data: 'coverage_percent (0–100), region_left / region_top / region_right / region_bottom (0–1)' },
      { event: 'live_motion_overlay_toggled', when: 'Red motion overlay toggled', data: 'enabled (bool)' },
      { event: 'alarm_smart_edge_suppressed', when: 'Smart Edge suppresses an alarm (border-only motion → Paused instead of trigger)', data: 'edge_motion (number), motion_threshold (number)' },
      { event: 'stream_health_changed', when: 'Stream health transitions between states', data: 'health (enum: searching, low_frame_rate, healthy), signal_level (int 1–4, healthy only), fps (number)' },
      { event: 'stream_session_ended', when: 'Streaming stops (leave live view, backgrounded, or stream lost)', data: 'duration_seconds (int), end_reason (enum: left_screen, backgrounded, stream_lost)' },
    ],
  },
  {
    title: 'Alarm',
    description: 'Runtime alarm behavior on the live view (alarm configuration settings live in App Settings). Four states: disabled, inactive, paused, active.',
    events: [
      { event: 'alarm_state_changed', when: 'Alarm status moves between states', data: 'from_state / to_state (enum: disabled, inactive, paused, active), trigger (enum: manual_tap, long_press, countdown_elapsed, smart_edge, schedule, alarm_dismissed)' },
      { event: 'alarm_arm_blocked', when: 'User taps the alarm button to arm but the action is refused', data: 'reason (enum: no_connection — stream still Searching, disabled — alarm globally disabled / kill-switch)' },
      { event: 'alarm_triggered', when: 'Motion exceeds threshold while Active — alarm sounds', data: 'motion_level (number), motion_threshold (number), audible (bool — alarm volume > 0), was_locked (bool), clock_mode_active (bool)' },
      { event: 'alarm_dismissed', when: 'Alarm stops and returns to Paused', data: 'method (enum: manual, auto_timeout — auto-stop after the alarm-duration setting)' },
      { event: 'mic_toggled', when: 'Microphone turned on or off', data: 'enabled (bool), source (enum: manual, alarm_auto — auto-enabled on alarm dismiss, auto_timeout — auto-off after the post-dismiss timeout)' },
    ],
  },
  {
    title: 'Recordings — Creation',
    description: 'Proposed — not yet in the live Confluence catalog, and this is a new build (not a port of the legacy app), so nothing here is guaranteed to exist unless it’s specified. Every existing Recordings event only fires when a user interacts with a recording that already exists (plays, downloads, tags it); nothing fires when a recording is first created, so there is no way to count total recording volume or know whether a recording coincided with an active alarm. Legacy SAMi3 had an equivalent step for reference: the camera reports a manifest of available recordings (filenames only) before any video is transferred, and the app lists the recording from that manifest — the video download happens separately, either automatically in the background or on-demand when played. Camera identity (camera_mac_address, camera_model) is already attached to every event via Identify, so it isn’t repeated here.',
    events: [
      {
        event: 'recording_created',
        when: 'A new recording is discovered from the camera’s storage manifest and added to the Recordings list — the video file itself may not be downloaded to the device yet (that can happen later, automatically or on-demand). Fires once per recording, the first time the app becomes aware of it.',
        data: 'recording_id (string), recorded_at (timestamp — when the recording actually started on the camera; can lag behind this event’s own fired-at time if the camera was offline), duration_seconds (int), record_mode_at_creation (enum: motion_only, everything — mirrors the camera’s record_mode setting at capture time), was_during_alarm (bool — true if the alarm was in the active state, per alarm_state_changed, at the moment this recording started capturing)',
        isProposed: true,
      },
    ],
  },
  {
    title: 'Recordings — Screen Views',
    events: [
      { event: 'recordings_viewed', when: 'Recordings list is shown', data: '—' },
      { event: 'trash_viewed', when: 'Trash view is shown', data: '—' },
    ],
  },
  {
    title: 'Recordings — Downloading',
    events: [
      { event: 'recording_download_requested', when: 'Download requested', data: 'recording_ids (array), item_count (int), source (enum: video_player, list)' },
      { event: 'recording_download_completed', when: 'A download finishes (fires per recording)', data: 'recording_id (string)' },
      { event: 'recording_download_failed', when: 'A download fails', data: 'recording_id (string), error_reason (enum: no_space, network_error, timeout — full list TBD)' },
    ],
  },
  {
    title: 'Recordings — Selection',
    description: 'Single-vs-multiple is captured by item_count / recording_ids on the action itself, so per-row selection toggles aren’t tracked separately.',
    events: [
      { event: 'recordings_edit_mode_toggled', when: 'User enters / exits multi-select (Edit)', data: 'enabled (bool)' },
      { event: 'recordings_select_all', when: 'A select-all control is used', data: 'scope (enum: all, all_unlocked)' },
    ],
  },
  {
    title: 'Recordings — Filter',
    events: [
      { event: 'recordings_filter_changed', when: 'A filter is applied, de-selected, or cleared', data: 'active_filters (array of enum: alarmed, locked, duration_at_least_20s, last_24_hours) — the full resulting set after the change; an empty array means all filters were cleared' },
    ],
  },
  {
    title: 'Recordings — Actions',
    description: 'Actions operate on a set of recording IDs, invoked from the video player (always single), a single row action, or a bulk edit-mode selection. Trash/restore/delete_forever are folded in here as action values.',
    events: [
      { event: 'recording_action', when: 'A recording action is performed (single or bulk)', data: 'action (enum: trash, restore, delete_forever, lock, unlock, mark_alarmed, unmark_alarmed, share), source (enum: video_player, single, bulk), recording_ids (array), item_count (int)' },
    ],
  },
  {
    title: 'Recordings — Playback',
    events: [
      { event: 'recording_played', when: 'A recording starts playing in the player', data: 'recording_id (string), source (enum: recordings, trash)' },
      { event: 'recording_player_navigated', when: 'User moves to the previous / next recording within the player', data: 'direction (enum: previous, next)' },
    ],
  },
  {
    title: 'Recordings — Storage',
    description: 'recordings_auto_deleted is defined ahead of implementation — the garbage collector is not built yet.',
    events: [
      { event: 'recordings_storage_full_shown', when: 'The "no space for more recordings" dialog is displayed', data: 'storage_limit_gb (number)' },
      { event: 'recordings_auto_deleted', when: 'Garbage collection auto-deletes older recordings per the GC / storage setting (not yet implemented)', data: 'deleted_count (int), recording_ids (array), storage_limit_gb (number)' },
    ],
  },
  {
    title: 'Connectivity — Dialogs',
    description: 'Connectivity issues surfaced as dialogs. SSID names are intentionally not sent.',
    events: [
      { event: 'connectivity_dialog_shown', when: 'A connectivity issue dialog is displayed', data: 'dialog (enum: network_error — no Wi-Fi/mobile network; camera_not_found — "Can’t find Sami Camera"; wrong_network — device on a different Wi-Fi than the camera)' },
      { event: 'connectivity_dialog_dismissed', when: 'User dismisses / resolves the dialog', data: 'dialog (enum, same)' },
    ],
  },
  {
    title: 'Connectivity — Notifications',
    description: 'Posted only while the alarm is enabled. The shown/opened ratio is a safety signal.',
    events: [
      { event: 'notification_shown', when: 'A monitoring notification is posted', data: 'type (enum: camera_fault — camera disconnected while armed; app_not_active — app backgrounded while armed)' },
      { event: 'notification_opened', when: 'User taps the notification (returns to the app)', data: 'type (enum, same)' },
    ],
  },
  {
    title: 'Help',
    description: 'Switches between an online and offline view based on connectivity. mode records which view was shown.',
    events: [
      { event: 'help_viewed', when: 'Help screen is shown', data: 'mode (enum: online, offline)' },
      { event: 'help_link_clicked', when: 'A help link is tapped', data: 'link (enum: support, user_manual, installation_instructions)' },
      { event: 'help_logs_sent', when: 'Send Logs is tapped', data: 'success (bool), error_reason (enum, when success=false — full list TBD)' },
    ],
  },
];

// Flattened for the single unified table (Category / Event / When / Data /
// Reference) — the section-level title + description above still comes from
// EVENT_CATALOG directly.
const EVENT_CATALOG_ROWS = EVENT_CATALOG.flatMap((section) =>
  section.events.map((e) => ({ category: section.title, ...e }))
);

// Which catalog events would power each dashboard chart — maps the small
// chart ID shown in each ChartCard's footer back to the events behind it, so
// the Event Catalog can be filtered by chart. Illustrative/documentation-only
// mapping (this mockup uses dummy data, not live events): Device Family and
// OS Version Breakdown have no dedicated events since they come from
// Amplitude's auto-captured properties on every event, not one specific event.
const CHART_REGISTRY: { id: string; title: string; events: string[] }[] = [
  { id: 'USG-01', title: 'Online Cameras Over Time', events: ['stream_health_changed', 'connectivity_dialog_shown', 'connectivity_dialog_dismissed', 'notification_shown'] },
  { id: 'USG-02', title: 'Camera Connectivity (Right Now)', events: ['camera_setting_changed'] },
  { id: 'RET-01', title: 'Internet Connection Retention', events: ['onboarding_camera_added', 'stream_health_changed', 'connectivity_dialog_shown', 'notification_shown'] },
  { id: 'RET-02', title: 'Connection Consistency', events: ['stream_health_changed', 'connectivity_dialog_shown'] },
  { id: 'RET-03', title: 'Days Until Reconnection', events: ['stream_health_changed', 'connectivity_dialog_shown', 'notification_shown'] },
  { id: 'RET-04', title: 'Onboarding Funnel', events: ['onboarding_welcome_viewed', 'onboarding_disclaimers_viewed', 'onboarding_guide_viewed', 'onboarding_camera_ready_viewed', 'onboarding_permissions_viewed', 'onboarding_connect_viewed', 'onboarding_camera_added'] },
  { id: 'ALM-01', title: 'Recordings Created Over Time', events: ['recording_created'] },
  { id: 'ALM-02', title: 'Alarms Triggered Over Time', events: ['alarm_triggered'] },
  { id: 'ALM-03', title: 'Alarms per Camera per Day', events: ['alarm_triggered'] },
  { id: 'ALM-04', title: 'Recordings: Created, Watched, Locked, Alarmed, Shared', events: ['recording_created', 'recording_played', 'recording_action'] },
  { id: 'ALM-05', title: 'Recordings Tagged Manually', events: ['recording_action', 'recording_created'] },
  { id: 'FEA-01', title: 'Feature Usage', events: ['setting_changed', 'camera_setting_changed', 'live_border_toggled', 'live_detection_zone_changed', 'live_motion_overlay_toggled', 'clock_mode_shown', 'screen_locked', 'alarm_smart_edge_suppressed'] },
  { id: 'FEA-02', title: 'Recording Schedule Adoption', events: ['camera_setting_changed'] },
  { id: 'FEA-03', title: 'Most-Used App Settings', events: ['setting_changed'] },
  { id: 'FEA-04', title: 'Most-Used Camera Settings', events: ['camera_setting_changed'] },
  { id: 'DEV-01', title: 'Device Family', events: [] },
  { id: 'DEV-02', title: 'OS Version Breakdown', events: [] },
];

const CATALOG_OPEN_ITEMS = [
  'Not-yet-wired settings — border_size, recording_transfers_enabled, hide_shorter_than, google_drive_backup, disable_telemetry, always_allow_mobile_data are present in the UI but no-op/local-only; their setting_changed events apply only once wired.',
  'active_screen coverage — extend the enum on app_backgrounded beyond live/recordings/settings/help to also include trash, recording_player, camera_selection (and onboarding once it ships).',
  'Post-onboarding "Add Camera" — the Connect/camera-add events also fire when adding a camera from Settings → Add Sami Network Camera; add a source (onboarding vs. settings) to those events, or factor out a shared Add-Camera section.',
  'error_reason enum values — define the full lists for onboarding search/add failures, camera-settings/action failures, recording download failures, and Help send-logs.',
  'Full disclaimer list — complete the accepted_disclaimers enum from the Disclaimers screen.',
  'Device identifier — Amplitude auto device_id vs. a custom persisted app-install UUID.',
  'camera_firmware_version — confirm parsing it from the camera system-info raw fields.',
  'Garbage collector — recordings_auto_deleted is defined ahead of implementation (GC not built yet).',
  'Live sensitivity tuning — to be removed from the code, so not tracked.',
];

// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'usage', label: 'Usage & Connectivity', icon: Activity },
  { id: 'retention', label: 'Retention', icon: RefreshCw },
  { id: 'alarms', label: 'Alarms & Recordings', icon: Bell },
  { id: 'features', label: 'Feature Adoption', icon: SettingsIcon },
  { id: 'devices', label: 'Amplitude Auto-Data', icon: Smartphone },
] as const;

// Its own sidebar group, below "Sami Analytics" — a reference doc (real,
// not dummy data), not a data view, so it doesn't get Platform/Time filters.
const DOCS_CATEGORIES = [
  { id: 'catalog', label: 'Event Catalog', icon: BookOpen },
  { id: 'conventions', label: 'Conventions & Metadata', icon: FileText },
] as const;

const ALL_CATEGORIES = [...CATEGORIES, ...DOCS_CATEGORIES];

type CategoryId = typeof CATEGORIES[number]['id'] | typeof DOCS_CATEGORIES[number]['id'];

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
  const contentScrollRef = useRef<HTMLDivElement>(null);
  // Always land at the top of the page on any category switch — otherwise a
  // scrolled-down position from a previous visit (e.g. to Event Catalog)
  // sticks around and the "View events used" CTA looks like it did nothing.
  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0 });
  }, [activeCategory]);
  const [platformFilter, setPlatformFilter] = useState('All Platforms');
  const [timeRange, setTimeRange] = useState('30 Days');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('All Categories');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogChartFilter, setCatalogChartFilter] = useState('All Charts');
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

  const scaledOnboardingFunnel = useMemo(
    () => onboardingFunnel.map((d) => ({ ...d, count: scaleCount(d.count) })),
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

  const scaledAppSettingsUsage = useMemo(
    () => appSettingsUsage.map((d) => ({ ...d, count: scaleCount(d.count) })),
    [platformMultiplier]
  );

  const scaledCameraSettingsUsage = useMemo(
    () => cameraSettingsUsage.map((d) => ({ ...d, count: scaleCount(d.count) })),
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

  // Event Catalog: Category dropdown + Chart dropdown + free-text search
  // across event name, when-it-fires, and event-specific data.
  const catalogCategoryOptions = useMemo(
    () => ['All Categories', ...Array.from(new Set(EVENT_CATALOG_ROWS.map((r) => r.category)))],
    []
  );
  const catalogChartOptions = useMemo(
    () => ['All Charts', 'None (unused by any chart)', ...CHART_REGISTRY.map((c) => `${c.id} — ${c.title}`)],
    []
  );
  const selectedChart = useMemo(
    () => CHART_REGISTRY.find((c) => `${c.id} — ${c.title}` === catalogChartFilter),
    [catalogChartFilter]
  );
  const chartMappedEvents = useMemo(
    () => new Set(CHART_REGISTRY.flatMap((c) => c.events)),
    []
  );
  const filteredCatalogRows = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    return EVENT_CATALOG_ROWS.filter((r) => {
      if (catalogCategoryFilter !== 'All Categories' && r.category !== catalogCategoryFilter) return false;
      if (catalogChartFilter === 'None (unused by any chart)' && chartMappedEvents.has(r.event)) return false;
      if (selectedChart && !selectedChart.events.includes(r.event)) return false;
      if (!q) return true;
      return (
        r.event.toLowerCase().includes(q) ||
        r.when.toLowerCase().includes(q) ||
        r.data.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [catalogCategoryFilter, catalogChartFilter, catalogSearch, selectedChart, chartMappedEvents]);

  // "View events used" CTA on each chart — jumps to the Event Catalog with
  // the Chart filter pre-set to that chart, and clears the other filters
  // so nothing hides the result.
  const goToChartEvents = (id: string) => {
    const chart = CHART_REGISTRY.find((c) => c.id === id);
    if (!chart) return;
    setCatalogCategoryFilter('All Categories');
    setCatalogSearch('');
    setCatalogChartFilter(`${chart.id} — ${chart.title}`);
    setActiveCategory('catalog');
  };

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

          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-3 mb-1 mt-5">
            Reference
          </div>
          {DOCS_CATEGORIES.map((cat) => {
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

      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-16 border-b border-[#E5E9F2] bg-white flex items-center justify-between px-6 flex-shrink-0">
          <div className="text-lg font-semibold">
            {ALL_CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </div>
        </div>

        {/* Filters row — hidden for the Event Catalog, which is reference
            documentation, not a filterable data view. */}
        {activeCategory !== 'catalog' && activeCategory !== 'conventions' && (
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
        )}

        {/* Scrollable content */}
        <div ref={contentScrollRef} className="flex-1 overflow-y-auto p-6">
          {activeCategory === 'usage' && (
            <div className="space-y-6">
              <ChartCard
                title="Online Cameras Over Time"
                answers="How many cameras are online each day?"
                chartId="USG-01"
                onViewEvents={() => goToChartEvents('USG-01')}
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
                title="Camera Connectivity (Right Now)"
                answers="Connectivity: how many cameras connect wirelessly vs. wired?"
                chartId="USG-02"
                onViewEvents={() => goToChartEvents('USG-02')}
              >
                <p className="text-xs text-gray-500 -mt-1 mb-3">
                  A current snapshot, not a trend over time — each camera&apos;s most recently known connection type.
                </p>
                <SimpleTable
                  columns={['Connection type', 'Cameras', '% of fleet']}
                  rows={connectivityTable.map((r) => [r.type, r.cameras, r.pct])}
                />
              </ChartCard>
            </div>
          )}

          {activeCategory === 'retention' && (
            <div className="space-y-6">
              <ChartCard
                title="Internet Connection Retention"
                answers="Are cameras still connecting to the internet weeks after setup?"
                chartId="RET-01"
                onViewEvents={() => goToChartEvents('RET-01')}
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
                  chartId="RET-02"
                  onViewEvents={() => goToChartEvents('RET-02')}
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
                  chartId="RET-03"
                  onViewEvents={() => goToChartEvents('RET-03')}
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
                title="Onboarding Funnel"
                answers="How far do new users get through onboarding — where do they finish, and where do they drop off?"
                chartId="RET-04"
                onViewEvents={() => goToChartEvents('RET-04')}
              >
                <p className="text-xs text-gray-500 -mt-1 mb-3">
                  Each step is the screen-viewed event for that part of onboarding; the last bar is cameras successfully added (onboarding complete).
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={scaledOnboardingFunnel} layout="vertical" margin={{ left: 16 }}>
                    <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <YAxis type="category" dataKey="step" tick={{ fontSize: 12, fill: '#111827' }} width={90} />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary} radius={[0, 6, 6, 0]} name="Users" />
                  </BarChart>
                </ResponsiveContainer>
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
                  chartId="ALM-01"
                  onViewEvents={() => goToChartEvents('ALM-01')}
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
                  chartId="ALM-02"
                  onViewEvents={() => goToChartEvents('ALM-02')}
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
                chartId="ALM-03"
                onViewEvents={() => goToChartEvents('ALM-03')}
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
                chartId="ALM-04"
                onViewEvents={() => goToChartEvents('ALM-04')}
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

              <ChartCard
                title="Recordings Tagged Manually"
                answers="In total, how many recordings were tagged as locked or alarmed manually?"
                chartId="ALM-05"
                onViewEvents={() => goToChartEvents('ALM-05')}
              >
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={recordingsStageTotals.filter((d) => d.stage === 'Locked' || d.stage === 'Alarmed')} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.axis }} />
                    <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: '#111827' }} width={70} />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.purple} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {activeCategory === 'features' && (
            <div className="space-y-6">
              <ChartCard
                title="Feature Usage"
                answers="What features are being used? How many times do people utilize a given feature?"
                chartId="FEA-01"
                onViewEvents={() => goToChartEvents('FEA-01')}
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
                chartId="FEA-02"
                onViewEvents={() => goToChartEvents('FEA-02')}
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

              <div className="grid grid-cols-2 gap-6">
                <ChartCard
                  title="Most-Used App Settings"
                  answers="Which App Settings do people change the most?"
                  chartId="FEA-03"
                  onViewEvents={() => goToChartEvents('FEA-03')}
                >
                  <ResponsiveContainer width="100%" height={460}>
                    <BarChart data={scaledAppSettingsUsage} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <YAxis type="category" dataKey="setting" tick={{ fontSize: 11, fill: '#111827' }} width={190} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.primary} radius={[0, 6, 6, 0]} name="Changes (30d)" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-500 mt-3">
                    The 6 settings marked "(not wired)" show 0 — they&apos;re present in the UI but no-op/local-only today, so no real change events fire for them yet. See Open Items in the Event Catalog.
                  </p>
                </ChartCard>

                <ChartCard
                  title="Most-Used Camera Settings"
                  answers="Which Camera Settings do people change the most?"
                  chartId="FEA-04"
                  onViewEvents={() => goToChartEvents('FEA-04')}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scaledCameraSettingsUsage} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.axis }} />
                      <YAxis type="category" dataKey="setting" tick={{ fontSize: 11, fill: '#111827' }} width={150} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.purple} radius={[0, 6, 6, 0]} name="Changes (30d)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          )}

          {activeCategory === 'devices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 max-w-md">
                <ChartCard
                  title="Device Family"
                  answers="Apple device: what device type is being used to monitor?"
                  chartId="DEV-01"
                  onViewEvents={() => goToChartEvents('DEV-01')}
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
                chartId="DEV-02"
                onViewEvents={() => goToChartEvents('DEV-02')}
              >
                <SimpleTable
                  columns={['OS Version', 'Devices', '% of platform']}
                  rows={filteredOsVersionTable.map((r) => [r.os, r.devices, r.pct])}
                />
                <p className="text-xs text-gray-500 mt-3">From Amplitude&apos;s auto-captured <code className="font-mono">os_name</code> / <code className="font-mono">os_version</code>.</p>
              </ChartCard>
            </div>
          )}

          {activeCategory === 'catalog' && (
            <div className="space-y-6">
              <ChartCard title="All Events">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Dropdown
                    label="Category"
                    options={catalogCategoryOptions}
                    value={catalogCategoryFilter}
                    onChange={setCatalogCategoryFilter}
                  />
                  <Dropdown
                    label="Chart"
                    options={catalogChartOptions}
                    value={catalogChartFilter}
                    onChange={setCatalogChartFilter}
                  />
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Search events..."
                      className="bg-white border border-[#E5E9F2] rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#2F6FEB] w-56"
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {filteredCatalogRows.length} of {EVENT_CATALOG_ROWS.length} events
                  </span>
                </div>
                {selectedChart && selectedChart.events.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">
                    &quot;{selectedChart.title}&quot; ({selectedChart.id}) isn&apos;t built from a specific catalog event — it comes from properties Amplitude auto-captures on every event, not a dedicated one.
                  </p>
                ) : (
                  <CatalogTable rows={filteredCatalogRows} />
                )}
              </ChartCard>

              <ChartCard title="Category Descriptions">
                <div className="space-y-3 text-sm">
                  {EVENT_CATALOG.filter((section) => section.description).map((section) => (
                    <p key={section.title}>
                      <span className="font-medium text-[#111827]">{section.title}</span>
                      <span className="text-gray-600"> — {section.description}</span>
                    </p>
                  ))}
                </div>
              </ChartCard>
            </div>
          )}

          {activeCategory === 'conventions' && (
            <div className="space-y-6">
              <div className="text-xs text-gray-400 -mt-1">
                Shared conventions and metadata that apply across the Event Catalog — how it&apos;s structured, what&apos;s sent on every event, and what Amplitude captures automatically.
              </div>

              <ChartCard title="Conventions">
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1F2937]">
                  {CATALOG_CONVENTIONS.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </ChartCard>

              <ChartCard title="Shared Event Properties">
                <SimpleTable columns={CATALOG_SHARED_PROPERTIES.columns} rows={CATALOG_SHARED_PROPERTIES.rows} />
              </ChartCard>

              <ChartCard title="Camera / Device Identity">
                <SimpleTable columns={CATALOG_IDENTITY_PROPERTIES.columns} rows={CATALOG_IDENTITY_PROPERTIES.rows} />
              </ChartCard>

              <ChartCard title="Automatically Captured by Amplitude">
                <SimpleTable columns={CATALOG_AUTO_CAPTURED.columns} rows={CATALOG_AUTO_CAPTURED.rows} />
              </ChartCard>

              <ChartCard title="Open Items">
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1F2937]">
                  {CATALOG_OPEN_ITEMS.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </ChartCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
