'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Signal, Clock, ScanFace, Activity, Lock, Video, CircleHelp, Settings, Mic, MicOff, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowBigRight, FolderOpen, Calendar, Bell, History, Trash2, HardDrive, Eye, EyeOff, Share2, Check, Wifi, Battery, Compass, MessageCircle, Image, Music2, AppWindow, Folder, Camera, Ruler, Search, Star, Guitar, FileText, Lightbulb, Mail, StickyNote, Grid3x3, Filter, X, Archive, Play, Pause, SkipBack, SkipForward, AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
const splashLogo = '/assets/9c5d45d1fb550fd85085fcd4ca7fbc0d2661c54c.png';
const homeScreenIcon = '/assets/4fcc62f32178f39d03a6f997dc02af74d60bdc02.png';
const homeScreenWallpaper = '/assets/fa13dc602b6247ed34afd5c7fccebfbdd8fd81e2.png';
import { MotionDetectionIcon } from '@/app/components/MotionDetectionIcon';
import { AnimatedWifiIcon } from '@/app/components/AnimatedWifiIcon';
import { RecordingIcon } from '@/app/components/RecordingIcon';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { Toaster } from '@/app/components/ui/sonner';
import { OnboardingFlow } from '@/app/components/onboarding/OnboardingFlow';
import { RecordingsScreen } from '@/app/components/RecordingsScreen';
import { SettingsScreen } from '@/app/components/SettingsScreen';

// Settings screen accent color
const SETTINGS_ACCENT_COLOR = '#5A8BBF';
const SETTINGS_BG_COLOR = '#000000';
const SETTINGS_SECTION_BG = '#1F2937'; // gray-800

