import { useState } from 'react';
import { ChevronLeft, ChevronRight, Wifi, Check, Eye, EyeOff, Lock, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { WiFiSelection } from '@/app/components/onboarding/WiFiSelection';
import { NetworkPassword } from '@/app/components/onboarding/NetworkPassword';
import { WifiTestingScreen } from '@/app/components/onboarding/WifiTestingScreen';

const SETTINGS_ACCENT_COLOR = '#5A8BBF';
const SETTINGS_BG_COLOR = '#000000';

export interface SettingsScreenProps {
  // Navigation
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  selectedOS: 'ios' | 'android' | null;
  setShowOnboarding: (v: boolean) => void;
  setOnboardingInitialStep: (v: number) => void;
  setOnboardingSkipPermissions: (v: boolean) => void;

  // Device
  selectedDevice: string;
  setSelectedDevice: (v: string) => void;
  cameraPaired: boolean;
  setCameraPaired: (v: boolean) => void;
  showPairingPopup: boolean;
  setShowPairingPopup: (v: boolean) => void;
  showCameraSettings: boolean;
  setShowCameraSettings: (v: boolean) => void;
  savedCameraPassword: string;
  setSavedCameraPassword: (v: string) => void;
  savedCameraPasswordHint: string;
  setSavedCameraPasswordHint: (v: string) => void;

  // WiFi
  settingsWifiNetwork: string;
  setSettingsWifiNetwork: (v: string) => void;
  showSettingsWifiPicker: boolean;
  setShowSettingsWifiPicker: (v: boolean) => void;
  settingsWifiPickerStep: 'select' | 'password' | 'testing';
  setSettingsWifiPickerStep: (v: 'select' | 'password' | 'testing') => void;
  settingsWifiPendingSsid: string;
  setSettingsWifiPendingSsid: (v: string) => void;

  // Alarms
  enableAlarm: boolean;
  handleEnableAlarmToggle: () => void;
  motionThresholdSetting: number;
  setMotionThresholdSetting: (v: number) => void;
  alarmThresholdSetting: number;
  setAlarmThresholdSetting: (v: number) => void;
  sensitivityBoost: number;
  setSensitivityBoost: (v: number) => void;
  maxPauseTime: number;
  setMaxPauseTime: (v: number) => void;
  smartBorder: boolean;
  handleSmartBorderToggle: () => void;
  beepOnCameraFault: boolean;
  handleBeepOnCameraFaultToggle: (v: boolean) => void;
  beepOnAppNotActive: boolean;
  handleBeepOnAppNotActiveToggle: (v: boolean) => void;

  // Alarm threshold helpers
  incrementAlarmThreshold: (v: number) => number;
  decrementAlarmThreshold: (v: number) => number;
  formatAlarmThreshold: (v: number) => string;

  // Max pause time helpers
  maxPauseTimeValues: number[];
  incrementMaxPauseTime: (v: number) => number;
  decrementMaxPauseTime: (v: number) => number;
  formatMaxPauseTime: (v: number) => string;
  getMaxPauseTimeSliderIndex: (v: number) => number;
  getMaxPauseTimeFromSliderIndex: (v: number) => number;

  // Schedule
  enableAlarmSchedule: boolean;
  setEnableAlarmSchedule: (v: boolean) => void;
  alarmEnableHour: number;
  setAlarmEnableHour: (v: number) => void;
  alarmEnableMinute: number;
  setAlarmEnableMinute: (v: number) => void;
  alarmEnablePeriod: 'AM' | 'PM';
  setAlarmEnablePeriod: (v: 'AM' | 'PM') => void;
  showAlarmEnableTimePicker: boolean;
  setShowAlarmEnableTimePicker: (v: boolean) => void;
  alarmDisableHour: number;
  setAlarmDisableHour: (v: number) => void;
  alarmDisableMinute: number;
  setAlarmDisableMinute: (v: number) => void;
  alarmDisablePeriod: 'AM' | 'PM';
  setAlarmDisablePeriod: (v: 'AM' | 'PM') => void;
  showAlarmDisableTimePicker: boolean;
  setShowAlarmDisableTimePicker: (v: boolean) => void;
  formatTime: (hour: number, minute: number, period: 'AM' | 'PM') => string;

  // Audio
  alarmVolume: number;
  setAlarmVolume: (v: number) => void;
  alarmSound: string;
  setAlarmSound: (v: string) => void;
  alarmDuration: number;
  setAlarmDuration: (v: number) => void;
  vibrateOnAlarm: boolean;
  setVibrateOnAlarm: (v: boolean) => void;
  microphoneBoost: boolean;
  setMicrophoneBoost: (v: boolean) => void;
  microphoneNoiseReduction: boolean;
  setMicrophoneNoiseReduction: (v: boolean) => void;
  showMicrophoneBoostPopup: boolean;
  setShowMicrophoneBoostPopup: (v: boolean) => void;
  showMicrophoneNoiseReductionPopup: boolean;
  setShowMicrophoneNoiseReductionPopup: (v: boolean) => void;

  // Alarm duration helpers
  alarmDurationValues: number[];
  incrementAlarmDuration: (v: number) => number;
  decrementAlarmDuration: (v: number) => number;
  formatAlarmDuration: (v: number) => string;
  getAlarmDurationSliderIndex: (v: number) => number;
  getAlarmDurationFromSliderIndex: (v: number) => number;

  // Display
  screenTimeoutToClock: boolean;
  setScreenTimeoutToClock: (v: boolean) => void;
  timeoutDelay: number;
  setTimeoutDelay: (v: number) => void;
  timeoutDelayValues: number[];
  incrementTimeoutDelay: (v: number) => number;
  decrementTimeoutDelay: (v: number) => number;
  formatTimeoutDelay: (v: number) => string;
  getTimeoutDelaySliderIndex: (v: number) => number;
  getTimeoutDelayFromSliderIndex: (v: number) => number;

  // Recordings settings
  enableAutoRecording: boolean;
  setEnableAutoRecording: (v: boolean) => void;
  storageLimit: number;
  setStorageLimit: (v: number) => void;
  autoDeleteOlderVideos: boolean;
  setAutoDeleteOlderVideos: (v: boolean) => void;
  showAutoDeletePopup: boolean;
  setShowAutoDeletePopup: (v: boolean) => void;
  setShowStorageNotification: (v: boolean) => void;

  // Mobile data / analytics
  alwaysAllowMobileData: boolean;
  setAlwaysAllowMobileData: (v: boolean) => void;
  enableSentData: boolean;
  setEnableSentData: (v: boolean) => void;

  // Reset dialogs
  showResetDialog: boolean;
  setShowResetDialog: (v: boolean) => void;
  showEraseConfirmDialog: boolean;
  setShowEraseConfirmDialog: (v: boolean) => void;
  showResetAllConfirmDialog: boolean;
  setShowResetAllConfirmDialog: (v: boolean) => void;
  handleResetUserSettings: () => void;
  handleResetAllAppSettings: () => void;
  handleEraseAllContent: () => void;
  handleConfirmResetAllAppSettings: () => void;
  handleConfirmEraseAllContent: () => void;

  // Camera fault popups
  showCameraFaultPopup: boolean;
  closeCameraFaultPopup: () => void;
  showBeepCameraFaultInfo: boolean;
  setShowBeepCameraFaultInfo: (v: boolean) => void;
  showCameraNotFound: boolean;
  setShowCameraNotFound: (v: boolean) => void;

  // Beep app not active popups
  showBeepAppNotActivePopup: boolean;
  setShowBeepAppNotActivePopup: (v: boolean) => void;
  setBeepOnAppNotActive: (v: boolean) => void;
  showSilentSwitchPopup: boolean;
  setShowSilentSwitchPopup: (v: boolean) => void;
  closeSilentSwitchPopup: (action: 'disable' | 'ok') => void;

  // Smart border popups
  showSmartBorderPopup1: boolean;
  handleSmartBorderPopup1Ok: () => void;
  handleSmartBorderPopup1Cancel: () => void;
  showSmartBorderPopup2: boolean;
  handleSmartBorderPopup2Ok: () => void;
  handleSmartBorderPopup2Cancel: () => void;

  // Enable alarm alerts
  showEnableAlarmAlert: boolean;
  currentAlertIndex: number;
  enableAlarmAlertMessages: string[];
  handleAlertOk: () => void;
  handleAlertCancel: () => void;

  // QC section
  showQCSection: boolean;
  setShowQCSection: (v: boolean) => void;
  handleQCTitlePressStart: () => void;
  handleQCTitlePressEnd: () => void;
  displayData: boolean;
  setDisplayData: (v: boolean) => void;
  rapidTestMode: boolean;
  setRapidTestMode: (v: boolean) => void;
  burningMode: boolean;
  setBurningMode: (v: boolean) => void;
  minWifiQuality: number;
  setMinWifiQuality: (v: number) => void;
  devAWS: boolean;
  setDevAWS: (v: boolean) => void;

  // Camera settings
  nightVisionMode: 'Off' | 'On' | 'Auto' | 'Auto+';
  setNightVisionMode: (v: 'Off' | 'On' | 'Auto' | 'Auto+') => void;
  irIlluminatorMode: 'Off' | 'On' | 'Auto';
  setIrIlluminatorMode: (v: 'Off' | 'On' | 'Auto') => void;
  recordMode: 'Never' | 'Motion Only' | 'Everything';
  setRecordMode: (v: 'Never' | 'Motion Only' | 'Everything') => void;
  recordThreshold: number;
  setRecordThreshold: (v: number) => void;
  powerLightFlash: boolean;
  setPowerLightFlash: (v: boolean) => void;

}

export function SettingsScreen({
  showSettings,
  setShowSettings,
  selectedOS,
  setShowOnboarding,
  setOnboardingInitialStep,
  setOnboardingSkipPermissions,
  selectedDevice,
  setSelectedDevice,
  cameraPaired,
  setCameraPaired,
  showPairingPopup,
  setShowPairingPopup,
  showCameraSettings,
  setShowCameraSettings,
  savedCameraPassword,
  setSavedCameraPassword,
  savedCameraPasswordHint,
  setSavedCameraPasswordHint,
  settingsWifiNetwork,
  setSettingsWifiNetwork,
  showSettingsWifiPicker,
  setShowSettingsWifiPicker,
  settingsWifiPickerStep,
  setSettingsWifiPickerStep,
  settingsWifiPendingSsid,
  setSettingsWifiPendingSsid,
  enableAlarm,
  handleEnableAlarmToggle,
  motionThresholdSetting,
  setMotionThresholdSetting,
  alarmThresholdSetting,
  setAlarmThresholdSetting,
  sensitivityBoost,
  setSensitivityBoost,
  maxPauseTime,
  setMaxPauseTime,
  smartBorder,
  handleSmartBorderToggle,
  beepOnCameraFault,
  handleBeepOnCameraFaultToggle,
  beepOnAppNotActive,
  handleBeepOnAppNotActiveToggle,
  incrementAlarmThreshold,
  decrementAlarmThreshold,
  formatAlarmThreshold,
  maxPauseTimeValues,
  incrementMaxPauseTime,
  decrementMaxPauseTime,
  formatMaxPauseTime,
  getMaxPauseTimeSliderIndex,
  getMaxPauseTimeFromSliderIndex,
  enableAlarmSchedule,
  setEnableAlarmSchedule,
  alarmEnableHour,
  setAlarmEnableHour,
  alarmEnableMinute,
  setAlarmEnableMinute,
  alarmEnablePeriod,
  setAlarmEnablePeriod,
  showAlarmEnableTimePicker,
  setShowAlarmEnableTimePicker,
  alarmDisableHour,
  setAlarmDisableHour,
  alarmDisableMinute,
  setAlarmDisableMinute,
  alarmDisablePeriod,
  setAlarmDisablePeriod,
  showAlarmDisableTimePicker,
  setShowAlarmDisableTimePicker,
  formatTime,
  alarmVolume,
  setAlarmVolume,
  alarmSound,
  setAlarmSound,
  alarmDuration,
  setAlarmDuration,
  vibrateOnAlarm,
  setVibrateOnAlarm,
  microphoneBoost,
  setMicrophoneBoost,
  microphoneNoiseReduction,
  setMicrophoneNoiseReduction,
  showMicrophoneBoostPopup,
  setShowMicrophoneBoostPopup,
  showMicrophoneNoiseReductionPopup,
  setShowMicrophoneNoiseReductionPopup,
  alarmDurationValues,
  incrementAlarmDuration,
  decrementAlarmDuration,
  formatAlarmDuration,
  getAlarmDurationSliderIndex,
  getAlarmDurationFromSliderIndex,
  screenTimeoutToClock,
  setScreenTimeoutToClock,
  timeoutDelay,
  setTimeoutDelay,
  timeoutDelayValues,
  incrementTimeoutDelay,
  decrementTimeoutDelay,
  formatTimeoutDelay,
  getTimeoutDelaySliderIndex,
  getTimeoutDelayFromSliderIndex,
  enableAutoRecording,
  setEnableAutoRecording,
  storageLimit,
  setStorageLimit,
  autoDeleteOlderVideos,
  setAutoDeleteOlderVideos,
  showAutoDeletePopup,
  setShowAutoDeletePopup,
  setShowStorageNotification,
  alwaysAllowMobileData,
  setAlwaysAllowMobileData,
  enableSentData,
  setEnableSentData,
  showResetDialog,
  setShowResetDialog,
  showEraseConfirmDialog,
  setShowEraseConfirmDialog,
  showResetAllConfirmDialog,
  setShowResetAllConfirmDialog,
  handleResetUserSettings,
  handleResetAllAppSettings,
  handleEraseAllContent,
  handleConfirmResetAllAppSettings,
  handleConfirmEraseAllContent,
  showCameraFaultPopup,
  closeCameraFaultPopup,
  showBeepCameraFaultInfo,
  setShowBeepCameraFaultInfo,
  showCameraNotFound,
  setShowCameraNotFound,
  showBeepAppNotActivePopup,
  setShowBeepAppNotActivePopup,
  setBeepOnAppNotActive,
  showSilentSwitchPopup,
  setShowSilentSwitchPopup,
  closeSilentSwitchPopup,
  showSmartBorderPopup1,
  handleSmartBorderPopup1Ok,
  handleSmartBorderPopup1Cancel,
  showSmartBorderPopup2,
  handleSmartBorderPopup2Ok,
  handleSmartBorderPopup2Cancel,
  showEnableAlarmAlert,
  currentAlertIndex,
  enableAlarmAlertMessages,
  handleAlertOk,
  handleAlertCancel,
  showQCSection,
  setShowQCSection,
  handleQCTitlePressStart,
  handleQCTitlePressEnd,
  displayData,
  setDisplayData,
  rapidTestMode,
  setRapidTestMode,
  burningMode,
  setBurningMode,
  minWifiQuality,
  setMinWifiQuality,
  devAWS,
  setDevAWS,
  nightVisionMode,
  setNightVisionMode,
  irIlluminatorMode,
  setIrIlluminatorMode,
  recordMode,
  setRecordMode,
  recordThreshold,
  setRecordThreshold,
  powerLightFlash,
  setPowerLightFlash,
}: SettingsScreenProps) {
  if (!showSettings) return null;

  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [editedPassword, setEditedPassword] = useState('');
  const [editedConfirmPassword, setEditedConfirmPassword] = useState('');
  const [editedPasswordHint, setEditedPasswordHint] = useState('');
  const [editPasswordError, setEditPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function validateCameraPassword(password: string): { isValid: boolean; message: string } {
    const hasCapital = /[A-Z]/.test(password);
    const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    if (!hasCapital) return { isValid: false, message: 'Password must contain at least one capital letter' };
    if (letterCount < 4) return { isValid: false, message: 'Password must contain at least 4 letters' };
    if (numberCount < 2) return { isValid: false, message: 'Password must contain at least 2 numbers' };
    return { isValid: true, message: '' };
  }

  const [showRemoveCameraConfirm, setShowRemoveCameraConfirm] = useState(false);

  // SD Card
  type SDStatus = 'Missing!' | 'Reading...' | 'Blank' | '1 Recording' | '42 recordings';
  const SD_STATUS_CYCLE: SDStatus[] = ['Missing!', 'Reading...', 'Blank', '1 Recording', '42 recordings'];
  const [sdStatus, setSdStatus] = useState<SDStatus>('42 recordings');
  const cycleSDStatus = () => setSdStatus(s => SD_STATUS_CYCLE[(SD_STATUS_CYCLE.indexOf(s) + 1) % SD_STATUS_CYCLE.length]);
  const [sdFormatAttempt, setSdFormatAttempt] = useState(0);
  type SDPopup = 'confirm-format' | 'format-failed' | 'format-complete' | null;
  const [sdPopup, setSdPopup] = useState<SDPopup>(null);
  const [sdFormatting, setSdFormatting] = useState(false);


  // Factory Reset
  type FactoryResetPopup = 'confirm' | 'done' | null;
  type FactoryResetProgress = 'formatting' | 'resetting' | null;
  const [factoryResetPopup, setFactoryResetPopup] = useState<FactoryResetPopup>(null);
  const [factoryResetProgress, setFactoryResetProgress] = useState<FactoryResetProgress>(null);

  const startFactoryReset = () => {
    setFactoryResetPopup(null);
    setFactoryResetProgress('formatting');
    setTimeout(() => {
      setFactoryResetProgress('resetting');
      setTimeout(() => {
        setFactoryResetProgress(null);
        setFactoryResetPopup('done');
      }, 2500);
    }, 2500);
  };

  const completeFactoryReset = () => {
    setFactoryResetPopup(null);
    setCameraPaired(false);
    setSelectedDevice('');
    setShowCameraSettings(false);
  };

  // Restart Camera
  type RebootPopup = 'confirm' | 'done' | null;
  const [rebootPopup, setRebootPopup] = useState<RebootPopup>(null);
  const [rebooting, setRebooting] = useState(false);

  const startReboot = () => {
    setRebootPopup(null);
    setRebooting(true);
    setTimeout(() => {
      setRebooting(false);
      setRebootPopup('done');
    }, 2500);
  };

  const startFormat = () => {
    setSdPopup(null);
    setSdFormatting(true);
    const attempt = sdFormatAttempt + 1;
    setSdFormatAttempt(attempt);
    setTimeout(() => {
      setSdFormatting(false);
      if (attempt === 1) {
        setSdPopup('format-failed');
      } else {
        setSdStatus('Blank');
        setSdPopup('format-complete');
      }
    }, 2500);
  };

  // Camera Wi-Fi signal quality (tappable cycle for demo)
  type CameraSignal = 'Excellent' | 'Ok' | 'Bad' | 'Poor' | 'Wired' | 'NONE';
  const CAMERA_SIGNAL_CYCLE: CameraSignal[] = ['Excellent', 'Ok', 'Bad', 'Poor', 'Wired', 'NONE'];
  const [cameraSignal, setCameraSignal] = useState<CameraSignal>('Excellent');
  const cycleCameraSignal = () => {
    const idx = CAMERA_SIGNAL_CYCLE.indexOf(cameraSignal);
    setCameraSignal(CAMERA_SIGNAL_CYCLE[(idx + 1) % CAMERA_SIGNAL_CYCLE.length]);
  };
  const cameraSignalColor = cameraSignal === 'Excellent' ? '#BFE3D9'
    : cameraSignal === 'Ok' ? '#FCEAAD'
    : cameraSignal === 'Wired' ? '#BFE3D9'
    : '#FFC7BD'; // Bad, Poor, NONE

  // Internet Viewing screen
  type IVStatus = '---' | 'Checking...' | 'No Internet Connection' | 'Router uPnP Disabled' | 'Online' | 'Camera Not Reachable';
  type IVProgress = 'configuring-port' | 'connecting' | 'disabling' | null;
  type IVPopup = 'upnp-failed' | 'no-internet' | 'warn-disable' | 'manual-port-error' | null;
  const [showIVScreen, setShowIVScreen] = useState(false);
  const [internetViewingEnabled, setInternetViewingEnabled] = useState(false);
  const [ivToggleBusy, setIvToggleBusy] = useState(false);
  const [ivEnableAttempt, setIvEnableAttempt] = useState(0);
  const [ivRouterMode, setIvRouterMode] = useState<'automatic' | 'manual'>('automatic');
  const [ivPortNumber, setIvPortNumber] = useState('');
  const [ivSavedPortNumber, setIvSavedPortNumber] = useState('');
  const [ivPortEditing, setIvPortEditing] = useState(false);
  const [ivStatus, setIvStatus] = useState<IVStatus>('---');
  const [ivProgress, setIvProgress] = useState<IVProgress>(null);
  const [ivPopup, setIvPopup] = useState<IVPopup>(null);
  const [ivCheckAttempt, setIvCheckAttempt] = useState(0);

  const ivCheckStatusAuto = () => {
    setIvStatus('Checking...');
    setTimeout(() => setIvStatus('Online'), 1500);
  };

  const ivCheckStatusManual = (routerMode: 'automatic' | 'manual') => {
    const next = ivCheckAttempt + 1;
    setIvCheckAttempt(next);
    setIvStatus('Checking...');
    setTimeout(() => {
      if (next === 1) {
        setIvStatus(routerMode === 'automatic' ? 'Router uPnP Disabled' : 'Camera Not Reachable');
      } else {
        setIvStatus('Online');
      }
    }, 1500);
  };

  const openIVScreen = () => {
    setShowIVScreen(true);
    // Pre-fill port number from saved value on open
    if (ivSavedPortNumber) setIvPortNumber(ivSavedPortNumber);
    if (internetViewingEnabled) ivCheckStatusAuto();
  };

  const ivRunEnable = (attempt: number, routerMode: 'automatic' | 'manual') => {
    setIvToggleBusy(true);
    if (attempt === 1) {
      // 1st attempt: No Internet Connection
      setIvProgress('configuring-port');
      setTimeout(() => {
        setIvProgress(null);
        setInternetViewingEnabled(false);
        setIvToggleBusy(false);
        setIvPopup('no-internet');
      }, 1500);
    } else if (attempt === 2) {
      // 2nd attempt: port setup failure
      setIvProgress('configuring-port');
      setTimeout(() => {
        setIvProgress(null);
        setInternetViewingEnabled(false);
        setIvToggleBusy(false);
        if (routerMode === 'automatic') {
          setIvStatus('Router uPnP Disabled');
          setIvPopup('upnp-failed');
        } else {
          setIvPopup('manual-port-error');
        }
      }, 2000);
    } else {
      // 3rd+ attempt: success
      setIvProgress('configuring-port');
      setTimeout(() => {
        setIvProgress('connecting');
        setTimeout(() => {
          setIvProgress(null);
          setInternetViewingEnabled(true);
          setIvToggleBusy(false);
          setIvStatus('Online');
        }, 2000);
      }, 2000);
    }
  };

  const handleIVToggle = () => {
    if (ivToggleBusy) return;
    if (!internetViewingEnabled) {
      const next = ivEnableAttempt + 1;
      setIvEnableAttempt(next);
      ivRunEnable(next, ivRouterMode);
    } else {
      // Disable: warn if "connected via internet" (status Online)
      if (ivStatus === 'Online') {
        setIvPopup('warn-disable');
      } else {
        ivConfirmDisable();
      }
    }
  };

  const ivConfirmDisable = () => {
    setIvPopup(null);
    setIvToggleBusy(true);
    setIvProgress('disabling');
    setTimeout(() => {
      setIvProgress(null);
      setInternetViewingEnabled(false);
      setIvStatus('---');
      setIvEnableAttempt(0);
      setIvCheckAttempt(0);
      setIvToggleBusy(false);
    }, 2000);
  };

  // IP Address
  type IpMode = 'automatic' | 'manual';
  interface IpConfig { ip: string; subnet: string; gateway: string; dnsProto: 'dynamic' | 'static'; dns1: string; dns2: string; }
  const [ipMode, setIpMode] = useState<IpMode>('automatic');
  const [showIpEditor, setShowIpEditor] = useState(false);
  const [ipEditorMode, setIpEditorMode] = useState<IpMode>('automatic');
  const [ipConfig, setIpConfig] = useState<IpConfig>({ ip: '', subnet: '', gateway: '', dnsProto: 'dynamic', dns1: '', dns2: '' });
  const [ipEditorConfig, setIpEditorConfig] = useState<IpConfig>({ ip: '', subnet: '', gateway: '', dnsProto: 'dynamic', dns1: '', dns2: '' });
  const [ipErrors, setIpErrors] = useState<Partial<Record<keyof IpConfig, string>>>({});
  const [showIpWarning, setShowIpWarning] = useState(false);
  const [ipRestartMsg, setIpRestartMsg] = useState(false);

  const isValidIp = (val: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(val) && val.split('.').every(n => Number(n) <= 255);

  const validateIpFields = (): boolean => {
    if (ipEditorMode === 'automatic') return true;
    const errs: Partial<Record<keyof IpConfig, string>> = {};
    if (!isValidIp(ipEditorConfig.ip)) errs.ip = 'IP Address is not valid (should be in the form: 192.168.0.100)';
    if (!isValidIp(ipEditorConfig.subnet)) errs.subnet = 'Subnet Mask is not valid (should be in the form: 255.255.255.0)';
    if (!isValidIp(ipEditorConfig.gateway)) errs.gateway = 'Router IP Address is not valid (should be in the form: 192.168.0.1)';
    if (ipEditorConfig.dnsProto === 'static') {
      if (!isValidIp(ipEditorConfig.dns1)) errs.dns1 = 'DNS 1 is not valid (should be in the form: 8.8.8.8)';
      if (!isValidIp(ipEditorConfig.dns2)) errs.dns2 = 'DNS 2 is not valid (should be in the form: 8.8.4.4)';
    }
    setIpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleIpSave = () => {
    if (!validateIpFields()) return;
    if (ipEditorMode === 'manual') {
      setShowIpWarning(true);
    } else {
      commitIpSave();
    }
  };

  const commitIpSave = () => {
    setShowIpWarning(false);
    setIpMode(ipEditorMode);
    setIpConfig({ ...ipEditorConfig });
    setShowIpEditor(false);
    setIpRestartMsg(true);
    setTimeout(() => setIpRestartMsg(false), 5000);
  };

  // Record Schedule
  type ScheduleDay = boolean; // Sun=0 .. Sat=6
  interface Schedule {
    enabled: boolean;
    allDay: boolean;
    startHour: number;
    startMinute: number;
    startPeriod: 'AM' | 'PM';
    endHour: number;
    endMinute: number;
    endPeriod: 'AM' | 'PM';
    days: [ScheduleDay, ScheduleDay, ScheduleDay, ScheduleDay, ScheduleDay, ScheduleDay, ScheduleDay];
  }
  const defaultScheduleEnabled = (): Schedule => ({
    enabled: true, allDay: true,
    startHour: 12, startMinute: 0, startPeriod: 'AM',
    endHour: 12, endMinute: 0, endPeriod: 'AM',
    days: [true, true, true, true, true, true, true],
  });
  const defaultScheduleDisabled = (): Schedule => ({
    enabled: false, allDay: true,
    startHour: 12, startMinute: 0, startPeriod: 'AM',
    endHour: 12, endMinute: 0, endPeriod: 'AM',
    days: [false, false, false, false, false, false, false],
  });
  const [schedules, setSchedules] = useState<Schedule[]>([defaultScheduleEnabled(), defaultScheduleDisabled(), defaultScheduleDisabled(), defaultScheduleDisabled()]);
  const [showScheduleList, setShowScheduleList] = useState(false);
  const [editingScheduleIdx, setEditingScheduleIdx] = useState<number | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showScheduleStartPicker, setShowScheduleStartPicker] = useState(false);
  const [showScheduleEndPicker, setShowScheduleEndPicker] = useState(false);

  const scheduleSummary = (s: Schedule) => {
    if (!s.enabled) return 'Disabled';
    const allDays = s.days.every(Boolean);
    const dayLabels = ['Sun','Mon','Tues','Weds','Thurs','Fri','Sat'];
    const selectedDays = allDays ? 'Everyday' : dayLabels.filter((_, i) => s.days[i]).join(', ');
    const timeStr = s.allDay ? 'All day' : `On at ${s.startHour}:${s.startMinute.toString().padStart(2,'0')} ${s.startPeriod}, Off at ${s.endHour}:${s.endMinute.toString().padStart(2,'0')} ${s.endPeriod}`;
    return `${timeStr}, ${selectedDays}`;
  };

  const overallScheduleSummary = (): { text: string; color: string } => {
    if (schedules.every(s => !s.enabled)) return { text: 'Disabled', color: '#FFC7BD' };
    if (schedules.some(s => s.enabled && s.allDay && s.days.every(Boolean))) return { text: 'All day, Everyday', color: '#BFE3D9' };
    return { text: 'Custom', color: '#FCEAAD' };
  };

  // Record Mode popup
  type RMPopup = { mode: 'Never' | 'Motion Only' | 'Everything'; title: string; message: string; hasCancel: boolean } | null;
  const [rmPopup, setRmPopup] = useState<RMPopup>(null);

  const rmMessages: Record<'Never' | 'Motion Only' | 'Everything', { title: string; message: string; hasCancel: boolean }> = {
    'Never':       { title: "Record Never",       message: "No recordings will be made.", hasCancel: true },
    'Motion Only': { title: "Record Motion Only", message: "Recordings will be made whenever there is motion and enabled by recording schedule.", hasCancel: false },
    'Everything':  { title: "Record Always",      message: "Everything will be recorded when enabled by recording schedule.", hasCancel: false },
  };

  // Night Vision / IR Illuminator popups
  type NVPopup = { mode: 'Off' | 'On' | 'Auto' | 'Auto+'; title: string; message: string; hasCancel: boolean } | null;
  type IRPopup = { mode: 'Off' | 'On' | 'Auto'; title: string; message: string; hasCancel: boolean } | null;
  const [nvPopup, setNvPopup] = useState<NVPopup>(null);
  const [irPopup, setIrPopup] = useState<IRPopup>(null);

  // Record Threshold save simulation
  const [savedRecordThreshold, setSavedRecordThreshold] = useState(recordThreshold);
  const [recordThresholdError, setRecordThresholdError] = useState(false);

  const attemptSaveRecordThreshold = (value: number) => {
    if (Math.random() < 0.2) {
      setRecordThresholdError(true);
      setRecordThreshold(savedRecordThreshold);
    } else {
      setRecordThresholdError(false);
      setSavedRecordThreshold(value);
    }
  };

  const nvMessages: Record<'Off' | 'On' | 'Auto' | 'Auto+', { title: string; message: string; hasCancel: boolean }> = {
    'Off':   { title: "Night Vision Off",   message: "Color image always. There will be little or no image when the room is dark. WARNING: The camera will not be able to alarm or record in a dark room.", hasCancel: true },
    'On':    { title: "Night Vision On",    message: "Black and white image always. Best motion alarm performance.", hasCancel: false },
    'Auto':  { title: "Night Vision Auto",  message: "Color during the day, black and white at night. Infrared is filtered for more natural colors but with possibly reduced motion detection performance.", hasCancel: false },
    'Auto+': { title: "Night Vision Auto+", message: "Color during the day, black and white at night. Color includes infrared so colors will be off but very good motion detection.", hasCancel: false },
  };

  const irMessages: Record<'Off' | 'On' | 'Auto', { title: string; message: string; hasCancel: boolean }> = {
    'Off':  { title: "Infrared Illuminators Off",  message: "The infrared illuminators will always be off. WARNING: the camera will not alarm or record in a dark room.", hasCancel: true },
    'On':   { title: "Infrared Illuminators On",   message: "The infrared illuminators will always be on. This may improve the image in a partially lit room. This may also reduce the infrared illuminator lifespan.", hasCancel: false },
    'Auto': { title: "Infrared Illuminators Auto", message: "The infrared illuminators will automatically switch on when the room is dark and off when lit.", hasCancel: false },
  };

  // Camera WiFi picker (separate from app WiFi in Network section)
  const [cameraWifiNetwork, setCameraWifiNetwork] = useState('Sami-5G');
  const [showCameraWifiPicker, setShowCameraWifiPicker] = useState(false);
  const [cameraWifiPickerStep, setCameraWifiPickerStep] = useState<'select' | 'password' | 'warning' | 'testing'>('select');
  const [cameraWifiPendingSsid, setCameraWifiPendingSsid] = useState('');
  const [cameraWifiPendingPassword, setCameraWifiPendingPassword] = useState('');
  const [cameraWifiPendingIsOpen, setCameraWifiPendingIsOpen] = useState(false);
  const [cameraWifiPasswordAttempt, setCameraWifiPasswordAttempt] = useState(0);
  const [cameraWifiShowErrorOnReturn, setCameraWifiShowErrorOnReturn] = useState(false);
  const [showCameraWifiSuccess, setShowCameraWifiSuccess] = useState(false);
  const [cameraWifiSuccessNetwork, setCameraWifiSuccessNetwork] = useState('');
  // Inline state for camera WiFi picker popup (separate from onboarding flow)
  const CW_NETWORKS = [
    { ssid: 'Sami-5G', secured: true, strength: 3 },
    { ssid: 'Home-WiFi-5G', secured: true, strength: 3 },
    { ssid: 'Home-WiFi-2.4G', secured: true, strength: 2 },
    { ssid: 'CoffeeShop_Free', secured: false, strength: 2 },
    { ssid: 'Guest-Network', secured: true, strength: 2 },
    { ssid: 'OpenWifi_Lobby', secured: false, strength: 1 },
  ];
  const [cwPickerSelectedSsid, setCwPickerSelectedSsid] = useState('Sami-5G');
  const [cwPickerIsRefreshing, setCwPickerIsRefreshing] = useState(false);
  const [cwPickerPassword, setCwPickerPassword] = useState('');
  const [cwPickerShowPw, setCwPickerShowPw] = useState(false);
  const [cwPickerPwError, setCwPickerPwError] = useState(false);

  return (
    <div className="absolute inset-0 bg-black z-30 flex flex-col">
      {/* Top black panel */}
      <div className="bg-black py-4 flex items-center justify-between">
        <button
          onClick={() => setShowSettings(false)}
          className="ml-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <span
          className="text-white text-lg font-medium cursor-pointer select-none"
          onMouseDown={handleQCTitlePressStart}
          onMouseUp={handleQCTitlePressEnd}
          onMouseLeave={handleQCTitlePressEnd}
          onTouchStart={handleQCTitlePressStart}
          onTouchEnd={handleQCTitlePressEnd}
        >Settings</span>

        <button
          onClick={() => setShowResetDialog(true)}
          className="mr-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Settings content */}
      <div className="flex-1 bg-black overflow-y-auto px-6">
        <div className="space-y-8 py-6">

          {/* Devices Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Devices</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="space-y-1">
                {/* Sami Camera or Add Camera */}
                {cameraPaired ? (
                  <div
                    onClick={() => setSelectedDevice('sami-3c: 7812FFA01839')}
                    className="w-full px-4 py-4 text-white flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {selectedDevice === 'sami-3c: 7812FFA01839' && <Check className="w-5 h-5" style={{ color: SETTINGS_ACCENT_COLOR }} />}
                    </div>
                    <div className="flex-1">
                      <div className="leading-tight">Sami-3c: 7812FFA01839</div>
                      <div className="text-sm text-gray-400 mt-0.5">offline</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCameraSettings(true);
                      }}
                      className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90"
                      style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}
                    >
                      Camera Settings
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setOnboardingInitialStep(selectedOS === 'android' ? 13 : 2);
                      setOnboardingSkipPermissions(true);
                      setShowSettings(false);
                      setShowOnboarding(true);
                    }}
                    className="w-full px-4 py-4 text-white flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {/* Empty space - cannot be selected */}
                    </div>
                    <div className="flex-1">
                      <div className="leading-tight">Add Sami Camera</div>
                    </div>
                    <ChevronRight className="w-10 h-10 text-white flex-shrink-0" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Network Section — Android only */}
          {selectedOS === 'android' && <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Network</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
              <button
                onClick={() => {
                  setSettingsWifiPickerStep('select');
                  setShowSettingsWifiPicker(true);
                }}
                className="w-full flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <span className="text-white block">Wi-Fi Network</span>
                    <span className="text-gray-400 text-sm">{settingsWifiNetwork}</span>
                  </div>
                </div>
                <ChevronRight className="w-10 h-10 text-white" />
              </button>
            </div>
          </div>}

          {cameraPaired && (
          <>
          {/* Alarms Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Alarms</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
              <div className="space-y-0">
              {/* Enable Alarm */}
              <div className="flex items-center justify-between py-4 border-b border-gray-700">
                <span className="text-white">Enable Alarm</span>
                <button
                  onClick={handleEnableAlarmToggle}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    enableAlarm ? '' : 'bg-gray-400'
                  }`}
                  style={enableAlarm ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      enableAlarm ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Motion Threshold */}
              <div className="flex items-center py-4 border-b border-gray-700">
                <span className="text-white text-lg w-48">Motion Threshold</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <button
                    onClick={() => setMotionThresholdSetting(Math.max(0, motionThresholdSetting - 1))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    −
                  </button>
                  <div className="relative w-64">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-200"
                        style={{ width: `${motionThresholdSetting}%`, backgroundColor: '#5A8BBF' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={motionThresholdSetting}
                      onChange={(e) => setMotionThresholdSetting(Number(e.target.value))}
                      className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                      style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                      style={{ left: `calc(${motionThresholdSetting}% - 10px)`, borderColor: '#5A8BBF' }}
                    />
                  </div>
                  <button
                    onClick={() => setMotionThresholdSetting(Math.min(100, motionThresholdSetting + 1))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    +
                  </button>
                  <span className="text-white w-[80px] text-right">{motionThresholdSetting}%</span>
                </div>
              </div>

              {/* Alarm Threshold */}
              <div className="flex items-center py-4 border-b border-gray-700">
                <span className="text-white text-lg w-48">Alarm Threshold</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <button
                    onClick={() => setAlarmThresholdSetting(decrementAlarmThreshold(alarmThresholdSetting))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    −
                  </button>
                  <div className="relative w-64">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-200"
                        style={{ width: `${(alarmThresholdSetting / 900) * 100}%`, backgroundColor: '#5A8BBF' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="900"
                      step="1"
                      value={alarmThresholdSetting}
                      onChange={(e) => setAlarmThresholdSetting(Number(e.target.value))}
                      className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                      style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                      style={{ left: `calc(${(alarmThresholdSetting / 900) * 100}% - 10px)`, borderColor: '#5A8BBF' }}
                    />
                  </div>
                  <button
                    onClick={() => setAlarmThresholdSetting(incrementAlarmThreshold(alarmThresholdSetting))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    +
                  </button>
                  <span className="text-white w-[80px] text-right">
                    {formatAlarmThreshold(alarmThresholdSetting)}
                  </span>
                </div>
              </div>

              {/* Sensitivity Boost */}
              <div className="flex items-center py-4 border-b border-gray-700">
                <span className="text-white text-lg w-48">Sensitivity Boost</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <button
                    onClick={() => setSensitivityBoost(Math.max(0, sensitivityBoost - 1))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    −
                  </button>
                  <div className="relative w-64">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-200"
                        style={{ width: `${sensitivityBoost}%`, backgroundColor: '#5A8BBF' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={sensitivityBoost}
                      onChange={(e) => setSensitivityBoost(Number(e.target.value))}
                      className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                      style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                      style={{ left: `calc(${sensitivityBoost}% - 10px)`, borderColor: '#5A8BBF' }}
                    />
                  </div>
                  <button
                    onClick={() => setSensitivityBoost(Math.min(100, sensitivityBoost + 1))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    +
                  </button>
                  <span className="text-white w-[80px] text-right">{sensitivityBoost}%</span>
                </div>
              </div>

              {/* Max Pause Time */}
              <div className="flex items-center py-4 border-b border-gray-700">
                <span className="text-white text-lg w-48">Max Pause Time</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <button
                    onClick={() => setMaxPauseTime(decrementMaxPauseTime(maxPauseTime))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    −
                  </button>
                  <div className="relative w-64">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-200"
                        style={{ width: `${(getMaxPauseTimeSliderIndex(maxPauseTime) / 60) * 100}%`, backgroundColor: '#6BA3D4' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="1"
                      value={getMaxPauseTimeSliderIndex(maxPauseTime)}
                      onChange={(e) => setMaxPauseTime(getMaxPauseTimeFromSliderIndex(Number(e.target.value)))}
                      className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                      style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                      style={{ left: `calc(${(getMaxPauseTimeSliderIndex(maxPauseTime) / 60) * 100}% - 10px)`, borderColor: '#6BA3D4' }}
                    />
                  </div>
                  <button
                    onClick={() => setMaxPauseTime(incrementMaxPauseTime(maxPauseTime))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    +
                  </button>
                  <span className="text-white w-[80px] text-right">
                    {formatMaxPauseTime(maxPauseTime)}
                  </span>
                </div>
              </div>

              {/* Smart Border */}
              <div className="flex items-center justify-between py-4 border-b border-gray-700">
                <span className="text-white">Smart Border <span className="text-sm italic">(Smart Edge)</span></span>
                <button
                  onClick={handleSmartBorderToggle}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    smartBorder ? '' : 'bg-gray-400'
                  }`}
                  style={smartBorder ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      smartBorder ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Beep on Camera Fault */}
              <div className="flex items-center justify-between py-4 border-b border-gray-700">
                <span className="text-white">Beep on Camera Fault</span>
                <button
                  onClick={() => handleBeepOnCameraFaultToggle(!beepOnCameraFault)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    beepOnCameraFault ? '' : 'bg-gray-400'
                  }`}
                  style={beepOnCameraFault ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      beepOnCameraFault ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Beep on App Not Active */}
              <div className="flex items-center justify-between py-4">
                <span className="text-white">Beep on App Not Active</span>
                <button
                  onClick={() => handleBeepOnAppNotActiveToggle(!beepOnAppNotActive)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    beepOnAppNotActive ? '' : 'bg-gray-400'
                  }`}
                  style={beepOnAppNotActive ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      beepOnAppNotActive ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Schedule</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
              <div className="space-y-0">
                {/* Enable Alarm Schedule */}
                <div className="flex items-center justify-between py-4 border-b border-gray-700">
                  <span className="text-white">Enable Alarm Schedule</span>
                  <button
                    onClick={() => setEnableAlarmSchedule(!enableAlarmSchedule)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${
                      enableAlarmSchedule ? '' : 'bg-gray-400'
                    }`}
                    style={enableAlarmSchedule ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        enableAlarmSchedule ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Alarm Enable Time */}
                <button
                  onClick={() => setShowAlarmEnableTimePicker(true)}
                  className="w-full flex items-center justify-between py-4 bg-transparent text-white transition-colors border-b border-gray-700"
                >
                  <span className="text-white">Alarm Enable Time</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{formatTime(alarmEnableHour, alarmEnableMinute, alarmEnablePeriod)}</span>
                    <ChevronRight className="w-10 h-10 text-white" />
                  </div>
                </button>

                {/* Alarm Disable Time */}
                <button
                  onClick={() => setShowAlarmDisableTimePicker(true)}
                  className="w-full flex items-center justify-between py-4 bg-transparent text-white transition-colors"
                >
                  <span className="text-white">Alarm Disable Time</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{formatTime(alarmDisableHour, alarmDisableMinute, alarmDisablePeriod)}</span>
                    <ChevronRight className="w-10 h-10 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Audio Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Audio</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
              <div className="space-y-0">
              {/* Alarm Volume */}
              <div className="flex items-center py-4 border-b border-gray-700">
                <span className="text-white text-lg w-48">Alarm Volume</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <button
                    onClick={() => setAlarmVolume(Math.max(0, alarmVolume - 1))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    −
                  </button>
                  <div className="relative w-64">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-200"
                        style={{ width: `${alarmVolume}%`, backgroundColor: '#6BA3D4' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={alarmVolume}
                      onChange={(e) => setAlarmVolume(Number(e.target.value))}
                      className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                      style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                      style={{ left: `calc(${alarmVolume}% - 10px)`, borderColor: '#6BA3D4' }}
                    />
                  </div>
                  <button
                    onClick={() => setAlarmVolume(Math.min(100, alarmVolume + 1))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    +
                  </button>
                  <span className="text-white w-[80px] text-right">{alarmVolume}%</span>
                </div>
              </div>

              {/* Alarm Sound */}
              <div className="flex items-center justify-between py-4 border-b border-gray-700">
                <span className="text-white">Alarm Sound</span>
                <div className="flex">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((sound, index) => (
                    <button
                      key={sound}
                      onClick={() => setAlarmSound(sound)}
                      className={`px-4 py-2 transition-colors text-sm ${
                        alarmSound === sound
                          ? 'text-white'
                          : 'bg-gray-600 text-white hover:bg-gray-500'
                      } ${
                        index === 0 ? 'rounded-l' : ''
                      } ${
                        index === 5 ? 'rounded-r' : 'border-r border-gray-700'
                      }`}
                      style={alarmSound === sound ? { backgroundColor: '#6BA3D4' } : {}}
                    >
                      {sound}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alarm Duration */}
              <div className="flex items-center py-4 border-b border-gray-700">
                <span className="text-white text-lg w-48">Alarm Duration</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <button
                    onClick={() => setAlarmDuration(decrementAlarmDuration(alarmDuration))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    −
                  </button>
                  <div className="relative w-64">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-200"
                        style={{ width: `${(getAlarmDurationSliderIndex(alarmDuration) / 68) * 100}%`, backgroundColor: '#6BA3D4' }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="68"
                      step="1"
                      value={getAlarmDurationSliderIndex(alarmDuration)}
                      onChange={(e) => setAlarmDuration(getAlarmDurationFromSliderIndex(Number(e.target.value)))}
                      className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                      style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                      style={{ left: `calc(${(getAlarmDurationSliderIndex(alarmDuration) / 68) * 100}% - 10px)`, borderColor: '#6BA3D4' }}
                    />
                  </div>
                  <button
                    onClick={() => setAlarmDuration(incrementAlarmDuration(alarmDuration))}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                  >
                    +
                  </button>
                  <span className="text-white w-[80px] text-right">{formatAlarmDuration(alarmDuration)}</span>
                </div>
              </div>

              {/* Vibrate on Alarm */}
              <div className="flex items-center justify-between py-4 border-b border-gray-700">
                <span className="text-white">Vibrate on Alarm</span>
                <button
                  onClick={() => setVibrateOnAlarm(!vibrateOnAlarm)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    vibrateOnAlarm ? '' : 'bg-gray-400'
                  }`}
                  style={vibrateOnAlarm ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      vibrateOnAlarm ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Microphone Boost */}
              <div className="flex items-center justify-between py-4 border-b border-gray-700">
                <span className="text-white">Microphone Boost</span>
                <button
                  onClick={() => {
                    if (!microphoneBoost) {
                      setShowMicrophoneBoostPopup(true);
                    } else {
                      setMicrophoneBoost(false);
                    }
                  }}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    microphoneBoost ? '' : 'bg-gray-400'
                  }`}
                  style={microphoneBoost ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      microphoneBoost ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Microphone Noise Reduction */}
              <div className="flex items-center justify-between py-4">
                <span className="text-white">Microphone Noise Reduction</span>
                <button
                  onClick={() => {
                    if (!microphoneNoiseReduction) {
                      setShowMicrophoneNoiseReductionPopup(true);
                    } else {
                      setMicrophoneNoiseReduction(false);
                    }
                  }}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    microphoneNoiseReduction ? '' : 'bg-gray-400'
                  }`}
                  style={microphoneNoiseReduction ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      microphoneNoiseReduction ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            </div>
          </div>

          {/* Display Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Display</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
              <div className="space-y-0">
                {/* Screen Timeout to Clock */}
                <div className="flex items-center justify-between py-4 border-b border-gray-700">
                  <span className="text-white">Screen Timeout to Clock</span>
                  <button
                    onClick={() => setScreenTimeoutToClock(!screenTimeoutToClock)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${
                      screenTimeoutToClock ? '' : 'bg-gray-400'
                    }`}
                    style={screenTimeoutToClock ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        screenTimeoutToClock ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Timeout Delay */}
                <div className="flex items-center py-4 border-b border-gray-700">
                  <span className="text-white text-lg w-48">Timeout Delay</span>
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <button
                      onClick={() => setTimeoutDelay(decrementTimeoutDelay(timeoutDelay))}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                    >
                      −
                    </button>
                    <div className="relative w-64">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-200"
                          style={{ width: `${(getTimeoutDelaySliderIndex(timeoutDelay) / (timeoutDelayValues.length - 1)) * 100}%`, backgroundColor: '#6BA3D4' }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={timeoutDelayValues.length - 1}
                        step="1"
                        value={getTimeoutDelaySliderIndex(timeoutDelay)}
                        onChange={(e) => setTimeoutDelay(getTimeoutDelayFromSliderIndex(Number(e.target.value)))}
                        className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                        style={{ margin: 0 }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                        style={{ left: `calc(${(getTimeoutDelaySliderIndex(timeoutDelay) / (timeoutDelayValues.length - 1)) * 100}% - 10px)`, borderColor: SETTINGS_ACCENT_COLOR }}
                      />
                    </div>
                    <button
                      onClick={() => setTimeoutDelay(incrementTimeoutDelay(timeoutDelay))}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                    >
                      +
                    </button>
                    <span className="text-white w-[80px] text-right">{formatTimeoutDelay(timeoutDelay)}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Recordings Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Recordings</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
              <div className="space-y-0">
                {/* Enable Automatic Recording Transfers */}
                <div className="flex items-center justify-between py-4 border-b border-gray-700">
                  <span className="text-white">Enable Automatic Recording Transfers</span>
                  <button
                    onClick={() => setEnableAutoRecording(!enableAutoRecording)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${
                      enableAutoRecording ? '' : 'bg-gray-400'
                    }`}
                    style={enableAutoRecording ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        enableAutoRecording ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Storage Limit */}
                <div className="flex items-center py-4 border-b border-gray-700">
                  <span className="text-white text-lg w-48">Storage Limit</span>
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <button
                      onClick={() => setStorageLimit(Math.max(1, storageLimit - 1))}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                    >
                      −
                    </button>
                    <div className="relative w-64">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-200"
                          style={{ width: `${((storageLimit - 1) / 499) * 100}%`, backgroundColor: SETTINGS_ACCENT_COLOR }}
                        />
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="500"
                        step="1"
                        value={storageLimit}
                        onChange={(e) => setStorageLimit(Number(e.target.value))}
                        className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                        style={{ margin: 0 }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                        style={{ left: `calc(${((storageLimit - 1) / 499) * 100}% - 10px)`, borderColor: SETTINGS_ACCENT_COLOR }}
                      />
                    </div>
                    <button
                      onClick={() => setStorageLimit(Math.min(500, storageLimit + 1))}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                    >
                      +
                    </button>
                    <span className="text-white w-[80px] text-right">{storageLimit}GB</span>
                  </div>
                </div>

                {/* Auto-Delete Older Videos */}
                <div className="flex items-center justify-between py-4 border-b border-gray-700">
                  <span className="text-white">Automatically-Delete Older Videos</span>
                  <button
                    onClick={() => {
                      if (!autoDeleteOlderVideos) {
                        setShowAutoDeletePopup(true);
                      } else {
                        setAutoDeleteOlderVideos(false);
                      }
                    }}
                    className={`w-14 h-8 rounded-full transition-colors relative ${
                      autoDeleteOlderVideos ? '' : 'bg-gray-400'
                    }`}
                    style={autoDeleteOlderVideos ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        autoDeleteOlderVideos ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Mobile Data Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Mobile Data</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
              <div className="space-y-0">
                {/* Always Allow Mobile Data */}
                <div className="flex items-center justify-between py-4">
                  <span className="text-white">Always Allow Mobile Data</span>
                  <button
                    onClick={() => setAlwaysAllowMobileData(!alwaysAllowMobileData)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${
                      alwaysAllowMobileData ? '' : 'bg-gray-400'
                    }`}
                    style={alwaysAllowMobileData ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        alwaysAllowMobileData ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Anonymous Data Analytics Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3 px-4">Data Analytics</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
              <div className="space-y-0">
                {/* Unable Sent Data */}
                <div className="flex items-center justify-between py-4">
                  <span className="text-white">Use my anonymous data</span>
                  <button
                    onClick={() => setEnableSentData(!enableSentData)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${
                      enableSentData ? '' : 'bg-gray-400'
                    }`}
                    style={enableSentData ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        enableSentData ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* QC Section (Easter Egg) */}
          {showQCSection && (
            <div>
              <h3 className="text-white text-xl font-bold mb-3 px-4">QC</h3>
              <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
                <div className="space-y-0">
                  {/* Display Data */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white">Display Data</span>
                    <button
                      onClick={() => setDisplayData(!displayData)}
                      className={`w-14 h-8 rounded-full transition-colors relative ${
                        displayData ? '' : 'bg-gray-400'
                      }`}
                      style={displayData ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          displayData ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Rapid Test Mode */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white">Rapid Test Mode</span>
                    <button
                      onClick={() => setRapidTestMode(!rapidTestMode)}
                      className={`w-14 h-8 rounded-full transition-colors relative ${
                        rapidTestMode ? '' : 'bg-gray-400'
                      }`}
                      style={rapidTestMode ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          rapidTestMode ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Burning Mode */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white">Burning Mode</span>
                    <button
                      onClick={() => setBurningMode(!burningMode)}
                      className={`w-14 h-8 rounded-full transition-colors relative ${
                        burningMode ? '' : 'bg-gray-400'
                      }`}
                      style={burningMode ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          burningMode ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Min Wi-Fi Quality */}
                  <div className="flex items-center py-4 border-b border-gray-700">
                    <span className="text-white text-lg w-48">Min Wi-Fi Quality</span>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <button
                        onClick={() => setMinWifiQuality(Math.max(50, minWifiQuality - 1))}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                      >
                        −
                      </button>
                      <div className="relative w-64">
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-200"
                            style={{ width: `${((minWifiQuality - 50) / 100) * 100}%`, backgroundColor: SETTINGS_ACCENT_COLOR }}
                          />
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          step="1"
                          value={minWifiQuality}
                          onChange={(e) => setMinWifiQuality(Number(e.target.value))}
                          className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                          style={{ margin: 0 }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg"
                          style={{ left: `calc(${((minWifiQuality - 50) / 100) * 100}% - 10px)`, borderColor: SETTINGS_ACCENT_COLOR }}
                        />
                      </div>
                      <button
                        onClick={() => setMinWifiQuality(Math.min(150, minWifiQuality + 1))}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white"
                      >
                        +
                      </button>
                      <span className="text-white w-[80px] text-right">{minWifiQuality}</span>
                    </div>
                  </div>

                  {/* Dev AWS */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-white">Dev AWS</span>
                    <button
                      onClick={() => setDevAWS(!devAWS)}
                      className={`w-14 h-8 rounded-full transition-colors relative ${
                        devAWS ? '' : 'bg-gray-400'
                      }`}
                      style={devAWS ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          devAWS ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          </>
          )}

        </div>
      </div>

      {/* Pairing Popup */}
      {showPairingPopup && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg px-12 py-8 text-center">
            <div className="text-white text-2xl font-medium">Pairing Camera</div>
            <div className="mt-4">
              <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: SETTINGS_ACCENT_COLOR, borderTopColor: 'transparent' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Dialog */}
      {showResetDialog && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[700px] overflow-hidden">
            {/* Options */}
            <div className="px-8 py-6 space-y-6">
              {/* Option 1 */}
              <div className="flex items-center justify-between gap-6 pb-6 border-b border-gray-700">
                <div className="flex-1">
                  <p className="text-white text-base leading-relaxed">
                    Resets values for alarm, schedule, audio, display and recordings.
                  </p>
                </div>
                <button
                  onClick={handleResetUserSettings}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors whitespace-nowrap font-semibold text-sm"
                >
                  Reset User Settings
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex items-center justify-between gap-6 pb-6 border-b border-gray-700">
                <div className="flex-1">
                  <p className="text-white text-base leading-relaxed">
                    Resets app settings, clears all locks and alarm tags and removes cameras.
                  </p>
                </div>
                <button
                  onClick={handleResetAllAppSettings}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors whitespace-nowrap font-semibold text-sm"
                >
                  Reset App Settings
                </button>
              </div>

              {/* Option 3 */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-white text-base leading-relaxed">
                    Resets app settings and deletes all recordings from the current Device.
                  </p>
                </div>
                <button
                  onClick={handleEraseAllContent}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors whitespace-nowrap font-semibold text-sm"
                >
                  Erase All Content
                </button>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="border-t border-gray-700">
              <button
                onClick={() => setShowResetDialog(false)}
                className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Erase All Content Confirmation Dialog */}
      {showEraseConfirmDialog && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
            {/* Title */}
            <div className="px-8 pt-6">
              <h2 className="text-white text-2xl font-semibold text-center">Are you sure?</h2>
            </div>

            {/* Description */}
            <div className="px-8 py-6">
              <p className="text-white text-lg leading-relaxed text-center">
                This will reset all the app settings and delete all recordings from the current Device, recordings will remain on your camera. The app will exit when done.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={handleConfirmEraseAllContent}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-red-500"
              >
                Erase All
              </button>
              <button
                onClick={() => setShowEraseConfirmDialog(false)}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset All App Settings Confirmation Dialog */}
      {showResetAllConfirmDialog && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[650px] overflow-hidden">
            {/* Title */}
            <div className="px-8 pt-6">
              <h2 className="text-white text-2xl font-semibold text-center">Are you sure?</h2>
            </div>

            {/* Description */}
            <div className="px-8 py-6">
              <p className="text-white text-lg leading-relaxed text-center">
                This will reset the app settings. No recordings will be deleted but all locks and alarm flags will be cleared and cameras will be removed. The app will exit after reset.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={handleConfirmResetAllAppSettings}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-red-500"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetAllConfirmDialog(false)}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Fault Popup */}
      {showCameraFaultPopup && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
            {/* Title */}
            <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">
              Can't find Sami camera
            </div>

            {/* Description */}
            <div className="px-6 py-6">
              <p className="text-white text-center text-lg">
                Check that you are connected to the correct Wi-Fi network and that the camera is on. Searching now...
              </p>
            </div>

            {/* Ok Button */}
            <div className="border-t border-gray-700">
              <button
                onClick={closeCameraFaultPopup}
                className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beep on App Not Active - First Popup */}
      {showBeepAppNotActivePopup && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
            {/* Title */}
            <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">
              Beep on App Not Active
            </div>

            {/* Description */}
            <div className="px-6 py-6">
              <p className="text-white text-center text-lg">
                If the app stops running when the alarm is enabled you will get a notification.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={() => {
                  setShowBeepAppNotActivePopup(false);
                  setBeepOnAppNotActive(false);
                }}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBeepAppNotActivePopup(false);
                  setBeepOnAppNotActive(true);
                  setShowSilentSwitchPopup(true);
                }}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Silent Switch On - Second Popup */}
      {showSilentSwitchPopup && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
            {/* Title */}
            <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">
              Silent Switch On
            </div>

            {/* Description */}
            <div className="px-6 py-6">
              <p className="text-white text-center text-lg">
                You have enable "Beep on App Not Active" but your Device silent switch is on. It must be off for you to hear the alerts.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={() => closeSilentSwitchPopup('disable')}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-red-500"
              >
                Disable
              </button>
              <button
                onClick={() => closeSilentSwitchPopup('ok')}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Microphone Boost Popup */}
      {showMicrophoneBoostPopup && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
            {/* Title */}
            <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">
              Microphone Boost
            </div>

            {/* Description */}
            <div className="px-6 py-6">
              <p className="text-white text-center text-lg">
                This will increase the audio volume making it easier to hear quite sounds. Note: loud sounds may distort.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={() => {
                  setShowMicrophoneBoostPopup(false);
                  setMicrophoneBoost(false);
                }}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowMicrophoneBoostPopup(false);
                  setMicrophoneBoost(true);
                }}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Microphone Noise Reduction Popup */}
      {showMicrophoneNoiseReductionPopup && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
            {/* Title */}
            <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">
              Microphone Noise Reduction
            </div>

            {/* Description */}
            <div className="px-6 py-6">
              <p className="text-white text-center text-lg">
                This will reduce the background noise you hear when room is quiet.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={() => {
                  setShowMicrophoneNoiseReductionPopup(false);
                  setMicrophoneNoiseReduction(false);
                }}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowMicrophoneNoiseReductionPopup(false);
                  setMicrophoneNoiseReduction(true);
                }}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Settings Screen Overlay */}
      {showCameraSettings && (
        <div
          className="absolute inset-0 bg-black z-40 flex flex-col animate-slide-in-right"
          style={{
            animation: 'slideInRight 0.3s ease-out forwards'
          }}
        >
          {/* Top Navigation Bar */}
          <div className="bg-black py-4 flex items-center justify-between">
            <button
              onClick={() => setShowCameraSettings(false)}
              className="ml-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <span className="text-white text-lg font-medium">Camera Settings</span>

            <div className="mr-6 w-[72px]"></div>
          </div>

          {/* Content Area with Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6" style={{ backgroundColor: SETTINGS_BG_COLOR }}>
            <div className="py-6 space-y-8">

              {/* ── Camera Status / Password (no category header) ── */}
              <div>
                <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
                  {/* Camera Status */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white text-base">Camera Status</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#BFE3D9] text-base font-medium">Online</span>
                      <button
                        onClick={() => setShowRemoveCameraConfirm(true)}
                        className="px-4 py-2 bg-[#B95555] hover:bg-[#B95555]/80 text-white rounded transition-colors text-sm"
                      >Remove</button>
                    </div>
                  </div>

                  {/* Camera Password */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white text-base">Camera Password</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 text-base">{savedCameraPassword || 'Not set'}</span>
                      <button
                        onClick={() => {
                          setEditedPassword(savedCameraPassword || '');
                          setEditedConfirmPassword('');
                          setEditedPasswordHint(savedCameraPasswordHint || '');
                          setEditPasswordError('');
                          setShowPassword(false);
                          setShowEditPasswordModal(true);
                        }}
                        className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90"
                        style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}
                      >Edit</button>
                    </div>
                  </div>

                  {/* Camera Wi-Fi */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-white text-base">Camera Wi-Fi [{cameraWifiNetwork}]</span>
                    <div className="flex items-center gap-4">
                      <button onClick={cycleCameraSignal} className="flex items-center gap-2 hover:opacity-70 transition-opacity" title="Tap to cycle signal states (demo)">
                        {cameraSignal !== 'Wired' && cameraSignal !== 'NONE' && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {(cameraSignal === 'Excellent' || cameraSignal === 'Ok') && <path d="M1 11C1 11 5.5 6.5 12 6.5C18.5 6.5 23 11 23 11" stroke={cameraSignalColor} strokeWidth="2" strokeLinecap="round" fill="none" />}
                            {cameraSignal === 'Excellent' && <path d="M5 14C5 14 8 11 12 11C16 11 19 14 19 14" stroke={cameraSignalColor} strokeWidth="2" strokeLinecap="round" fill="none" />}
                            <path d="M8.5 16.5C8.5 16.5 10 15 12 15C14 15 15.5 16.5 15.5 16.5" stroke={cameraSignalColor} strokeWidth="2" strokeLinecap="round" fill="none" />
                            <circle cx="12" cy="20" r="1.5" fill={cameraSignalColor} />
                          </svg>
                        )}
                        <span className="text-sm font-medium" style={{ color: cameraSignalColor }}>
                          {cameraSignal === 'Excellent' ? 'Signal is Excellent' : cameraSignal === 'Ok' ? 'Signal is Ok' : cameraSignal === 'Bad' ? 'Signal is Bad' : cameraSignal === 'Poor' ? 'Signal is Poor' : cameraSignal}
                        </span>
                      </button>
                      <button onClick={() => { setCameraWifiPickerStep('select'); setShowCameraWifiPicker(true); }} className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90" style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}>Change</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Image ── */}
              <div>
                <h3 className="text-white text-xl font-bold mb-3 px-4">Image</h3>
                <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
                  {/* Night Vision Mode */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white text-base">Night Vision Mode</span>
                    <div className="flex">
                      {(['Off', 'On', 'Auto', 'Auto+'] as const).map((mode, index) => (
                        <button
                          key={mode}
                          onClick={() => { if (mode === nightVisionMode) return; setNvPopup({ mode, ...nvMessages[mode] }); }}
                          className={`px-4 py-2 transition-colors text-sm ${nightVisionMode === mode ? 'text-white' : 'bg-gray-600 text-white hover:bg-gray-500'} ${index === 0 ? 'rounded-l' : ''} ${index === 3 ? 'rounded-r' : 'border-r border-gray-700'}`}
                          style={nightVisionMode === mode ? { backgroundColor: '#6BA3D4' } : {}}
                        >{mode}</button>
                      ))}
                    </div>
                  </div>

                  {/* IR Illuminator Mode */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-white text-base">IR Illuminator Mode</span>
                    <div className="flex">
                      {(['Off', 'On', 'Auto'] as const).map((mode, index) => (
                        <button
                          key={mode}
                          onClick={() => { if (mode === irIlluminatorMode) return; setIrPopup({ mode, ...irMessages[mode] }); }}
                          className={`px-4 py-2 transition-colors text-sm ${irIlluminatorMode === mode ? 'text-white' : 'bg-gray-600 text-white hover:bg-gray-500'} ${index === 0 ? 'rounded-l' : ''} ${index === 2 ? 'rounded-r' : 'border-r border-gray-700'}`}
                          style={irIlluminatorMode === mode ? { backgroundColor: '#6BA3D4' } : {}}
                        >{mode}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Recordings ── */}
              <div>
                <h3 className="text-white text-xl font-bold mb-3 px-4">Recordings</h3>
                <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
                  {/* Record Mode */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white text-base">Record Mode</span>
                    <div className="flex">
                      {(['Never', 'Motion Only', 'Everything'] as const).map((mode, index) => (
                        <button
                          key={mode}
                          onClick={() => { if (mode === recordMode) return; setRmPopup({ mode, ...rmMessages[mode] }); }}
                          className={`px-4 py-2 transition-colors text-sm ${recordMode === mode ? 'text-white' : 'bg-gray-600 text-white hover:bg-gray-500'} ${index === 0 ? 'rounded-l' : ''} ${index === 2 ? 'rounded-r' : 'border-r border-gray-700'}`}
                          style={recordMode === mode ? { backgroundColor: '#6BA3D4' } : {}}
                        >{mode}</button>
                      ))}
                    </div>
                  </div>

                  {/* Record Threshold */}
                  {(() => {
                    const rtDisabled = recordMode !== 'Motion Only';
                    return (
                      <div className={`flex flex-col py-4 border-b border-gray-700 transition-opacity ${rtDisabled ? 'opacity-40' : ''}`}>
                        <div className="flex items-center">
                          <span className="text-white text-lg w-48">Record Threshold</span>
                          <div className="flex items-center gap-3 flex-1 justify-end">
                            <button disabled={rtDisabled} onClick={() => { const v = Math.max(0, recordThreshold - 5); setRecordThreshold(v); attemptSaveRecordThreshold(v); }} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white disabled:cursor-not-allowed">−</button>
                            <div className="relative w-64">
                              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-200" style={{ width: `${recordThreshold}%`, backgroundColor: '#6BA3D4' }} />
                              </div>
                              <input type="range" min="0" max="100" step="5" disabled={rtDisabled} value={recordThreshold} onChange={(e) => { setRecordThresholdError(false); setRecordThreshold(Number(e.target.value)); }} onMouseUp={(e) => attemptSaveRecordThreshold(Number((e.target as HTMLInputElement).value))} onTouchEnd={(e) => attemptSaveRecordThreshold(Number((e.target as HTMLInputElement).value))} className={`absolute top-0 left-0 w-full h-1 opacity-0 ${rtDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} style={{ margin: 0 }} />
                              <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 pointer-events-none shadow-lg" style={{ left: `calc(${recordThreshold}% - 10px)`, borderColor: '#6BA3D4' }} />
                            </div>
                            <button disabled={rtDisabled} onClick={() => { const v = Math.min(100, recordThreshold + 5); setRecordThreshold(v); attemptSaveRecordThreshold(v); }} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white disabled:cursor-not-allowed">+</button>
                            <span className="text-white w-[80px] text-right">{recordThreshold}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Record Schedule */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white text-base">Record Schedule</span>
                    <div className="flex items-center gap-4">
                      {(() => { const s = overallScheduleSummary(); return <span className="text-base font-medium" style={{ color: s.color }}>{s.text}</span>; })()}
                      <button onClick={() => { setEditingScheduleIdx(0); setEditingSchedule({ ...schedules[0], days: [...schedules[0].days] as Schedule['days'] }); setShowScheduleList(true); }} className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90" style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}>Edit</button>
                    </div>
                  </div>

                  {/* SD Card */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-white text-base">SD Card</span>
                    <div className="flex items-center gap-4">
                      <button onClick={cycleSDStatus} className="hover:opacity-70 transition-opacity" title="Tap to cycle SD states (demo)">
                        <span className="text-base font-medium" style={{ color: sdStatus === 'Missing!' ? '#FFC7BD' : sdStatus === 'Reading...' ? '#FCEAAD' : sdStatus === 'Blank' ? '#FCEAAD' : '#BFE3D9' }}>{sdStatus}</span>
                      </button>
                      <button onClick={() => setSdPopup('confirm-format')} className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90" style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}>Format</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Network Connection ── */}
              <div>
                <h3 className="text-white text-xl font-bold mb-3 px-4">Network Connection</h3>
                <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
                  {/* Internet Viewing */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white text-base">Internet Viewing</span>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-base" style={{ color: internetViewingEnabled ? '#BFE3D9' : '#FFC7BD' }}>{internetViewingEnabled ? 'Enabled' : 'Disabled'}</span>
                      <button
                        onClick={openIVScreen}
                        className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90"
                        style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}
                      >{internetViewingEnabled ? 'Edit' : 'Enable'}</button>
                    </div>
                  </div>

                  {/* Power Light Flash on Internet Viewer */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white text-base">Power Light Flash on Internet Viewer</span>
                    <button
                      onClick={() => setPowerLightFlash(!powerLightFlash)}
                      className={`w-14 h-8 rounded-full transition-colors relative ${powerLightFlash ? '' : 'bg-gray-400'}`}
                      style={powerLightFlash ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${powerLightFlash ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* IP Address */}
                  <div className="flex flex-col py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-base">IP Address</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-300 text-base">{ipMode === 'automatic' ? 'Automatic' : 'Manual'}</span>
                        <button onClick={() => { setIpEditorMode(ipMode); setIpEditorConfig({ ...ipConfig }); setIpErrors({}); setShowIpEditor(true); }} className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90" style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}>Edit</button>
                      </div>
                    </div>
                    {ipRestartMsg && <p className="text-sm mt-2" style={{ color: '#BFE3D9' }}>The camera is now restarting and should reconnect within 60 seconds.</p>}
                  </div>
                </div>
              </div>

              {/* ── General ── */}
              <div>
                <h3 className="text-white text-xl font-bold mb-3 px-4">General</h3>
                <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
                  {/* Restart Camera */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-white text-base">Restart Camera</span>
                    <button
                      onClick={() => setRebootPopup('confirm')}
                      className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90"
                      style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}
                    >Reboot</button>
                  </div>

                  {/* Factory Reset */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-white text-base">Factory Reset</span>
                    <button
                      onClick={() => setFactoryResetPopup('confirm')}
                      className="px-4 py-2 text-white rounded transition-colors text-sm hover:opacity-90"
                      style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}
                    >Reset</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Settings WiFi Picker Overlay */}
      {showSettingsWifiPicker && (
        <div className="absolute inset-0 z-40">
          {settingsWifiPickerStep === 'select' && (
            <WiFiSelection
              onSelect={(ssid, secured) => {
                if (!secured) {
                  setSettingsWifiPendingSsid(ssid);
                  setSettingsWifiPickerStep('testing');
                } else {
                  setSettingsWifiPendingSsid(ssid);
                  setSettingsWifiPickerStep('password');
                }
              }}
              onCancel={() => {
                setShowSettingsWifiPicker(false);
                setSettingsWifiPickerStep('select');
              }}
            />
          )}
          {settingsWifiPickerStep === 'password' && (
            <NetworkPassword
              ssid={settingsWifiPendingSsid}
              onSubmit={() => setSettingsWifiPickerStep('testing')}
              onCancel={() => setSettingsWifiPickerStep('select')}
            />
          )}
          {settingsWifiPickerStep === 'testing' && (
            <WifiTestingScreen
              onComplete={() => {
                setSettingsWifiNetwork(settingsWifiPendingSsid);
                setShowSettingsWifiPicker(false);
                setSettingsWifiPickerStep('select');
              }}
            />
          )}
        </div>
      )}

      {/* Enable Alarm Alert */}
      {showEnableAlarmAlert && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
            {/* Alert Content */}
            <div className="p-8">
              <p className="text-white text-lg leading-relaxed text-center">
                {enableAlarmAlertMessages[currentAlertIndex]}
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={handleAlertCancel}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAlertOk}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Border Popup 1 */}
      {showSmartBorderPopup1 && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
            {/* Title */}
            <div className="px-8 pt-6">
              <h2 className="text-white text-2xl font-semibold text-center">Enable Smart Border</h2>
            </div>

            {/* Description */}
            <div className="px-8 py-6">
              <p className="text-white text-lg leading-relaxed text-center">
                Smart Border suppresses the alarm when Motion is detected starting from the Border Region and going to the Center Monitored Area. Usually used to ignore when a caregiver or a pet enters a room.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={handleSmartBorderPopup1Cancel}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSmartBorderPopup1Ok}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Border Popup 2 */}
      {showSmartBorderPopup2 && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
            {/* Title */}
            <div className="px-8 pt-6">
              <h2 className="text-white text-2xl font-semibold text-center">Changes on Border Functionality</h2>
            </div>

            {/* Description */}
            <div className="px-8 py-6">
              <p className="text-white text-lg leading-relaxed text-center">
                Enabling Smart Border means the app will only ignore motion in the border region if it starts there. If motion starts in the center and moves into the border region, it will still trigger an alert.
              </p>
            </div>

            {/* Buttons */}
            <div className="border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={handleSmartBorderPopup2Cancel}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700 text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSmartBorderPopup2Ok}
                className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alarm Enable Time Picker */}
      {showAlarmEnableTimePicker && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
            {/* Title */}
            <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">
              Alarm Enable Time
            </div>

            {/* Pickers */}
            <div className="flex items-center justify-center gap-4 py-8 px-8">
              {/* Hour Picker */}
              <div className="flex flex-col items-center">
                {/* Show 2 hours above */}
                {[-2, -1].map(offset => {
                  const hour = alarmEnableHour + offset;
                  const displayHour = hour <= 0 ? hour + 12 : hour;
                  return (
                    <button
                      key={`hour-${offset}`}
                      onClick={() => setAlarmEnableHour(displayHour)}
                      className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                    >
                      {displayHour}
                    </button>
                  );
                })}

                {/* Selected hour */}
                <div className="text-white text-4xl font-semibold py-2 w-20 text-center">
                  {alarmEnableHour === 0 ? 12 : alarmEnableHour}
                </div>

                {/* Show 2 hours below */}
                {[1, 2].map(offset => {
                  const hour = alarmEnableHour + offset;
                  const displayHour = hour > 12 ? hour - 12 : hour;
                  return (
                    <button
                      key={`hour-${offset}`}
                      onClick={() => setAlarmEnableHour(displayHour)}
                      className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                    >
                      {displayHour}
                    </button>
                  );
                })}
              </div>

              <div className="text-white text-4xl font-semibold">:</div>

              {/* Minute Picker */}
              <div className="flex flex-col items-center">
                {/* Show 2 minutes above */}
                {[-2, -1].map(offset => {
                  const minute = (alarmEnableMinute + offset + 60) % 60;
                  return (
                    <button
                      key={`minute-${offset}`}
                      onClick={() => setAlarmEnableMinute(minute)}
                      className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  );
                })}

                {/* Selected minute */}
                <div className="text-white text-4xl font-semibold py-2 w-20 text-center">
                  {alarmEnableMinute.toString().padStart(2, '0')}
                </div>

                {/* Show 2 minutes below */}
                {[1, 2].map(offset => {
                  const minute = (alarmEnableMinute + offset) % 60;
                  return (
                    <button
                      key={`minute-${offset}`}
                      onClick={() => setAlarmEnableMinute(minute)}
                      className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              {/* AM/PM Picker */}
              <div className="flex flex-col items-center ml-4">
                {/* Empty space for alignment */}
                <div className="h-[52px]"></div>

                {/* Show opposite option above if PM is selected */}
                {alarmEnablePeriod === 'PM' ? (
                  <button
                    onClick={() => setAlarmEnablePeriod('AM')}
                    className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                  >
                    AM
                  </button>
                ) : (
                  <div className="h-[52px]"></div>
                )}

                {/* Selected period */}
                <button
                  onClick={() => setAlarmEnablePeriod(alarmEnablePeriod === 'AM' ? 'PM' : 'AM')}
                  className="text-white text-4xl font-semibold py-2 w-20 text-center"
                >
                  {alarmEnablePeriod}
                </button>

                {/* Show opposite option below if AM is selected */}
                {alarmEnablePeriod === 'AM' ? (
                  <button
                    onClick={() => setAlarmEnablePeriod('PM')}
                    className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                  >
                    PM
                  </button>
                ) : (
                  <div className="h-[52px]"></div>
                )}

                {/* Empty space for alignment */}
                <div className="h-[52px]"></div>
              </div>
            </div>

            {/* Done Button */}
            <div className="border-t border-gray-700">
              <button
                onClick={() => setShowAlarmEnableTimePicker(false)}
                className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alarm Disable Time Picker */}
      {showAlarmDisableTimePicker && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
            {/* Title */}
            <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">
              Alarm Disable Time
            </div>

            {/* Pickers */}
            <div className="flex items-center justify-center gap-4 py-8 px-8">
              {/* Hour Picker */}
              <div className="flex flex-col items-center">
                {/* Show 2 hours above */}
                {[-2, -1].map(offset => {
                  const hour = alarmDisableHour + offset;
                  const displayHour = hour <= 0 ? hour + 12 : hour;
                  return (
                    <button
                      key={`hour-${offset}`}
                      onClick={() => setAlarmDisableHour(displayHour)}
                      className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                    >
                      {displayHour}
                    </button>
                  );
                })}

                {/* Selected hour */}
                <div className="text-white text-4xl font-semibold py-2 w-20 text-center">
                  {alarmDisableHour === 0 ? 12 : alarmDisableHour}
                </div>

                {/* Show 2 hours below */}
                {[1, 2].map(offset => {
                  const hour = alarmDisableHour + offset;
                  const displayHour = hour > 12 ? hour - 12 : hour;
                  return (
                    <button
                      key={`hour-${offset}`}
                      onClick={() => setAlarmDisableHour(displayHour)}
                      className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                    >
                      {displayHour}
                    </button>
                  );
                })}
              </div>

              <div className="text-white text-4xl font-semibold">:</div>

              {/* Minute Picker */}
              <div className="flex flex-col items-center">
                {/* Show 2 minutes above */}
                {[-2, -1].map(offset => {
                  const minute = (alarmDisableMinute + offset + 60) % 60;
                  return (
                    <button
                      key={`minute-${offset}`}
                      onClick={() => setAlarmDisableMinute(minute)}
                      className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  );
                })}

                {/* Selected minute */}
                <div className="text-white text-4xl font-semibold py-2 w-20 text-center">
                  {alarmDisableMinute.toString().padStart(2, '0')}
                </div>

                {/* Show 2 minutes below */}
                {[1, 2].map(offset => {
                  const minute = (alarmDisableMinute + offset) % 60;
                  return (
                    <button
                      key={`minute-${offset}`}
                      onClick={() => setAlarmDisableMinute(minute)}
                      className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              {/* AM/PM Picker */}
              <div className="flex flex-col items-center ml-4">
                {/* Empty space for alignment */}
                <div className="h-[52px]"></div>

                {/* Show opposite option above if PM is selected */}
                {alarmDisablePeriod === 'PM' ? (
                  <button
                    onClick={() => setAlarmDisablePeriod('AM')}
                    className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                  >
                    AM
                  </button>
                ) : (
                  <div className="h-[52px]"></div>
                )}

                {/* Selected period */}
                <button
                  onClick={() => setAlarmDisablePeriod(alarmDisablePeriod === 'AM' ? 'PM' : 'AM')}
                  className="text-white text-4xl font-semibold py-2 w-20 text-center"
                >
                  {alarmDisablePeriod}
                </button>

                {/* Show opposite option below if AM is selected */}
                {alarmDisablePeriod === 'AM' ? (
                  <button
                    onClick={() => setAlarmDisablePeriod('PM')}
                    className="text-gray-500 text-xl py-1 w-20 text-center hover:text-gray-400 transition-colors"
                  >
                    PM
                  </button>
                ) : (
                  <div className="h-[52px]"></div>
                )}

                {/* Empty space for alignment */}
                <div className="h-[52px]"></div>
              </div>
            </div>

            {/* Done Button */}
            <div className="border-t border-gray-700">
              <button
                onClick={() => setShowAlarmDisableTimePicker(false)}
                className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Remove Camera Confirmation Popup */}
      {showRemoveCameraConfirm && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 py-6">
              <p className="text-gray-300 text-base leading-relaxed text-center">
                Are you sure you want to remove this camera? If you want to reconnect again without needing to reset the camera, save this password: <span className="text-white font-semibold">{savedCameraPassword || 'N/A'}</span>.
              </p>
            </div>
            <div className="border-t border-gray-700 flex">
              <button
                onClick={() => setShowRemoveCameraConfirm(false)}
                className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Keep
              </button>
              <button
                onClick={() => {
                  setCameraPaired(false);
                  setSelectedDevice('');
                  setShowCameraSettings(false);
                  setShowRemoveCameraConfirm(false);
                }}
                className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold text-[#B95555]"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Record Schedule — Schedule Editor */}
      {showScheduleList && editingScheduleIdx !== null && editingSchedule && (() => {
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const fmt = (h: number, m: number, p: 'AM'|'PM') => `${h === 0 ? 12 : h}:${m.toString().padStart(2,'0')} ${p}`;

        const setDay = (idx: number, val: boolean) => {
          const newDays = [...editingSchedule.days] as Schedule['days'];
          newDays[idx] = val;
          const anySelected = newDays.some(Boolean);
          setEditingSchedule({ ...editingSchedule, days: newDays, enabled: anySelected ? editingSchedule.enabled : false });
        };

        const saveAndBack = () => {
          const updated = [...schedules];
          updated[editingScheduleIdx] = editingSchedule;
          setSchedules(updated);
          setEditingScheduleIdx(null);
          setEditingSchedule(null);
          setShowScheduleList(false);
        };

        return (
          <div className="absolute inset-0 bg-black z-50 flex flex-col">
            <div className="bg-black py-4 flex items-center justify-between">
              <button
                onClick={saveAndBack}
                className="ml-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <span className="text-white text-lg font-medium">Record Schedule</span>
              <div className="mr-6 w-[72px]" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div className="bg-gray-800 rounded-lg overflow-hidden px-4">
                {/* Enabled toggle */}
                <div className="flex items-center justify-between py-4 border-b border-gray-700">
                  <span className="text-white">Enabled</span>
                  <button
                    onClick={() => {
                      const nowEnabled = !editingSchedule.enabled;
                      const newDays = editingSchedule.days.some(Boolean)
                        ? editingSchedule.days
                        : [true,true,true,true,true,true,true] as Schedule['days'];
                      setEditingSchedule({ ...editingSchedule, enabled: nowEnabled, days: newDays });
                    }}
                    className={`w-14 h-8 rounded-full transition-colors relative ${editingSchedule.enabled ? '' : 'bg-gray-400'}`}
                    style={editingSchedule.enabled ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${editingSchedule.enabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* All Day toggle */}
                <div className="flex items-center justify-between py-4 border-b border-gray-700">
                  <span className="text-white">All Day</span>
                  <button
                    onClick={() => {
                      const newAllDay = !editingSchedule.allDay;
                      setEditingSchedule({
                        ...editingSchedule, allDay: newAllDay,
                        startHour: newAllDay ? 0 : 9, startMinute: 0, startPeriod: newAllDay ? 'AM' : 'PM',
                        endHour: newAllDay ? 12 : 7, endMinute: 0, endPeriod: newAllDay ? 'PM' : 'AM',
                      });
                    }}
                    className={`w-14 h-8 rounded-full transition-colors relative ${editingSchedule.allDay ? '' : 'bg-gray-400'}`}
                    style={editingSchedule.allDay ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${editingSchedule.allDay ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* Start time */}
                {!editingSchedule.allDay && (
                  <button
                    onClick={() => setShowScheduleStartPicker(true)}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-700"
                  >
                    <span className="text-white">Start Time</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{fmt(editingSchedule.startHour, editingSchedule.startMinute, editingSchedule.startPeriod)}</span>
                      <ChevronRight className="w-10 h-10 text-white" />
                    </div>
                  </button>
                )}

                {/* End time */}
                {!editingSchedule.allDay && (
                  <button
                    onClick={() => setShowScheduleEndPicker(true)}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-700"
                  >
                    <span className="text-white">End Time</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{fmt(editingSchedule.endHour, editingSchedule.endMinute, editingSchedule.endPeriod)}</span>
                      <ChevronRight className="w-10 h-10 text-white" />
                    </div>
                  </button>
                )}

                {/* Day selector */}
                <div className="py-4">
                  <span className="text-white text-base block mb-3">Days</span>
                  <div className="flex gap-1">
                    {dayLabels.map((day, i) => (
                      <button
                        key={day}
                        onClick={() => {
                          const newVal = !editingSchedule.days[i];
                          setDay(i, newVal);
                          if (newVal && !editingSchedule.enabled) {
                            setEditingSchedule(prev => prev ? { ...prev, enabled: true, days: [...prev.days].map((d, idx) => idx === i ? true : d) as Schedule['days'] } : prev);
                          }
                        }}
                        className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${editingSchedule.days[i] ? 'text-white' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
                        style={editingSchedule.days[i] ? { backgroundColor: '#6BA3D4' } : {}}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Start Time Picker */}
            {showScheduleStartPicker && (
              <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
                <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
                  <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">Start Time</div>
                  <div className="flex items-center justify-center gap-4 py-8 px-8">
                    {/* Hour */}
                    <div className="flex flex-col items-center">
                      {[-2,-1].map(o => { const h = editingSchedule.startHour + o; const d = h <= 0 ? h + 12 : h; return <button key={o} onClick={() => setEditingSchedule({...editingSchedule, startHour: d})} className="text-gray-500 text-xl py-1 w-20 text-center">{d}</button>; })}
                      <div className="text-white text-4xl font-semibold py-2 w-20 text-center">{editingSchedule.startHour === 0 ? 12 : editingSchedule.startHour}</div>
                      {[1,2].map(o => { const h = editingSchedule.startHour + o; const d = h > 12 ? h - 12 : h; return <button key={o} onClick={() => setEditingSchedule({...editingSchedule, startHour: d})} className="text-gray-500 text-xl py-1 w-20 text-center">{d}</button>; })}
                    </div>
                    <div className="text-white text-4xl font-semibold">:</div>
                    {/* Minute */}
                    <div className="flex flex-col items-center">
                      {[-2,-1].map(o => { const m = (editingSchedule.startMinute + o + 60) % 60; return <button key={o} onClick={() => setEditingSchedule({...editingSchedule, startMinute: m})} className="text-gray-500 text-xl py-1 w-20 text-center">{m.toString().padStart(2,'0')}</button>; })}
                      <div className="text-white text-4xl font-semibold py-2 w-20 text-center">{editingSchedule.startMinute.toString().padStart(2,'0')}</div>
                      {[1,2].map(o => { const m = (editingSchedule.startMinute + o) % 60; return <button key={o} onClick={() => setEditingSchedule({...editingSchedule, startMinute: m})} className="text-gray-500 text-xl py-1 w-20 text-center">{m.toString().padStart(2,'0')}</button>; })}
                    </div>
                    {/* AM/PM */}
                    <div className="flex flex-col items-center gap-3 ml-4">
                      {(['AM','PM'] as const).map(p => (
                        <button key={p} onClick={() => setEditingSchedule({...editingSchedule, startPeriod: p})}
                          className={`px-5 py-3 rounded-lg text-lg font-semibold transition-colors ${editingSchedule.startPeriod === p ? 'text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                          style={editingSchedule.startPeriod === p ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                        >{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-700">
                    <button onClick={() => setShowScheduleStartPicker(false)} className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold" style={{ color: SETTINGS_ACCENT_COLOR }}>Done</button>
                  </div>
                </div>
              </div>
            )}

            {/* End Time Picker */}
            {showScheduleEndPicker && (
              <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
                <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
                  <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">End Time</div>
                  <div className="flex items-center justify-center gap-4 py-8 px-8">
                    {/* Hour */}
                    <div className="flex flex-col items-center">
                      {[-2,-1].map(o => { const h = editingSchedule.endHour + o; const d = h <= 0 ? h + 12 : h; return <button key={o} onClick={() => setEditingSchedule({...editingSchedule, endHour: d})} className="text-gray-500 text-xl py-1 w-20 text-center">{d}</button>; })}
                      <div className="text-white text-4xl font-semibold py-2 w-20 text-center">{editingSchedule.endHour === 0 ? 12 : editingSchedule.endHour}</div>
                      {[1,2].map(o => { const h = editingSchedule.endHour + o; const d = h > 12 ? h - 12 : h; return <button key={o} onClick={() => setEditingSchedule({...editingSchedule, endHour: d})} className="text-gray-700 text-xl py-1 w-20 text-center">{d}</button>; })}
                    </div>
                    <div className="text-white text-4xl font-semibold">:</div>
                    {/* Minute */}
                    <div className="flex flex-col items-center">
                      {[-2,-1].map(o => { const m = (editingSchedule.endMinute + o + 60) % 60; return <button key={o} onClick={() => setEditingSchedule({...editingSchedule, endMinute: m})} className="text-gray-500 text-xl py-1 w-20 text-center">{m.toString().padStart(2,'0')}</button>; })}
                      <div className="text-white text-4xl font-semibold py-2 w-20 text-center">{editingSchedule.endMinute.toString().padStart(2,'0')}</div>
                      {[1,2].map(o => { const m = (editingSchedule.endMinute + o) % 60; return <button key={o} onClick={() => setEditingSchedule({...editingSchedule, endMinute: m})} className="text-gray-500 text-xl py-1 w-20 text-center">{m.toString().padStart(2,'0')}</button>; })}
                    </div>
                    {/* AM/PM */}
                    <div className="flex flex-col items-center gap-3 ml-4">
                      {(['AM','PM'] as const).map(p => (
                        <button key={p} onClick={() => setEditingSchedule({...editingSchedule, endPeriod: p})}
                          className={`px-5 py-3 rounded-lg text-lg font-semibold transition-colors ${editingSchedule.endPeriod === p ? 'text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                          style={editingSchedule.endPeriod === p ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
                        >{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-700">
                    <button onClick={() => setShowScheduleEndPicker(false)} className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold" style={{ color: SETTINGS_ACCENT_COLOR }}>Done</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Internet Viewing Screen */}
      {showIVScreen && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col" style={{ animation: 'slideInRight 0.3s ease-out forwards' }}>
          {/* Top Navigation Bar — matches Camera Settings header */}
          <div className="bg-black py-4 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setShowIVScreen(false)}
              className="ml-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Camera Settings</span>
            </button>
            <span className="text-white text-lg font-medium">Internet Viewing</span>
            <div className="mr-6 w-[150px]" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6" style={{ backgroundColor: SETTINGS_BG_COLOR }}>
            {/* Instructional text */}
            <p className="text-gray-400 text-sm leading-relaxed py-4 border-b border-gray-700">
              When enabled you can connect to the camera with the Sami app over the internet. For security be sure you have set up a good camera password. We recommend a mix of upper and lower case, numbers, and symbols.
            </p>

            {/* Enable Internet Access toggle */}
            <div className="flex items-center justify-between py-4 border-b border-gray-700">
              <span className="text-white text-base">Enable Internet Access</span>
              <button
                onClick={handleIVToggle}
                disabled={ivToggleBusy}
                className={`w-14 h-8 rounded-full transition-colors relative ${ivToggleBusy ? 'opacity-50 cursor-not-allowed' : ''} ${!internetViewingEnabled ? 'bg-gray-400' : ''}`}
                style={internetViewingEnabled ? { backgroundColor: SETTINGS_ACCENT_COLOR } : {}}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${internetViewingEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {internetViewingEnabled && (
              <>
                {/* Status row */}
                <div
                  className="flex items-center justify-between py-4 border-b border-gray-700 cursor-pointer"
                  onClick={() => {
                    if (ivStatus === 'Router uPnP Disabled') {
                      const next = ivEnableAttempt + 1;
                      setIvEnableAttempt(next);
                      ivRunEnable(next, ivRouterMode);
                    } else {
                      ivCheckStatusManual(ivRouterMode);
                    }
                  }}
                >
                  <span className="text-white text-base">Status - touch to check again</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium" style={{
                      color: ivStatus === 'Online' ? '#BFE3D9'
                        : ivStatus === 'Checking...' ? '#FCEAAD'
                        : ivStatus === '---' ? '#888'
                        : '#FFC7BD'
                    }}>{ivStatus}</span>
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Configure Router */}
                <div className="flex items-center justify-between py-4 border-b border-gray-700">
                  <span className="text-white text-base">Configure Router</span>
                  <div className="flex rounded-lg overflow-hidden border border-gray-600">
                    {(['automatic', 'manual'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => {
                          setIvRouterMode(m);
                          if (m === 'automatic') {
                            setIvPortNumber(''); // clear port field when switching to Automatic
                            if (internetViewingEnabled) {
                              const next = ivEnableAttempt + 1;
                              setIvEnableAttempt(next);
                              ivRunEnable(next, 'automatic');
                            }
                          }
                        }}
                        className="px-4 py-2 text-sm font-medium transition-colors"
                        style={ivRouterMode === m ? { backgroundColor: SETTINGS_ACCENT_COLOR, color: '#fff' } : { backgroundColor: '#1a1a1a', color: '#888' }}
                      >
                        {m === 'automatic' ? 'Automatic' : 'Manual'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Port Number (Manual only) */}
                {ivRouterMode === 'manual' && (
                  <div className="py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-base">Port Number</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        placeholder="e.g. 8080"
                        value={ivPortNumber}
                        onFocus={() => setIvPortEditing(true)}
                        onChange={e => setIvPortNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-[#5A8BBF] focus:outline-none text-base"
                      />
                      {ivPortEditing && (
                        <>
                          <button
                            onClick={() => { setIvPortNumber(ivSavedPortNumber); setIvPortEditing(false); }}
                            className="px-4 py-2 rounded-lg text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                          >Cancel</button>
                          <button
                            onClick={() => {
                              setIvPortEditing(false);
                              const num = Number(ivPortNumber);
                              if (!ivPortNumber || num < 2 || num > 65535) {
                                setIvPortNumber(ivSavedPortNumber);
                                ivCheckStatusManual(ivRouterMode);
                              } else {
                                setIvSavedPortNumber(ivPortNumber);
                                const next = ivEnableAttempt + 1;
                                setIvEnableAttempt(next);
                                ivRunEnable(next, 'manual');
                              }
                            }}
                            className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-colors"
                            style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}
                          >Done</button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Progress overlay — matches Preparing Video popup style */}
          {ivProgress && (
            <div className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg w-[480px] overflow-hidden border border-gray-700">
                <div className="px-8 pt-6 pb-2">
                  <h2 className="text-white text-xl font-semibold text-center">
                    {ivProgress === 'configuring-port' && (ivRouterMode === 'automatic' ? 'Opening Port...' : 'Configuring Port...')}
                    {ivProgress === 'connecting' && 'Connecting...'}
                    {ivProgress === 'disabling' && 'Disabling Internet...'}
                  </h2>
                </div>
                <div className="px-8 py-6 flex flex-col items-center gap-4">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#BFE3D9]">
                    <Loader2 className="w-12 h-12 text-[#BFE3D9] animate-spin" />
                  </div>
                  <p className="text-gray-300 text-base text-center leading-snug">
                    {ivProgress === 'configuring-port' && (ivRouterMode === 'automatic' ? 'Opening a port for the camera through your router to the internet...' : 'Configuring port...')}
                    {ivProgress === 'connecting' && 'Connecting your camera to the internet...'}
                    {ivProgress === 'disabling' && 'Please wait...'}
                  </p>
                </div>
                {(ivProgress === 'connecting' || (ivProgress === 'configuring-port' && ivRouterMode === 'automatic')) && (
                  <div className="border-t border-gray-700">
                    <button
                      onClick={() => { setIvProgress(null); setIvToggleBusy(false); setInternetViewingEnabled(false); }}
                      className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                      style={{ color: SETTINGS_ACCENT_COLOR }}
                    >Cancel</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IV Popups */}
          {ivPopup === 'no-internet' && (
            <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
                <div className="px-8 pt-6 pb-2"><h2 className="text-white text-xl font-semibold text-center">No Internet Connection</h2></div>
                <div className="px-8 py-5"><p className="text-gray-300 text-base leading-relaxed text-center">Your camera must be connected to a network with access to the internet to enable this.</p></div>
                <div className="border-t border-gray-700"><button onClick={() => setIvPopup(null)} className="w-full text-lg py-4 hover:bg-gray-700 transition-colors font-semibold" style={{ color: SETTINGS_ACCENT_COLOR }}>Ok</button></div>
              </div>
            </div>
          )}
          {ivPopup === 'upnp-failed' && (
            <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
                <div className="px-8 pt-6 pb-2"><h2 className="text-white text-xl font-semibold text-center">UPnP Failed</h2></div>
                <div className="px-8 py-5"><p className="text-gray-300 text-base leading-relaxed text-center">Your router did not accept the UPnP port setting. Enable UPnP on your router and try again or manually configure the port.</p></div>
                <div className="border-t border-gray-700"><button onClick={() => setIvPopup(null)} className="w-full text-lg py-4 hover:bg-gray-700 transition-colors font-semibold" style={{ color: SETTINGS_ACCENT_COLOR }}>Ok</button></div>
              </div>
            </div>
          )}
          {ivPopup === 'manual-port-error' && (
            <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
                <div className="px-8 pt-6 pb-2"><h2 className="text-white text-xl font-semibold text-center">Port Configuration Failed</h2></div>
                <div className="px-8 py-5"><p className="text-gray-300 text-base leading-relaxed text-center">Couldn&apos;t configure the manual port. Please try again.</p></div>
                <div className="border-t border-gray-700"><button onClick={() => setIvPopup(null)} className="w-full text-lg py-4 hover:bg-gray-700 transition-colors font-semibold" style={{ color: SETTINGS_ACCENT_COLOR }}>Ok</button></div>
              </div>
            </div>
          )}
          {ivPopup === 'warn-disable' && (
            <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
                <div className="px-8 pt-6 pb-2"><h2 className="text-white text-xl font-semibold text-center">Warning</h2></div>
                <div className="px-8 py-5"><p className="text-gray-300 text-base leading-relaxed text-center">You are connected via the Internet now. If you disable this you will be disconnected and will not be able to reconnect until you connect via local Wi-Fi.</p></div>
                <div className="border-t border-gray-700 flex">
                  <button onClick={() => setIvPopup(null)} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700" style={{ color: SETTINGS_ACCENT_COLOR }}>Cancel</button>
                  <button onClick={ivConfirmDisable} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold" style={{ color: '#FFC7BD' }}>Disable</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IP Address Editor */}
      {showIpEditor && (
        <div className="absolute inset-0 bg-[#1a1a2e] z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center px-4 pt-5 pb-3 border-b border-gray-700">
            <button onClick={() => setShowIpEditor(false)} className="text-gray-400 hover:text-white p-2 mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="text-white text-lg font-medium flex-1">IP Address</span>
            <button onClick={handleIpSave} className="text-white px-4 py-2 rounded text-sm font-semibold hover:opacity-90" style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}>Save</button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Mode toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-600">
              {(['automatic', 'manual'] as IpMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setIpEditorMode(m); setIpErrors({}); }}
                  className="flex-1 py-3 text-base font-medium transition-colors capitalize"
                  style={ipEditorMode === m ? { backgroundColor: SETTINGS_ACCENT_COLOR, color: '#fff' } : { backgroundColor: '#2a2a3e', color: '#aaa' }}
                >
                  {m === 'automatic' ? 'Automatic' : 'Manual'}
                </button>
              ))}
            </div>

            {ipEditorMode === 'manual' && (() => {
              const ipField = (label: string, key: 'ip' | 'subnet' | 'gateway' | 'dns1' | 'dns2', placeholder: string) => (
                <div key={key}>
                  <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder={placeholder}
                    value={ipEditorConfig[key] as string}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setIpEditorConfig(c => ({ ...c, [key]: val }));
                      setIpErrors(er => ({ ...er, [key]: undefined }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-900 text-white border focus:outline-none text-base ${ipErrors[key] ? 'border-[#FFC7BD]' : 'border-gray-600 focus:border-[#6BA3D4]'}`}
                  />
                  {ipErrors[key] && <p className="text-sm mt-1" style={{ color: '#FFC7BD' }}>{ipErrors[key]}</p>}
                </div>
              );
              return (
                <div className="space-y-4">
                  {ipField('IP Address', 'ip', '192.168.0.100')}
                  {ipField('Subnet Mask', 'subnet', '255.255.255.0')}
                  {ipField('Router / Gateway IP Address', 'gateway', '192.168.0.1')}

                  {/* DNS Proto */}
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">DNS Proto</label>
                    <div className="flex rounded-xl overflow-hidden border border-gray-600">
                      {(['dynamic', 'static'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setIpEditorConfig(c => ({ ...c, dnsProto: p }))}
                          className="flex-1 py-3 text-base font-medium transition-colors capitalize"
                          style={ipEditorConfig.dnsProto === p ? { backgroundColor: SETTINGS_ACCENT_COLOR, color: '#fff' } : { backgroundColor: '#2a2a3e', color: '#aaa' }}
                        >
                          {p === 'dynamic' ? 'Dynamic' : 'Static'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {ipEditorConfig.dnsProto === 'static' && (
                    <>
                      {ipField('DNS 1', 'dns1', '8.8.8.8')}
                      {ipField('DNS 2', 'dns2', '8.8.4.4')}
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* IP Address — Warning popup before save */}
      {showIpWarning && (
        <div className="absolute inset-0 bg-black/70 z-[60] flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">Warning</h2>
            </div>
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">Make sure your settings are correct. If not the camera may not reconnect and need to be reset.</p>
            </div>
            <div className="border-t border-gray-700 flex">
              <button onClick={() => setShowIpWarning(false)} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700" style={{ color: SETTINGS_ACCENT_COLOR }}>Cancel</button>
              <button onClick={commitIpSave} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold" style={{ color: '#FFC7BD' }}>Make Change</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Factory Reset ─────────────────────────────────────────── */}

      {factoryResetPopup === 'confirm' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">Warning: This will completely reset your Sami camera to factory defaults including erasing all recordings on the SD card. This cannot be undone. It WILL NOT affect the recordings already saved to your device.</p>
            </div>
            <div className="border-t border-gray-700 flex">
              <button onClick={() => setFactoryResetPopup(null)} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700" style={{ color: SETTINGS_ACCENT_COLOR }}>Cancel</button>
              <button onClick={startFactoryReset} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold" style={{ color: '#FFC7BD' }}>Factory Reset</button>
            </div>
          </div>
        </div>
      )}

      {factoryResetProgress && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[480px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">
                {factoryResetProgress === 'formatting' ? 'Formatting...' : 'Resetting...'}
              </h2>
            </div>
            <div className="px-8 py-6 flex justify-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#BFE3D9]">
                <Loader2 className="w-12 h-12 text-[#BFE3D9] animate-spin" />
              </div>
            </div>
          </div>
        </div>
      )}

      {factoryResetPopup === 'done' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">The camera has been reset and is restarting. You can un-plug it now or wait for it to finish restarting and re-add it.</p>
            </div>
            <div className="border-t border-gray-700">
              <button onClick={completeFactoryReset} className="w-full text-lg py-4 hover:bg-gray-700 transition-colors font-semibold" style={{ color: SETTINGS_ACCENT_COLOR }}>Ok</button>
            </div>
          </div>
        </div>
      )}

      {/* ── end Factory Reset ──────────────────────────────────────── */}

      {/* ── Restart Camera ────────────────────────────────────────── */}

      {rebootPopup === 'confirm' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">This will restart your Sami camera. No settings will be affected.</p>
            </div>
            <div className="border-t border-gray-700 flex">
              <button onClick={() => setRebootPopup(null)} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700" style={{ color: SETTINGS_ACCENT_COLOR }}>Cancel</button>
              <button onClick={startReboot} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold" style={{ color: '#FFC7BD' }}>Reboot</button>
            </div>
          </div>
        </div>
      )}

      {rebooting && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[480px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">Rebooting...</h2>
            </div>
            <div className="px-8 py-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#BFE3D9]">
                <Loader2 className="w-12 h-12 text-[#BFE3D9] animate-spin" />
              </div>
            </div>
          </div>
        </div>
      )}

      {rebootPopup === 'done' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">The camera has been rebooted and is restarting.</p>
            </div>
            <div className="border-t border-gray-700">
              <button
                onClick={() => { setRebootPopup(null); setShowCameraSettings(false); }}
                className="w-full text-lg py-4 hover:bg-gray-700 transition-colors font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >Ok</button>
            </div>
          </div>
        </div>
      )}

      {/* ── end Restart Camera ─────────────────────────────────────── */}

      {/* ── SD Card ───────────────────────────────────────────────── */}

      {/* SD Card — Confirm Format */}
      {sdPopup === 'confirm-format' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">Warning: this will reformat and erase the SD card on your camera. This cannot be undone. It WILL NOT affect the recordings already saved to your device.</p>
            </div>
            <div className="border-t border-gray-700 flex">
              <button onClick={() => setSdPopup(null)} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700" style={{ color: SETTINGS_ACCENT_COLOR }}>Cancel</button>
              <button onClick={startFormat} className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold" style={{ color: '#FFC7BD' }}>Format SD</button>
            </div>
          </div>
        </div>
      )}

      {/* SD Card — Formatting progress (Preparing Video style) */}
      {sdFormatting && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[480px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">Formatting...</h2>
            </div>
            <div className="px-8 py-6 flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#BFE3D9]">
                <Loader2 className="w-12 h-12 text-[#BFE3D9] animate-spin" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SD Card — Format failed */}
      {sdPopup === 'format-failed' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2"><h2 className="text-white text-xl font-semibold text-center">Format failed!</h2></div>
            <div className="px-8 py-5"><p className="text-gray-300 text-base leading-relaxed text-center">The microSD card is either missing or bad.</p></div>
            <div className="border-t border-gray-700"><button onClick={() => setSdPopup(null)} className="w-full text-lg py-4 hover:bg-gray-700 transition-colors font-semibold" style={{ color: SETTINGS_ACCENT_COLOR }}>Ok</button></div>
          </div>
        </div>
      )}

      {/* SD Card — Format complete */}
      {sdPopup === 'format-complete' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2"><h2 className="text-white text-xl font-semibold text-center">Format complete!</h2></div>
            <div className="border-t border-gray-700 mt-4"><button onClick={() => setSdPopup(null)} className="w-full text-lg py-4 hover:bg-gray-700 transition-colors font-semibold" style={{ color: SETTINGS_ACCENT_COLOR }}>Ok</button></div>
          </div>
        </div>
      )}

      {/* ── end SD Card ────────────────────────────────────────────── */}

      {/* Record Threshold Error Popup */}
      {recordThresholdError && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">Save Failed</h2>
            </div>
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">
                Couldn&apos;t save Record Threshold. Please check your connection and try again.
              </p>
            </div>
            <div className="border-t border-gray-700 flex">
              <button
                onClick={() => setRecordThresholdError(false)}
                className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Mode Popup */}
      {rmPopup && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">{rmPopup.title}</h2>
            </div>
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">{rmPopup.message}</p>
            </div>
            <div className="border-t border-gray-700 flex">
              {rmPopup.hasCancel && (
                <button
                  onClick={() => setRmPopup(null)}
                  className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => { setRecordMode(rmPopup.mode); setRmPopup(null); }}
                className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Night Vision Mode Popup */}
      {nvPopup && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">{nvPopup.title}</h2>
            </div>
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">{nvPopup.message}</p>
            </div>
            <div className="border-t border-gray-700 flex">
              {nvPopup.hasCancel && (
                <button
                  onClick={() => setNvPopup(null)}
                  className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  const mode = nvPopup.mode;
                  setNightVisionMode(mode);
                  // Auto-update IR Illuminator Mode
                  setIrIlluminatorMode(mode === 'Off' ? 'Off' : 'Auto');
                  setNvPopup(null);
                }}
                className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IR Illuminator Mode Popup */}
      {irPopup && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">{irPopup.title}</h2>
            </div>
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed text-center">{irPopup.message}</p>
            </div>
            <div className="border-t border-gray-700 flex">
              {irPopup.hasCancel && (
                <button
                  onClick={() => setIrPopup(null)}
                  className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  setIrIlluminatorMode(irPopup.mode);
                  setIrPopup(null);
                }}
                className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera WiFi Picker Overlay — popup style (Camera Settings only; onboarding uses separate full-screen components) */}
      {showCameraWifiPicker && (
        <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">

          {/* Step: Select network */}
          {cameraWifiPickerStep === 'select' && (
            <div className="bg-gray-800 rounded-2xl w-[480px] overflow-hidden border border-gray-700 shadow-2xl">
              <div className="p-6 border-b border-gray-700 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl text-white">Select Camera Wi-Fi</h2>
                  <p className="text-sm text-gray-400 mt-1">Choose the network for your camera</p>
                  <p className="text-base text-[#FCEAAD] mt-2">For better use, select a Sami-5G network</p>
                </div>
                <button
                  onClick={() => { setCwPickerIsRefreshing(true); setTimeout(() => setCwPickerIsRefreshing(false), 1500); }}
                  disabled={cwPickerIsRefreshing}
                  className="ml-4 mt-1 p-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${cwPickerIsRefreshing ? 'animate-spin' : ''}`} style={{ color: SETTINGS_ACCENT_COLOR }} />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {cwPickerIsRefreshing ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin" style={{ color: SETTINGS_ACCENT_COLOR }} />
                    <p className="text-gray-400 text-sm">Searching for networks...</p>
                  </div>
                ) : CW_NETWORKS.map(network => {
                  const isSelected = network.ssid === cwPickerSelectedSsid;
                  return (
                    <button key={network.ssid} onClick={() => setCwPickerSelectedSsid(network.ssid)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    >
                      <Wifi className={`w-5 h-5 flex-shrink-0 ${network.strength === 3 ? 'text-white' : network.strength === 2 ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className="flex-1 text-left text-base" style={{ color: isSelected ? SETTINGS_ACCENT_COLOR : 'white', fontWeight: isSelected ? 600 : 400 }}>{network.ssid}</span>
                      {isSelected
                        ? <Check className="w-5 h-5 flex-shrink-0" style={{ color: SETTINGS_ACCENT_COLOR }} />
                        : network.secured && <Lock className="w-4 h-4 flex-shrink-0 text-gray-500" />
                      }
                    </button>
                  );
                })}
              </div>
              <div className="p-4 border-t border-gray-700 flex gap-3">
                <button
                  onClick={() => { setShowCameraWifiPicker(false); setCameraWifiPickerStep('select'); }}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >Cancel</button>
                <button
                  onClick={() => {
                    const net = CW_NETWORKS.find(n => n.ssid === cwPickerSelectedSsid);
                    const secured = net?.secured ?? true;
                    setCameraWifiPendingSsid(cwPickerSelectedSsid);
                    setCameraWifiPendingIsOpen(!secured);
                    if (!secured) {
                      setCameraWifiPendingPassword('');
                      setCameraWifiPickerStep('warning');
                    } else {
                      setCameraWifiPasswordAttempt(0);
                      setCwPickerPwError(false);
                      setCwPickerPassword('');
                      setCameraWifiPickerStep('password');
                    }
                  }}
                  className="flex-1 text-white py-3 rounded-xl hover:opacity-80 transition-colors font-semibold"
                  style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}
                >Select</button>
              </div>
            </div>
          )}

          {/* Step: Password */}
          {cameraWifiPickerStep === 'password' && (
            <div className="bg-gray-800 rounded-2xl w-[480px] overflow-hidden border border-gray-700 shadow-2xl p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Wifi className="w-6 h-6 text-white" />
                <h2 className="text-xl text-center text-white">{cameraWifiPendingSsid}</h2>
              </div>
              <p className="text-sm text-gray-400 mb-6 text-center">Enter the password for this network</p>
              {cwPickerPwError && (
                <div className="mb-4 px-4 py-3 bg-[#B85555]/20 border border-[#B85555]/50 rounded-xl">
                  <p className="text-[#F08080] text-sm text-center">Incorrect password. Please try again.</p>
                </div>
              )}
              <div className="mb-6">
                <label className="block text-sm mb-2 text-gray-400">Wi-Fi Password</label>
                <div className="relative">
                  <input
                    type={cwPickerShowPw ? 'text' : 'password'}
                    value={cwPickerPassword}
                    onChange={e => setCwPickerPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && cwPickerPassword.length > 0) { setCameraWifiPendingPassword(cwPickerPassword); setCameraWifiPickerStep('warning'); } }}
                    className={`w-full px-4 py-3 border rounded-xl pr-12 focus:outline-none bg-gray-900 text-white placeholder-gray-600 ${cwPickerPwError ? 'border-[#B85555]' : 'border-gray-600 focus:border-[#5A8BBF]'}`}
                    placeholder="Enter password"
                    autoFocus
                  />
                  <button onClick={() => setCwPickerShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-700 rounded-lg" type="button">
                    {cwPickerShowPw ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => { setCameraWifiPendingPassword(cwPickerPassword); setCameraWifiPickerStep('warning'); }}
                  disabled={cwPickerPassword.length === 0}
                  className="w-full text-white py-3 rounded-xl disabled:opacity-50 transition-colors font-semibold"
                  style={{ backgroundColor: SETTINGS_ACCENT_COLOR }}
                >Connect</button>
                <button onClick={() => { setCwPickerPwError(false); setCameraWifiPickerStep('select'); }}
                  className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors">Back</button>
              </div>
            </div>
          )}

          {/* Step: Warning */}
          {cameraWifiPickerStep === 'warning' && (
            <div className="bg-gray-800 rounded-2xl w-[480px] overflow-hidden border border-gray-700 shadow-2xl">
              <div className="px-8 pt-6 pb-2">
                <h2 className="text-white text-xl font-semibold text-center">Warning</h2>
              </div>
              <div className="px-8 py-5">
                <p className="text-gray-300 text-base leading-relaxed text-center">
                  {cameraWifiPendingIsOpen
                    ? `You are moving the Sami camera to the "${cameraWifiPendingSsid}" network.`
                    : `You are moving the Sami camera to the "${cameraWifiPendingSsid}" network with the password "${cameraWifiPendingPassword}".`
                  }{' '}
                  If this is incorrect you may need to connect the camera to a router with an Ethernet wire to recover.
                </p>
              </div>
              <div className="border-t border-gray-700 flex flex-col">
                <button
                  onClick={() => {
                    setCameraWifiPickerStep('testing');
                    setTimeout(() => {
                      if (!cameraWifiPendingIsOpen && cameraWifiPasswordAttempt === 0) {
                        setCameraWifiPasswordAttempt(1);
                        setCwPickerPwError(true);
                        setCwPickerPassword('');
                        setCameraWifiPickerStep('password');
                      } else {
                        setCameraWifiNetwork(cameraWifiPendingSsid);
                        setCameraWifiSuccessNetwork(cameraWifiPendingSsid);
                        setShowCameraWifiPicker(false);
                        setCameraWifiPickerStep('select');
                        setShowCameraWifiSuccess(true);
                      }
                    }, 3000);
                  }}
                  className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-b border-gray-700"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >Continue</button>
                {!cameraWifiPendingIsOpen && (
                  <button onClick={() => setCameraWifiPickerStep('password')}
                    className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-b border-gray-700"
                    style={{ color: SETTINGS_ACCENT_COLOR }}
                  >Edit password</button>
                )}
                <button
                  onClick={() => { setShowCameraWifiPicker(false); setCameraWifiPickerStep('select'); }}
                  className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold text-[#B95555]"
                >Cancel</button>
              </div>
            </div>
          )}

          {/* Step: Connecting (testing) */}
          {cameraWifiPickerStep === 'testing' && (
            <div className="bg-gray-800 rounded-lg w-[480px] overflow-hidden border border-gray-700">
              <div className="px-8 pt-6 pb-4 border-b border-gray-700">
                <h2 className="text-white text-xl font-semibold text-center">Connecting Camera to Wi-Fi</h2>
              </div>
              <div className="px-8 py-8 flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#BFE3D9]">
                  <Loader2 className="w-12 h-12 text-[#BFE3D9] animate-spin" />
                </div>
                <p className="text-sm text-gray-400">This may take a few seconds</p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Camera Wi-Fi Success Popup */}
      {showCameraWifiSuccess && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold">Wi-Fi configured.</h2>
            </div>
            <div className="px-8 py-5">
              <p className="text-gray-300 text-base leading-relaxed">
                {cameraSignal === 'Wired'
                  ? `Camera Wi-Fi has been set to use "${cameraWifiSuccessNetwork}". You can disconnect the Ethernet wire now.`
                  : `Camera Wi-Fi has been set to use "${cameraWifiSuccessNetwork}". Change your device to the same network to reconnect.`
                }
              </p>
            </div>
            <div className="border-t border-gray-700 flex">
              <button
                onClick={() => setShowCameraWifiSuccess(false)}
                className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >Ok</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Camera Password Modal */}
      {showEditPasswordModal && (() => {
        const validation = validateCameraPassword(editedPassword);
        const passwordsMatch = editedPassword === editedConfirmPassword && editedConfirmPassword.length > 0;
        const canSave = validation.isValid && passwordsMatch && editedPasswordHint.trim().length > 0;

        const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          setEditedPassword(val);
          if (val.length > 0) {
            const v = validateCameraPassword(val);
            if (!v.isValid) { setEditPasswordError(v.message); return; }
          }
          if (editedConfirmPassword.length > 0 && val !== editedConfirmPassword) {
            setEditPasswordError('Passwords do not match');
          } else {
            setEditPasswordError('');
          }
        };

        const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          setEditedConfirmPassword(val);
          if (val.length > 0 && editedPassword !== val) {
            setEditPasswordError('Passwords do not match');
          } else {
            setEditPasswordError('');
          }
        };

        return (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[520px] overflow-hidden border border-gray-700">
              {/* Icon + title */}
              <div className="flex flex-col items-center pt-8 pb-2 px-8">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 border-2 border-[#FCEAAD]">
                  <Lock className="w-8 h-8 text-[#FCEAAD]" />
                </div>
                <h2 className="text-white text-xl font-semibold text-center mb-2">Edit Camera Password</h2>
                <p className="text-gray-400 text-sm text-center">Password must contain a capital letter, at least 4 letters and 2 numbers</p>
              </div>

              {/* Fields */}
              <div className="px-8 py-5 space-y-3">
                <input
                  type="text"
                  value={editedPassword}
                  onChange={handleNewPasswordChange}
                  autoFocus
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-gray-900 text-white placeholder-gray-500 ${editPasswordError ? 'border-[#FFC7BD] focus:border-[#FFC7BD]' : 'border-[#FCEAAD]/30 focus:border-[#FCEAAD]'}`}
                  placeholder="New password"
                />
                <input
                  type="text"
                  value={editedConfirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-gray-900 text-white placeholder-gray-500 ${editPasswordError ? 'border-[#FFC7BD] focus:border-[#FFC7BD]' : 'border-[#FCEAAD]/30 focus:border-[#FCEAAD]'}`}
                  placeholder="Confirm new password"
                />
                <div>
                  <input
                    type="text"
                    value={editedPasswordHint}
                    onChange={(e) => setEditedPasswordHint(e.target.value.slice(0, 30))}
                    maxLength={30}
                    className="w-full px-4 py-3 border border-[#FCEAAD]/30 rounded-xl focus:outline-none focus:border-[#FCEAAD] bg-gray-900 text-white placeholder-gray-500"
                    placeholder="Password hint (e.g., my first pet's name)"
                  />
                  <p className="text-xs text-gray-400 mt-1">This will help you remember your password ({editedPasswordHint.length}/30)</p>
                </div>
                {editPasswordError && (
                  <p className="text-sm text-[#FFC7BD]">{editPasswordError}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-700 flex">
                <button
                  onClick={() => setShowEditPasswordModal(false)}
                  className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Cancel
                </button>
                <button
                  disabled={!canSave}
                  onClick={() => {
                    setSavedCameraPassword(editedPassword);
                    setSavedCameraPasswordHint(editedPasswordHint);
                    setShowEditPasswordModal(false);
                  }}
                  className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
