import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Calendar, Bell, History, Trash2, HardDrive, Lock, Filter, X, Archive, Play, Pause, SkipBack, SkipForward, AlertCircle, RotateCcw, Check, Camera, Activity, Share2 } from 'lucide-react';
const splashLogo = '/assets/9c5d45d1fb550fd85085fcd4ca7fbc0d2661c54c.png';

const SETTINGS_ACCENT_COLOR = '#5A8BBF';

type Recording = {
  id: number;
  timestamp: Date;
  title: string;
  camera: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  hasAlarm: boolean;
  isLocked: boolean;
  isArchived: boolean;
  watchProgress: number;
};

export interface RecordingsScreenProps {
  // Navigation
  showRecordings: boolean;
  setShowRecordings: (v: boolean) => void;

  // Recording data
  allRecordings: Recording[];
  setAllRecordings: React.Dispatch<React.SetStateAction<Recording[]>>;
  currentRecordings: Recording[];
  groupedRecordings: { [monthKey: string]: { [dateKey: string]: Recording[] } };

  // Video player state
  selectedRecordingIndex: number | null;
  setSelectedRecordingIndex: (v: number | null) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (v: boolean) => void;

  // Download state
  isDownloadingRecording: boolean;
  setIsDownloadingRecording: (v: boolean) => void;
  downloadProgress: number;
  setDownloadProgress: (v: number) => void;
  downloadedRecordingIds: Set<number>;
  setDownloadedRecordingIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  downloadingRecordingIds: Map<number, number>;
  setDownloadingRecordingIds: React.Dispatch<React.SetStateAction<Map<number, number>>>;
  activeDownloadInterval: NodeJS.Timeout | null;
  setActiveDownloadInterval: (v: NodeJS.Timeout | null) => void;
  showDownloadError: boolean;
  setShowDownloadError: (v: boolean) => void;

  // Edit mode
  isEditingRecordings: boolean;
  setIsEditingRecordings: (v: boolean) => void;
  selectedRecordingIds: number[];
  setSelectedRecordingIds: (v: number[]) => void;

  // Archive/trash
  showArchivedSection: boolean;
  setShowArchivedSection: (v: boolean) => void;
  showArchivedMessage: boolean;
  setShowArchivedMessage: (v: boolean) => void;
  showUnarchivedMessage: boolean;
  setShowUnarchivedMessage: (v: boolean) => void;
  showDeletedMessage: boolean;
  setShowDeletedMessage: (v: boolean) => void;
  showArchiveConfirmPopup: boolean;
  setShowArchiveConfirmPopup: (v: boolean) => void;
  archiveWarningType: 'locked' | 'alarmed' | 'locked/alarmed';
  setArchiveWarningType: (v: 'locked' | 'alarmed' | 'locked/alarmed') => void;
  archiveIsSingleLocked: boolean;
  setArchiveIsSingleLocked: (v: boolean) => void;
  handleArchiveConfirmOk: () => void;
  handleArchiveConfirmCancel: () => void;
  handleArchiveUnlockedOnly: () => void;

  // Delete confirmation
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: (v: boolean) => void;
  showBulkDeleteConfirmation: boolean;
  setShowBulkDeleteConfirmation: (v: boolean) => void;
  showSingleDeleteConfirmation: boolean;
  setShowSingleDeleteConfirmation: (v: boolean) => void;
  singleDeleteRecordingId: number | null;
  setSingleDeleteRecordingId: (v: number | null) => void;

  // Filters & grouping
  activeFilters: { alarmOnly: boolean; lockedOnly: boolean; longVideosOnly: boolean; last24Hours: boolean };
  setActiveFilters: (v: { alarmOnly: boolean; lockedOnly: boolean; longVideosOnly: boolean; last24Hours: boolean }) => void;
  collapsedDateGroups: Set<string>;
  setCollapsedDateGroups: (v: Set<string>) => void;
  collapsedMonthGroups: Set<string>;
  setCollapsedMonthGroups: (v: Set<string>) => void;

  // Storage
  showStorageNotification: boolean;
  setShowStorageNotification: (v: boolean) => void;
  showStoragePopup: boolean;
  setShowStoragePopup: (v: boolean) => void;
  showAutoDeletePopup: boolean;
  setShowAutoDeletePopup: (v: boolean) => void;
  autoDeleteOlderVideos: boolean;
  setAutoDeleteOlderVideos: (v: boolean) => void;

  // Swipe state for regular recordings
  swipedRecordingId: number | null;
  setSwipedRecordingId: (v: number | null) => void;
  swipeOffset: number;
  setSwipeOffset: (v: number) => void;
  swipeStartX: React.MutableRefObject<number>;
  currentSwipeOffset: React.MutableRefObject<number>;
  hasSwipedRef: React.MutableRefObject<boolean>;

  // Swipe state for trashed recordings
  trashedSwipedId: number | null;
  setTrashedSwipedId: (v: number | null) => void;
  trashedSwipeOffset: number;
  setTrashedSwipeOffset: (v: number) => void;
  trashedSwipeStartX: React.MutableRefObject<number>;
  trashedCurrentSwipeOffset: React.MutableRefObject<number>;
  trashedHasSwipedRef: React.MutableRefObject<boolean>;
}

