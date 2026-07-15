# 📹 Camera Manufacturer Requirements for SAMi Baby Monitor System

## Document Purpose
This document outlines the technical requirements and functional specifications that the SAMi camera hardware must support to integrate with the SAMi Baby Monitor iOS application.

---

## 🔧 1. HARDWARE SPECIFICATIONS

### 1.1 Camera Model & Identification
- **Model Name Format**: SAMi-3c
- **Unique Device ID**: Each camera must provide a unique 12-character hexadecimal identifier (e.g., 7812FFA01839, 7812FFA010C1)
- **Device Naming Convention**: `SAMi-3c: [12-digit hex ID]`

### 1.2 Physical Components Required
- **IR Illuminator**: Hardware infrared illuminator for night vision capability
- **IR Filter**: Mechanically switchable IR cut filter
- **Power LED**: Controllable power indicator light
- **Microphone**: Audio input for sound detection and monitoring
- **SD Card Slot**: For local video storage (must report capacity and recording count)
- **Network Interface**: Wired Ethernet and/or Wi-Fi connectivity

### 1.3 Video Specifications
- **Resolution**: Minimum 1080p (1920x1080) for clear baby monitoring
- **Frame Rate**: Minimum 15 fps for smooth motion detection
- **Night Vision**: Must support night vision mode with green-tinted infrared imaging
- **Video Filter Support**: Camera must output video compatible with the following filter effects:
  - Brightness reduction (0.6x)
  - Contrast increase (1.1x)
  - Saturation reduction (0.3x)
  - Sepia tone (0.3)
  - Hue rotation (+60deg for green night vision effect)

---

## 🌐 2. NETWORK & CONNECTIVITY

### 2.1 Connection Methods
- **Wired Ethernet**: Primary connection method (must be reported to app)
- **Wi-Fi**: Support for wireless connection with SSID reporting
- **Local Network**: Must be discoverable on local network with IP address reporting

### 2.2 Network Protocol Requirements
- **Socket Communication**: TCP socket server on port 80
- **Local IP Address**: Must provide current socket address (e.g., 192.168.0.2:80)
- **SSID Reporting**: Must report both:
  - Current network SSID (e.g., "SAMi-5G")
  - Camera's own Wi-Fi SSID (e.g., "SAMi")
- **Dynamic IP Support**: Must support DHCP for automatic IP assignment
- **Connection State**: Must report real-time connection status:
  - "online" - Camera connected and functioning
  - "offline" - Camera disconnected or unreachable
  - "fault" - Camera hardware/connection error

### 2.3 Internet Features (Optional)
- **Internet Viewing**: Support for remote viewing capability
- **Port Forwarding**: Configurable port for internet access
- **Browser Viewer**: Support for web-based viewing interface
- **Cloud Integration**: AWS socket support for cloud connectivity (optional)

---

## 🎥 3. VIDEO STREAMING & RECORDING

### 3.1 Live Video Feed
- **Real-time Streaming**: Must provide continuous low-latency video stream to iOS app
- **Video Encoding**: H.264 or compatible codec for iOS compatibility
- **Stream Quality**: Adjustable bitrate based on network conditions

### 3.2 Recording Functionality
The camera must support three recording modes:

#### Mode 1: Never
- No recordings are saved to SD card
- Live view only

#### Mode 2: Motion Only (Default)
- Record ONLY when motion is detected
- Motion detection threshold: Adjustable 0-100%
- Record threshold setting: 0-100% (controls sensitivity)
- Must support the app's motion detection parameters

#### Mode 3: Everything
- Continuous recording to SD card
- 24/7 recording regardless of motion

### 3.3 Recording Parameters
- **Record Threshold**: Camera must accept threshold value 0-100% from app
- **Motion Sensitivity**: Must work with app's configurable motion detection sensitivity
- **File Format**: MP4 or compatible format for iOS playback
- **Timestamp Embedding**: All recordings must include:
  - Date: MM/DD/YYYY format
  - Time: HH:MM:SS with AM/PM
  - Day of week
  - Format example: "Tuesday, December 16 2025 at 7:38:00AM"