function AppContent() {
  const [selectedOS, setSelectedOS] = useState<'ios' | 'android' | null>(null);
  const [showHomeScreen, setShowHomeScreen] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingInitialStep, setOnboardingInitialStep] = useState(0);
  const [onboardingSkipPermissions, setOnboardingSkipPermissions] = useState(false);
  const [savedPasswordHint, setSavedPasswordHint] = useState('');
  const [savedCameraPassword, setSavedCameraPassword] = useState('');
  const [savedCameraPasswordHint, setSavedCameraPasswordHint] = useState('');
  const [showClock, setShowClock] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showOfflineHelp, setShowOfflineHelp] = useState(false);
  const [showRecordings, setShowRecordings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRecordingIndex, setSelectedRecordingIndex] = useState<number | null>(null);
  const [isEditingRecordings, setIsEditingRecordings] = useState(false);
  const [selectedRecordingIds, setSelectedRecordingIds] = useState<number[]>([]);
  const [showArchivedSection, setShowArchivedSection] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isDownloadingRecording, setIsDownloadingRecording] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedRecordingIds, setDownloadedRecordingIds] = useState<Set<number>>(new Set());
  const [downloadingRecordingIds, setDownloadingRecordingIds] = useState<Map<number, number>>(new Map());
  const [activeDownloadInterval, setActiveDownloadInterval] = useState<NodeJS.Timeout | null>(null);
  const [showDownloadError, setShowDownloadError] = useState(false);
  const [swipedRecordingId, setSwipedRecordingId] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const swipeStartX = useRef(0);
  const currentSwipeOffset = useRef(0);
  const hasSwipedRef = useRef(false);

  // Trash view swipe state (separate from regular view)
  const [trashedSwipedId, setTrashedSwipedId] = useState<number | null>(null);
  const [trashedSwipeOffset, setTrashedSwipeOffset] = useState(0);
  const trashedSwipeStartX = useRef(0);
  const trashedCurrentSwipeOffset = useRef(0);
  const trashedHasSwipedRef = useRef(false);

  // Single-item permanent delete confirmation
  const [showSingleDeleteConfirmation, setShowSingleDeleteConfirmation] = useState(false);
  const [singleDeleteRecordingId, setSingleDeleteRecordingId] = useState<number | null>(null);

  // Recording filters
  const [activeFilters, setActiveFilters] = useState({
    alarmOnly: false,
    lockedOnly: false,
    longVideosOnly: false,
    last24Hours: false
  });
  const [collapsedDateGroups, setCollapsedDateGroups] = useState<Set<string>>(new Set());
  const [collapsedMonthGroups, setCollapsedMonthGroups] = useState<Set<string>>(new Set());
  const [showSendLogDialog, setShowSendLogDialog] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [borderActive, setBorderActive] = useState(false);
  const [motionActive, setMotionActive] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [showVolumePicker, setShowVolumePicker] = useState(false);
  const [micVolume, setMicVolume] = useState(70);
  const [cameraOn, setCameraOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [volumeLevel, setVolumeLevel] = useState(60);
  const [sensitivityLevel, setSensitivityLevel] = useState(85);
  const [movementThreshold, setMovementThreshold] = useState(75);
  const [timeThreshold, setTimeThreshold] = useState(70);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [borderThickness, setBorderThickness] = useState(48);
  const [isBorderDragging, setIsBorderDragging] = useState(false);
  const [borderDragStart, setBorderDragStart] = useState(0);
  const [borderDragStartPos, setBorderDragStartPos] = useState({ x: 0, y: 0 });
  const [hasBorderMoved, setHasBorderMoved] = useState(false);
  const [showBorderHint, setShowBorderHint] = useState(false);
  
  // Border rectangle state (position and dimensions in PIXELS)
  // Default values set to max active area with 70px margins on all sides
  // Typical landscape container: ~732px width x ~390px height
  const [borderRect, setBorderRect] = useState({ x: 70, y: 70, width: 592, height: 250 });
  const [isDraggingRect, setIsDraggingRect] = useState(false);
  const [isDraggingCorner, setIsDraggingCorner] = useState<string | null>(null);
  const [rectDragStart, setRectDragStart] = useState({ x: 0, y: 0, rectX: 0, rectY: 0, rectWidth: 0, rectHeight: 0 });
  const [showMotionHint, setShowMotionHint] = useState(false);
  const [showHoldHint, setShowHoldHint] = useState(false);
  const [showAlarmDisabledHint, setShowAlarmDisabledHint] = useState(false);
  const [holdHintTimer, setHoldHintTimer] = useState<NodeJS.Timeout | null>(null);
  const [showBorderSavedHint, setShowBorderSavedHint] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [volumePickerTimer, setVolumePickerTimer] = useState<NodeJS.Timeout | null>(null);
  const volumePickerRef = useRef<HTMLDivElement>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const [logEmail, setLogEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);
  const [isHoldingAlarm, setIsHoldingAlarm] = useState(false);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [longPressCompleted, setLongPressCompleted] = useState(false);
  const [isAlarmSimulating, setIsAlarmSimulating] = useState(false);
  const [showMuteButton, setShowMuteButton] = useState(false);
  const [baseVolumeLevel] = useState(60);
  const [isWaitingForNoMotion, setIsWaitingForNoMotion] = useState(false);
  const [baseSensitivityLevel] = useState(45);
  const [micAutoOffTimer, setMicAutoOffTimer] = useState<NodeJS.Timeout | null>(null);
  const [showWifiPopup, setShowWifiPopup] = useState(false);
  const [lastConnectedNetwork] = useState('Home_WiFi_5G');
  const [currentNetwork] = useState('Guest_Network');
  const [settingsWifiNetwork, setSettingsWifiNetwork] = useState('Guest_Network');
  const [showSettingsWifiPicker, setShowSettingsWifiPicker] = useState(false);
  const [settingsWifiPickerStep, setSettingsWifiPickerStep] = useState<'select' | 'password' | 'testing'>('select');
  const [settingsWifiPendingSsid, setSettingsWifiPendingSsid] = useState('');
  const [showWifiSearchHint, setShowWifiSearchHint] = useState(false);
  const [showBeepCameraFaultInfo, setShowBeepCameraFaultInfo] = useState(false);
  const [showCameraNotFound, setShowCameraNotFound] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false);
  const [showClockBrightnessHint, setShowClockBrightnessHint] = useState(false);

  // Audio context for generating sounds
  const audioContextRef = useRef<AudioContext | null>(null);
  const alarmOscillatorRef = useRef<OscillatorNode | null>(null);
  const alarmGainRef = useRef<GainNode | null>(null);
  const beepOscillatorRef = useRef<OscillatorNode | null>(null);
  const beepGainRef = useRef<GainNode | null>(null);
  const pushNotificationBeepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize audio context
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };
  
  // Play alarm sound (looping)
  const playAlarmSound = () => {
    const audioContext = getAudioContext();
    
    // Stop any existing alarm
    stopAlarmSound();
    
    // Create oscillator for alarm sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800 Hz alarm tone
    
    // Create pulsing effect
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    let time = audioContext.currentTime;
    for (let i = 0; i < 100; i++) {
      gainNode.gain.setValueAtTime(0.3, time);
      gainNode.gain.setValueAtTime(0, time + 0.2);
      time += 0.4;
    }
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    alarmOscillatorRef.current = oscillator;
    alarmGainRef.current = gainNode;
  };
  
  // Stop alarm sound
  const stopAlarmSound = () => {
    if (alarmOscillatorRef.current) {
      try {
        alarmOscillatorRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      alarmOscillatorRef.current = null;
      alarmGainRef.current = null;
    }
  };
  
  // Play beep sound (single beep)
  const playBeepSound = () => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // 1000 Hz beep
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };
  
  // Play beep sound (looping for camera fault)
  const playBeepSoundLoop = () => {
    const audioContext = getAudioContext();
    
    // Stop any existing beep
    stopBeepSound();
    
    // Create oscillator for beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // 1000 Hz beep
    
    // Create pulsing beep effect (faster than alarm)
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    let time = audioContext.currentTime;
    for (let i = 0; i < 100; i++) {
      gainNode.gain.setValueAtTime(0.4, time);
      gainNode.gain.setValueAtTime(0, time + 0.15);
      time += 0.3; // Faster beep pattern
    }
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    beepOscillatorRef.current = oscillator;
    beepGainRef.current = gainNode;
  };
  
  // Stop beep sound
  const stopBeepSound = () => {
    if (beepOscillatorRef.current) {
      try {
        beepOscillatorRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      beepOscillatorRef.current = null;
      beepGainRef.current = null;
    }
  };
  
  // Play beep sound in repeat (for push notification)
  const playBeepSoundRepeat = () => {
    // Play the first beep immediately
    playBeepSound();
    
    // Set interval to play beep every 1 second
    const interval = setInterval(() => {
      playBeepSound();
    }, 1000);
    
    pushNotificationBeepIntervalRef.current = interval;
  };
  
  // Stop beep sound repeat
  const stopBeepSoundRepeat = () => {
    if (pushNotificationBeepIntervalRef.current) {
      clearInterval(pushNotificationBeepIntervalRef.current);
      pushNotificationBeepIntervalRef.current = null;
    }
  };

  // Settings state
  const [selectedDevice, setSelectedDevice] = useState('');
  const [cameraPaired, setCameraPaired] = useState(false);
  const [showPairingPopup, setShowPairingPopup] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEraseConfirmDialog, setShowEraseConfirmDialog] = useState(false);
  const [showResetAllConfirmDialog, setShowResetAllConfirmDialog] = useState(false);
  const [showCameraSettings, setShowCameraSettings] = useState(false);
  
  // QC (Easter Egg) states
  const [showQCSection, setShowQCSection] = useState(false);
  const [qcPressTimer, setQcPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [displayData, setDisplayData] = useState(false);
  const [rapidTestMode, setRapidTestMode] = useState(false);
  const [burningMode, setBurningMode] = useState(false);
  const [minWifiQuality, setMinWifiQuality] = useState(100);
  const [devAWS, setDevAWS] = useState(false);

  // Camera Settings state
  const [nightVisionMode, setNightVisionMode] = useState<'Off' | 'On' | 'Auto' | 'Auto+'>('Auto');
  const [irIlluminatorMode, setIrIlluminatorMode] = useState<'Off' | 'On' | 'Auto'>('Auto');
  const [recordMode, setRecordMode] = useState<'Never' | 'Motion Only' | 'Everything'>('Motion Only');
  const [recordThreshold, setRecordThreshold] = useState(20);
  const [powerLightFlash, setPowerLightFlash] = useState(false);
  
  const [enableAlarm, setEnableAlarm] = useState(false);
  const [motionThresholdSetting, setMotionThresholdSetting] = useState(25);
  const [alarmThresholdSetting, setAlarmThresholdSetting] = useState(20);
  const [sensitivityBoost, setSensitivityBoost] = useState(0);
  const [maxPauseTime, setMaxPauseTime] = useState(120);
  const [borderSizeSetting, setBorderSizeSetting] = useState(10);
  const [smartBorder, setSmartBorder] = useState(false);
  const [smartBorderValue, setSmartBorderValue] = useState(20);
  const [beepOnCameraFault, setBeepOnCameraFault] = useState(false);
  const [beepOnAppNotActive, setBeepOnAppNotActive] = useState(false);
  const [enableAlarmSchedule, setEnableAlarmSchedule] = useState(false);
  const [alarmVolume, setAlarmVolume] = useState(50);
  const [alarmSound, setAlarmSound] = useState('A');
  const [alarmDuration, setAlarmDuration] = useState(-1); // Default to Infinite
  const [vibrateOnAlarm, setVibrateOnAlarm] = useState(false);
  
  // Camera fault popup states
  const [showCameraFaultPopup, setShowCameraFaultPopup] = useState(false);
  const [cameraFaultBeepTimer, setCameraFaultBeepTimer] = useState<NodeJS.Timeout | null>(null);

  // Volume warning popup for camera fault beep
  const [showVolumeWarningPopup, setShowVolumeWarningPopup] = useState(false);
  const [ignoreCameraFaultWarning, setIgnoreCameraFaultWarning] = useState(false);
  
  // Beep on App Not Active popup states
  const [showBeepAppNotActivePopup, setShowBeepAppNotActivePopup] = useState(false);
  const [showSilentSwitchPopup, setShowSilentSwitchPopup] = useState(false);
  const [showPushNotification, setShowPushNotification] = useState(false);

  // Archive confirmation popup state
  const [showArchiveConfirmPopup, setShowArchiveConfirmPopup] = useState(false);
  const [showArchivedMessage, setShowArchivedMessage] = useState(false);
  const [showUnarchivedMessage, setShowUnarchivedMessage] = useState(false);
  const [showDeletedMessage, setShowDeletedMessage] = useState(false);
  const [archiveWarningType, setArchiveWarningType] = useState<'locked' | 'alarmed' | 'locked/alarmed'>('locked/alarmed');
  const [archiveIsSingleLocked, setArchiveIsSingleLocked] = useState(false);

  // Storage popup and notification state
  const [showStoragePopup, setShowStoragePopup] = useState(false);
  const [showStorageNotification, setShowStorageNotification] = useState(true);
  const [hasShownStoragePopup, setHasShownStoragePopup] = useState(false);

  // Enable alarm alerts state
  const [hasSeenEnableAlarmAlerts, setHasSeenEnableAlarmAlerts] = useState(false);
  const [showEnableAlarmAlert, setShowEnableAlarmAlert] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  
  // Alarm time states
  const [alarmEnableHour, setAlarmEnableHour] = useState(7);
  const [alarmEnableMinute, setAlarmEnableMinute] = useState(0);
  const [alarmEnablePeriod, setAlarmEnablePeriod] = useState<'AM' | 'PM'>('PM');
  const [showAlarmEnableTimePicker, setShowAlarmEnableTimePicker] = useState(false);
  
  const [alarmDisableHour, setAlarmDisableHour] = useState(7);
  const [alarmDisableMinute, setAlarmDisableMinute] = useState(0);
  const [alarmDisablePeriod, setAlarmDisablePeriod] = useState<'AM' | 'PM'>('AM');
  const [showAlarmDisableTimePicker, setShowAlarmDisableTimePicker] = useState(false);
  
  const [microphoneBoost, setMicrophoneBoost] = useState(false);
  const [microphoneNoiseReduction, setMicrophoneNoiseReduction] = useState(false);
  const [showMicrophoneBoostPopup, setShowMicrophoneBoostPopup] = useState(false);
  const [showMicrophoneNoiseReductionPopup, setShowMicrophoneNoiseReductionPopup] = useState(false);
  const [showSmartBorderPopup1, setShowSmartBorderPopup1] = useState(false);
  const [showSmartBorderPopup2, setShowSmartBorderPopup2] = useState(false);
  const [screenTimeoutToClock, setScreenTimeoutToClock] = useState(false);
  const [timeoutDelay, setTimeoutDelay] = useState(60);
  const [largeThumbnails, setLargeThumbnails] = useState(false);
  const [enableAutoRecording, setEnableAutoRecording] = useState(true);
  const [storageLimit, setStorageLimit] = useState(250);
  const [hideShorterThan, setHideShorterThan] = useState('15sec');
  const [autoDeleteOlderVideos, setAutoDeleteOlderVideos] = useState(false);
  const [showAutoDeletePopup, setShowAutoDeletePopup] = useState(false);
  const [backupLockedVideos, setBackupLockedVideos] = useState(false);
  const [showBackupPopup, setShowBackupPopup] = useState(false);
  const [iCloudBackup, setICloudBackup] = useState('None');
  const [disableTelemetry, setDisableTelemetry] = useState(false);
  const [alwaysAllowMobileData, setAlwaysAllowMobileData] = useState(false);
  const [enableSentData, setEnableSentData] = useState(true);

  // Current timestamp state
  const [currentTimestamp, setCurrentTimestamp] = useState(new Date());

  // Load password hint and password from localStorage on mount
  useEffect(() => {
    const storedHint = localStorage.getItem('samiPasswordHint');
    if (storedHint) {
      setSavedPasswordHint(storedHint);
    }
    const storedPassword = localStorage.getItem('samiCameraPassword');
    if (storedPassword) {
      setSavedCameraPassword(storedPassword);
    }
  }, []);

  // Save password hint to localStorage when it changes
  useEffect(() => {
    if (savedPasswordHint) {
      localStorage.setItem('samiPasswordHint', savedPasswordHint);
    }
  }, [savedPasswordHint]);

  // Save camera password to localStorage when it changes
  useEffect(() => {
    if (savedCameraPassword) {
      localStorage.setItem('samiCameraPassword', savedCameraPassword);
    }
  }, [savedCameraPassword]);

  // Update timestamp every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show storage popup the first time user enters Recordings view
  useEffect(() => {
    if (showRecordings && !hasShownStoragePopup) {
      setShowStoragePopup(true);
      setHasShownStoragePopup(true);
    }
  }, [showRecordings, hasShownStoragePopup]);

  // Show clock brightness hint and hide after 10 seconds
  useEffect(() => {
    if (showClock) {
      setShowClockBrightnessHint(true);
      const timer = setTimeout(() => {
        setShowClockBrightnessHint(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowClockBrightnessHint(false);
    }
  }, [showClock]);

  // Initialize border rect with maximum values based on actual container dimensions
  useEffect(() => {
    const initializeBorderRect = () => {
      const videoContainer = document.querySelector('.video-feed-container');
      if (!videoContainer) {
        // Retry if container not ready yet
        setTimeout(initializeBorderRect, 100);
        return;
      }
      
      const containerRect = videoContainer.getBoundingClientRect();
      const MARGIN = 70; // 70px margin on all sides
      
      // Set to maximum area with 70px margins
      setBorderRect({
        x: MARGIN,
        y: MARGIN,
        width: containerRect.width - (MARGIN * 2),
        height: containerRect.height - (MARGIN * 2)
      });
    };
    
    // Wait for splash screen to complete
    if (!showSplash) {
      initializeBorderRect();
    }
  }, [showSplash]);

  // Volume picker inactivity timer and click outside handler
  useEffect(() => {
    const resetVolumePickerTimer = () => {
      if (volumePickerTimer) {
        clearTimeout(volumePickerTimer);
      }
      const timer = setTimeout(() => {
        setShowVolumePicker(false);
      }, 10000); // 10 seconds
      setVolumePickerTimer(timer);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (showVolumePicker && volumePickerRef.current && !volumePickerRef.current.contains(event.target as Node)) {
        // Also check if the click is not on the mic button
        if (micButtonRef.current && !micButtonRef.current.contains(event.target as Node)) {
          setShowVolumePicker(false);
        }
      }
    };

    if (showVolumePicker) {
      resetVolumePickerTimer();
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (volumePickerTimer) {
        clearTimeout(volumePickerTimer);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumePicker]);

  // Sync download progress when viewing a downloading recording
  useEffect(() => {
    if (selectedRecordingIndex !== null && downloadingRecordingIds.has(selectedRecordingIndex)) {
      const currentProgress = downloadingRecordingIds.get(selectedRecordingIndex) || 0;
      setDownloadProgress(currentProgress);

      // If download completes while viewing
      if (currentProgress >= 100) {
        setIsDownloadingRecording(false);
      }
    }
  }, [selectedRecordingIndex, downloadingRecordingIds]);

  // Reset volume picker timer on interaction
  const handleVolumePickerInteraction = () => {
    if (volumePickerTimer) {
      clearTimeout(volumePickerTimer);
    }
    const timer = setTimeout(() => {
      setShowVolumePicker(false);
    }, 10000);
    setVolumePickerTimer(timer);
  };

  // Timer for sleeping mode
  useEffect(() => {
    if (isLocked && !isDragging && !isSleeping) {
      const timer = setTimeout(() => {
        setIsSleeping(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLocked, isDragging, isSleeping]);

  // Timer for border hint
  useEffect(() => {
    if (borderActive) {
      setShowBorderHint(true);
      setShowMotionHint(false); // Hide motion hint when border hint shows
      setShowHoldHint(false); // Hide hold hint when border hint shows
      setShowUnlockMessage(false); // Hide unlock message when border hint shows
      setShowBorderSavedHint(false); // Hide border saved hint when border hint shows
      const timer = setTimeout(() => {
        setShowBorderHint(false);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setShowBorderHint(false);
    }
  }, [borderActive]);

  // Timer for motion hint
  useEffect(() => {
    if (motionActive) {
      setShowMotionHint(true);
      setShowBorderHint(false); // Hide border hint when motion hint shows
      setShowHoldHint(false); // Hide hold hint when motion hint shows
      setShowUnlockMessage(false); // Hide unlock message when motion hint shows
      setShowBorderSavedHint(false); // Hide border saved hint when motion hint shows
      const timer = setTimeout(() => {
        setShowMotionHint(false);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setShowMotionHint(false);
    }
  }, [motionActive]);

  // Timer for wifi search hint
  useEffect(() => {
    if (showWifiSearchHint) {
      const timer = setTimeout(() => {
        setShowWifiSearchHint(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showWifiSearchHint]);

  // Reset swipe state when edit mode is toggled or archived section changes
  useEffect(() => {
    setSwipedRecordingId(null);
    setSwipeOffset(0);
  }, [isEditingRecordings, showArchivedSection]);

  // Timer for hold hint
  useEffect(() => {
    if (isHoldingAlarm && !showHoldHint) {
      setShowHoldHint(true);
      setShowBorderHint(false); // Hide border hint when hold hint shows
      setShowMotionHint(false); // Hide motion hint when hold hint shows
      setShowUnlockMessage(false); // Hide unlock message when hold hint shows
      setShowBorderSavedHint(false); // Hide border saved hint when hold hint shows
      
      // Clear any existing timer
      if (holdHintTimer) {
        clearTimeout(holdHintTimer);
      }
      
      // Set timer to hide after 10 seconds
      const timer = setTimeout(() => {
        setShowHoldHint(false);
        setHoldHintTimer(null);
      }, 10000);
      
      setHoldHintTimer(timer);
    }
  }, [isHoldingAlarm]);

  // Cleanup hold hint timer on unmount
  useEffect(() => {
    return () => {
      if (holdHintTimer) {
        clearTimeout(holdHintTimer);
      }
    };
  }, []);

  // Hide hold hint when other hints appear and clear timer
  useEffect(() => {
    if (borderActive || motionActive || showUnlockMessage) {
      setShowHoldHint(false);
      if (holdHintTimer) {
        clearTimeout(holdHintTimer);
        setHoldHintTimer(null);
      }
    }
  }, [borderActive, motionActive, showUnlockMessage]);

  // Hide hold hint when alarm turns off
  useEffect(() => {
    if (!cameraOn && showHoldHint) {
      setShowHoldHint(false);
      if (holdHintTimer) {
        clearTimeout(holdHintTimer);
        setHoldHintTimer(null);
      }
    }
  }, [cameraOn]);

  // Timer for alarm disabled hint
  useEffect(() => {
    if (showAlarmDisabledHint) {
      setShowBorderSavedHint(false); // Hide border saved hint when alarm disabled hint shows
      const timer = setTimeout(() => {
        setShowAlarmDisabledHint(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlarmDisabledHint]);

  // Alarm simulation - animate bars when alarm is on
  useEffect(() => {
    if (cameraOn && !isPaused) {
      setIsAlarmSimulating(true);
      setShowMuteButton(false);
      
      // Animate bars moving up and down
      const animationInterval = setInterval(() => {
        setVolumeLevel(prev => {
          const variation = Math.random() * 30 - 15; // Random between -15 and +15
          return Math.max(45, Math.min(75, baseVolumeLevel + variation));
        });
        setSensitivityLevel(prev => {
          const variation = Math.random() * 30 - 15; // Random between -15 and +15
          return Math.max(30, Math.min(60, baseSensitivityLevel + variation));
        });
      }, 300); // Update every 300ms for smooth animation
      
      // Show mute button after 5 seconds
      const muteTimer = setTimeout(() => {
        setShowMuteButton(true);
      }, 5000);
      
      return () => {
        clearInterval(animationInterval);
        clearTimeout(muteTimer);
      };
    } else {
      setIsAlarmSimulating(false);
      setShowMuteButton(false);
      // Reset bars to base levels
      setVolumeLevel(baseVolumeLevel);
      setSensitivityLevel(baseSensitivityLevel);
    }
  }, [cameraOn, isPaused, baseVolumeLevel, baseSensitivityLevel]);

  // Play alarm sound when mute button appears
  useEffect(() => {
    if (showMuteButton) {
      playAlarmSound();
    } else {
      stopAlarmSound();
    }
  }, [showMuteButton]);

  // Handle mute button click
  const handleMuteAlarm = () => {
    const wasMicOff = !micOn;
    
    setCameraOn(false);
    setIsPaused(true);
    setCountdown(120);
    setShowMuteButton(false);
    setIsAlarmSimulating(false);
    setMicOn(true); // Turn on mic button (green)
    setShowVolumePicker(false); // But don't show the volume picker
    setIsWaitingForNoMotion(true); // Start the "waiting for no motion" period
    
    // If mic was OFF, start 1-minute timer to turn it back off
    if (wasMicOff) {
      // Clear any existing timer
      if (micAutoOffTimer) {
        clearTimeout(micAutoOffTimer);
      }
      
      // Set new timer for 1 minute
      const timer = setTimeout(() => {
        setMicOn(false);
        setShowVolumePicker(false);
        setMicAutoOffTimer(null);
      }, 60000); // 60 seconds = 1 minute
      
      setMicAutoOffTimer(timer);
    }
  };

  // Helper functions for Alarm Threshold
  // 0-119 seconds, then 2-15 minutes
  const incrementAlarmThreshold = (current: number) => {
    if (current < 119) {
      return current + 1; // Increment by 1 second from 0s to 119s
    } else if (current === 119) {
      return 120; // Jump to 2 minutes (120 seconds)
    } else if (current < 900) {
      return Math.min(900, current + 60); // Increment by 1 minute up to 15 minutes (900 seconds)
    }
    return current; // Max is 15 minutes
  };

  const decrementAlarmThreshold = (current: number) => {
    if (current <= 120 && current > 119) {
      return 119; // Jump back to 119s from 2 minutes
    } else if (current > 120) {
      return Math.max(120, current - 60); // Decrement by 1 minute
    } else if (current > 0) {
      return current - 1; // Decrement by 1 second
    }
    return 0; // Min is 0 seconds
  };

  const formatAlarmThreshold = (seconds: number) => {
    if (seconds < 120) {
      return `${seconds}sec`;
    } else {
      return `${Math.floor(seconds / 60)}min`;
    }
  };

  // Helper functions for Max Pause Time
  // 10-59 seconds, then 1-10 minutes, then Infinite (-1)
  // Create array of all valid values: [10,11,12...59,60,120,180...600,-1]
  const maxPauseTimeValues = [
    ...Array.from({ length: 50 }, (_, i) => 10 + i), // 10-59 seconds
    ...Array.from({ length: 10 }, (_, i) => 60 + i * 60), // 1-10 minutes
    -1 // Infinite
  ];

  const incrementMaxPauseTime = (current: number) => {
    const currentIndex = maxPauseTimeValues.indexOf(current);
    if (currentIndex === -1 || currentIndex === maxPauseTimeValues.length - 1) return current;
    return maxPauseTimeValues[currentIndex + 1];
  };

  const decrementMaxPauseTime = (current: number) => {
    const currentIndex = maxPauseTimeValues.indexOf(current);
    if (currentIndex === -1 || currentIndex === 0) return current;
    return maxPauseTimeValues[currentIndex - 1];
  };

  const formatMaxPauseTime = (seconds: number) => {
    if (seconds === -1) {
      return 'Inf';
    } else if (seconds < 60) {
      return `${seconds}sec`;
    } else {
      return `${Math.floor(seconds / 60)}min`;
    }
  };

  const getMaxPauseTimeSliderIndex = (seconds: number) => {
    const index = maxPauseTimeValues.indexOf(seconds);
    return index === -1 ? 0 : index;
  };

  const getMaxPauseTimeFromSliderIndex = (index: number) => {
    return maxPauseTimeValues[index] || 10;
  };

  // Helper functions for Alarm Duration
  // 1-59 seconds, then 1-9 minutes, then Infinite (-1)
  // Create array of all valid values: [1,2,3...59,60,120,180...540,-1]
  const alarmDurationValues = [
    ...Array.from({ length: 59 }, (_, i) => 1 + i), // 1-59 seconds
    ...Array.from({ length: 9 }, (_, i) => 60 + i * 60), // 1-9 minutes
    -1 // Infinite
  ];

  const incrementAlarmDuration = (current: number) => {
    const currentIndex = alarmDurationValues.indexOf(current);
    if (currentIndex === -1 || currentIndex === alarmDurationValues.length - 1) return current;
    return alarmDurationValues[currentIndex + 1];
  };

  const decrementAlarmDuration = (current: number) => {
    const currentIndex = alarmDurationValues.indexOf(current);
    if (currentIndex === -1 || currentIndex === 0) return current;
    return alarmDurationValues[currentIndex - 1];
  };

  const formatAlarmDuration = (seconds: number) => {
    if (seconds === -1) {
      return 'Inf';
    } else if (seconds < 60) {
      return `${seconds}sec`;
    } else {
      return `${Math.floor(seconds / 60)}min`;
    }
  };

  const getAlarmDurationSliderIndex = (seconds: number) => {
    const index = alarmDurationValues.indexOf(seconds);
    return index === -1 ? 0 : index;
  };

  const getAlarmDurationFromSliderIndex = (index: number) => {
    return alarmDurationValues[index] || 1;
  };

  // Helper functions for time formatting
  const formatTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const formattedHour = hour === 0 ? 12 : hour;
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Helper functions for Timeout Delay
  // 5-59 seconds, then 1-5 minutes
  // Create array of all valid values: [5,6,7...59,60,120,180,240,300]
  const timeoutDelayValues = [
    ...Array.from({ length: 55 }, (_, i) => 5 + i), // 5-59 seconds
    ...Array.from({ length: 5 }, (_, i) => 60 + i * 60), // 1-5 minutes
  ];

  const incrementTimeoutDelay = (current: number) => {
    const currentIndex = timeoutDelayValues.indexOf(current);
    if (currentIndex === -1 || currentIndex === timeoutDelayValues.length - 1) return current;
    return timeoutDelayValues[currentIndex + 1];
  };

  const decrementTimeoutDelay = (current: number) => {
    const currentIndex = timeoutDelayValues.indexOf(current);
    if (currentIndex === -1 || currentIndex === 0) return current;
    return timeoutDelayValues[currentIndex - 1];
  };

  const formatTimeoutDelay = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}sec`;
    } else {
      return `${Math.floor(seconds / 60)}min`;
    }
  };

  const getTimeoutDelaySliderIndex = (seconds: number) => {
    const index = timeoutDelayValues.indexOf(seconds);
    return index === -1 ? 0 : index;
  };

  const getTimeoutDelayFromSliderIndex = (index: number) => {
    return timeoutDelayValues[index] || 5;
  };

  // Handle 3-second "waiting for no motion" period before countdown starts
  useEffect(() => {
    if (isWaitingForNoMotion) {
      const timer = setTimeout(() => {
        setIsWaitingForNoMotion(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isWaitingForNoMotion]);

  // Cleanup mic auto-off timer on unmount
  useEffect(() => {
    return () => {
      if (micAutoOffTimer) {
        clearTimeout(micAutoOffTimer);
      }
    };
  }, [micAutoOffTimer]);

  // Countdown timer for paused state
  useEffect(() => {
    if (isPaused && countdown > 0 && !isWaitingForNoMotion) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Countdown finished, turn camera on
            setIsPaused(false);
            setCameraOn(true);
            return 120; // Reset countdown
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPaused, countdown, isWaitingForNoMotion]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate realistic timeline-based recordings
  const generateTimelineRecordings = () => {
    const recordings = [];
    const now = new Date();
    const formatDuration = (seconds: number) => {
      if (seconds > 60) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
      }
      return `${seconds}s`;
    };

    // Helper function to generate recordings for a specific day
    const generateDayRecordings = (year: number, month: number, day: number, hasWatchProgress: boolean = false) => {
      const count = Math.floor(Math.random() * 11) + 20; // 20-30 recordings
      const numAlarms = Math.floor(Math.random() * 4) + 1; // 1-4 alarms
      const numLocked = Math.floor(Math.random() * 4) + 1; // 1-4 locked

      const dayRecordings = [];
      const alarmIndices = new Set<number>();
      const lockedIndices = new Set<number>();

      // Ensure at least 1 video has both alarm and lock
      const bothIndex = Math.floor(Math.random() * count);
      alarmIndices.add(bothIndex);
      lockedIndices.add(bothIndex);

      // Randomly select additional recordings with alarms
      while (alarmIndices.size < numAlarms) {
        alarmIndices.add(Math.floor(Math.random() * count));
      }

      // Randomly select additional recordings that are locked
      while (lockedIndices.size < numLocked) {
        lockedIndices.add(Math.floor(Math.random() * count));
      }

      for (let i = 0; i < count; i++) {
        // Generate hour between 7pm-10am (baby monitor hours)
        // Valid hours: 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        const validHours = [19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const hour = validHours[Math.floor(Math.random() * validHours.length)];
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);

        // 40% of videos should be shorter than 20s
        let duration: number;
        if (Math.random() < 0.4) {
          // Short videos: 5-19 seconds
          duration = Math.floor(Math.random() * 15) + 5;
        } else {
          // Longer videos: 20-215 seconds
          duration = Math.floor(Math.random() * 196) + 20;
        }

        dayRecordings.push({
          time: new Date(year, month, day, hour, minute, second),
          duration: duration,
          hasAlarm: alarmIndices.has(i),
          isLocked: lockedIndices.has(i),
          watchProgress: hasWatchProgress && i === 0 ? Math.floor(Math.random() * 70) + 20 : 0
        });
      }

      return dayRecordings;
    };

    // Today's recordings (April 8, 2026)
    const todayRecordings = generateDayRecordings(2026, 3, 8, true);

    // Yesterday (April 7)
    const yesterdayRecordings = generateDayRecordings(2026, 3, 7);

    // Last 7 days
    const lastWeekRecordings = [
      ...generateDayRecordings(2026, 3, 6),
      ...generateDayRecordings(2026, 3, 5),
      ...generateDayRecordings(2026, 3, 4),
      ...generateDayRecordings(2026, 3, 3),
      ...generateDayRecordings(2026, 3, 2),
      ...generateDayRecordings(2026, 3, 1),
      ...generateDayRecordings(2026, 2, 31),
    ];

    // Older recordings (last 30 days)
    const olderRecordings = [];
    for (let daysAgo = 8; daysAgo <= 30; daysAgo++) {
      const date = new Date(2026, 3, 8);
      date.setDate(date.getDate() - daysAgo);
      olderRecordings.push(...generateDayRecordings(date.getFullYear(), date.getMonth(), date.getDate()));
    }

    // Combine all and sort by time (newest first)
    const allRecordings = [...todayRecordings, ...yesterdayRecordings, ...lastWeekRecordings, ...olderRecordings]
      .sort((a, b) => b.time.getTime() - a.time.getTime());

    // Create recording objects
    allRecordings.forEach((rec, index) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const dayName = days[rec.time.getDay()];
      const monthName = months[rec.time.getMonth()];
      const day = rec.time.getDate();
      const year = rec.time.getFullYear();
      let hour = rec.time.getHours();
      const minute = rec.time.getMinutes();
      const second = rec.time.getSeconds();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;

      recordings.push({
        id: index,
        timestamp: rec.time,
        title: `${dayName}, ${monthName} ${day} ${year} at ${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}${ampm}`,
        camera: 'camara [7812FFA01839]',
        duration: formatDuration(rec.duration),
        durationSeconds: rec.duration,
        thumbnail: 'https://images.unsplash.com/photo-1644691211587-a0107492ad0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwc2xlZXBpbmclMjBjcmliJTIwYmVkcm9vbSUyMGRhcmt8ZW58MXx8fHwxNzY2NzY0ODU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        hasAlarm: rec.hasAlarm,
        isLocked: rec.isLocked,
        isArchived: false,
        watchProgress: rec.watchProgress
      });
    });

    return recordings;
  };

  // All recordings (as state so we can update lock/alarm status)
  const [allRecordings, setAllRecordings] = useState(() => generateTimelineRecordings());

  // Filter recordings based on active filters
  const currentRecordings = useMemo(() => {
    let filtered = [...allRecordings];

    // If in archived section, show only archived recordings
    // Otherwise, exclude archived recordings
    if (showArchivedSection) {
      filtered = filtered.filter(r => r.isArchived);
    } else {
      filtered = filtered.filter(r => !r.isArchived);
    }

    // Apply other filters only if NOT in archived section
    if (!showArchivedSection) {
      // Alarm filter
      if (activeFilters.alarmOnly) {
        filtered = filtered.filter(r => r.hasAlarm);
      }

      // Locked filter
      if (activeFilters.lockedOnly) {
        filtered = filtered.filter(r => r.isLocked);
      }

      // Long videos filter (20+ seconds)
      if (activeFilters.longVideosOnly) {
        filtered = filtered.filter(r => r.durationSeconds >= 20);
      }

      // Last 24 hours filter
      if (activeFilters.last24Hours) {
        const now = new Date(2026, 3, 8); // April 8, 2026
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        filtered = filtered.filter(r => r.timestamp >= yesterday);
      }
    }

    return filtered;
  }, [allRecordings, activeFilters, showArchivedSection]);

  // Group recordings by month and date for timeline view
  const groupedRecordings = useMemo(() => {
    const monthGroups: { [monthKey: string]: { [dateKey: string]: typeof currentRecordings } } = {};
    const now = new Date(2026, 3, 6); // April 6, 2026
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    currentRecordings.forEach(recording => {
      const recDate = new Date(recording.timestamp);

      // Create month key
      const monthKey = `${months[recDate.getMonth()]} ${recDate.getFullYear()}`;

      // Determine date key
      const today = recDate.getDate() === now.getDate() &&
                    recDate.getMonth() === now.getMonth() &&
                    recDate.getFullYear() === now.getFullYear();

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = recDate.getDate() === yesterday.getDate() &&
                          recDate.getMonth() === yesterday.getMonth() &&
                          recDate.getFullYear() === yesterday.getFullYear();

      let dateKey: string;
      if (today) {
        dateKey = 'Today';
      } else if (isYesterday) {
        dateKey = 'Yesterday';
      } else {
        dateKey = `${days[recDate.getDay()]}, ${monthsShort[recDate.getMonth()]} ${recDate.getDate()}`;
      }

      // Initialize month group if needed
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = {};
      }

      // Initialize date group within month if needed
      if (!monthGroups[monthKey][dateKey]) {
        monthGroups[monthKey][dateKey] = [];
      }

      monthGroups[monthKey][dateKey].push(recording);
    });

    return monthGroups;
  }, [currentRecordings]);

  // Enable alarm alert messages
  const enableAlarmAlertMessages = [
    "1 of 5: IMPORTANT! READ THIS FIRST! Sami is a nocturnal movement monitor and will detect all types of movement regardless of the movement's origin.",
    "2 of 5: HiPass Design LLC. does not guarantee the effectiveness of Sami for any particular application and use of Sami is solely at your own risk.",
    "3 of 5: Sami has not been evaluated or approved by the U.S. Food and Drug Administration or any other government agency for any purpose.",
    "4 of 5: Sami is not a medical device and is not intended for use in the prevention, diagnosis, mitigation, treatment, or cure of any disease or other conditions.",
    "5 of 5: Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
  ];

  // Handle enable alarm toggle with alerts
  const handleEnableAlarmToggle = () => {
    // If turning OFF, just toggle
    if (enableAlarm) {
      setEnableAlarm(false);
      return;
    }
    
    // If turning ON and haven't seen alerts, show first alert
    if (!hasSeenEnableAlarmAlerts) {
      setCurrentAlertIndex(0);
      setShowEnableAlarmAlert(true);
      return;
    }
    
    // Otherwise just toggle on
    setEnableAlarm(true);
  };

  // Handle alert OK button
  const handleAlertOk = () => {
    // If there are more alerts, show next one
    if (currentAlertIndex < enableAlarmAlertMessages.length - 1) {
      setCurrentAlertIndex(currentAlertIndex + 1);
    } else {
      // All alerts shown, enable alarm and mark as seen
      setShowEnableAlarmAlert(false);
      setEnableAlarm(true);
      setHasSeenEnableAlarmAlerts(true);
    }
  };

  // Handle alert Cancel button
  const handleAlertCancel = () => {
    setShowEnableAlarmAlert(false);
    setEnableAlarm(false);
    setCurrentAlertIndex(0);
  };

  // Handle Smart Border toggle
  const handleSmartBorderToggle = () => {
    // If turning OFF, just toggle
    if (smartBorder) {
      setSmartBorder(false);
      return;
    }
    
    // If turning ON, show first popup
    setShowSmartBorderPopup1(true);
  };

  // Handle Smart Border Popup 1 OK button
  const handleSmartBorderPopup1Ok = () => {
    setShowSmartBorderPopup1(false);
    // Show second popup
    setShowSmartBorderPopup2(true);
  };

  // Handle Smart Border Popup 1 Cancel button
  const handleSmartBorderPopup1Cancel = () => {
    setShowSmartBorderPopup1(false);
    // Don't enable Smart Border
  };

  // Handle Smart Border Popup 2 OK button
  const handleSmartBorderPopup2Ok = () => {
    setShowSmartBorderPopup2(false);
    // Enable Smart Border
    setSmartBorder(true);
  };

  // Handle Smart Border Popup 2 Cancel button
  const handleSmartBorderPopup2Cancel = () => {
    setShowSmartBorderPopup2(false);
    // Don't enable Smart Border
  };

  // Handle Off/Pause button click
  const handleCameraButtonClick = () => {
    // If alarm is disabled in settings, show hint instead
    if (!enableAlarm) {
      setShowAlarmDisabledHint(true);
      return;
    }
    
    // Don't process click if long press just completed
    if (longPressCompleted) {
      return;
    }
    
    if (!cameraOn && !isPaused) {
      // Start paused mode with countdown
      setIsPaused(true);
      setCountdown(120);
      setIsWaitingForNoMotion(true); // Start the "waiting for no motion" period
    } else if (isPaused) {
      // Skip countdown and turn on immediately
      setIsPaused(false);
      setCameraOn(true);
      setCountdown(120);
    }
    // Note: When camera is On, we use long press to turn it off
  };

  // Handle long press start for "On" button
  const handleAlarmPressStart = () => {
    if (cameraOn && !isPaused) {
      setIsHoldingAlarm(true);
      const timer = setTimeout(() => {
        // After 2 seconds, turn off
        setCameraOn(false);
        setIsHoldingAlarm(false);
        setLongPressCompleted(true);
        
        // Reset the long press flag after 1 second to allow finger to lift
        setTimeout(() => {
          setLongPressCompleted(false);
        }, 1000);
      }, 2000);
      setHoldTimer(timer);
    }
  };

  // Handle long press end/cancel
  const handleAlarmPressEnd = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    setIsHoldingAlarm(false);
    // Don't reset longPressCompleted here - it will be reset by the timer
  };

  const handleWakeUp = () => {
    if (isSleeping && isLocked) {
      setIsSleeping(false);
    }
  };

  const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const slider = document.getElementById('unlock-slider');
    if (!slider) return;
    
    const rect = slider.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    setSliderPosition(percentage);
    
    // Unlock when slider reaches 90%
    if (percentage >= 90) {
      setIsLocked(false);
      setSliderPosition(0);
      setIsDragging(false);
      setShowUnlockMessage(true);
      setShowBorderSavedHint(false); // Hide border saved hint when unlock message shows
      setTimeout(() => {
        setShowUnlockMessage(false);
      }, 10000);
    }
  };

  const handleSliderEnd = () => {
    setIsDragging(false);
    // Reset slider if not fully dragged
    if (sliderPosition < 90) {
      setSliderPosition(0);
    }
  };

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    setIsSleeping(false);
  };

  // Handle global mouse/touch move for border dragging
  useEffect(() => {
    if (!isBorderDragging) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      // Calculate distance from start position
      const deltaX = Math.abs(clientX - borderDragStartPos.x);
      const deltaY = Math.abs(clientY - borderDragStartPos.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Only consider it a drag if moved more than 10 pixels
      if (distance > 10) {
        setHasBorderMoved(true);
        
        const border = document.getElementById('border-overlay');
        if (!border) return;
        
        const rect = border.getBoundingClientRect();
        const x = clientX - rect.left;
        const delta = (x - borderDragStart) / 10;
        const thickness = Math.max(24, Math.min(200, delta + borderThickness));
        
        setBorderThickness(thickness);
      }
    };

    const handleGlobalEnd = () => {
      // If we didn't move (just clicked), toggle the bottom panel
      if (!hasBorderMoved) {
        // Toggle bottom panel
        if (!isLocked) {
          setShowBottomPanel(prev => {
            const newValue = !prev;
            
            // Clear existing timer
            if (inactivityTimer) {
              clearTimeout(inactivityTimer);
            }
            
            // If showing the panel, set a 5-second timer to hide it
            if (newValue) {
              const timer = setTimeout(() => {
                setShowBottomPanel(false);
              }, 5000);
              setInactivityTimer(timer);
            }
            
            return newValue;
          });
        }
      }
      setIsBorderDragging(false);
    };

    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchmove', handleGlobalMove);
    document.addEventListener('touchend', handleGlobalEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isBorderDragging, borderDragStartPos, borderDragStart, borderThickness, hasBorderMoved, isLocked, inactivityTimer]);

  const handleBorderDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsBorderDragging(true);
    setHasBorderMoved(false); // Reset movement flag
    setBorderDragStartPos({ x: clientX, y: clientY }); // Store initial position
    
    const border = document.getElementById('border-overlay');
    if (!border) return;
    const rect = border.getBoundingClientRect();
    setBorderDragStart(clientX - rect.left);
  };

  // New border rectangle drag handlers
  const handleRectDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDraggingRect(true);
    setRectDragStart({
      x: clientX,
      y: clientY,
      rectX: borderRect.x,
      rectY: borderRect.y,
      rectWidth: borderRect.width,
      rectHeight: borderRect.height
    });
  };

  const handleCornerDragStart = (corner: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDraggingCorner(corner);
    setRectDragStart({
      x: clientX,
      y: clientY,
      rectX: borderRect.x,
      rectY: borderRect.y,
      rectWidth: borderRect.width,
      rectHeight: borderRect.height
    });
  };

  // Handle rectangle and corner dragging
  useEffect(() => {
    if (!isDraggingRect && !isDraggingCorner) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      const videoContainer = document.querySelector('.video-feed-container');
      if (!videoContainer) return;
      const containerRect = videoContainer.getBoundingClientRect();

      const deltaXPx = clientX - rectDragStart.x;
      const deltaYPx = clientY - rectDragStart.y;

      // Define protected area - equal pixel margins on all sides
      const PROTECTED_MARGIN_PX = 70; // 70px margin on all sides
      const PROTECTED_TOP = PROTECTED_MARGIN_PX;
      const PROTECTED_BOTTOM = containerRect.height - PROTECTED_MARGIN_PX;
      const PROTECTED_LEFT = PROTECTED_MARGIN_PX;
      const PROTECTED_RIGHT = containerRect.width - PROTECTED_MARGIN_PX;

      if (isDraggingRect) {
        // Dragging the entire rectangle
        let newX = rectDragStart.rectX + deltaXPx;
        let newY = rectDragStart.rectY + deltaYPx;
        
        // Constrain to protected boundaries on all sides
        newX = Math.max(PROTECTED_LEFT, Math.min(PROTECTED_RIGHT - rectDragStart.rectWidth, newX));
        newY = Math.max(PROTECTED_TOP, Math.min(PROTECTED_BOTTOM - rectDragStart.rectHeight, newY));
        
        setBorderRect({
          x: newX,
          y: newY,
          width: rectDragStart.rectWidth,
          height: rectDragStart.rectHeight
        });
      } else if (isDraggingCorner) {
        // Dragging a corner to reshape
        let newRect = { ...borderRect };

        switch (isDraggingCorner) {
          case 'top-left':
            newRect.x = Math.max(PROTECTED_LEFT, Math.min(rectDragStart.rectX + rectDragStart.rectWidth - 10, rectDragStart.rectX + deltaXPx));
            newRect.y = Math.max(PROTECTED_TOP, Math.min(rectDragStart.rectY + rectDragStart.rectHeight - 10, rectDragStart.rectY + deltaYPx));
            newRect.width = rectDragStart.rectWidth + (rectDragStart.rectX - newRect.x);
            newRect.height = rectDragStart.rectHeight + (rectDragStart.rectY - newRect.y);
            break;
          case 'top-right':
            newRect.y = Math.max(PROTECTED_TOP, Math.min(rectDragStart.rectY + rectDragStart.rectHeight - 10, rectDragStart.rectY + deltaYPx));
            newRect.width = Math.max(10, Math.min(PROTECTED_RIGHT - rectDragStart.rectX, rectDragStart.rectWidth + deltaXPx));
            newRect.height = rectDragStart.rectHeight + (rectDragStart.rectY - newRect.y);
            break;
          case 'bottom-left':
            newRect.x = Math.max(PROTECTED_LEFT, Math.min(rectDragStart.rectX + rectDragStart.rectWidth - 10, rectDragStart.rectX + deltaXPx));
            newRect.width = rectDragStart.rectWidth + (rectDragStart.rectX - newRect.x);
            newRect.height = Math.max(10, Math.min(PROTECTED_BOTTOM - rectDragStart.rectY, rectDragStart.rectHeight + deltaYPx));
            break;
          case 'bottom-right':
            newRect.width = Math.max(10, Math.min(PROTECTED_RIGHT - rectDragStart.rectX, rectDragStart.rectWidth + deltaXPx));
            newRect.height = Math.max(10, Math.min(PROTECTED_BOTTOM - rectDragStart.rectY, rectDragStart.rectHeight + deltaYPx));
            break;
        }

        setBorderRect(newRect);
      }
    };

    const handleEnd = () => {
      setIsDraggingRect(false);
      setIsDraggingCorner(null);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingRect, isDraggingCorner, rectDragStart, borderRect]);

  // Check if we're on the main view (not in any other screen)
  const isMainView = !showHomeScreen && !showSplash && !showClock && !showHelp && !showRecordings && !showSettings && selectedRecordingIndex === null;

  // Check for volume warning on main view
  useEffect(() => {
    if (isMainView && beepOnCameraFault && alarmVolume === 0 && !ignoreCameraFaultWarning) {
      setShowVolumeWarningPopup(true);
    }
  }, [isMainView, beepOnCameraFault, alarmVolume, ignoreCameraFaultWarning]);

  // Camera fault popup functions
  const handleBeepOnCameraFaultToggle = (newValue: boolean) => {
    setBeepOnCameraFault(newValue);

    // If toggling ON, show the info popup
    if (newValue) {
      setShowBeepCameraFaultInfo(true);
    }

    // If toggling ON and enableAlarm is ON, show the camera fault popup immediately
    if (newValue && enableAlarm) {
      triggerCameraFaultPopup();
    }
  };

  const triggerCameraFaultPopup = () => {
    setShowCameraFaultPopup(true);
    
    // Set a timer to beep after 10 seconds if popup is not closed
    const timer = setTimeout(() => {
      // Play beep sound in loop - using Web Audio API
      playBeepSoundLoop();
      setCameraFaultBeepTimer(null);
    }, 10000);
    
    setCameraFaultBeepTimer(timer);
  };

  const closeCameraFaultPopup = () => {
    setShowCameraFaultPopup(false);
    
    // Cancel the beep timer if it's still active
    if (cameraFaultBeepTimer) {
      clearTimeout(cameraFaultBeepTimer);
      setCameraFaultBeepTimer(null);
    }
    
    // Stop the beep sound if it's playing
    stopBeepSound();
  };

  // Cleanup camera fault timer on unmount
  useEffect(() => {
    return () => {
      if (cameraFaultBeepTimer) {
        clearTimeout(cameraFaultBeepTimer);
      }
    };
  }, [cameraFaultBeepTimer]);
  
  // Cleanup push notification beep interval on unmount
  useEffect(() => {
    return () => {
      if (pushNotificationBeepIntervalRef.current) {
        clearInterval(pushNotificationBeepIntervalRef.current);
      }
    };
  }, []);

  // Beep on App Not Active functions
  const handleBeepOnAppNotActiveToggle = (newValue: boolean) => {
    // If toggling ON, show the first popup
    if (newValue) {
      setShowBeepAppNotActivePopup(true);
    } else {
      setBeepOnAppNotActive(false);
    }
  };

  const closeBeepAppNotActivePopup = () => {
    setShowBeepAppNotActivePopup(false);
    // Show the second popup (silent switch)
    setShowSilentSwitchPopup(true);
  };

  const closeSilentSwitchPopup = (action: 'disable' | 'ok') => {
    setShowSilentSwitchPopup(false);
    
    if (action === 'disable') {
      // Disable the Beep on App Not Active setting
      setBeepOnAppNotActive(false);
    } else {
      // Show push notification for 5 seconds
      setShowPushNotification(true);
      playBeepSoundRepeat();
      
      // Auto-hide after 5 seconds and stop beeping
      setTimeout(() => {
        setShowPushNotification(false);
        stopBeepSoundRepeat();
      }, 5000);
    }
  };

  // Archive confirmation popup functions
  const handleArchiveConfirmOk = () => {
    setShowArchiveConfirmPopup(false);

    // Handle video player archive (single recording)
    if (selectedRecordingIndex !== null) {
      const randomProgress = Math.floor(Math.random() * 61) + 30; // 30-90%
      setAllRecordings(prev => prev.map(r =>
        r.id === selectedRecordingIndex ? { ...r, isArchived: true, watchProgress: randomProgress } : r
      ));
      setSelectedRecordingIndex(null);
      setIsVideoPlaying(false);

      // Hide storage notification
      setShowStorageNotification(false);

      // Show archived confirmation message
      setShowArchivedMessage(true);
      setTimeout(() => {
        setShowArchivedMessage(false);
      }, 3000);
    }
    // Handle recordings list archive (multiple recordings)
    else if (selectedRecordingIds.length > 0) {
      setAllRecordings(prev => prev.map(r =>
        selectedRecordingIds.includes(r.id) ? { ...r, isArchived: true } : r
      ));
      setSelectedRecordingIds([]);

      // Hide storage notification
      setShowStorageNotification(false);

      // Show archived confirmation message for recordings list
      setShowArchivedMessage(true);
      setTimeout(() => {
        setShowArchivedMessage(false);
      }, 3000);
    }

    // Reset swipe state
    setSwipedRecordingId(null);
    setSwipeOffset(0);
  };

  const handleArchiveConfirmCancel = () => {
    setShowArchiveConfirmPopup(false);
  };

  const handleArchiveUnlockedOnly = () => {
    setShowArchiveConfirmPopup(false);

    // Handle video player archive (single recording) - only if not locked
    if (selectedRecordingIndex !== null) {
      const recording = allRecordings.find(r => r.id === selectedRecordingIndex);
      if (recording && !recording.isLocked) {
        const randomProgress = Math.floor(Math.random() * 61) + 30; // 30-90%
        setAllRecordings(prev => prev.map(r =>
          r.id === selectedRecordingIndex ? { ...r, isArchived: true, watchProgress: randomProgress } : r
        ));
        setSelectedRecordingIndex(null);
        setIsVideoPlaying(false);

        // Hide storage notification
        setShowStorageNotification(false);

        // Show archived confirmation message
        setShowArchivedMessage(true);
        setTimeout(() => {
          setShowArchivedMessage(false);
        }, 3000);
      }
    }
    // Handle recordings list archive (multiple recordings) - only unlocked ones
    else if (selectedRecordingIds.length > 0) {
      const unlockedIds = selectedRecordingIds.filter(id => {
        const recording = allRecordings.find(r => r.id === id);
        return recording && !recording.isLocked;
      });

      setAllRecordings(prev => prev.map(r =>
        unlockedIds.includes(r.id) ? { ...r, isArchived: true } : r
      ));
      setSelectedRecordingIds([]);

      // Hide storage notification
      setShowStorageNotification(false);

      // Show archived confirmation message for recordings list
      setShowArchivedMessage(true);
      setTimeout(() => {
        setShowArchivedMessage(false);
      }, 3000);
    }

    // Reset swipe state
    setSwipedRecordingId(null);
    setSwipeOffset(0);
  };

  // Reset functions
  const handleResetUserSettings = () => {
    // Reset user preferences only (alarm, motion, audio, display settings)
    setEnableAlarm(false);
    setHasSeenEnableAlarmAlerts(false);
    setMotionThresholdSetting(25);
    setAlarmThresholdSetting(20);
    setSensitivityBoost(0);
    setMaxPauseTime(120);
    setBorderSizeSetting(50);
    setSmartBorder(false);
    setSmartBorderValue(20);
    setBeepOnCameraFault(true);
    setBeepOnAppNotActive(false);
    setEnableAlarmSchedule(false);
    setAlarmVolume(50);
    setAlarmSound('A');
    setAlarmDuration(-1); // Default to Infinite
    setVibrateOnAlarm(false);
    setMicrophoneBoost(false);
    setMicrophoneNoiseReduction(false);
    setScreenTimeoutToClock(false);
    setTimeoutDelay(1);
    setShowResetDialog(false);
  };

  const handleResetAllAppSettings = () => {
    // Show confirmation dialog first
    setShowResetDialog(false);
    setShowResetAllConfirmDialog(true);
  };

  const handleConfirmResetAllAppSettings = () => {
    // Reset all settings including device selection
    setSelectedDevice('');
    setCameraPaired(false);
    setEnableAlarm(false);
    setHasSeenEnableAlarmAlerts(false);
    setMotionThresholdSetting(25);
    setAlarmThresholdSetting(20);
    setSensitivityBoost(0);
    setMaxPauseTime(120);
    setBorderSizeSetting(50);
    setSmartBorder(false);
    setSmartBorderValue(20);
    setBeepOnCameraFault(true);
    setBeepOnAppNotActive(false);
    setEnableAlarmSchedule(false);
    setAlarmVolume(50);
    setAlarmSound('A');
    setAlarmDuration(-1); // Default to Infinite
    setVibrateOnAlarm(false);
    setMicrophoneBoost(false);
    setMicrophoneNoiseReduction(false);
    setScreenTimeoutToClock(false);
    setTimeoutDelay(1);
    setEnableAutoRecording(true);
    setStorageLimit(250);
    setHideShorterThan('15sec');
    setICloudBackup('None');
    setDisableTelemetry(false);
    setAlwaysAllowMobileData(false);
    
    // Reset QC settings
    setDisplayData(false);
    setRapidTestMode(false);
    setBurningMode(false);
    setMinWifiQuality(100);
    setDevAWS(false);
    setShowQCSection(false);
    
    setShowResetAllConfirmDialog(false);
  };

  const handleEraseAllContent = () => {
    // Show confirmation dialog first
    setShowResetDialog(false);
    setShowEraseConfirmDialog(true);
  };

  const handleConfirmEraseAllContent = () => {
    // Reset everything including recordings (in a real app, this would delete recordings)
    handleConfirmResetAllAppSettings();
    // In a real implementation, this would also:
    // - Delete all recordings from storage
    // - Clear cache
    // - Reset recording counter
    // - Clear any saved camera settings
    // - Exit the app
    setShowEraseConfirmDialog(false);
  };

  // QC Section Easter Egg handlers
  const handleQCTitlePressStart = () => {
    const timer = setTimeout(() => {
      setShowQCSection(true);
    }, 3000); // 3 seconds
    setQcPressTimer(timer);
  };

  const handleQCTitlePressEnd = () => {
    if (qcPressTimer) {
      clearTimeout(qcPressTimer);
      setQcPressTimer(null);
    }
  };

  // Handle screen click to toggle bottom panel
  const handleScreenClick = () => {
    if (!isLocked) {
      setShowBottomPanel(prev => {
        const newValue = !prev;
        
        // Clear existing timer
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
        
        // If showing the panel, set a 5-second timer to hide it
        if (newValue) {
          const timer = setTimeout(() => {
            setShowBottomPanel(false);
          }, 5000);
          setInactivityTimer(timer);
        }
        
        return newValue;
      });
    }
  };

  // Handle user activity to show bottom panel and reset timer (for settings button)
  const handleUserActivity = () => {
    if (!isLocked) {
      setShowBottomPanel(true);
      
      // Clear existing timer
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      // Set a new 5-second timer to hide the panel
      const timer = setTimeout(() => {
        setShowBottomPanel(false);
      }, 5000);
      setInactivityTimer(timer);
    }
  };

  // Reset inactivity timer when unlocked
  useEffect(() => {
    if (!isLocked) {
      handleUserActivity();
    }
    
    // Cleanup timer on unmount
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [isLocked]);

  // Home Screen
  if (selectedOS === null) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-[133.33vh] max-h-[75vw] aspect-[4/3] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0d1b2e 0%, #1a2f4a 50%, #0d2233 100%)' }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-16">
            <img src={splashLogo} alt="Sami" className="w-24 h-24 object-contain" />
            <span className="text-white text-3xl font-semibold tracking-wide" style={{ fontFamily: 'SF Pro, system-ui, sans-serif' }}>Sami</span>
          </div>

          {/* Question */}
          <p className="text-gray-300 text-lg mb-10" style={{ fontFamily: 'SF Pro, system-ui, sans-serif' }}>
            Which device are you using?
          </p>

          {/* OS Buttons */}
          <div className="flex gap-8">
            <button
              onClick={() => setSelectedOS('ios')}
              className="flex flex-col items-center gap-4 px-12 py-8 rounded-2xl border-2 border-gray-600 hover:border-[#22C7E8] transition-all group"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {/* Apple logo SVG */}
              <svg className="w-14 h-14 text-white group-hover:text-[#22C7E8] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-white text-xl font-semibold group-hover:text-[#22C7E8] transition-colors" style={{ fontFamily: 'SF Pro, system-ui, sans-serif' }}>iOS</span>
            </button>

            <button
              onClick={() => setSelectedOS('android')}
              className="flex flex-col items-center gap-4 px-12 py-8 rounded-2xl border-2 border-gray-600 hover:border-[#22C7E8] transition-all group"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {/* Android logo SVG */}
              <svg className="w-14 h-14 text-white group-hover:text-[#22C7E8] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.341a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-9.546 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M2.976 8.25h18.048v8.625c0 .621-.504 1.125-1.125 1.125H4.1a1.125 1.125 0 0 1-1.125-1.125V8.25zM8.358 3.102l-1.56-2.7a.375.375 0 0 1 .65-.376l1.58 2.737A9.77 9.77 0 0 1 12 2.25c1.12 0 2.196.188 3.196.537l1.558-2.699a.375.375 0 0 1 .65.376l-1.56 2.7A9.754 9.754 0 0 1 21.024 8.25H2.976a9.754 9.754 0 0 1 5.382-5.148z"/>
              </svg>
              <span className="text-white text-xl font-semibold group-hover:text-[#22C7E8] transition-colors" style={{ fontFamily: 'SF Pro, system-ui, sans-serif' }}>Android</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showHomeScreen) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-[133.33vh] max-h-[75vw] aspect-[4/3]">
          {/* iOS Wallpaper Background */}
          <img 
            src={homeScreenWallpaper}
            alt="Wallpaper"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-6 text-white text-sm z-10">
            <div className="font-semibold">9:41 AM</div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <Battery className="w-6 h-3" />
            </div>
          </div>

          {/* App Grid - Landscape iPad layout (6 columns) */}
          <div className="absolute top-16 left-12 right-12">
            <div className="grid grid-cols-6 gap-x-16 gap-y-8">
              {/* Row 1 */}
              <AppIcon name="Photo Booth" color="#FF3B30" Icon={Camera} />
              <AppIcon name="Find My" color="#00C957" Icon={Compass} />
              <AppIcon name="Shortcuts" color="#5B7FE5" Icon={AppWindow} />
              <AppIcon name="Translate" color="#1F3F74" Icon={MessageCircle} />
              <AppIcon name="iTunes Store" color="#E84393" Icon={Star} />
              <AppIcon name="GarageBand" color="#FF5C39" Icon={Guitar} />
              
              {/* Row 2 */}
              <AppIcon name="Keynote" color="#0A84FF" Icon={FileText} />
              <AppIcon name="Tips" color="#FFD60A" Icon={Lightbulb} />
              
              {/* Sami app */}
              <div 
                className="flex flex-col items-center gap-2 cursor-pointer transform transition-transform active:scale-95"
                onClick={() => setShowHomeScreen(false)}
              >
                <div className="w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={homeScreenIcon} 
                    alt="Sami" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white text-xs text-center font-medium drop-shadow-md">Sami</span>
              </div>
            </div>
          </div>

          {/* Page indicator dots */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
          </div>

          {/* Dock - bottom center */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl px-4 py-3 flex items-center gap-4">
              <DockAppIcon name="Messages" color="#00C957" Icon={MessageCircle} />
              <DockAppIcon name="Safari" color="#0A84FF" Icon={Compass} />
              <DockAppIcon name="Music" color="#FF2D55" Icon={Music2} />
              <DockAppIcon name="Mail" color="#0A84FF" Icon={Mail} />
              <DockAppIcon name="Calendar" color="#FF3B30" Icon={Calendar} />
              <DockAppIcon name="Photos" color="#FF3B30" Icon={Image} />
              <DockAppIcon name="Notes" color="#FFD60A" Icon={StickyNote} />
              <DockAppIcon name="Apps" color="#8E8E93" Icon={Grid3x3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Splash Screen
  if (showSplash) {
    return (
      <motion.div
        className="relative w-full h-screen bg-black flex items-center justify-center cursor-pointer"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div
          className="relative w-full h-full max-w-[133.33vh] max-h-[75vw] aspect-[4/3] flex items-center justify-center"
          style={{ backgroundColor: '#293891' }}
          onClick={() => {
            setShowSplash(false);
            setOnboardingInitialStep(0);
            setOnboardingSkipPermissions(false);
            setShowOnboarding(true);
          }}
        >
          <motion.div
            className="flex flex-col items-center justify-center gap-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
          {/* Logo and brand name */}
          <img
            src={splashLogo}
            alt="Sami logo"
            className="w-auto h-auto max-w-[200px] max-h-[200px] object-contain animate-pulse brightness-0 invert"
          />

          {/* Loading dots */}
          <div className="flex gap-3">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
      </motion.div>
    );
  }

  // Onboarding Flow
  if (showOnboarding) {
    return (
      <OnboardingFlow
        initialStep={onboardingInitialStep}
        skipPermissions={onboardingSkipPermissions}
        platform={selectedOS ?? 'ios'}
        currentWifi={settingsWifiNetwork}
        savedPasswordHint={savedPasswordHint}
        onPasswordHintSaved={(hint) => { setSavedPasswordHint(hint); setSavedCameraPasswordHint(hint); }}
        onPasswordSaved={(password) => setSavedCameraPassword(password)}
        onSkip={() => {
          setShowOnboarding(false);
          setOnboardingInitialStep(0);
          setOnboardingSkipPermissions(false);
          setCameraPaired(true);
          setSelectedDevice('sami-3c: 7812FFA01839');
          setSettingsWifiNetwork('Sami-5G');
          setSavedCameraPassword('Sami55');
          setSavedCameraPasswordHint('This is my hint');
        }}
        onComplete={() => {
          setShowOnboarding(false);
          setOnboardingInitialStep(0);
          setOnboardingSkipPermissions(false);
          setCameraPaired(true);
          setSelectedDevice('sami-3c: 7812FFA01839');
        }}
        onCancel={() => {
          setShowOnboarding(false);
          setOnboardingInitialStep(0);
          setOnboardingSkipPermissions(false);
          setShowSettings(true);
        }}
      />
    );
  }

  // Main Baby Monitor Screen
  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-full h-full max-w-[133.33vh] max-h-[75vw] aspect-[4/3] bg-gradient-to-b from-[#1a3d4d] via-[#0f2532] to-[#0a1520] overflow-hidden flex flex-col"
        onClick={handleWakeUp}
      >
        
        {/* Sleeping mode grey overlay */}
        {isSleeping && isLocked && (
          <div className="absolute inset-0 bg-black/50 z-25 pointer-events-none transition-opacity duration-500" />
        )}
        
        {/* Clock Screen Overlay */}
        {showClock && (
          <div
            className="absolute inset-0 bg-black z-30 flex items-center justify-center cursor-pointer"
            onClick={() => setShowClock(false)}
          >
            {/* Wifi icon - top right */}
            <div className="absolute top-6 right-6">
              <AnimatedWifiIcon />
            </div>

            {/* Time Display */}
            <div
              className="text-[280px] font-bold tracking-wider leading-none"
              style={{
                animation: 'cyanFadeIn 1.5s ease-out forwards'
              }}
            >
              10:48
            </div>

            {/* Bottom instruction text */}
            {showClockBrightnessHint && (
              <div className="absolute bottom-16 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg">
                <span className="text-black text-lg">Slide your finger left/right to adjust brightness</span>
              </div>
            )}
          </div>
        )}

        {/* Help Screen Overlay */}
        {showHelp && (
          <div className="absolute inset-0 bg-black z-30 flex flex-col">
            {/* Top black panel */}
            <div className="bg-black py-4 flex items-center justify-between">
              <button 
                onClick={() => setShowHelp(false)}
                className="ml-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <span className="text-white text-lg font-medium">
                Help [Version 1.0 build 1]
              </span>
              
              <button 
                onClick={() => setShowSendLogDialog(true)}
                className="mr-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Send log
              </button>
            </div>
            
            {/* Content area */}
            <div className="flex-1 bg-black overflow-y-auto flex items-center justify-center p-12">
              <div className="max-w-2xl text-left p-12 rounded-lg" style={{ backgroundColor: '#1E2938' }}>
                <h1 className="text-white text-5xl font-bold mb-8">Looking for help?</h1>
                
                <div className="text-white text-2xl space-y-6">
                  <p>
                    Visit <a href="https://support.samialert.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#5A8BBF] hover:underline cursor-pointer text-2xl">support.samialert.com</a> where you can:
                  </p>
                  
                  <ul className="list-disc list-inside space-y-3 ml-4">
                    <li>View how-to guides</li>
                    <li>View troubleshooting tips and FAQs</li>
                    <li>Submit a support ticket and get in touch with our team</li>
                  </ul>
                  
                  <p className="mt-8">
                    Other useful direct links:
                  </p>
                  
                  <ul className="list-disc list-inside space-y-3 ml-4">
                    <li><a href="https://support.samialert.com/hc/en-us/articles/9207155110925-SAMi-3-Manual-Overview-of-SAMi-App-Settings-Features" target="_blank" rel="noopener noreferrer" className="text-[#5A8BBF] hover:underline cursor-pointer text-2xl">User Manual</a></li>
                    <li><a href="https://support.samialert.com/hc/en-us/categories/8690414210445-Setup-Guides-User-Manuals" target="_blank" rel="noopener noreferrer" className="text-[#5A8BBF] hover:underline cursor-pointer text-2xl">Installation instructions</a></li>
                  </ul>
                  
                  <p
                    onClick={() => setShowOfflineHelp(true)}
                    className="mt-8 text-gray-400 text-lg cursor-pointer hover:text-gray-300 transition-colors"
                  >
                    [see offline version&gt;]
                  </p>
                </div>
              </div>
            </div>
            
            {/* Send Log Dialog */}
            {showSendLogDialog && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
                <div className="bg-black rounded-lg p-8 max-w-md w-full mx-4">
                  <h2 className="text-white text-2xl font-bold mb-4">Send Log</h2>
                  {emailError ? (
                    <p className="text-white mb-6">{emailError} is not a valid email address. Please re-enter</p>
                  ) : (
                    <p className="text-white mb-6">Enter an email address for us to contact you:</p>
                  )}
                  
                  <input
                    type="email"
                    value={logEmail}
                    onChange={(e) => {
                      setLogEmail(e.target.value);
                      setEmailError(''); // Clear error when user types
                    }}
                    placeholder="sami@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white text-black placeholder-gray-400 mb-6"
                  />
                  
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => {
                        setShowSendLogDialog(false);
                        setLogEmail('');
                        setEmailError('');
                      }}
                      className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Validate email
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        const trimmedEmail = logEmail.trim();
                        
                        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
                          setEmailError(trimmedEmail || '(empty)');
                        } else {
                          // Email is valid, show composer
                          setShowSendLogDialog(false);
                          setEmailError('');
                          setShowEmailComposer(true);
                        }
                      }}
                      className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Offline Help Screen */}
        {showOfflineHelp && (
          <div className="absolute inset-0 bg-black z-40 flex flex-col">
            {/* Top black panel */}
            <div className="bg-black py-4 flex items-center justify-between">
              <button
                onClick={() => setShowOfflineHelp(false)}
                className="ml-6 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <span className="text-white text-lg font-medium">
                Help [Version 1.0 build 1]
              </span>

              <button
                onClick={() => setShowSendLogDialog(true)}
                className="mr-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Send log
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 bg-black overflow-y-auto flex items-center justify-center p-12">
              <div className="max-w-2xl text-center p-12 rounded-lg" style={{ backgroundColor: '#1E2938' }}>
                <h1 className="text-white text-5xl font-bold mb-8">Looking for help?</h1>

                <div className="text-white text-2xl">
                  <p>
                    Your Device is Currently Offline.
                    <br /><br />
                    Please switch to a network with internet connectivity or visit{' '}
                    <span className="font-semibold text-[#5A8BBF]">https://support.samialert.com</span>{' '}
                    from another device connected to the internet.
                  </p>
                </div>
              </div>
            </div>

            {/* Send Log Dialog */}
            {showSendLogDialog && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-black rounded-lg p-8 max-w-md w-full mx-4">
                  <h2 className="text-white text-2xl font-bold mb-4">Send Log</h2>
                  {emailError ? (
                    <p className="text-white mb-6">{emailError} is not a valid email address. Please re-enter</p>
                  ) : (
                    <p className="text-white mb-6">Enter an email address for us to contact you:</p>
                  )}

                  <input
                    type="email"
                    value={logEmail}
                    onChange={(e) => {
                      setLogEmail(e.target.value);
                      setEmailError(''); // Clear error when user types
                    }}
                    placeholder="sami@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white text-black placeholder-gray-400 mb-6"
                  />

                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => {
                        setShowSendLogDialog(false);
                        setLogEmail('');
                        setEmailError('');
                      }}
                      className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Validate email
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        const trimmedEmail = logEmail.trim();

                        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
                          setEmailError(trimmedEmail || '(empty)');
                        } else {
                          // Email is valid, show composer
                          setShowSendLogDialog(false);
                          setEmailError('');
                          setShowEmailComposer(true);
                        }
                      }}
                      className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Email Composer */}
        {showEmailComposer && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col">
            {/* Top bar */}
            <div className="bg-black py-4 px-6 flex items-center justify-between border-b border-gray-700">
              <button 
                onClick={() => {
                  setShowEmailComposer(false);
                  setLogEmail('');
                }}
                className="text-[#5A8BBF] text-lg"
              >
                Cancel
              </button>
              
              <span className="text-white text-lg font-medium">
                New Message
              </span>
              
              <button 
                onClick={() => {
                  // Simulate sending email
                  setShowEmailComposer(false);
                  setLogEmail('');
                }}
                className="text-[#5A8BBF] text-lg"
              >
                Send
              </button>
            </div>
            
            {/* Email fields */}
            <div className="flex-1 bg-white overflow-y-auto">
              {/* To field */}
              <div className="flex items-center border-b border-gray-300 px-4 py-3">
                <span className="text-gray-500 mr-3 w-16">To:</span>
                <span className="text-black flex-1">Sami3_support@hipassdesign.com</span>
              </div>
              
              {/* From field */}
              <div className="flex items-center border-b border-gray-300 px-4 py-3">
                 <span className="text-gray-500 mr-3 w-16">From:</span>
                <span className="text-black flex-1">{logEmail}</span>
              </div>
              
              {/* Subject field */}
              <div className="flex items-center border-b border-gray-300 px-4 py-3">
                <span className="text-gray-500 mr-3 w-16">Subject:</span>
                <span className="text-black flex-1">!!! Support request for Sami-3c [7812FFA010C1]</span>
              </div>
              
              {/* Body */}
              <div className="px-4 py-4">
                <pre className="text-black font-mono text-sm whitespace-pre-wrap">
{`^^^Please describe the problem above here^^^
From: ${logEmail}
--------------
DEVICE SETTINGS:
Running on: iPhone 13 (iPhone14,5)
iOS Version: 18.5
TimeZone: America/Costa_Rica
Location Services: enabled
VPN: off
Local Network access: ENABLED
iPhone SSID: "Sami-5G"
--------------
APP SETTINGS:
User ID: 5FCC2AE4-B5E1-4989-9245-AF146437E6E9
Sami3 Version: 3.1.5 build 2
Selected Camera: 7812FFA010C1
Local Network Access: ENABLED
selected_camera_name: 7812FFA010C1
skip_firmware_update: FALSE
enable_emfit: FALSE
alarm_enable_switch: ALARM DISABLED
motion_threshold: 25%
alert_threshold: 20.0s
alarm_duration: 600
sensitivity_boost: 0%
* max_pause_time: 120
* border_size: 58
beep on camera fault: FALSE
alert_on_app_not_active: FALSE
alarm_schedule_enabled: FALSE
disable_time: 07:00
enable_time: 19:00
mic_on: FALSE
alarm_vol: 50%
alarm_sound: 0
vibrate_on_alarm: FALSE
mic_boost: FALSE
mic_noise_reduction: FALSE
clock_delay_switch: FALSE
clock_delay: 60s
* clock_brightness: 0.01166666
smart_edge_switch: FALSE
large_thumbs_switch: FALSE
enable_transfers: TRUE
storage_limit: 254.87
min_rec_length: 15
icloud: 0
qc_mode: FALSE
qc_display_data: FALSE
--------------
CAMERA SETTINGS:
* Saved Log:
Sami camera: 7812FFA010C1
model: Sami-3c
camera state: online
firmwareVersion: 143.20190319
socketAddress: 192.168.0.2:80
lastWorkingLanSocket: 192.168.0.2:80
awsSocket: (null)
lastWorkingSSID: Sami-5G
cameraSSID: Sami
* Camera is Wired
NightVision Mode: Auto
IR Illuminator Mode: Auto
IR Filter Mode: On
Record Mode: Motion Only
Record Motion Threshold: 4
Record Schedule 1: All day, Everyday
Record Schedule 2: Disabled
Record Schedule 3: Disabled
Record Schedule 4: Disabled
SD Card is Ok
Dropbox is Disabled
Internet is Disabled
Internet Port Status is Unconfigured
Browser Viewer is Disabled
Power Light is Enabled
Power Light Flash is Enabled
IP is Dynamic`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Recordings Screen Overlay */}
        <RecordingsScreen
          showRecordings={showRecordings}
          setShowRecordings={setShowRecordings}
          allRecordings={allRecordings}
          setAllRecordings={setAllRecordings}
          currentRecordings={currentRecordings}
          groupedRecordings={groupedRecordings}
          selectedRecordingIndex={selectedRecordingIndex}
          setSelectedRecordingIndex={setSelectedRecordingIndex}
          isVideoPlaying={isVideoPlaying}
          setIsVideoPlaying={setIsVideoPlaying}
          isDownloadingRecording={isDownloadingRecording}
          setIsDownloadingRecording={setIsDownloadingRecording}
          downloadProgress={downloadProgress}
          setDownloadProgress={setDownloadProgress}
          downloadedRecordingIds={downloadedRecordingIds}
          setDownloadedRecordingIds={setDownloadedRecordingIds}
          downloadingRecordingIds={downloadingRecordingIds}
          setDownloadingRecordingIds={setDownloadingRecordingIds}
          activeDownloadInterval={activeDownloadInterval}
          setActiveDownloadInterval={setActiveDownloadInterval}
          showDownloadError={showDownloadError}
          setShowDownloadError={setShowDownloadError}
          isEditingRecordings={isEditingRecordings}
          setIsEditingRecordings={setIsEditingRecordings}
          selectedRecordingIds={selectedRecordingIds}
          setSelectedRecordingIds={setSelectedRecordingIds}
          showArchivedSection={showArchivedSection}
          setShowArchivedSection={setShowArchivedSection}
          showArchivedMessage={showArchivedMessage}
          setShowArchivedMessage={setShowArchivedMessage}
          showUnarchivedMessage={showUnarchivedMessage}
          setShowUnarchivedMessage={setShowUnarchivedMessage}
          showDeletedMessage={showDeletedMessage}
          setShowDeletedMessage={setShowDeletedMessage}
          showArchiveConfirmPopup={showArchiveConfirmPopup}
          setShowArchiveConfirmPopup={setShowArchiveConfirmPopup}
          archiveWarningType={archiveWarningType}
          setArchiveWarningType={setArchiveWarningType}
          archiveIsSingleLocked={archiveIsSingleLocked}
          setArchiveIsSingleLocked={setArchiveIsSingleLocked}
          handleArchiveConfirmOk={handleArchiveConfirmOk}
          handleArchiveConfirmCancel={handleArchiveConfirmCancel}
          handleArchiveUnlockedOnly={handleArchiveUnlockedOnly}
          showDeleteConfirmation={showDeleteConfirmation}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          showBulkDeleteConfirmation={showBulkDeleteConfirmation}
          setShowBulkDeleteConfirmation={setShowBulkDeleteConfirmation}
          showSingleDeleteConfirmation={showSingleDeleteConfirmation}
          setShowSingleDeleteConfirmation={setShowSingleDeleteConfirmation}
          singleDeleteRecordingId={singleDeleteRecordingId}
          setSingleDeleteRecordingId={setSingleDeleteRecordingId}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          collapsedDateGroups={collapsedDateGroups}
          setCollapsedDateGroups={setCollapsedDateGroups}
          collapsedMonthGroups={collapsedMonthGroups}
          setCollapsedMonthGroups={setCollapsedMonthGroups}
          showStorageNotification={showStorageNotification}
          setShowStorageNotification={setShowStorageNotification}
          showStoragePopup={showStoragePopup}
          setShowStoragePopup={setShowStoragePopup}
          showAutoDeletePopup={showAutoDeletePopup}
          setShowAutoDeletePopup={setShowAutoDeletePopup}
          autoDeleteOlderVideos={autoDeleteOlderVideos}
          setAutoDeleteOlderVideos={setAutoDeleteOlderVideos}
          swipedRecordingId={swipedRecordingId}
          setSwipedRecordingId={setSwipedRecordingId}
          swipeOffset={swipeOffset}
          setSwipeOffset={setSwipeOffset}
          swipeStartX={swipeStartX}
          currentSwipeOffset={currentSwipeOffset}
          hasSwipedRef={hasSwipedRef}
          trashedSwipedId={trashedSwipedId}
          setTrashedSwipedId={setTrashedSwipedId}
          trashedSwipeOffset={trashedSwipeOffset}
          setTrashedSwipeOffset={setTrashedSwipeOffset}
          trashedSwipeStartX={trashedSwipeStartX}
          trashedCurrentSwipeOffset={trashedCurrentSwipeOffset}
          trashedHasSwipedRef={trashedHasSwipedRef}
        />

        {/* Settings Screen Overlay */}
        <SettingsScreen
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          selectedOS={selectedOS}
          setShowOnboarding={setShowOnboarding}
          setOnboardingInitialStep={setOnboardingInitialStep}
          setOnboardingSkipPermissions={setOnboardingSkipPermissions}
          selectedDevice={selectedDevice}
          setSelectedDevice={setSelectedDevice}
          cameraPaired={cameraPaired}
          setCameraPaired={setCameraPaired}
          showPairingPopup={showPairingPopup}
          setShowPairingPopup={setShowPairingPopup}
          showCameraSettings={showCameraSettings}
          setShowCameraSettings={setShowCameraSettings}
          savedCameraPassword={savedCameraPassword}
          setSavedCameraPassword={setSavedCameraPassword}
          savedCameraPasswordHint={savedCameraPasswordHint}
          setSavedCameraPasswordHint={setSavedCameraPasswordHint}
          settingsWifiNetwork={settingsWifiNetwork}
          setSettingsWifiNetwork={setSettingsWifiNetwork}
          showSettingsWifiPicker={showSettingsWifiPicker}
          setShowSettingsWifiPicker={setShowSettingsWifiPicker}
          settingsWifiPickerStep={settingsWifiPickerStep}
          setSettingsWifiPickerStep={setSettingsWifiPickerStep}
          settingsWifiPendingSsid={settingsWifiPendingSsid}
          setSettingsWifiPendingSsid={setSettingsWifiPendingSsid}
          enableAlarm={enableAlarm}
          handleEnableAlarmToggle={handleEnableAlarmToggle}
          motionThresholdSetting={motionThresholdSetting}
          setMotionThresholdSetting={setMotionThresholdSetting}
          alarmThresholdSetting={alarmThresholdSetting}
          setAlarmThresholdSetting={setAlarmThresholdSetting}
          sensitivityBoost={sensitivityBoost}
          setSensitivityBoost={setSensitivityBoost}
          maxPauseTime={maxPauseTime}
          setMaxPauseTime={setMaxPauseTime}
          smartBorder={smartBorder}
          handleSmartBorderToggle={handleSmartBorderToggle}
          beepOnCameraFault={beepOnCameraFault}
          handleBeepOnCameraFaultToggle={handleBeepOnCameraFaultToggle}
          beepOnAppNotActive={beepOnAppNotActive}
          handleBeepOnAppNotActiveToggle={handleBeepOnAppNotActiveToggle}
          incrementAlarmThreshold={incrementAlarmThreshold}
          decrementAlarmThreshold={decrementAlarmThreshold}
          formatAlarmThreshold={formatAlarmThreshold}
          maxPauseTimeValues={maxPauseTimeValues}
          incrementMaxPauseTime={incrementMaxPauseTime}
          decrementMaxPauseTime={decrementMaxPauseTime}
          formatMaxPauseTime={formatMaxPauseTime}
          getMaxPauseTimeSliderIndex={getMaxPauseTimeSliderIndex}
          getMaxPauseTimeFromSliderIndex={getMaxPauseTimeFromSliderIndex}
          enableAlarmSchedule={enableAlarmSchedule}
          setEnableAlarmSchedule={setEnableAlarmSchedule}
          alarmEnableHour={alarmEnableHour}
          setAlarmEnableHour={setAlarmEnableHour}
          alarmEnableMinute={alarmEnableMinute}
          setAlarmEnableMinute={setAlarmEnableMinute}
          alarmEnablePeriod={alarmEnablePeriod}
          setAlarmEnablePeriod={setAlarmEnablePeriod}
          showAlarmEnableTimePicker={showAlarmEnableTimePicker}
          setShowAlarmEnableTimePicker={setShowAlarmEnableTimePicker}
          alarmDisableHour={alarmDisableHour}
          setAlarmDisableHour={setAlarmDisableHour}
          alarmDisableMinute={alarmDisableMinute}
          setAlarmDisableMinute={setAlarmDisableMinute}
          alarmDisablePeriod={alarmDisablePeriod}
          setAlarmDisablePeriod={setAlarmDisablePeriod}
          showAlarmDisableTimePicker={showAlarmDisableTimePicker}
          setShowAlarmDisableTimePicker={setShowAlarmDisableTimePicker}
          formatTime={formatTime}
          alarmVolume={alarmVolume}
          setAlarmVolume={setAlarmVolume}
          alarmSound={alarmSound}
          setAlarmSound={setAlarmSound}
          alarmDuration={alarmDuration}
          setAlarmDuration={setAlarmDuration}
          vibrateOnAlarm={vibrateOnAlarm}
          setVibrateOnAlarm={setVibrateOnAlarm}
          microphoneBoost={microphoneBoost}
          setMicrophoneBoost={setMicrophoneBoost}
          microphoneNoiseReduction={microphoneNoiseReduction}
          setMicrophoneNoiseReduction={setMicrophoneNoiseReduction}
          showMicrophoneBoostPopup={showMicrophoneBoostPopup}
          setShowMicrophoneBoostPopup={setShowMicrophoneBoostPopup}
          showMicrophoneNoiseReductionPopup={showMicrophoneNoiseReductionPopup}
          setShowMicrophoneNoiseReductionPopup={setShowMicrophoneNoiseReductionPopup}
          alarmDurationValues={alarmDurationValues}
          incrementAlarmDuration={incrementAlarmDuration}
          decrementAlarmDuration={decrementAlarmDuration}
          formatAlarmDuration={formatAlarmDuration}
          getAlarmDurationSliderIndex={getAlarmDurationSliderIndex}
          getAlarmDurationFromSliderIndex={getAlarmDurationFromSliderIndex}
          screenTimeoutToClock={screenTimeoutToClock}
          setScreenTimeoutToClock={setScreenTimeoutToClock}
          timeoutDelay={timeoutDelay}
          setTimeoutDelay={setTimeoutDelay}
          largeThumbnails={largeThumbnails}
          setLargeThumbnails={setLargeThumbnails}
          timeoutDelayValues={timeoutDelayValues}
          incrementTimeoutDelay={incrementTimeoutDelay}
          decrementTimeoutDelay={decrementTimeoutDelay}
          formatTimeoutDelay={formatTimeoutDelay}
          getTimeoutDelaySliderIndex={getTimeoutDelaySliderIndex}
          getTimeoutDelayFromSliderIndex={getTimeoutDelayFromSliderIndex}
          enableAutoRecording={enableAutoRecording}
          setEnableAutoRecording={setEnableAutoRecording}
          storageLimit={storageLimit}
          setStorageLimit={setStorageLimit}
          autoDeleteOlderVideos={autoDeleteOlderVideos}
          setAutoDeleteOlderVideos={setAutoDeleteOlderVideos}
          showAutoDeletePopup={showAutoDeletePopup}
          setShowAutoDeletePopup={setShowAutoDeletePopup}
          backupLockedVideos={backupLockedVideos}
          setBackupLockedVideos={setBackupLockedVideos}
          showBackupPopup={showBackupPopup}
          setShowBackupPopup={setShowBackupPopup}
          setShowStorageNotification={setShowStorageNotification}
          alwaysAllowMobileData={alwaysAllowMobileData}
          setAlwaysAllowMobileData={setAlwaysAllowMobileData}
          enableSentData={enableSentData}
          setEnableSentData={setEnableSentData}
          showResetDialog={showResetDialog}
          setShowResetDialog={setShowResetDialog}
          showEraseConfirmDialog={showEraseConfirmDialog}
          setShowEraseConfirmDialog={setShowEraseConfirmDialog}
          showResetAllConfirmDialog={showResetAllConfirmDialog}
          setShowResetAllConfirmDialog={setShowResetAllConfirmDialog}
          handleResetUserSettings={handleResetUserSettings}
          handleResetAllAppSettings={handleResetAllAppSettings}
          handleEraseAllContent={handleEraseAllContent}
          handleConfirmResetAllAppSettings={handleConfirmResetAllAppSettings}
          handleConfirmEraseAllContent={handleConfirmEraseAllContent}
          showCameraFaultPopup={showCameraFaultPopup}
          closeCameraFaultPopup={closeCameraFaultPopup}
          showBeepCameraFaultInfo={showBeepCameraFaultInfo}
          setShowBeepCameraFaultInfo={setShowBeepCameraFaultInfo}
          showCameraNotFound={showCameraNotFound}
          setShowCameraNotFound={setShowCameraNotFound}
          showBeepAppNotActivePopup={showBeepAppNotActivePopup}
          setShowBeepAppNotActivePopup={setShowBeepAppNotActivePopup}
          setBeepOnAppNotActive={setBeepOnAppNotActive}
          showSilentSwitchPopup={showSilentSwitchPopup}
          setShowSilentSwitchPopup={setShowSilentSwitchPopup}
          closeSilentSwitchPopup={closeSilentSwitchPopup}
          showSmartBorderPopup1={showSmartBorderPopup1}
          handleSmartBorderPopup1Ok={handleSmartBorderPopup1Ok}
          handleSmartBorderPopup1Cancel={handleSmartBorderPopup1Cancel}
          showSmartBorderPopup2={showSmartBorderPopup2}
          handleSmartBorderPopup2Ok={handleSmartBorderPopup2Ok}
          handleSmartBorderPopup2Cancel={handleSmartBorderPopup2Cancel}
          showEnableAlarmAlert={showEnableAlarmAlert}
          currentAlertIndex={currentAlertIndex}
          enableAlarmAlertMessages={enableAlarmAlertMessages}
          handleAlertOk={handleAlertOk}
          handleAlertCancel={handleAlertCancel}
          showQCSection={showQCSection}
          setShowQCSection={setShowQCSection}
          handleQCTitlePressStart={handleQCTitlePressStart}
          handleQCTitlePressEnd={handleQCTitlePressEnd}
          displayData={displayData}
          setDisplayData={setDisplayData}
          rapidTestMode={rapidTestMode}
          setRapidTestMode={setRapidTestMode}
          burningMode={burningMode}
          setBurningMode={setBurningMode}
          minWifiQuality={minWifiQuality}
          setMinWifiQuality={setMinWifiQuality}
          devAWS={devAWS}
          setDevAWS={setDevAWS}
          nightVisionMode={nightVisionMode}
          setNightVisionMode={setNightVisionMode}
          irIlluminatorMode={irIlluminatorMode}
          setIrIlluminatorMode={setIrIlluminatorMode}
          recordMode={recordMode}
          setRecordMode={setRecordMode}
          recordThreshold={recordThreshold}
          setRecordThreshold={setRecordThreshold}
          powerLightFlash={powerLightFlash}
          setPowerLightFlash={setPowerLightFlash}
        />

        
        {/* Push Notification */}
        {showPushNotification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[400px] bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
            <div className="flex items-center gap-4 p-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={homeScreenIcon} 
                  alt="Sami logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="text-white font-semibold text-base mb-1">
                  Sami 3
                </div>
                <div className="text-gray-300 text-sm">
                  Sami is no longer Active.
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Pairing Camera Popup - Main Screen */}
        {showPairingPopup && !showSettings && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg px-12 py-8 text-center">
              <div className="text-white text-2xl font-medium">Pairing Camera</div>
              <div className="mt-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            </div>
          </div>
        )}

        {/* Volume Warning Popup for Camera Fault Beep - Main Screen */}
        {showVolumeWarningPopup && !showSettings && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[500px] overflow-hidden">
              {/* Title */}
              <div className="text-white text-xl font-semibold text-center py-4 border-b border-gray-700">
                Alarm Volume Off
              </div>

              {/* Description */}
              <div className="px-6 py-6">
                <p className="text-white text-center text-lg">
                  You have enabled "Beep on camera fault" but your alarm volume is set to off.
                </p>
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-700 flex flex-col">
                <button
                  onClick={() => {
                    setShowVolumeWarningPopup(false);
                    setBeepOnCameraFault(false);
                    toast('Beep on camera fault is disabled');
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-b border-gray-700 text-red-500"
                >
                  Disable Beep
                </button>
                <button
                  onClick={() => {
                    setShowVolumeWarningPopup(false);
                    setIgnoreCameraFaultWarning(true);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-b border-gray-700"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Ignore
                </button>
                <button
                  onClick={() => {
                    setShowVolumeWarningPopup(false);
                    setAlarmVolume(50);
                    setBeepOnCameraFault(true);
                    toast('Alarm Volume set to 50%');
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Set Volume to 50%
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Archive Confirmation Popup */}
        {showArchiveConfirmPopup && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
              {/* Title */}
              <div className="px-8 pt-6">
                <h2 className="text-white text-2xl font-semibold text-center">
                  Trash {archiveWarningType === 'locked' ? 'Locked' : archiveWarningType === 'alarmed' ? 'Alarmed' : 'Locked/Alarmed'} Video
                </h2>
              </div>

              {/* Description */}
              <div className="px-8 py-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  {archiveIsSingleLocked
                    ? 'Are you sure you want to move this Locked video to the Trash?'
                    : 'One or more of your selected recordings is Locked'}
                </p>
              </div>

              {/* Buttons */}
              {archiveIsSingleLocked ? (
                <div className="border-t border-gray-700 flex flex-row">
                  <button
                    onClick={handleArchiveConfirmCancel}
                    className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-r border-gray-700"
                    style={{ color: SETTINGS_ACCENT_COLOR }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleArchiveConfirmOk}
                    className="flex-1 text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold text-[#B85555]"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-700 flex flex-col">
                  <button
                    onClick={handleArchiveUnlockedOnly}
                    className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-b border-gray-700"
                    style={{ color: SETTINGS_ACCENT_COLOR }}
                  >
                    Trash unlocked only
                  </button>
                  <button
                    onClick={handleArchiveConfirmOk}
                    className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold border-b border-gray-700 text-[#B85555]"
                  >
                    Trash ALL
                  </button>
                  <button
                    onClick={handleArchiveConfirmCancel}
                    className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                    style={{ color: SETTINGS_ACCENT_COLOR }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Storage Warning Popup */}
        {showStoragePopup && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
              {/* Title */}
              <div className="px-8 pt-6">
                <h2 className="text-white text-2xl font-semibold text-center">Out of Storage!</h2>
              </div>

              {/* Description */}
              <div className="px-8 py-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  Your Mobile Device is out of storage space, so recording transfers are disabled. You need to increase the storage limit in settings, activate Auto-Deletion or manually trash some recordings or delete other content from your Mobile Device.
                </p>
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-700 flex flex-col">
                <button
                  onClick={() => {
                    setShowStoragePopup(false);
                    setShowSettings(true);
                    setShowRecordings(false);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-full border-b border-gray-700"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Go to Settings
                </button>
                <button
                  onClick={() => {
                    setShowStoragePopup(false);
                    setShowAutoDeletePopup(true);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-full border-b border-gray-700 text-[#B85555]"
                >
                  Turn on Automatic-Deletion
                </button>
                <button
                  onClick={() => setShowStoragePopup(false)}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-full"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Manually manage storage
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auto-Delete Videos Popup */}
        {showAutoDeletePopup && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
              {/* Title */}
              <div className="px-8 pt-6">
                <h2 className="text-white text-2xl font-semibold text-center">Automatically-Delete Older Videos</h2>
              </div>

              {/* Description */}
              <div className="px-8 py-6">
                <p className="text-white text-lg leading-relaxed text-center">Older-Unlocked Videos will be permanently deleted automatically from the main view when you are out of storage on your Mobile Device. If you don't want to lose a Video, make sure you Lock it. You can turn this functionality off from the Settings View.</p>
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-700 flex">
                <button
                  onClick={() => {
                    setAutoDeleteOlderVideos(true);
                    setShowAutoDeletePopup(false);
                    setShowStorageNotification(false);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-full border-r border-gray-700 text-[#B85555]"
                >
                  OK
                </button>
                <button
                  onClick={() => setShowAutoDeletePopup(false)}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-full"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Backup Locked Videos Popup */}
        {showBackupPopup && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
              {/* Title */}
              <div className="px-8 pt-6">
                <h2 className="text-white text-2xl font-semibold text-center">Backup Locked Videos</h2>
              </div>

              {/* Description */}
              <div className="px-8 py-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  Locked videos will be backed up localy in your mobile files and also to your cloud backup.
                </p>
              </div>

              {/* Button */}
              <div className="border-t border-gray-700">
                <button
                  onClick={() => {
                    setBackupLockedVideos(true);
                    setShowBackupPopup(false);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-full"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WiFi Network Info Popup */}
        {showWifiPopup && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
              {/* Title */}
              <div className="px-8 pt-6">
                <h2 className="text-white text-2xl font-semibold text-center">Device Network Status</h2>
              </div>

              {/* Description */}
              <div className="px-8 py-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  You last connected to your Sami Device on the "{lastConnectedNetwork}" network. Your Device is currently connected to "{currentNetwork}" network. Use the Device Wi-Fi settings to change back to the "{lastConnectedNetwork}" network.
                </p>
              </div>

              {/* Button */}
              <div className="border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowWifiPopup(false);
                    setShowWifiSearchHint(true);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-full"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {showDeleteConfirmation && selectedRecordingIndex !== null && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
              {/* Title */}
              <div className="px-8 pt-6">
                <h2 className="text-white text-2xl font-semibold text-center">Delete Recording</h2>
              </div>

              {/* Description */}
              <div className="px-8 py-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  Are you sure you want to delete this recording? This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-700 flex">
                <button
                  onClick={() => {
                    const selectedRecording = allRecordings.find(r => r.id === selectedRecordingIndex);
                    if (selectedRecording) {
                      setAllRecordings(prev => prev.filter(r => r.id !== selectedRecording.id));
                      setSelectedRecordingIndex(null);
                      setIsVideoPlaying(false);
                      setShowDeletedMessage(true);
                      setTimeout(() => setShowDeletedMessage(false), 3000);
                    }
                    setShowDeleteConfirmation(false);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-1/2 border-r border-gray-700 text-[#B85555]"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-1/2"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Popup */}
        {showBulkDeleteConfirmation && selectedRecordingIds.length > 0 && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
              {/* Title */}
              <div className="px-8 pt-6">
                <h2 className="text-white text-2xl font-semibold text-center">Delete Recordings</h2>
              </div>

              {/* Description */}
              <div className="px-8 py-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  Are you sure you want to permanently delete {selectedRecordingIds.length} recording{selectedRecordingIds.length !== 1 ? 's' : ''}? This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-700 flex">
                <button
                  onClick={() => {
                    setAllRecordings(prev => prev.filter(r => !selectedRecordingIds.includes(r.id)));
                    setSelectedRecordingIds([]);
                    setShowDeletedMessage(true);
                    setTimeout(() => setShowDeletedMessage(false), 3000);
                    setShowBulkDeleteConfirmation(false);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-1/2 border-r border-gray-700 text-[#B85555]"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowBulkDeleteConfirmation(false)}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-1/2"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Single-item Permanent Delete Confirmation Popup */}
        {showSingleDeleteConfirmation && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
              <div className="px-8 pt-6">
                <h2 className="text-white text-2xl font-semibold text-center">Delete Recording</h2>
              </div>
              <div className="px-8 py-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  Are you sure you want to permanently delete this recording? This action cannot be undone.
                </p>
              </div>
              <div className="border-t border-gray-700 flex">
                <button
                  onClick={() => {
                    if (singleDeleteRecordingId !== null) {
                      setAllRecordings(prev => prev.filter(r => r.id !== singleDeleteRecordingId));
                      setSingleDeleteRecordingId(null);
                      setShowDeletedMessage(true);
                      setTimeout(() => setShowDeletedMessage(false), 3000);
                    }
                    setShowSingleDeleteConfirmation(false);
                  }}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-1/2 border-r border-gray-700 text-[#B85555]"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowSingleDeleteConfirmation(false)}
                  className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold w-1/2"
                  style={{ color: SETTINGS_ACCENT_COLOR }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Feed Area */}
        <div className="relative flex-1 overflow-hidden bg-black">
          {/* Baby monitor video feed */}
          <div
            onClick={handleScreenClick}
            className="video-feed-container absolute top-0 left-0 bottom-0 right-28 bg-black flex items-center justify-center cursor-pointer"
          >
            {!cameraPaired ? (
              <div className="flex flex-col items-center justify-center text-center px-8 max-w-md">
                {/* Warning Icon with Circle Background */}
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 border-2 border-[#FFC7BD]">
                  <AlertCircle className="w-10 h-10 text-[#FFC7BD]" />
                </div>

                {/* Text Content */}
                <h2 className="text-2xl text-white mb-3 font-semibold">
                  No camera paired
                </h2>
                <p className="text-base text-gray-400 leading-relaxed">
                  Please go to Device section on settings and configure one.
                </p>
              </div>
            ) : selectedDevice === 'sami-3c: 7812FFA01839' && (
              /* Actual video image wrapper */
              <div className="relative max-w-full max-h-full select-none" draggable="false">
              <img 
                src="https://images.unsplash.com/photo-1644691211587-a0107492ad0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwc2xlZXBpbmclMjBjcmliJTIwYmVkcm9vbSUyMGRhcmt8ZW58MXx8fHwxNzY2NzY0ODU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Baby Monitor Feed"
                draggable="false"
                className="max-w-full max-h-full object-contain block select-none"
                style={{ 
                  filter: 'brightness(0.6) contrast(1.1) saturate(0.3) sepia(0.3) hue-rotate(60deg)',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
              
              {/* Sami logo and Timestamp - top left corner inside video */}
              <div className="absolute top-2 left-2 z-10 flex items-center gap-3 pointer-events-none px-3 py-2 rounded-lg bg-[#5B6C7F]/40 backdrop-blur-sm select-none" draggable="false">
                <img 
                  src={splashLogo} 
                  alt="Sami logo" 
                  draggable="false"
                  className="w-8 h-8 object-contain opacity-40 brightness-0 invert select-none"
                />
                
                {/* Timestamp */}
                <div className="text-white text-lg font-mono opacity-40 select-none" draggable="false">
                  {(() => {
                    const year = currentTimestamp.getFullYear();
                    const month = String(currentTimestamp.getMonth() + 1).padStart(2, '0');
                    const day = String(currentTimestamp.getDate()).padStart(2, '0');
                    const hours = String(currentTimestamp.getHours()).padStart(2, '0');
                    const minutes = String(currentTimestamp.getMinutes()).padStart(2, '0');
                    const seconds = String(currentTimestamp.getSeconds()).padStart(2, '0');
                    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                  })()}
                </div>
              </div>
              
              {/* Night vision overlay effect */}
              <div className="absolute inset-0 bg-app-night-vision mix-blend-overlay pointer-events-none" />
              
              {/* Border overlay - shown when border is active - creates blue overlay with draggable rectangle cutout */}
              {borderActive && (() => {
                const videoContainer = document.querySelector('.video-feed-container');
                if (!videoContainer) return null;
                const containerRect = videoContainer.getBoundingClientRect();
                
                // Convert pixel values to percentages for rendering
                const xPercent = (borderRect.x / containerRect.width) * 100;
                const yPercent = (borderRect.y / containerRect.height) * 100;
                const widthPercent = (borderRect.width / containerRect.width) * 100;
                const heightPercent = (borderRect.height / containerRect.height) * 100;
                
                return (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {/* Blue overlay with cutout using clip-path */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                    <defs>
                      <mask id="border-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect 
                          x={`${xPercent}%`} 
                          y={`${yPercent}%`} 
                          width={`${widthPercent}%`} 
                          height={`${heightPercent}%`} 
                          fill="black"
                        />
                      </mask>
                    </defs>
                    <rect 
                      x="0" 
                      y="0" 
                      width="100%" 
                      height="100%" 
                      fill="rgba(91, 139, 191, 0.5)" 
                      mask="url(#border-mask)"
                    />
                  </svg>

                  {/* Draggable rectangle area */}
                  <div
                    className="absolute border-2 border-app-cyan-60 pointer-events-auto cursor-move"
                    style={{
                      left: `${xPercent}%`,
                      top: `${yPercent}%`,
                      width: `${widthPercent}%`,
                      height: `${heightPercent}%`,
                    }}
                    onMouseDown={handleRectDragStart}
                    onTouchStart={handleRectDragStart}
                  >
                    {/* Corner drag handles */}
                    <div
                      className="absolute top-0 left-0 w-4 h-4 rounded-full bg-white border-2 border-app-cyan-60 cursor-nwse-resize pointer-events-auto -translate-x-1/2 -translate-y-1/2"
                      onMouseDown={(e) => handleCornerDragStart('top-left', e)}
                      onTouchStart={(e) => handleCornerDragStart('top-left', e)}
                    />
                    <div
                      className="absolute top-0 right-0 w-4 h-4 rounded-full bg-white border-2 border-app-cyan-60 cursor-nesw-resize pointer-events-auto translate-x-1/2 -translate-y-1/2"
                      onMouseDown={(e) => handleCornerDragStart('top-right', e)}
                      onTouchStart={(e) => handleCornerDragStart('top-right', e)}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-4 h-4 rounded-full bg-white border-2 border-app-cyan-60 cursor-nesw-resize pointer-events-auto -translate-x-1/2 translate-y-1/2"
                      onMouseDown={(e) => handleCornerDragStart('bottom-left', e)}
                      onTouchStart={(e) => handleCornerDragStart('bottom-left', e)}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-white border-2 border-app-cyan-60 cursor-nwse-resize pointer-events-auto translate-x-1/2 translate-y-1/2"
                      onMouseDown={(e) => handleCornerDragStart('bottom-right', e)}
                      onTouchStart={(e) => handleCornerDragStart('bottom-right', e)}
                    />
                  </div>
                </div>
                );
              })()}
              </div>
            )}
          </div>

          {/* Motion detection overlay - red shadow on moving objects */}
          {motionActive && (() => {
            // Check if motion is inside the border area
            const videoContainer = document.querySelector('.video-feed-container');
            let isInsideBorder = true;

            if (borderActive && videoContainer) {
              const containerRect = videoContainer.getBoundingClientRect();
              const motionCenterX = containerRect.width / 2;
              const motionCenterY = containerRect.height / 2;

              // Check if motion center is inside the border rectangle
              isInsideBorder = (
                motionCenterX >= borderRect.x &&
                motionCenterX <= borderRect.x + borderRect.width &&
                motionCenterY >= borderRect.y &&
                motionCenterY <= borderRect.y + borderRect.height
              );
            }

            const motionColor = borderActive && !isInsideBorder ? '#BFE3D9' : '#B85555';

            return (
              <div className="absolute top-0 left-0 bottom-0 right-28 z-10 pointer-events-none">
                {/* Red or green glow around baby/moving object area - center of the image */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                  style={{
                    border: `4px solid ${motionColor}`,
                    animation: 'motionPulse 2s ease-in-out infinite'
                  }}
                />
              </div>
            );
          })()}

          {/* Border hint text - shown for 15 seconds when border is activated */}
          {showBorderHint && (
            <div className="absolute bottom-40 z-15 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg pointer-events-none" style={{ left: 'calc((100% - 7rem) / 2)', transform: 'translateX(-50%)' }}>
              <span className="text-black">Drag to adjust Active Monitored area</span>
            </div>
          )}

          {/* Border saved hint text - shown for 3 seconds when border is deactivated */}
          {showBorderSavedHint && (
            <div className="absolute bottom-40 z-15 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg pointer-events-none" style={{ left: 'calc((100% - 7rem) / 2)', transform: 'translateX(-50%)' }}>
              <span className="text-black">Border settings saved!</span>
            </div>
          )}

          {/* Motion hint text - shown for 15 seconds when motion is activated */}
          {showMotionHint && (
            <div className="absolute bottom-40 z-15 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg pointer-events-none" style={{ left: 'calc((100% - 7rem) / 2)', transform: 'translateX(-50%)' }}>
              <span className="text-black">Displaying motion in red...</span>
            </div>
          )}

          {/* WiFi search hint text - shown for 10 seconds after clicking OK on wifi popup */}
          {showWifiSearchHint && (
            <div className="absolute bottom-40 z-15 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg pointer-events-none" style={{ left: 'calc((100% - 7rem) / 2)', transform: 'translateX(-50%)' }}>
              <span className="text-black">Searching for Sami camera on {lastConnectedNetwork}</span>
            </div>
          )}

          {/* Hold hint text - shown when hold is activated */}
          {showHoldHint && (
            <div className="absolute bottom-40 z-15 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg pointer-events-none" style={{ left: 'calc((100% - 7rem) / 2)', transform: 'translateX(-50%)' }}>
              <span className="text-black">Hold for one second to turn alarm off</span>
            </div>
          )}

          {/* Alarm disabled hint text - shown when clicking disabled alarm button */}
          {showAlarmDisabledHint && (
            <div className="absolute bottom-40 z-15 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg pointer-events-none" style={{ left: 'calc((100% - 7rem) / 2)', transform: 'translateX(-50%)' }}>
              <span className="text-black">Alarm Disabled in Settings</span>
            </div>
          )}

          {/* Slide to Unlock - shown when locked */}
          {isLocked && !isSleeping && (
            <div className="absolute bottom-8 left-1/3 right-1/3 z-20">
              <div 
                id="unlock-slider"
                className="relative h-16 bg-gray-900/60 backdrop-blur-sm rounded-full overflow-hidden cursor-pointer select-none border-2 border-gray-600/50"
                onMouseMove={handleSliderMove}
                onMouseUp={handleSliderEnd}
                onMouseLeave={handleSliderEnd}
                onTouchMove={handleSliderMove}
                onTouchEnd={handleSliderEnd}
              >
                {/* Progress fill */}
                <div 
                  className="absolute left-0 top-0 bottom-0 h-full rounded-full transition-all duration-100"
                  style={{ 
                    width: `${sliderPosition}%`,
                    background: 'linear-gradient(90deg, #6BA3D4 0%, #283891 100%)',
                    opacity: 0.3
                  }}
                />
                
                {/* Slider button */}
                <div 
                  className="absolute left-0 top-0 bottom-0 h-full rounded-full flex items-center justify-center transition-all duration-100"
                  style={{ 
                    width: `${Math.max(25, sliderPosition)}%`,
                    minWidth: '64px',
                    background: 'linear-gradient(135deg, #6BA3D4 0%, #5890c0 100%)',
                    boxShadow: '0 4px 12px rgba(107, 163, 212, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseDown={handleSliderStart}
                  onTouchStart={handleSliderStart}
                >
                  <ArrowBigRight className="w-14 h-14 text-white fill-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                </div>
                
                {/* Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white text-xl font-medium tracking-wide" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    Slide to unlock
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Unlock message - shown after unlocking */}
          {showUnlockMessage && (
            <div className="absolute bottom-40 z-15 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg pointer-events-none" style={{ left: 'calc((100% - 7rem) / 2)', transform: 'translateX(-50%)' }}>
              <span className="text-black">Display unlocked</span>
            </div>
          )}

          {/* Camera Connection Signal - top right corner */}
          <div className="absolute top-3 right-32 flex items-center gap-4 z-10 px-3 py-2 rounded-lg bg-[#5B6C7F]/80 backdrop-blur-sm select-none">
            {/* REC indicator */}
            <RecordingIcon />
            
            {/* Wifi icon */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowWifiPopup(true);
              }}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <AnimatedWifiIcon />
            </button>
          </div>

          {/* Microphone Volume Control - right side, appears when mic is on */}
          {showVolumePicker && (
            <div 
              ref={volumePickerRef}
              className="absolute right-32 bottom-[145px] z-10 flex flex-row items-center gap-3 px-6 py-4 rounded-2xl bg-[#5B6C7F]/80 backdrop-blur-sm select-none"
              onMouseMove={handleVolumePickerInteraction}
              onClick={handleVolumePickerInteraction}
            >
              {/* Mic icon at left */}
              <Mic className="w-6 h-6 text-white" style={{ color: micVolume === 0 ? '#FCEAAD' : '#BFE3D9' }} />
              
              {/* Volume slider */}
              <div className="relative flex flex-row items-center">
                <div 
                  className="relative h-3 w-40 bg-[#2C3B4A] rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    setMicVolume(percentage);
                    handleVolumePickerInteraction();
                  }}
                >
                  {/* Filled portion */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-150"
                    style={{ width: `${micVolume}%`, backgroundColor: micVolume === 0 ? '#FCEAAD' : '#BFE3D9' }}
                  />
                  {/* Circular thumb */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-150 cursor-grab active:cursor-grabbing"
                    style={{ left: `calc(${micVolume}% - 10px)` }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleVolumePickerInteraction();
                      const slider = e.currentTarget.parentElement;
                      if (!slider) return;
                      
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const rect = slider.getBoundingClientRect();
                        const x = moveEvent.clientX - rect.left;
                        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                        setMicVolume(percentage);
                        handleVolumePickerInteraction();
                      };
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                </div>
              </div>
              
              {/* Volume percentage label */}
              <span className="text-white text-sm font-medium w-12 text-right">{Math.round(micVolume)}%</span>
            </div>
          )}

          {/* Right side control panel */}
          <div className={`absolute top-0 right-0 h-full flex flex-col items-center justify-between py-3 px-3 z-10 w-28 transition-opacity bg-[#2C3B4A] select-none ${
            isLocked ? 'pointer-events-none opacity-50' : ''
          }`}>
            {/* Mute Alarm Button - shown after 5 seconds of alarm simulation */}
            {showMuteButton && (
              <button
                onClick={handleMuteAlarm}
                className="absolute inset-0 w-full h-full flex items-center justify-center z-20 transition-colors duration-500"
                style={{
                  animation: 'muteButtonPulse 1s ease-in-out infinite'
                }}
              >
                <span className="text-white text-3xl font-bold tracking-wide">Mute Alarm</span>
              </button>
            )}

            {/* Off button at top */}
            <button
              onClick={handleCameraButtonClick}
              onMouseDown={enableAlarm && cameraPaired ? handleAlarmPressStart : undefined}
              onMouseUp={enableAlarm && cameraPaired ? handleAlarmPressEnd : undefined}
              onMouseLeave={enableAlarm && cameraPaired ? handleAlarmPressEnd : undefined}
              onTouchStart={enableAlarm && cameraPaired ? handleAlarmPressStart : undefined}
              onTouchEnd={enableAlarm && cameraPaired ? handleAlarmPressEnd : undefined}
              className={`w-full px-3 py-2 rounded-xl transition-all flex flex-col items-center justify-center h-20 ${
                !cameraPaired || !enableAlarm
                  ? 'bg-gray-600 text-white cursor-not-allowed'
                  : isPaused
                    ? 'bg-[#FCEAAD] text-white'
                    : cameraOn
                      ? 'bg-app-teal text-white'
                      : 'bg-app-coral text-white'
              }`}
            >
              {!cameraPaired || !enableAlarm ? (
                <>
                  <Bell className="w-8 h-8 mb-1" />
                  <span className="text-base">Off</span>
                </>
              ) : isPaused ? (
                <>
                  <span className="text-base font-bold" style={{ color: '#2C3B4A' }}>Paused</span>
                  <span className="text-xs mt-1" style={{ color: '#2C3B4A' }}>
                    {isWaitingForNoMotion ? 'Waiting for no motion' : `On in ${formatCountdown(countdown)}`}
                  </span>
                </>
              ) : cameraOn ? (
                <>
                  <Bell className="w-8 h-8 mb-1" style={{ color: '#2C3B4A' }} />
                  <span className="text-base" style={{ color: '#2C3B4A' }}>{isHoldingAlarm ? 'HOLD' : 'On'}</span>
                </>
              ) : (
                <>
                  <Bell className="w-8 h-8 mb-1" />
                  <span className="text-base">Off</span>
                </>
              )}
            </button>

            {/* Two sliders side by side */}
            <div className="flex gap-6 items-center justify-center">
              {/* Movement Meter Slider (Green) */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-2 h-72 bg-[#5B6C7E] rounded-full overflow-hidden">
                  {/* Filled portion */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 rounded-full transition-all"
                    style={{ height: `${volumeLevel}%`, backgroundColor: '#BFE3D9' }}
                  />
                </div>
                
                {/* Triangle threshold picker - outside on the left */}
                <div 
                  className="absolute right-0 transition-all z-10"
                  style={{ 
                    top: `${100 - movementThreshold}%`,
                    transform: 'translate(calc(70% - 3px), calc(-50% + 63px))'
                  }}
                >
                  <div className="relative">
                    <svg width="10" height="12" viewBox="0 0 10 12" className="text-white">
                      <polygon points="0,6 10,0 10,12" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                
                {/* Motion icon at bottom */}
                <div className="mt-2">
                  <MotionDetectionIcon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Time Detection Slider (Coral Red) */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-2 h-72 bg-[#5B6C7E] rounded-full overflow-hidden">
                  {/* Filled portion */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-full transition-all"
                    style={{ height: `${sensitivityLevel}%`, backgroundColor: '#FFC7BD' }}
                  />
                </div>
                
                {/* Triangle threshold picker - outside on the left */}
                <div 
                  className="absolute right-0 transition-all z-10"
                  style={{ 
                    top: `${100 - timeThreshold}%`,
                    transform: 'translate(calc(70% - 3px), calc(-50% + 63px))'
                  }}
                >
                  <div className="relative">
                    <svg width="10" height="12" viewBox="0 0 10 12" className="text-white">
                      <polygon points="0,6 10,0 10,12" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                
                {/* Bell/Alarm icon at bottom */}
                <div className="mt-2">
                  <Bell className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Mic button at bottom */}
            <button 
              ref={micButtonRef}
              onClick={() => {
                // Clear any auto-off timer when user manually interacts with mic button
                if (micAutoOffTimer) {
                  clearTimeout(micAutoOffTimer);
                  setMicAutoOffTimer(null);
                }
                
                if (!micOn) {
                  // Mic is off, turn it on and show picker
                  setMicOn(true);
                  setShowVolumePicker(true);
                } else if (showVolumePicker) {
                  // Mic is on and picker is visible, turn off mic and hide picker
                  setMicOn(false);
                  setShowVolumePicker(false);
                } else {
                  // Mic is on but picker is hidden, show picker
                  setShowVolumePicker(true);
                }
              }}
              className={`w-full h-20 px-3 rounded-xl transition-all flex flex-col items-center justify-center ${
                micOn ? 'text-white' : 'bg-[#5B6C7E] text-white'
              }`}
              style={micOn ? { backgroundColor: micVolume === 0 ? '#FCEAAD' : '#BFE3D9' } : {}}
            >
              {micOn ? (
                <Mic className="w-8 h-8 mb-1" style={{ color: micVolume === 0 ? '#FFFFFF' : '#2C3B4A' }} />
              ) : (
                <MicOff className="w-8 h-8 mb-1" />
              )}
              <span className="text-base" style={micOn && micVolume !== 0 ? { color: '#2C3B4A' } : {}}>Mic</span>
            </button>

            {/* Settings button - triggers bottom panel */}
            <button 
              onClick={handleUserActivity}
              className="w-full h-16 transition-all flex items-center justify-center text-white"
            >
              <Settings className="w-8 h-8" />
            </button>
          </div>

          {/* Bottom Navigation Bar - Overlay at bottom */}
          <AnimatePresence>
            {!isLocked && showBottomPanel && !showMuteButton && (
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 bg-[#2C3B4A] z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-around gap-3 py-3 px-3">
                  <button 
                    onClick={() => setShowClock(!showClock)}
                    className="w-36 h-[90px] rounded-xl bg-[#5B6C7E] flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <Clock className="w-10 h-10 text-white" />
                    <span className="text-sm text-white/80">Clock</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!cameraPaired) return;
                      const newState = !borderActive;
                      // Show "Border settings saved!" message when turning off
                      if (borderActive && !newState) {
                        setShowBorderSavedHint(true);
                        // Hide other hints
                        setShowBorderHint(false);
                        setShowMotionHint(false);
                        setShowHoldHint(false);
                        setShowUnlockMessage(false);
                        setShowAlarmDisabledHint(false);
                        setTimeout(() => {
                          setShowBorderSavedHint(false);
                        }, 10000); // Show for 10 seconds
                      }
                      setBorderActive(newState);
                    }}
                    disabled={!cameraPaired}
                    className={`w-36 h-[90px] rounded-xl flex flex-col items-center justify-center gap-2 transition-colors ${
                      !cameraPaired
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : borderActive
                          ? 'bg-app-cyan'
                          : 'bg-[#5B6C7E]'
                    }`}
                  >
                    <ScanFace className="w-10 h-10 text-white" />
                    <span className="text-sm text-white/80">Border</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!cameraPaired) return;
                      setMotionActive(!motionActive);
                    }}
                    disabled={!cameraPaired}
                    className={`w-36 h-[90px] rounded-xl flex flex-col items-center justify-center gap-2 transition-colors ${
                      !cameraPaired
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : motionActive
                          ? 'bg-app-cyan'
                          : 'bg-[#5B6C7E]'
                    }`}
                  >
                    <MotionDetectionIcon className="w-10 h-10 text-white" />
                    <span className="text-sm text-white/80">Motion</span>
                  </button>

                  <button 
                    onClick={handleLockToggle}
                    className="w-36 h-[90px] rounded-xl bg-[#5B6C7E] flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <Lock className="w-10 h-10 text-white" />
                    <span className="text-sm text-white/80">Lock</span>
                  </button>

                  <button 
                    onClick={() => setShowRecordings(!showRecordings)}
                    className="w-36 h-[90px] rounded-xl bg-[#5B6C7E] flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <Video className="w-10 h-10 text-white" />
                    <span className="text-sm text-white/80">Recordings</span>
                  </button>

                  <button 
                    onClick={() => setShowHelp(!showHelp)}
                    className="w-36 h-[90px] rounded-xl bg-[#5B6C7E] flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <CircleHelp className="w-10 h-10 text-white" />
                    <span className="text-sm text-white/80">Help</span>
                  </button>

                  <button 
                    onClick={() => {
                      setShowSettings(!showSettings);
                    }}
                    className="w-36 h-[90px] rounded-xl bg-[#5B6C7E] flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <Settings className="w-10 h-10 text-white" />
                    <span className="text-sm text-white/80">Settings</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Toaster
        position="bottom-center"
        offset="10rem"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#000000',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            boxShadow: 'none',
          },
        }}
      />
    </div>
  );
}

// Prototype-only control — not part of the designed app itself.
// Stays fixed in the top-left corner across every screen of the prototype.
function PrototypeLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      router.replace('/login');
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="fixed top-6 left-6 z-[9999] text-gray-500 hover:text-white transition-colors text-lg disabled:opacity-60"
    >
      {isLoggingOut ? 'Saliendo...' : 'Logout'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <PrototypeLogoutButton />
      <AppContent />
    </>
  );
}

// Helper component for app icons
function AppIcon({ name, color, Icon }: { name: string; color: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-12 h-12 text-white" />
      </div>
      <span className="text-white text-xs text-center font-medium drop-shadow-md">{name}</span>
    </div>
  );
}

// Helper component for dock app icons
function DockAppIcon({ name, color, Icon }: { name: string; color: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-10 h-10 text-white" />
      </div>
    </div>
  );
}