export function RecordingsScreen({
  showRecordings,
  setShowRecordings,
  allRecordings,
  setAllRecordings,
  currentRecordings,
  groupedRecordings,
  selectedRecordingIndex,
  setSelectedRecordingIndex,
  isVideoPlaying,
  setIsVideoPlaying,
  isDownloadingRecording,
  setIsDownloadingRecording,
  downloadProgress,
  setDownloadProgress,
  downloadedRecordingIds,
  setDownloadedRecordingIds,
  downloadingRecordingIds,
  setDownloadingRecordingIds,
  activeDownloadInterval,
  setActiveDownloadInterval,
  showDownloadError,
  setShowDownloadError,
  isEditingRecordings,
  setIsEditingRecordings,
  selectedRecordingIds,
  setSelectedRecordingIds,
  showArchivedSection,
  setShowArchivedSection,
  showArchivedMessage,
  setShowArchivedMessage,
  showUnarchivedMessage,
  setShowUnarchivedMessage,
  showDeletedMessage,
  setShowDeletedMessage,
  showArchiveConfirmPopup,
  setShowArchiveConfirmPopup,
  archiveWarningType,
  setArchiveWarningType,
  archiveIsSingleLocked,
  setArchiveIsSingleLocked,
  handleArchiveConfirmOk,
  handleArchiveConfirmCancel,
  handleArchiveUnlockedOnly,
  showDeleteConfirmation,
  setShowDeleteConfirmation,
  showBulkDeleteConfirmation,
  setShowBulkDeleteConfirmation,
  showSingleDeleteConfirmation,
  setShowSingleDeleteConfirmation,
  singleDeleteRecordingId,
  setSingleDeleteRecordingId,
  activeFilters,
  setActiveFilters,
  collapsedDateGroups,
  setCollapsedDateGroups,
  collapsedMonthGroups,
  setCollapsedMonthGroups,
  showStorageNotification,
  setShowStorageNotification,
  showStoragePopup,
  setShowStoragePopup,
  showAutoDeletePopup,
  setShowAutoDeletePopup,
  autoDeleteOlderVideos,
  setAutoDeleteOlderVideos,
  swipedRecordingId,
  setSwipedRecordingId,
  swipeOffset,
  setSwipeOffset,
  swipeStartX,
  currentSwipeOffset,
  hasSwipedRef,
  trashedSwipedId,
  setTrashedSwipedId,
  trashedSwipeOffset,
  setTrashedSwipeOffset,
  trashedSwipeStartX,
  trashedCurrentSwipeOffset,
  trashedHasSwipedRef,
}: RecordingsScreenProps) {
  if (!showRecordings) return null;

  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareProgress, setShareProgress] = useState(0);
  const shareIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startShare = () => {
    setShareProgress(0);
    setShowSharePopup(true);
    const startTime = Date.now();
    shareIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / 5000) * 100), 100);
      setShareProgress(pct);
      if (pct >= 100) {
        clearInterval(shareIntervalRef.current!);
        setShowSharePopup(false);
      }
    }, 50);
  };

  const cancelShare = () => {
    if (shareIntervalRef.current) clearInterval(shareIntervalRef.current);
    setShowSharePopup(false);
    setShareProgress(0);
  };

  return (
    <div className="absolute inset-0 bg-black z-30 flex flex-col">
      {selectedRecordingIndex !== null ? (
        /* Video Player View */
        (() => {
          const selectedRecording = currentRecordings.find(r => r.id === selectedRecordingIndex);
          const currentIndex = currentRecordings.findIndex(r => r.id === selectedRecordingIndex);
          if (!selectedRecording) return null;

          return (
            <>
              {/* Top black bar */}
              <div className="bg-black py-4 flex items-center justify-between px-6">
                <button
                  onClick={() => {
                    // Set watch progress when returning to list (only if not downloading)
                    if (!isDownloadingRecording) {
                      const randomProgress = Math.floor(Math.random() * 61) + 30; // 30-90%
                      setAllRecordings(prev => prev.map(r =>
                        r.id === selectedRecording.id ? { ...r, watchProgress: randomProgress } : r
                      ));
                    }
                    // Return to list view (download continues in background)
                    setSelectedRecordingIndex(null);
                    setIsVideoPlaying(false);
                    setIsDownloadingRecording(false);
                    setShowDownloadError(false);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>{showArchivedSection ? 'Trashed' : 'Recordings'}</span>
                </button>

                <span className="text-white text-base font-medium">
                  {showArchivedSection
                    ? (() => {
                        const date = new Date(selectedRecording.timestamp);
                        const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        let hour = date.getHours();
                        const minute = date.getMinutes();
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        hour = hour % 12 || 12;
                        const timeStr = `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
                        return (
                          <>
                            <span className="text-[#B95555]">Trashed</span>: {dateStr} {timeStr}
                          </>
                        );
                      })()
                    : selectedRecording.title
                  }
                </span>

                <div className="w-24" />
              </div>

              {/* Video display area */}
              <div className="bg-black relative flex items-center justify-center gap-6 py-4" style={{ height: '80vh' }}>
                {/* Video image wrapper - 4:3 aspect ratio */}
                <div className="relative h-full" style={{ aspectRatio: '4/3' }}>
                  {isDownloadingRecording ? (
                    /* Downloading state */
                    <div
                      className="w-full h-full bg-gray-900 flex flex-col items-center justify-center gap-6 cursor-pointer"
                      onClick={() => {
                        // Pause download and show error
                        if (activeDownloadInterval) {
                          clearInterval(activeDownloadInterval);
                          setActiveDownloadInterval(null);
                        }
                        setShowDownloadError(true);
                      }}
                    >
                      <h2 className="text-3xl text-white font-medium">Downloading...</h2>

                      <h3 className="text-xl text-gray-400">Downloading from Camera</h3>

                      <p className="text-lg text-[#BFE3D9]">
                        {downloadProgress}%
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full max-w-xs bg-gray-800 rounded-full h-3 overflow-hidden border border-[#FCEAAD]/30">
                        <div
                          className="bg-[#FCEAAD] h-full rounded-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>

                      <p className="text-sm text-gray-400 mt-2">
                        This may take a moment
                      </p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={selectedRecording.thumbnail}
                        alt="Recording"
                        className="w-full h-full object-cover"
                        style={{
                          filter: 'brightness(0.6) contrast(1.1) saturate(0.3) sepia(0.3) hue-rotate(60deg)'
                        }}
                      />

                      {/* Night vision overlay */}
                      <div className="absolute inset-0 bg-app-night-vision mix-blend-overlay pointer-events-none" />

                      {/* Archived overlay indicator */}
                      {showArchivedSection && (
                        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                      )}
                    </>
                  )}

                  {/* Sami logo and Timestamp - top left corner inside video */}
                  {!isDownloadingRecording && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-3 pointer-events-none px-3 py-2 rounded-lg bg-[#5B6C7F]/40 backdrop-blur-sm">
                      <img
                        src={splashLogo}
                        alt="Sami logo"
                        className="w-8 h-8 object-contain opacity-40 brightness-0 invert"
                      />

                      {/* Timestamp */}
                      <div className="text-white text-lg font-mono opacity-40">
                        {(() => {
                          const date = new Date(selectedRecording.timestamp);
                          const year = date.getFullYear();
                          const month = (date.getMonth() + 1).toString().padStart(2, '0');
                          const day = date.getDate().toString().padStart(2, '0');
                          const hour = date.getHours().toString().padStart(2, '0');
                          const minute = date.getMinutes().toString().padStart(2, '0');
                          const second = date.getSeconds().toString().padStart(2, '0');
                          return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Video Player Controls - Bottom Center */}
                  {!isDownloadingRecording && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center gap-3">
                      {/* Previous Button */}
                      <button
                        onClick={() => {
                          if (currentIndex < currentRecordings.length - 1) {
                            setSelectedRecordingIndex(currentRecordings[currentIndex + 1].id);
                            setIsVideoPlaying(false);
                          }
                        }}
                        disabled={currentIndex === currentRecordings.length - 1}
                        className={`p-3 rounded-full transition-all backdrop-blur-sm ${
                          currentIndex === currentRecordings.length - 1
                            ? 'bg-black/20 text-gray-600 cursor-not-allowed'
                            : 'bg-black/50 text-white hover:bg-black/60'
                        }`}
                        title="Previous video"
                      >
                        <SkipBack className="w-6 h-6" />
                      </button>

                      {/* Play/Pause Button */}
                      <button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="p-3.5 rounded-full bg-white/70 hover:bg-white/80 transition-all backdrop-blur-sm shadow-lg"
                        title={isVideoPlaying ? 'Pause' : 'Play'}
                      >
                        {isVideoPlaying ? (
                          <Pause className="w-7 h-7 text-gray-900" />
                        ) : (
                          <Play className="w-7 h-7 text-gray-900 ml-0.5" />
                        )}
                      </button>

                      {/* Next Button */}
                      <button
                        onClick={() => {
                          if (currentIndex > 0) {
                            setSelectedRecordingIndex(currentRecordings[currentIndex - 1].id);
                            setIsVideoPlaying(false);
                          }
                        }}
                        disabled={currentIndex === 0}
                        className={`p-3 rounded-full transition-all backdrop-blur-sm ${
                          currentIndex === 0
                            ? 'bg-black/20 text-gray-600 cursor-not-allowed'
                            : 'bg-black/50 text-white hover:bg-black/60'
                        }`}
                        title="Next video"
                      >
                        <SkipForward className="w-6 h-6" />
                      </button>
                    </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Action Buttons and Tags */}
              <div className="bg-gray-900 border-t border-gray-700 px-6 py-4 flex items-center justify-between -mt-2">
                {/* Left side: Action buttons */}
                <div className="flex items-center gap-3 ml-5">
                  <button
                    onClick={() => startShare()}
                    disabled={isDownloadingRecording}
                    className={`px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 ${
                      isDownloadingRecording
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-[#5A8BBF] hover:bg-[#5A8BBF]/90 text-white'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Share</span>
                  </button>
                  {showArchivedSection ? (
                    <>
                      <button
                        onClick={() => {
                          setAllRecordings(prev => prev.map(r =>
                            r.id === selectedRecording.id ? { ...r, isArchived: false } : r
                          ));
                          setSelectedRecordingIndex(null);
                          setIsVideoPlaying(false);
                          setShowArchivedSection(false);
                          setShowUnarchivedMessage(true);
                          setTimeout(() => setShowUnarchivedMessage(false), 3000);
                        }}
                        disabled={isDownloadingRecording}
                        className={`px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 ${
                          isDownloadingRecording
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-[#BFE3D9] hover:bg-[#BFE3D9]/90 text-[#2C3B4A]'
                        }`}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm font-semibold">Restore</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirmation(true);
                        }}
                        disabled={isDownloadingRecording}
                        className={`px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 ${
                          isDownloadingRecording
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-[#B85555] hover:bg-[#B85555]/90 text-white'
                        }`}
                      >
                        <X className="w-4 h-4" />
                        <span className="text-sm font-semibold">Delete</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        // Check if video is locked
                        if (selectedRecording.isLocked) {
                          setArchiveWarningType('locked');
                          setArchiveIsSingleLocked(true);
                          setShowArchiveConfirmPopup(true);
                        } else {
                          const randomProgress = Math.floor(Math.random() * 61) + 30; // 30-90%
                          setAllRecordings(prev => prev.map(r =>
                            r.id === selectedRecording.id ? { ...r, isArchived: true, watchProgress: randomProgress } : r
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
                      }}
                      disabled={isDownloadingRecording}
                      className={`px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 ${
                        isDownloadingRecording
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#B95555] hover:bg-[#B95555]/90 text-white'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">Trash</span>
                    </button>
                  )}
                </div>

                {/* Right side: Tags */}
                <div className="flex items-center gap-3 mr-5">
                  <span className="text-gray-400 text-sm font-medium">Tags:</span>
                  <button
                    onClick={() => {
                      setAllRecordings(prev => prev.map(r =>
                        r.id === selectedRecording.id ? { ...r, isLocked: !r.isLocked } : r
                      ));
                    }}
                    disabled={isDownloadingRecording}
                    className={`px-3 py-1.5 rounded-full transition-all backdrop-blur-sm flex items-center gap-1.5 ${
                      isDownloadingRecording
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : selectedRecording.isLocked
                        ? 'bg-[#FFC7BD]/90 hover:bg-[#FFC7BD] text-gray-900'
                        : 'bg-white/30 hover:bg-white/40 text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{selectedRecording.isLocked ? 'Locked' : 'Lock'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setAllRecordings(prev => prev.map(r =>
                        r.id === selectedRecording.id ? { ...r, hasAlarm: !r.hasAlarm } : r
                      ));
                    }}
                    disabled={isDownloadingRecording}
                    className={`px-3 py-1.5 rounded-full transition-all backdrop-blur-sm flex items-center gap-1.5 ${
                      isDownloadingRecording
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : selectedRecording.hasAlarm
                        ? 'bg-[#FCEAAD]/90 hover:bg-[#FCEAAD] text-[#2C3B4A]'
                        : 'bg-white/30 hover:bg-white/40 text-white'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{selectedRecording.hasAlarm ? 'Alarmed' : 'Alarm'}</span>
                  </button>
                </div>
              </div>

              {/* 6-Hour Timeline Window */}
              <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 relative hidden">
                {(() => {
                  // Get current video timestamp
                  const currentTime = new Date(selectedRecording.timestamp);

                  // Create 6-hour window: 3 hours before and 3 hours after
                  const windowStart = new Date(currentTime.getTime() - 3 * 60 * 60 * 1000); // 3 hours before
                  const windowEnd = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours after

                  // Get all recordings within this window
                  const windowRecordings = allRecordings.filter(r => {
                    const recordingDate = new Date(r.timestamp);
                    const inWindow = recordingDate >= windowStart && recordingDate <= windowEnd;
                    // If in archived section, only show archived videos
                    if (showArchivedSection) {
                      return inWindow && r.isArchived;
                    }
                    return inWindow;
                  });

                  // Function to convert timestamp to percentage position within the 6-hour window
                  const getTimePosition = (timestamp: Date) => {
                    const timeOffset = timestamp.getTime() - windowStart.getTime();
                    const windowDuration = windowEnd.getTime() - windowStart.getTime();
                    return (timeOffset / windowDuration) * 100;
                  };

                  // Generate hour markers for the 6-hour window
                  const generateHourMarkers = () => {
                    const markers = [];
                    let markerTime = new Date(windowStart);
                    markerTime.setMinutes(0, 0, 0);

                    // Round to next hour
                    if (markerTime < windowStart) {
                      markerTime.setHours(markerTime.getHours() + 1);
                    }

                    while (markerTime <= windowEnd) {
                      markers.push(new Date(markerTime));
                      markerTime.setHours(markerTime.getHours() + 1);
                    }

                    return markers;
                  };

                  const hourMarkers = generateHourMarkers();

                  // Generate 10-minute markers for the 6-hour window
                  const generate10MinMarkers = () => {
                    const markers = [];
                    let markerTime = new Date(windowStart);
                    // Round to next 10-minute mark
                    const minutes = markerTime.getMinutes();
                    const roundedMinutes = Math.ceil(minutes / 10) * 10;
                    markerTime.setMinutes(roundedMinutes, 0, 0);

                    while (markerTime <= windowEnd) {
                      // Only add if it's not on the hour (hours have their own markers)
                      if (markerTime.getMinutes() !== 0) {
                        markers.push(new Date(markerTime));
                      }
                      markerTime.setMinutes(markerTime.getMinutes() + 10);
                    }

                    return markers;
                  };

                  const tenMinMarkers = generate10MinMarkers();

                  // Find day boundaries (midnight crossings) within the window
                  const getDayBoundaries = () => {
                    const boundaries = [];
                    let checkTime = new Date(windowStart);
                    checkTime.setHours(0, 0, 0, 0);
                    checkTime.setDate(checkTime.getDate() + 1); // Start from next midnight

                    while (checkTime <= windowEnd) {
                      if (checkTime > windowStart) {
                        boundaries.push(new Date(checkTime));
                      }
                      checkTime.setDate(checkTime.getDate() + 1);
                    }

                    return boundaries;
                  };

                  const dayBoundaries = getDayBoundaries();

                  return (
                    <div className="space-y-3 px-12">
                      {/* Timeline header with current time */}
                      <div className="flex items-center justify-center gap-1 relative">
                        <div className="text-gray-200 text-sm font-medium">
                          {showArchivedSection
                            ? (() => {
                                const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                let hour = currentTime.getHours();
                                const minute = currentTime.getMinutes();
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                hour = hour % 12 || 12;
                                const timeStr = `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
                                return (
                                  <>
                                    <span className="text-orange-500">Archive</span>: {dateStr} {timeStr}
                                  </>
                                );
                              })()
                            : currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                          }
                        </div>
                        {/* Go to Newest button */}
                        <button
                          onClick={() => {
                            // Find the most recent recording (lowest index = newest)
                            const relevantRecordings = showArchivedSection
                              ? allRecordings.filter(r => r.isArchived)
                              : allRecordings;
                            if (relevantRecordings.length > 0) {
                              setSelectedRecordingIndex(relevantRecordings[0].id);
                              setIsVideoPlaying(false);
                            }
                          }}
                          className="absolute right-16 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                          title="Go to newest recording"
                        >
                          <span>Newest</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Timeline bar */}
                      <div className="relative h-20 pt-2">
                        {/* Video recording indicators - positioned above the bar */}
                        {windowRecordings.map(recording => {
                          const position = getTimePosition(new Date(recording.timestamp));
                          const isSelected = recording.id === selectedRecording.id;
                          const hasAlarm = recording.hasAlarm;

                          return (
                            <button
                              key={recording.id}
                              onClick={() => {
                                setSelectedRecordingIndex(recording.id);
                                setIsVideoPlaying(false);
                              }}
                              className={`absolute top-0 transform -translate-x-1/2 transition-all ${
                                isSelected ? 'z-10' : 'z-0'
                              }`}
                              style={{ left: `${position}%` }}
                              title={(() => {
                                const date = new Date(recording.timestamp);
                                let hour = date.getHours();
                                const minute = date.getMinutes();
                                const second = date.getSeconds();
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                hour = hour % 12 || 12;
                                const timeStr = `${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${ampm}`;
                                return hasAlarm ? `${timeStr} (Alarm)` : timeStr;
                              })()}
                            >
                              <div className={`w-3 h-3 rounded-full transition-all ${
                                isSelected
                                  ? 'bg-[#5B8BBF] ring-4 ring-[#5B8BBF]/30 scale-150'
                                  : hasAlarm
                                  ? 'bg-[#FCEAAD] ring-2 ring-[#FCEAAD]/50 hover:scale-125'
                                  : 'bg-gray-300 hover:bg-gray-200 hover:scale-125'
                              }`} />
                            </button>
                          );
                        })}

                        {/* Background bar */}
                        <div className="absolute top-6 left-0 right-0 h-2 bg-gray-700 rounded-full" />

                        {/* Day boundary markers */}
                        {dayBoundaries.map((boundaryTime, index) => {
                          const position = getTimePosition(boundaryTime);
                          return (
                            <div
                              key={index}
                              className="absolute top-0 h-full pointer-events-none z-10"
                              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                            >
                              {/* Vertical line */}
                              <div className="w-0.5 h-full bg-yellow-500/40" />
                              {/* Date label at top */}
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full">
                                <div className="bg-yellow-500/20 px-2 py-0.5 rounded text-xs text-yellow-400 whitespace-nowrap border border-yellow-500/30">
                                  {boundaryTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Current video indicator line - always at center (50%) */}
                        <div
                          className="absolute top-3 h-8 w-0.5 bg-[#5B8BBF] z-20 pointer-events-none"
                          style={{ left: '50%', transform: 'translateX(-50%)' }}
                        />

                        {/* 10-minute markers - below the bar */}
                        <div className="absolute top-9 left-0 right-0">
                          {tenMinMarkers.map((markerTime, index) => {
                            const position = getTimePosition(markerTime);
                            const minutes = markerTime.getMinutes();

                            return (
                              <div key={`10min-${index}`} className="relative" style={{ position: 'absolute', left: `${position}%`, transform: 'translateX(-50%)' }}>
                                {/* 10-minute marker line - smaller */}
                                <div className="w-px h-1.5 bg-gray-500 mx-auto" />
                                {/* Optional: Show minutes at 30-minute marks for reference */}
                                {minutes === 30 && (
                                  <div className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">
                                    :{minutes.toString().padStart(2, '0')}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Hour markers and labels - below the bar */}
                        <div className="absolute top-9 left-0 right-0">
                          {hourMarkers.map((markerTime, index) => {
                            const position = getTimePosition(markerTime);
                            let hour = markerTime.getHours();
                            const ampm = hour >= 12 ? 'pm' : 'am';
                            hour = hour % 12 || 12;

                            return (
                              <div key={`hour-${index}`} className="relative" style={{ position: 'absolute', left: `${position}%`, transform: 'translateX(-50%)' }}>
                                {/* Hour marker line */}
                                <div className="w-px h-2 bg-gray-400 mx-auto" />
                                {/* Hour label */}
                                <div className="text-xs text-gray-300 mt-1 whitespace-nowrap">
                                  {hour}{ampm}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Navigation arrows - positioned on the sides */}
                <button
                  onClick={() => {
                    // Filter recordings based on current section
                    const relevantRecordings = showArchivedSection
                      ? allRecordings.filter(r => r.isArchived)
                      : allRecordings;
                    const currentIdx = relevantRecordings.findIndex(r => r.id === selectedRecording.id);
                    if (currentIdx < relevantRecordings.length - 1) {
                      setSelectedRecordingIndex(relevantRecordings[currentIdx + 1].id);
                      setIsVideoPlaying(false);
                    }
                  }}
                  disabled={(() => {
                    const relevantRecordings = showArchivedSection
                      ? allRecordings.filter(r => r.isArchived)
                      : allRecordings;
                    const currentIdx = relevantRecordings.findIndex(r => r.id === selectedRecording.id);
                    return currentIdx === relevantRecordings.length - 1;
                  })()}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 z-30 flex items-center justify-center hover:bg-gray-700/50 transition-colors disabled:opacity-20 disabled:cursor-not-allowed rounded-lg"
                >
                  <ChevronLeft className="w-12 h-12 text-gray-300" />
                </button>

                <button
                  onClick={() => {
                    // Filter recordings based on current section
                    const relevantRecordings = showArchivedSection
                      ? allRecordings.filter(r => r.isArchived)
                      : allRecordings;
                    const currentIdx = relevantRecordings.findIndex(r => r.id === selectedRecording.id);
                    if (currentIdx > 0) {
                      setSelectedRecordingIndex(relevantRecordings[currentIdx - 1].id);
                      setIsVideoPlaying(false);
                    }
                  }}
                  disabled={(() => {
                    const relevantRecordings = showArchivedSection
                      ? allRecordings.filter(r => r.isArchived)
                      : allRecordings;
                    const currentIdx = relevantRecordings.findIndex(r => r.id === selectedRecording.id);
                    return currentIdx === 0;
                  })()}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 z-30 flex items-center justify-center hover:bg-gray-700/50 transition-colors disabled:opacity-20 disabled:cursor-not-allowed rounded-lg"
                >
                  <ChevronRight className="w-12 h-12 text-gray-300" />
                </button>
              </div>

              {/* Download Error Popup */}
              {showDownloadError && (
                <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
                  <div className="bg-gray-800 rounded-lg w-[600px] overflow-hidden">
                    {/* Icon and Title */}
                    <div className="px-8 pt-8 flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-4 border-2 border-[#FFC7BD]">
                        <AlertCircle className="w-10 h-10 text-[#FFC7BD]" />
                      </div>
                      <h2 className="text-white text-2xl font-semibold text-center">
                        Download Paused
                      </h2>
                    </div>

                    {/* Description */}
                    <div className="px-8 py-6">
                      <p className="text-white text-lg leading-relaxed text-center">
                        Download has been paused due to connection issues
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="border-t border-gray-700 flex flex-col">
                      <button
                        onClick={() => {
                          setShowDownloadError(false);
                          // Keep the download paused, user can navigate away
                        }}
                        className="text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                        style={{ color: '#5B8BBF' }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })()
      ) : (
        <>
          {/* Timeline View - Top panel with back button and storage info */}
          <div className="bg-black py-3 flex items-center justify-between px-6 border-b border-gray-800">
            <button
              onClick={() => {
                if (showArchivedSection) {
                  setShowArchivedSection(false);
                  setIsEditingRecordings(false);
                  setSelectedRecordingIds([]);
                } else {
                  setShowRecordings(false);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{showArchivedSection ? 'Recordings' : 'Back'}</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-white text-base font-medium">
                {showArchivedSection ? 'Trashed Recordings' : 'Recordings'}
              </span>
              <span className="text-gray-500 text-sm">
                ({currentRecordings.length})
              </span>
            </div>

            <button
              onClick={() => {
                setIsEditingRecordings(!isEditingRecordings);
                if (isEditingRecordings) {
                  setSelectedRecordingIds([]);
                }
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
            >
              {isEditingRecordings ? 'Done' : 'Edit'}
            </button>
          </div>

          {/* Archived Confirmation Message */}
          {showArchivedMessage && (
            <div className="bg-[#B95555] py-3 px-6 flex items-center justify-center border-b border-gray-800">
              <span className="text-white text-base font-medium">Video(s) have been Trashed</span>
            </div>
          )}

          {showUnarchivedMessage && (
            <div className="bg-[#68B08E] py-3 px-6 flex items-center justify-center border-b border-gray-800">
              <span className="text-white text-base font-medium">Video(s) have been Restored</span>
            </div>
          )}

          {showDeletedMessage && (
            <div className="bg-[#B85555] py-3 px-6 flex items-center justify-center border-b border-gray-800">
              <span className="text-white text-base font-medium">Video(s) have been Deleted</span>
            </div>
          )}

          {/* Storage Warning Notification */}
          {showStorageNotification && (
            <div className="bg-gray-900 py-3 px-6 flex items-center justify-center gap-2 border-b border-gray-800">
              <AlertCircle className="w-5 h-5 text-[#B85555] flex-shrink-0" />
              <span className="text-[#B85555] text-base font-medium">Out of storage! Trash some recordings, increase the storage limit in settings, or delete other content from your Mobile Device</span>
            </div>
          )}

          {/* Filter chips panel - only show when not in archived section */}
          {!showArchivedSection && (
            <div className="bg-gray-900 py-2 px-6 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3 overflow-x-auto flex-1">
                <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <button
                  onClick={() => setActiveFilters({ ...activeFilters, alarmOnly: !activeFilters.alarmOnly })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
                    activeFilters.alarmOnly
                      ? 'bg-[#FCEAAD] text-[#2C3B4A]'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >Alarmed<Bell className="w-4 h-4" /></button>
                <button
                  onClick={() => setActiveFilters({ ...activeFilters, lockedOnly: !activeFilters.lockedOnly })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
                    activeFilters.lockedOnly
                      ? 'bg-[#FFC7BD] text-gray-900'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >Locked<Lock className="w-4 h-4" /></button>
                <button
                  onClick={() => setActiveFilters({ ...activeFilters, longVideosOnly: !activeFilters.longVideosOnly })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
                    activeFilters.longVideosOnly
                      ? 'bg-[#BFE3D9] text-[#2C3B4A]'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <HardDrive className="w-4 h-4" />
                  20s+
                </button>
                <button
                  onClick={() => setActiveFilters({ ...activeFilters, last24Hours: !activeFilters.last24Hours })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
                    activeFilters.last24Hours
                      ? 'bg-[#5B8BBF] text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <History className="w-4 h-4" />
                  24hrs
                </button>

                <div className="w-px h-6 bg-gray-700 flex-shrink-0" />

                {/* Collapse/Expand All button */}
                <button
                  onClick={() => {
                    const allMonthLabels = Object.keys(groupedRecordings);
                    const allDateLabels: string[] = [];
                    Object.values(groupedRecordings).forEach(dateGroups => {
                      allDateLabels.push(...Object.keys(dateGroups));
                    });

                    const allCollapsed = collapsedMonthGroups.size === allMonthLabels.length &&
                                       collapsedDateGroups.size === allDateLabels.length;

                    if (allCollapsed) {
                      // Expand all months and dates
                      setCollapsedMonthGroups(new Set());
                      setCollapsedDateGroups(new Set());
                    } else {
                      // Collapse all months and dates
                      setCollapsedMonthGroups(new Set(allMonthLabels));
                      setCollapsedDateGroups(new Set(allDateLabels));
                    }
                  }}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  {(() => {
                    const allMonthLabels = Object.keys(groupedRecordings);
                    const allDateLabels: string[] = [];
                    Object.values(groupedRecordings).forEach(dateGroups => {
                      allDateLabels.push(...Object.keys(dateGroups));
                    });
                    const allCollapsed = collapsedMonthGroups.size === allMonthLabels.length &&
                                       collapsedDateGroups.size === allDateLabels.length;

                    return allCollapsed ? (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Expand
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Collapse
                      </>
                    );
                  })()}
                </button>
              </div>

              {/* Archived button on the right */}
              <button
                onClick={() => {
                  setShowArchivedSection(true);
                  setIsEditingRecordings(false);
                  setSelectedRecordingIds([]);
                }}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ml-3 bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                <Trash2 className="w-4 h-4" />
                Trashed
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Timeline with recordings grouped by date */}
          <div className="flex-1 bg-black overflow-y-auto px-5 py-3">
            {/* Archived section info banner */}
            {showArchivedSection && (
              <div className="mb-4 px-4 py-3 bg-gray-800/50 border border-yellow-900/30 rounded-lg">
                <p className="text-yellow-500 text-sm font-medium">
                  These videos will be deleted once your Mobile Device gets out of storage or you can delete them permanently manually
                </p>
              </div>
            )}

            {currentRecordings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Activity className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">No recordings found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedRecordings).map(([monthLabel, dateGroups]) => {
                  const isMonthCollapsed = collapsedMonthGroups.has(monthLabel);
                  const monthRecordingCount = Object.values(dateGroups).reduce((sum, recs) => sum + recs.length, 0);

                  return (
                    <div key={monthLabel} className="space-y-4">
                      {/* Month header - clickable to collapse/expand all days in this month */}
                      <button
                        onClick={() => {
                          const newCollapsed = new Set(collapsedMonthGroups);
                          if (isMonthCollapsed) {
                            newCollapsed.delete(monthLabel);
                          } else {
                            newCollapsed.add(monthLabel);
                          }
                          setCollapsedMonthGroups(newCollapsed);
                        }}
                        className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity pb-1 mb-2.5 border-b border-gray-700"
                      >
                        {isMonthCollapsed ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{monthLabel}</span>
                        <span className="text-gray-600 text-xs">({monthRecordingCount})</span>
                      </button>

                      {/* Days within this month - only show when month is not collapsed */}
                      {!isMonthCollapsed && (
                        <div className="ml-6 space-y-4">
                          {Object.entries(dateGroups)
                            .sort(([dateA], [dateB]) => {
                              // Prioritize "Today" first
                              if (dateA === 'Today') return -1;
                              if (dateB === 'Today') return 1;
                              // Then "Yesterday"
                              if (dateA === 'Yesterday') return -1;
                              if (dateB === 'Yesterday') return 1;
                              // Then sort rest chronologically (most recent first)
                              return 0;
                            })
                            .map(([dateLabel, recordings]) => {
                            const isDateCollapsed = collapsedDateGroups.has(dateLabel);

                            return (
                              <div key={dateLabel}>
                                {/* Date header with count - clickable to collapse/expand */}
                                <button
                                  onClick={() => {
                                    const newCollapsed = new Set(collapsedDateGroups);
                                    if (isDateCollapsed) {
                                      newCollapsed.delete(dateLabel);
                                    } else {
                                      newCollapsed.add(dateLabel);
                                    }
                                    setCollapsedDateGroups(newCollapsed);
                                  }}
                                  className="flex items-center gap-3 mb-2.5 w-full hover:opacity-80 transition-opacity -mt-0.5"
                                >
                                  {isDateCollapsed ? (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                  )}
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 rounded-lg">
                                    <Calendar className="w-3.5 h-3.5 text-[#5B8BBF]" />
                                    <span className="text-white font-semibold text-xs">{dateLabel}</span>
                                  </div>
                                  <span className="text-gray-500 text-sm">{recordings.length} recording{recordings.length !== 1 ? 's' : ''}</span>
                                </button>

                                {/* Recordings for this date - only show when not collapsed */}
                                {!isDateCollapsed && (
                        <div className="bg-gray-800/50 rounded-lg overflow-hidden space-y-0">
                          {recordings.map((recording, index) => {
                            const isSwiped = showArchivedSection
                              ? trashedSwipedId === recording.id
                              : swipedRecordingId === recording.id;
                            const activeSwipeOffset = showArchivedSection ? trashedSwipeOffset : swipeOffset;

                            const handleTouchStart = (e: React.TouchEvent) => {
                              if (isEditingRecordings) return;
                              if (showArchivedSection) {
                                if (trashedSwipedId !== null && trashedSwipedId !== recording.id) {
                                  setTrashedSwipedId(null);
                                  setTrashedSwipeOffset(0);
                                }
                                trashedSwipeStartX.current = e.touches[0].clientX;
                                trashedHasSwipedRef.current = false;
                                trashedCurrentSwipeOffset.current = 0;
                                return;
                              }
                              if (swipedRecordingId !== null && swipedRecordingId !== recording.id) {
                                setSwipedRecordingId(null);
                                setSwipeOffset(0);
                              }
                              swipeStartX.current = e.touches[0].clientX;
                              hasSwipedRef.current = false;
                              currentSwipeOffset.current = 0;
                            };

                            const handleTouchMove = (e: React.TouchEvent) => {
                              if (isEditingRecordings) return;
                              if (showArchivedSection) {
                                const diff = trashedSwipeStartX.current - e.touches[0].clientX;
                                if (Math.abs(diff) > 5) {
                                  trashedHasSwipedRef.current = true;
                                  setTrashedSwipedId(recording.id);
                                }
                                if (diff > 0) {
                                  const clampedDiff = Math.min(diff, 120);
                                  trashedCurrentSwipeOffset.current = -clampedDiff;
                                  setTrashedSwipeOffset(-clampedDiff);
                                } else if (diff < 0) {
                                  const clampedDiff = Math.max(diff, -120);
                                  trashedCurrentSwipeOffset.current = -clampedDiff;
                                  setTrashedSwipeOffset(-clampedDiff);
                                }
                                return;
                              }
                              const diff = swipeStartX.current - e.touches[0].clientX;
                              if (Math.abs(diff) > 5) {
                                hasSwipedRef.current = true;
                                setSwipedRecordingId(recording.id);
                              }
                              if (diff > 0) {
                                const clampedDiff = Math.min(diff, 120);
                                currentSwipeOffset.current = -clampedDiff;
                                setSwipeOffset(-clampedDiff);
                              } else if (diff < 0) {
                                const clampedDiff = Math.max(diff, -240);
                                currentSwipeOffset.current = -clampedDiff;
                                setSwipeOffset(-clampedDiff);
                              }
                            };

                            const handleTouchEnd = () => {
                              if (isEditingRecordings) return;
                              if (showArchivedSection) {
                                const finalOffset = trashedCurrentSwipeOffset.current;
                                trashedCurrentSwipeOffset.current = 0;
                                if (finalOffset < -20) {
                                  setTrashedSwipedId(recording.id);
                                  setTrashedSwipeOffset(-120);
                                } else if (finalOffset > 20) {
                                  setTrashedSwipedId(recording.id);
                                  setTrashedSwipeOffset(120);
                                } else {
                                  setTrashedSwipeOffset(0);
                                  setTrashedSwipedId(null);
                                }
                                return;
                              }
                              const finalOffset = currentSwipeOffset.current;
                              currentSwipeOffset.current = 0;
                              if (finalOffset < -20) {
                                setSwipedRecordingId(recording.id);
                                setSwipeOffset(-120);
                              } else if (finalOffset > 20) {
                                setSwipedRecordingId(recording.id);
                                setSwipeOffset(240);
                              } else {
                                setSwipeOffset(0);
                                setSwipedRecordingId(null);
                              }
                            };

                            const handleMouseDown = (e: React.MouseEvent) => {
                              if (isEditingRecordings) return;
                              if (showArchivedSection) {
                                if (trashedSwipedId !== null && trashedSwipedId !== recording.id) {
                                  setTrashedSwipedId(null);
                                  setTrashedSwipeOffset(0);
                                }
                                trashedSwipeStartX.current = e.clientX;
                                trashedHasSwipedRef.current = false;
                                trashedCurrentSwipeOffset.current = 0;
                                return;
                              }
                              if (swipedRecordingId !== null && swipedRecordingId !== recording.id) {
                                setSwipedRecordingId(null);
                                setSwipeOffset(0);
                              }
                              swipeStartX.current = e.clientX;
                              hasSwipedRef.current = false;
                              currentSwipeOffset.current = 0;
                            };

                            const handleMouseMove = (e: React.MouseEvent) => {
                              if (isEditingRecordings) return;
                              if (e.buttons !== 1) return;
                              if (showArchivedSection) {
                                const diff = trashedSwipeStartX.current - e.clientX;
                                if (Math.abs(diff) > 5) {
                                  trashedHasSwipedRef.current = true;
                                  setTrashedSwipedId(recording.id);
                                }
                                if (diff > 0) {
                                  const clampedDiff = Math.min(diff, 120);
                                  trashedCurrentSwipeOffset.current = -clampedDiff;
                                  setTrashedSwipeOffset(-clampedDiff);
                                } else if (diff < 0) {
                                  const clampedDiff = Math.max(diff, -120);
                                  trashedCurrentSwipeOffset.current = -clampedDiff;
                                  setTrashedSwipeOffset(-clampedDiff);
                                }
                                return;
                              }
                              const diff = swipeStartX.current - e.clientX;
                              if (Math.abs(diff) > 5) {
                                hasSwipedRef.current = true;
                                setSwipedRecordingId(recording.id);
                              }
                              if (diff > 0) {
                                const clampedDiff = Math.min(diff, 120);
                                currentSwipeOffset.current = -clampedDiff;
                                setSwipeOffset(-clampedDiff);
                              } else if (diff < 0) {
                                const clampedDiff = Math.max(diff, -240);
                                currentSwipeOffset.current = -clampedDiff;
                                setSwipeOffset(-clampedDiff);
                              }
                            };

                            const handleMouseUp = () => {
                              if (isEditingRecordings) return;
                              if (showArchivedSection) {
                                const finalOffset = trashedCurrentSwipeOffset.current;
                                trashedCurrentSwipeOffset.current = 0;
                                if (finalOffset < -20) {
                                  setTrashedSwipedId(recording.id);
                                  setTrashedSwipeOffset(-120);
                                } else if (finalOffset > 20) {
                                  setTrashedSwipedId(recording.id);
                                  setTrashedSwipeOffset(120);
                                } else {
                                  setTrashedSwipeOffset(0);
                                  setTrashedSwipedId(null);
                                }
                                return;
                              }
                              const finalOffset = currentSwipeOffset.current;
                              currentSwipeOffset.current = 0;
                              if (finalOffset < -20) {
                                setSwipedRecordingId(recording.id);
                                setSwipeOffset(-120);
                              } else if (finalOffset > 20) {
                                setSwipedRecordingId(recording.id);
                                setSwipeOffset(240);
                              } else {
                                setSwipeOffset(0);
                                setSwipedRecordingId(null);
                              }
                            };

                            const handleMouseLeave = () => {
                              const activeRef = showArchivedSection ? trashedCurrentSwipeOffset.current : currentSwipeOffset.current;
                              if (activeRef !== 0) {
                                handleMouseUp();
                              }
                            };

                            return (
                              <div
                                key={recording.id}
                                className={`relative ${index < recordings.length - 1 ? 'border-b-2 border-[#000000]' : ''}`}
                              >
                                {/* Lock and Alarm buttons behind (left side) — regular view only */}
                                {!isEditingRecordings && !showArchivedSection && (
                                  <div className="absolute left-0 top-0 bottom-0 w-[240px] flex items-center justify-center bg-gray-900">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAllRecordings(prev => prev.map(r =>
                                          r.id === recording.id ? { ...r, isLocked: !r.isLocked } : r
                                        ));
                                        setSwipedRecordingId(null);
                                        setSwipeOffset(0);
                                      }}
                                      className="flex flex-col items-center justify-center gap-1 text-gray-900 font-semibold w-[120px] h-full bg-[#FFC7BD] hover:bg-[#FFC7BD]/90 transition-colors"
                                    >
                                      <Lock className="w-6 h-6" />
                                      <span className="text-sm">{recording.isLocked ? 'Unlock' : 'Lock'}</span>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAllRecordings(prev => prev.map(r =>
                                          r.id === recording.id ? { ...r, hasAlarm: !r.hasAlarm } : r
                                        ));
                                        setSwipedRecordingId(null);
                                        setSwipeOffset(0);
                                      }}
                                      className="flex flex-col items-center justify-center gap-1 text-gray-900 font-semibold w-[120px] h-full bg-[#FCEAAD] hover:bg-[#FCEAAD]/90 transition-colors"
                                    >
                                      <Bell className="w-6 h-6" />
                                      <span className="text-sm">Alarm</span>
                                    </button>
                                  </div>
                                )}

                                {/* Restore button behind (left side) — trash view only */}
                                {!isEditingRecordings && showArchivedSection && (
                                  <div className="absolute left-0 top-0 bottom-0 w-[120px] flex items-center justify-center bg-[#BFE3D9]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAllRecordings(prev => prev.map(r =>
                                          r.id === recording.id ? { ...r, isArchived: false } : r
                                        ));
                                        setTrashedSwipedId(null);
                                        setTrashedSwipeOffset(0);
                                        setShowUnarchivedMessage(true);
                                        setTimeout(() => setShowUnarchivedMessage(false), 3000);
                                      }}
                                      className="flex flex-col items-center justify-center gap-1 text-[#2C3B4A] font-semibold w-full h-full hover:bg-[#BFE3D9]/90 transition-colors"
                                    >
                                      <RotateCcw className="w-6 h-6" />
                                      <span className="text-sm">Restore</span>
                                    </button>
                                  </div>
                                )}

                                {/* Delete button behind (right side) — trash view only */}
                                {!isEditingRecordings && showArchivedSection && (
                                  <div className="absolute right-0 top-0 bottom-0 w-[120px] flex items-center justify-center bg-[#B95555]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSingleDeleteRecordingId(recording.id);
                                        setShowSingleDeleteConfirmation(true);
                                        setTrashedSwipedId(null);
                                        setTrashedSwipeOffset(0);
                                      }}
                                      className="flex flex-col items-center justify-center gap-1 text-white font-semibold w-full h-full hover:bg-[#B95555]/90 transition-colors"
                                    >
                                      <Trash2 className="w-6 h-6" />
                                      <span className="text-sm">Delete</span>
                                    </button>
                                  </div>
                                )}

                                {/* Archive button behind (right side) — regular view only */}
                                {!isEditingRecordings && !showArchivedSection && (
                                  <div className="absolute right-0 top-0 bottom-0 w-[120px] flex items-center justify-center bg-[#B95555]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Check if recording is locked
                                        if (recording.isLocked) {
                                          setArchiveWarningType('locked');
                                          setArchiveIsSingleLocked(true);
                                          setSelectedRecordingIds([recording.id]);
                                          setShowArchiveConfirmPopup(true);
                                        } else {
                                          const randomProgress = Math.floor(Math.random() * 61) + 30;
                                          setAllRecordings(prev => prev.map(r =>
                                            r.id === recording.id ? { ...r, isArchived: true, watchProgress: randomProgress } : r
                                          ));
                                          // Hide storage notification
                                          setShowStorageNotification(false);
                                          setShowArchivedMessage(true);
                                          setTimeout(() => setShowArchivedMessage(false), 3000);
                                        }
                                        setSwipedRecordingId(null);
                                        setSwipeOffset(0);
                                      }}
                                      className="flex items-center gap-2 text-white font-semibold"
                                    >
                                      <Archive className="w-5 h-5" />
                                      <span>Trash</span>
                                    </button>
                                  </div>
                                )}

                                {/* Swipeable recording item */}
                                <button
                                  onClick={() => {
                                    // Close any other swiped row when clicking on a different row
                                    if (showArchivedSection) {
                                      if (trashedSwipedId !== null && trashedSwipedId !== recording.id) {
                                        setTrashedSwipedId(null);
                                        setTrashedSwipeOffset(0);
                                        return;
                                      }
                                    } else {
                                      if (swipedRecordingId !== null && swipedRecordingId !== recording.id) {
                                        setSwipedRecordingId(null);
                                        setSwipeOffset(0);
                                        return;
                                      }
                                    }

                                    // If a swipe just occurred, prevent navigation
                                    if (showArchivedSection ? trashedHasSwipedRef.current : hasSwipedRef.current) {
                                      if (showArchivedSection) trashedHasSwipedRef.current = false;
                                      else hasSwipedRef.current = false;
                                      return;
                                    }

                                    // If buttons are fully visible (either direction), clicking closes them
                                    if (isSwiped && (activeSwipeOffset <= -120 || activeSwipeOffset >= 120)) {
                                      if (showArchivedSection) {
                                        setTrashedSwipedId(null);
                                        setTrashedSwipeOffset(0);
                                      } else {
                                        setSwipedRecordingId(null);
                                        setSwipeOffset(0);
                                      }
                                      return;
                                    }

                                    if (isEditingRecordings) {
                                      if (selectedRecordingIds.includes(recording.id)) {
                                        setSelectedRecordingIds(selectedRecordingIds.filter(id => id !== recording.id));
                                      } else {
                                        setSelectedRecordingIds([...selectedRecordingIds, recording.id]);
                                      }
                                    } else {
                                      setSelectedRecordingIndex(recording.id);
                                      setIsVideoPlaying(false);

                                      // Check if this is one of the first 2 recordings and not yet downloaded
                                      if (index < 2 && !downloadedRecordingIds.has(recording.id)) {
                                        // If already downloading, just show the player with current progress
                                        if (downloadingRecordingIds.has(recording.id)) {
                                          setIsDownloadingRecording(true);
                                          setDownloadProgress(downloadingRecordingIds.get(recording.id) || 0);
                                        } else {
                                          // Start new download
                                          setIsDownloadingRecording(true);
                                          setDownloadProgress(0);

                                          // Clear any existing interval
                                          if (activeDownloadInterval) {
                                            clearInterval(activeDownloadInterval);
                                          }

                                          // Start download for this recording
                                          setDownloadingRecordingIds(prev => new Map(prev).set(recording.id, 0));

                                          // Simulate download progress
                                          const interval = setInterval(() => {
                                            setDownloadProgress(prev => {
                                              const newProgress = prev + 10;

                                              // Update the map for list view
                                              setDownloadingRecordingIds(prevMap => {
                                                const newMap = new Map(prevMap);
                                                newMap.set(recording.id, newProgress);
                                                return newMap;
                                              });

                                              if (newProgress >= 100) {
                                                clearInterval(interval);
                                                setIsDownloadingRecording(false);
                                                setActiveDownloadInterval(null);
                                                // Mark this recording as downloaded
                                                setDownloadedRecordingIds(prevIds => new Set(prevIds).add(recording.id));
                                                // Remove from downloading map
                                                setDownloadingRecordingIds(prevMap => {
                                                  const newMap = new Map(prevMap);
                                                  newMap.delete(recording.id);
                                                  return newMap;
                                                });
                                                return 100;
                                              }
                                              return newProgress;
                                            });
                                          }, 300);

                                          setActiveDownloadInterval(interval);
                                        }
                                      }
                                    }
                                  }}
                                  onTouchStart={handleTouchStart}
                                  onTouchMove={handleTouchMove}
                                  onTouchEnd={handleTouchEnd}
                                  onMouseDown={handleMouseDown}
                                  onMouseMove={handleMouseMove}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseLeave}
                                  style={{
                                    transform: isSwiped ? `translateX(${activeSwipeOffset}px)` : 'translateX(0)',
                                    transition: (showArchivedSection ? trashedCurrentSwipeOffset.current : currentSwipeOffset.current) === 0 ? 'transform 0.3s ease' : 'none'
                                  }}
                                  className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-gray-700 transition-colors cursor-pointer bg-gray-800 relative"
                                >
                                  {/* Checkbox for edit mode */}
                                  {isEditingRecordings && (
                                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        selectedRecordingIds.includes(recording.id)
                                          ? 'border-[#5B8BBF] bg-[#5B8BBF]'
                                          : 'border-gray-400'
                                      }`}>
                                        {selectedRecordingIds.includes(recording.id) && (
                                          <Check className="w-4 h-4 text-white" />
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Thumbnail with night vision effect */}
                                  <div className="relative w-[90px] h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                                    {index < 2 && !downloadedRecordingIds.has(recording.id) ? (
                                      <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center gap-2 px-2">
                                        {downloadingRecordingIds.has(recording.id) ? (
                                          /* Downloading state - show "Downloading..." text and progress bar */
                                          <>
                                            <span className="text-xs text-gray-400 font-medium">Downloading...</span>
                                            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                              <div
                                                className="bg-[#FCEAAD] h-full rounded-full transition-all duration-300"
                                                style={{ width: `${downloadingRecordingIds.get(recording.id)}%` }}
                                              />
                                            </div>
                                          </>
                                        ) : (
                                          /* Not downloading - show Camera icon and "Sami" text */
                                          <>
                                            <Camera className="w-8 h-8 text-gray-500" />
                                            <span className="text-xs text-gray-500">Sami</span>
                                          </>
                                        )}
                                      </div>
                                    ) : (
                                      <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{
                                          backgroundImage: `url(${recording.thumbnail})`,
                                          filter: 'brightness(0.6) contrast(1.1) saturate(0.3) sepia(0.3) hue-rotate(60deg)'
                                        }}
                                      />
                                    )}
                                    {/* Archived overlay for archived section */}
                                    {showArchivedSection && (
                                      <div className="absolute inset-0 bg-black/40" />
                                    )}
                                  </div>

                                  {/* Time and details */}
                                  <div className="flex-1 flex flex-col justify-center items-start min-w-0">
                                    {/* Time */}
                                    <div className="text-white font-semibold text-base">
                                      {(() => {
                                        const date = new Date(recording.timestamp);
                                        let hour = date.getHours();
                                        const minute = date.getMinutes();
                                        const second = date.getSeconds();
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        hour = hour % 12 || 12;
                                        return `${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${ampm}`;
                                      })()}
                                    </div>
                                    {/* Camera */}
                                    <div className="text-gray-400 text-sm mt-0.5">{recording.camera}</div>
                                    {/* Duration with watch progress */}
                                    {recording.watchProgress > 0 && (
                                      <div className="w-28 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
                                        <div
                                          className="h-full rounded-full transition-all"
                                          style={{ width: `${recording.watchProgress}%`, backgroundColor: '#5B8BBF' }}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Icons and duration */}
                                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    {/* Status icons */}
                                    {(recording.hasAlarm || recording.isLocked) && (
                                      <div className="flex items-center gap-2">
                                        {recording.hasAlarm && (
                                          <div className="p-2 bg-[#FCEAAD] rounded-md shadow-lg">
                                            <Bell className="w-5 h-5 text-[#2C3B4A]" />
                                          </div>
                                        )}
                                        {recording.isLocked && (
                                          <div className="p-2 bg-[#FFC7BD] rounded-md shadow-lg">
                                            <Lock className="w-5 h-5 text-gray-900" />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {/* Duration */}
                                    <div className="px-2.5 py-1 bg-gray-700 rounded text-gray-300 text-sm font-medium">
                                      {recording.duration}
                                    </div>
                                  </div>

                                  {/* Navigation arrow */}
                                  {!isEditingRecordings && (
                                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom panel with action buttons - only show in edit mode */}
          {isEditingRecordings && (
            <div className="bg-gray-900 border-t border-gray-700 py-3 px-6 flex items-center justify-between">
              {/* Selection info and buttons */}
              <div className="flex items-center gap-4">
                <span className="text-white text-sm font-medium">
                  {selectedRecordingIds.length} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRecordingIds([])}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      const allIds = currentRecordings.map(r => r.id);
                      setSelectedRecordingIds(allIds);
                    }}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
                  >
                    Select All
                  </button>
                  {!showArchivedSection && (
                    <button
                      onClick={() => {
                        const unlockedIds = currentRecordings.filter(r => !r.isLocked).map(r => r.id);
                        setSelectedRecordingIds(unlockedIds);
                      }}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
                    >
                      Unlocked
                    </button>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {showArchivedSection ? (
                  <>
                    {/* Archived section actions: Unarchive and Permanently Delete */}
                    <button
                      disabled={selectedRecordingIds.length === 0}
                      onClick={() => {
                        if (selectedRecordingIds.length > 0) {
                          setAllRecordings(prev => prev.map(r =>
                            selectedRecordingIds.includes(r.id) ? { ...r, isArchived: false } : r
                          ));
                          setSelectedRecordingIds([]);
                          setShowArchivedSection(false);
                          setShowUnarchivedMessage(true);
                          setTimeout(() => setShowUnarchivedMessage(false), 3000);
                        }
                      }}
                      className={`px-4 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                        selectedRecordingIds.length === 0
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#BFE3D9] text-[#2C3B4A] hover:bg-[#BFE3D9]/90'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                    <button
                      disabled={selectedRecordingIds.length === 0}
                      onClick={() => {
                        if (selectedRecordingIds.length > 0) {
                          setShowBulkDeleteConfirmation(true);
                        }
                      }}
                      className={`px-4 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                        selectedRecordingIds.length === 0
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#B85555] text-white hover:bg-[#B85555]/90'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    {/* Active recordings section actions: Lock, Alarm, Archive */}
                    <button
                      disabled={selectedRecordingIds.length === 0}
                      onClick={() => {
                        if (selectedRecordingIds.length > 0) {
                          setAllRecordings(prev => prev.map(r =>
                            selectedRecordingIds.includes(r.id) ? { ...r, isLocked: !r.isLocked } : r
                          ));
                        }
                      }}
                      className={`px-4 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                        selectedRecordingIds.length === 0
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#FFC7BD] text-gray-900 hover:bg-[#FFC7BD]/90'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      Lock
                    </button>
                    <button
                      disabled={selectedRecordingIds.length === 0}
                      onClick={() => {
                        if (selectedRecordingIds.length > 0) {
                          setAllRecordings(prev => prev.map(r =>
                            selectedRecordingIds.includes(r.id) ? { ...r, hasAlarm: !r.hasAlarm } : r
                          ));
                        }
                      }}
                      className={`px-4 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                        selectedRecordingIds.length === 0
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#FCEAAD] text-[#2C3B4A] hover:bg-[#FCEAAD]/90'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      Alarm
                    </button>
                    <button
                      disabled={selectedRecordingIds.length === 0}
                      onClick={() => {
                        if (selectedRecordingIds.length > 0) {
                          // Check if any selected recordings are locked
                          const selectedVideos = allRecordings.filter(r => selectedRecordingIds.includes(r.id));
                          const hasLocked = selectedVideos.some(r => r.isLocked);

                          if (hasLocked) {
                            setArchiveWarningType('locked');
                            setArchiveIsSingleLocked(false);
                            setShowArchiveConfirmPopup(true);
                          } else {
                            setAllRecordings(prev => prev.map(r =>
                              selectedRecordingIds.includes(r.id) ? { ...r, isArchived: true } : r
                            ));
                            setSelectedRecordingIds([]);

                            // Hide storage notification
                            setShowStorageNotification(false);

                            // Show archived confirmation message
                            setShowArchivedMessage(true);
                            setTimeout(() => {
                              setShowArchivedMessage(false);
                            }, 3000);
                          }
                        }
                      }}
                      className={`px-4 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                        selectedRecordingIds.length === 0
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#B95555] text-white hover:bg-[#B95555]/90'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Trash
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Share Preparing Popup */}
      {showSharePopup && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-[480px] overflow-hidden border border-gray-700">
            <div className="px-8 pt-6 pb-2">
              <h2 className="text-white text-xl font-semibold text-center">Preparing Video</h2>
            </div>
            <div className="px-8 py-6 space-y-4">
              <p className="text-gray-300 text-base text-center">Preparing video for sharing...</p>
              <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-700">
                <div
                  className="bg-[#5A8BBF] h-full rounded-full transition-none"
                  style={{ width: `${shareProgress}%` }}
                />
              </div>
              <p className="text-[#5A8BBF] text-sm text-center font-semibold">{shareProgress}%</p>
            </div>
            <div className="border-t border-gray-700">
              <button
                onClick={cancelShare}
                className="w-full text-lg py-4 hover:bg-gray-700 transition-colors text-center font-semibold"
                style={{ color: SETTINGS_ACCENT_COLOR }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