### 3.4 Recording Schedule
Camera must support up to 4 configurable recording schedules:
- **Schedule 1**: Default "All day, Everyday"
- **Schedule 2-4**: User-definable time ranges
- **Schedule Control**: Ability to enable/disable each schedule independently

### 3.5 SD Card Management
Camera must provide the following SD card information:
- **Card Status**: OK, Full, Error, Missing
- **Recording Count**: Total number of recordings stored
- **Free Space**: Available storage capacity
- **Format Function**: Support remote SD card formatting via app command
- **Recording List**: Provide metadata for all recordings:
  - Filename/ID
  - Duration (in seconds)
  - Timestamp
  - File size
  - Thumbnail/preview frame

---

## 🔍 4. NIGHT VISION & ILLUMINATION

### 4.1 Night Vision Mode
Camera must support 4 distinct night vision modes:

#### Off
- Night vision disabled
- IR filter remains in normal (color) position
- IR illuminator OFF

#### On
- Night vision always enabled
- IR filter removed (monochrome mode)
- IR illuminator always ON

#### Auto (Default)
- Automatic switching based on ambient light detection
- Camera decides when to enable IR filter and illuminator
- Smooth transition between modes

#### Auto+
- Enhanced automatic mode with more aggressive sensitivity
- Earlier activation in low-light conditions
- Optimized for dark environments

### 4.2 IR Illuminator Mode
Independent control of IR illuminator (3 modes):

#### Off
- IR illuminator disabled
- Useful for external IR light sources

#### On
- IR illuminator always on
- Maximum illumination

#### Auto (Default)
- Illuminator controlled automatically based on night vision mode and ambient light

### 4.3 IR Filter Control
- **Mechanical Filter**: Must support mechanical IR cut filter
- **Filter Modes**: On (color mode) / Off (night vision mode)
- **Auto Switching**: Filter must switch automatically in Auto/Auto+ modes
- **Response Time**: Filter switch should complete within 2 seconds

---

## 🚨 5. MOTION DETECTION

### 5.1 Motion Detection Engine
The camera must provide:
- **Real-time Motion Analysis**: Continuous frame-by-frame motion detection
- **Configurable Sensitivity**: Accept sensitivity value 0-100% from app
- **Active Area Support**: Accept custom rectangular detection zone from app
- **Motion Level Reporting**: Real-time motion intensity 0-100%

### 5.2 Active Area (Border Detection)
The camera must support configurable motion detection zone:
- **Rectangle Definition**: X, Y, Width, Height in pixel coordinates
- **Coordinate System**: Relative to full camera frame
- **Dynamic Updates**: Accept zone changes in real-time without stream interruption
- **Border Size**: Support adjustable border thickness 0-100%
- **Smart Border**: Optional intelligent edge detection enhancement

### 5.3 Motion Threshold Settings
- **Movement Threshold**: 0-100%, controls minimum motion level to trigger detection
- **Time Threshold**: 0-100%, controls duration motion must persist
- **Sensitivity Boost**: 0-100% additional sensitivity multiplier

### 5.4 Motion Event Reporting
Camera must report to app:
- **Motion Detected**: Binary flag (true/false)
- **Motion Intensity**: Current motion level 0-100%
- **Motion Duration**: How long motion has been continuous (seconds)
- **Motion Location**: Coordinates of detected motion within active area (optional)

---

## 🔊 6. AUDIO CAPABILITIES

### 6.1 Microphone Input
- **Audio Detection**: Real-time sound level monitoring
- **Sound Level Reporting**: Audio volume 0-100% to app
- **Microphone Boost**: Support for amplification setting (on/off)
- **Noise Reduction**: Optional noise reduction algorithm (on/off)

### 6.2 Two-Way Audio (Optional)
- **Speaker Output**: Support for audio playback from app
- **Talk-Back**: Real-time bidirectional audio communication
- **Volume Control**: Adjustable output volume

---

## 📡 7. FIRMWARE & UPDATES

### 7.1 Firmware Information
Camera must provide:
- **Firmware Version**: Format: `XXX.YYYYMMDD` (e.g., 143.20190319)
  - XXX = version number
  - YYYYMMDD = build date
- **Model Information**: Hardware model and revision
- **Update Status**: Current update availability status

### 7.2 Firmware Update Process
- **Remote Update**: Support OTA (Over-The-Air) firmware updates
- **Update Initiation**: Accept update command from app
- **Update Progress**: Report update progress percentage
- **Auto-Recovery**: Ability to recover from failed updates
- **Version Check**: App must be able to query current and available firmware versions

---

## ⚙️ 8. CONFIGURATION & SETTINGS

### 8.1 Camera Settings API
The camera must accept and respond to the following configuration commands:

#### Video Settings
- Set Night Vision Mode (Off/On/Auto/Auto+)
- Set IR Illuminator Mode (Off/On/Auto)
- Set Record Mode (Never/Motion Only/Everything)
- Set Record Threshold (0-100%)

#### Motion Detection Settings
- Set Motion Threshold (0-100%)
- Set Sensitivity Boost (0-100%)
- Set Active Area Rectangle (x, y, width, height)
- Set Border Size (0-100%)
- Enable/Disable Smart Border

#### Audio Settings
- Enable/Disable Microphone Boost
- Enable/Disable Noise Reduction

#### Visual Indicators
- Enable/Disable Power LED
- Enable/Disable Power Light Flash (for internet viewer notification)

#### Network Settings
- Set Wi-Fi Credentials
- Set IP Address Mode (Dynamic/Static)
- Set Static IP Configuration (if applicable)

### 8.2 Password Protection
- **Camera Password**: Support password-protected access
- **Password Length**: Minimum 8 characters
- **Password Change**: Support remote password modification via app

### 8.3 Factory Reset
Camera must support factory reset functionality:
- **Reset Command**: Accept factory reset instruction from app
- **Reset Scope**: Restore all settings to factory defaults:
  - Network configuration
  - Recording settings
  - Motion detection settings
  - Password (reset to default)
  - Night vision mode (reset to Auto)
- **Preserve**: Firmware version should NOT be reset
- **Reboot**: Automatic reboot after factory reset

### 8.4 Camera Reboot
- **Soft Reboot**: Restart without losing settings
- **Reboot Command**: Accept reboot instruction from app
- **Reboot Time**: Complete reboot within 30 seconds
- **Auto-reconnect**: Automatically reconnect to network after reboot

---

## 🔔 9. ALARM & NOTIFICATION INTEGRATION

### 9.1 Alarm Events
The camera does NOT generate alarms (alarms are app-side), but must support:
- **Motion Event Triggers**: Provide motion data for app alarm logic
- **Real-time Data**: Low-latency motion and audio level reporting
- **Continuous Monitoring**: Uninterrupted monitoring even during recordings

### 9.2 Camera Fault Detection
Camera must report fault conditions:
- **Connection Lost**: When network connection is interrupted
- **Hardware Error**: When camera hardware malfunctions
- **SD Card Error**: When SD card fails or becomes full
- **Fault Recovery**: Automatic recovery when fault condition resolves

---

## 📊 10. STATUS & HEALTH REPORTING

### 10.1 Real-time Status
Camera must continuously report:
- **Connection State**: online/offline/fault
- **Recording State**: idle/recording
- **SD Card Status**: OK/Full/Error/Missing
- **Current Mode**: Active night vision mode
- **Current Settings**: All current configuration values

### 10.2 Diagnostic Information
For support and troubleshooting, camera must provide:
- **Socket Address**: Current IP:Port
- **Last Working LAN Socket**: Last successful connection address
- **Last Working SSID**: Last successful Wi-Fi network
- **Uptime**: Time since last boot
- **Temperature**: Internal camera temperature (optional)
- **Error Logs**: Recent error messages and codes

---

## 🔐 11. SECURITY REQUIREMENTS

### 11.1 Local Network Security
- **Encrypted Communication**: Support TLS/SSL for data transmission (recommended)
- **Authentication**: Password-based authentication for all commands
- **Session Management**: Secure session handling for app connections

### 11.2 Data Privacy
- **Local Processing**: All video processing should occur locally when possible
- **No Cloud Requirement**: Camera must function fully on local network without cloud
- **User Data Protection**: No transmission of video/audio without explicit user configuration

---

## 📱 12. iOS APP INTEGRATION SPECIFICS

### 12.1 Pairing Process
Camera must support device discovery and pairing:
1. **Broadcast Discovery**: Respond to network broadcast for device discovery
2. **Device Identification**: Provide model name and unique ID
3. **Pairing Confirmation**: Accept pairing request from app
4. **Save Configuration**: Remember paired devices

### 12.2 Connection Requirements
- **Persistent Connection**: Maintain persistent connection while app is active
- **Auto-reconnect**: Automatically reconnect when app reopens
- **Connection Timeout**: 30 second timeout for initial connection
- **Keepalive**: Send keepalive packets every 10 seconds

### 12.3 Communication Protocol
- **Command Format**: JSON-based or binary protocol (specify in API docs)
- **Response Time**: < 500ms response to configuration commands
- **Status Updates**: Push status updates every 1 second
- **Motion Data**: Push motion level data at minimum 5 Hz

---

## 📋 13. SUPPORTED FEATURES SUMMARY

### Must Have (Required)
✅ Unique device ID  
✅ Live video streaming  
✅ Night vision with Auto mode  
✅ IR illuminator control  
✅ Motion detection with configurable active area  
✅ SD card recording (Motion Only mode)  
✅ Recording timestamp embedding  
✅ Wired/Wi-Fi connectivity  
✅ Real-time status reporting  
✅ Firmware update support  
✅ Factory reset & reboot  
✅ Microphone with sound level detection  
✅ Power LED control  

### Should Have (Recommended)
⭐ Auto+ night vision mode  
⭐ Microphone boost  
⭐ Noise reduction  
⭐ Smart Border detection  
⭐ Browser viewer support  
⭐ Recording schedules (4 slots)  
⭐ Power light flash indicator  
⭐ Temperature monitoring  

### Nice to Have (Optional)
💡 Two-way audio  
💡 Cloud connectivity (AWS)  
💡 Internet viewing  
💡 Dropbox integration  
💡 Advanced diagnostic logs  

---

## 🧪 14. TESTING & VALIDATION

### 14.1 Functional Testing
Camera must pass the following test scenarios:
- ✅ Pair with iOS app successfully
- ✅ Stream live video continuously for 8+ hours
- ✅ Switch night vision modes without stream interruption
- ✅ Detect motion accurately with 0-100% sensitivity settings
- ✅ Record motion events to SD card with correct timestamps
- ✅ Accept and apply all configuration changes within 500ms
- ✅ Recover from network disconnection within 30 seconds
- ✅ Complete firmware update without data loss
- ✅ Factory reset to known defaults
- ✅ Report fault conditions accurately

### 14.2 Performance Requirements
- **Video Latency**: < 1 second from camera to app display
- **Motion Detection Latency**: < 200ms from motion to app notification
- **Configuration Change**: < 500ms to apply new settings
- **Uptime**: 99%+ uptime during normal operation
- **Network Recovery**: < 30 seconds to reconnect after fault
- **SD Card Write**: Support continuous recording without frame drops

### 14.3 Compatibility Testing
- Test with iOS 16.0 and later
- Test on both Wi-Fi and wired Ethernet
- Test with SD cards: 32GB, 64GB, 128GB, 256GB
- Test in low-light and complete darkness
- Test at various distances (1m - 10m from subject)

---

## 📞 15. TECHNICAL SUPPORT REQUIREMENTS

### 15.1 Diagnostic Data Export
Camera must support exporting diagnostic information for support requests:
```
CAMERA SETTINGS:
SAMi camera: [Device ID]
model: SAMi-3c
camera state: [online/offline/fault]
firmwareVersion: [Version]
socketAddress: [IP:Port]
lastWorkingLanSocket: [IP:Port]
lastWorkingSSID: [SSID]
cameraSSID: [Camera SSID]
Connection Type: [Wired/Wireless]
NightVision Mode: [Current Mode]
IR Illuminator Mode: [Current Mode]
IR Filter Mode: [On/Off]
Record Mode: [Current Mode]
Record Motion Threshold: [Value]
Record Schedule 1-4: [Status]
SD Card: [Status]
Internet: [Enabled/Disabled]
Browser Viewer: [Enabled/Disabled]
Power Light: [Enabled/Disabled]
Power Light Flash: [Enabled/Disabled]
IP: [Dynamic/Static]
```

### 15.2 Support Contact
- Manufacturer must provide technical documentation
- API documentation for all commands and responses
- Integration support during development
- Ongoing support for firmware updates

---

## 📝 16. API COMMAND REFERENCE (Summary)

### 16.1 Required Commands (Camera Must Accept)
```
GET_STATUS - Query current camera status
SET_NIGHT_VISION_MODE - Set night vision mode
SET_IR_ILLUMINATOR_MODE - Set IR illuminator mode
SET_RECORD_MODE - Set recording mode
SET_RECORD_THRESHOLD - Set recording sensitivity
SET_MOTION_AREA - Set active detection area
SET_MOTION_SENSITIVITY - Set motion detection sensitivity
SET_RECORDING_SCHEDULE - Configure recording schedule
FORMAT_SD_CARD - Format SD card
UPDATE_FIRMWARE - Initiate firmware update
REBOOT - Reboot camera
FACTORY_RESET - Reset to factory defaults
SET_PASSWORD - Change camera password
SET_WIFI_CREDENTIALS - Set Wi-Fi network credentials
SET_POWER_LED - Enable/disable power LED
SET_POWER_LED_FLASH - Enable/disable power LED flash
ENABLE_MIC_BOOST - Enable/disable microphone boost
ENABLE_NOISE_REDUCTION - Enable/disable noise reduction
GET_RECORDINGS_LIST - Get list of all recordings
GET_RECORDING_METADATA - Get metadata for specific recording
DELETE_RECORDING - Delete specific recording
```

### 16.2 Required Status Reports (Camera Must Send)
```
CONNECTION_STATUS - online/offline/fault
MOTION_LEVEL - Current motion intensity 0-100%
AUDIO_LEVEL - Current audio level 0-100%
RECORDING_STATUS - idle/recording
SD_CARD_STATUS - OK/Full/Error/Missing
SD_CARD_SPACE - Free space in MB
RECORDING_COUNT - Total recordings stored
CURRENT_CONFIG - All current settings
FIRMWARE_VERSION - Current firmware version
TEMPERATURE - Camera temperature (optional)
ERROR_EVENT - Error code and message when faults occur
```

---

## ✅ 17. COMPLIANCE & CERTIFICATION

### 17.1 Required Certifications
- **FCC Certification**: For use in United States
- **CE Marking**: For use in European Union
- **RoHS Compliance**: Environmental standards
- **Safety Certifications**: UL/CSA or equivalent for electrical safety

### 17.2 Privacy & Legal Compliance
- **COPPA Compliance**: Children's Online Privacy Protection Act
- **GDPR Consideration**: Data protection (if applicable)
- **Local Recording Notice**: Camera must display indicator when recording (LED or on-screen)

---

## 🎯 18. QUALITY STANDARDS

### 18.1 Reliability
- **MTBF**: Minimum 50,000 hours mean time between failures
- **Operating Temperature**: 0°C to 40°C (32°F to 104°F)
- **Storage Temperature**: -20°C to 60°C (-4°F to 140°F)
- **Humidity**: 10% to 90% non-condensing

### 18.2 Video Quality
- **Low Light Performance**: Clear image in < 1 lux with IR illuminator
- **Frame Rate Stability**: Consistent frame rate ±2 fps
- **Color Accuracy**: Natural skin tones in normal light
- **Night Vision Quality**: Clear detail at 3-5 meters range

---

## 📖 19. DOCUMENTATION REQUIREMENTS

The camera manufacturer must provide:
1. **Technical Specification Sheet**: Complete hardware specifications
2. **API Documentation**: Detailed command protocol documentation
3. **Integration Guide**: Step-by-step integration instructions
4. **Troubleshooting Guide**: Common issues and solutions
5. **Firmware Release Notes**: Changes and improvements in each version
6. **Default Configuration**: Factory default settings documentation
7. **Network Configuration Guide**: Setup instructions for various network scenarios
8. **Safety & Warranty Information**: User safety guidelines and warranty terms

---

## 📧 20. CONTACT & SUPPORT

### Application Developer Contact
- **Company**: HiPass Design LLC
- **Support Email**: SAMi3_support@hipassdesign.com
- **Website**: https://www.samialert.com
- **Support Portal**: https://support.samialert.com

### Integration Support Needed
For successful integration, camera manufacturer must provide:
- Direct engineering contact for technical questions
- Sample camera units for testing and development
- Access to test firmware builds
- Response time: < 48 hours for critical integration issues

---

## 📅 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-12 | Initial requirements document based on SAMi 3.1.5 build 2 |

---

## 🔍 APPENDIX A: USE CASE SCENARIOS

### Scenario 1: Normal Night Monitoring
1. Parent places baby in crib at 7:00 PM
2. App enables alarm via schedule (7:00 PM - 7:00 AM)
3. Camera auto-switches to night vision mode (Auto)
4. Motion detection monitors baby within defined active area
5. If excessive motion detected, app triggers alarm
6. All motion events recorded to SD card

### Scenario 2: Camera Fault Recovery
1. Camera loses Wi-Fi connection
2. Camera reports "offline" status to app
3. App displays camera fault popup if "Beep on Camera Fault" enabled
4. After 10 seconds, app plays beep sound to alert parent
5. Camera auto-reconnects when Wi-Fi restored
6. Camera reports "online" status
7. App stops beep and closes popup

### Scenario 3: Recording Playback
1. Parent opens Recordings screen in app
2. App queries camera for recordings list
3. Camera provides metadata for all SD card recordings
4. Parent selects recording to view
5. Camera streams recorded video to app
6. Video displays with timestamp overlay and night vision effect

### Scenario 4: Firmware Update
1. Parent opens Camera Settings screen
2. App checks camera firmware version (e.g., 143.20190319)
3. App detects newer firmware available
4. Parent taps "Update" button
5. Camera downloads and installs new firmware
6. Camera reboots automatically
7. App reconnects to camera with new firmware

---

## 📊 APPENDIX B: TECHNICAL DIAGRAMS

### B.1 System Architecture
```
┌─────────────────┐
│   iOS App       │
│  (SAMi Monitor) │
└────────┬────────┘
         │ TCP Socket (Port 80)
         │ Local Network
         ▼
┌─────────────────┐
│  SAMi Camera    │
│   (SAMi-3c)     │
├─────────────────┤
│ • Video Stream  │
│ • Motion Engine │
│ • IR Control    │
│ • Audio Input   │
│ • SD Storage    │
└─────────────────┘
```

### B.2 Data Flow
```
Camera → App (Real-time Status Updates)
- Motion Level (5 Hz)
- Audio Level (5 Hz)
- Connection Status (1 Hz)
- Recording Status (1 Hz)

App → Camera (Configuration Commands)
- Set Night Vision Mode
- Set Recording Mode
- Set Motion Area
- Set Sensitivity
```

---

## 🎓 APPENDIX C: GLOSSARY

- **Active Area**: User-defined rectangular region for motion detection
- **Border Size**: Thickness of the active area border indicator
- **IR Illuminator**: Infrared LED light for night vision
- **IR Filter**: Mechanical filter that blocks infrared light in daylight mode
- **Motion Threshold**: Minimum motion intensity to trigger detection
- **Night Vision**: Monochrome infrared imaging mode for low-light monitoring
- **Sensitivity Boost**: Additional motion detection sensitivity multiplier
- **Smart Border**: Intelligent boundary detection algorithm
- **Socket Address**: IP address and port for network communication

---

**END OF DOCUMENT**

*This requirements document is based on the SAMi Baby Monitor iOS application version 3.1.5 build 2. Camera manufacturers should use this as a comprehensive guide for hardware and firmware development to ensure full compatibility with the SAMi monitoring ecosystem.*
