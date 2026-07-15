# 🔒 User Story: Lock Button

**As a** parent using the SAMi monitor, **I want** a Lock button that prevents accidental screen touches and interaction with controls, **So that** I can safely place the monitor device without worrying about unintended changes to settings or alarm states.

---

## **Acceptance Criteria (AC):**

### **Button Location & Design:**

- Button is located in the bottom navigation bar (fourth position, between Motion and Recordings)
- Button displays a Lock icon with "Lock" label
- Background color: Grey (same as other inactive buttons)
- Icon and text color: White
- Button does not have active/inactive visual states (always grey)

### **Button Behavior:**

**Single Tap:**
- Toggles Lock state on/off
- If Lock is OFF, single tap enables Lock Mode
- If Lock is ON, single tap disables Lock Mode (no slider required when using the button)

**Immediate Effects:**
- When Lock is activated via button, "Slide to unlock" slider appears immediately
- When Lock is deactivated via button, sleeping mode is cancelled if active

### **Lock Mode States:**

#### **State 1: Unlocked (Default)**
- All controls are accessible and functional
- Bottom navigation panel can be toggled by tapping the screen
- Sliders (volume, sensitivity, movement, time) are adjustable
- All buttons respond to single taps

#### **State 2: Locked - Active State**
- "Slide to unlock" slider appears at bottom center of screen
- Bottom navigation panel is still visible and accessible
- Lock button in bottom nav remains functional (can tap to unlock)
- Screen taps do NOT toggle the bottom navigation panel
- Control sliders are not adjustable
- After 3 seconds of no interaction, transitions to Sleeping Mode

#### **State 3: Locked - Sleeping Mode**
- Grey overlay appears over entire screen (semi-transparent)
- All UI elements remain visible but dimmed
- "Slide to unlock" slider is hidden
- Bottom navigation panel remains accessible
- Any tap on screen wakes up to "Locked - Active State"
- Sleeping mode timer resets to 3 seconds

### **"Slide to Unlock" Slider:**

**Appearance:**
- Located at bottom center of screen
- Horizontal slider with rounded corners
- Background: Dark grey with border
- Contains text "Slide to unlock" in center
- Draggable handle on left side with arrow icon pointing right
- Handle has blue gradient background with glow effect

**Interaction:**
- User must drag handle from left to right
- Slider shows progress as handle moves
- When handle reaches 90% or more, unlocks automatically
- If released before 90%, handle snaps back to start position
- Requires continuous drag motion (not tap-based)

**Unlocking Behavior:**
- Upon reaching 90%, Lock Mode is disabled immediately
- Slider disappears
- "Display unlocked" message appears for 10 seconds
- Sleeping mode is cancelled if active
- Normal interaction is restored

### **Sleeping Mode Details:**

**Entry Conditions:**
- Lock Mode must be ON
- No slider dragging activity
- 3 seconds of inactivity

**Visual Changes:**
- Semi-transparent grey/black overlay covers entire screen
- All elements underneath remain visible but dimmed
- "Slide to unlock" slider is hidden during sleep
- Transition has smooth fade effect

**Wake-Up Behavior:**
- Any tap anywhere on screen wakes the display
- Grey overlay fades out
- "Slide to unlock" slider reappears
- Sleeping mode timer resets to 3 seconds

**Continuous Cycle:**
- If no interaction after waking, returns to sleeping mode after 3 seconds
- Cycle continues until Lock Mode is disabled

### **Lock Mode Restrictions:**

**Disabled Functionality:**
- Screen taps do NOT toggle bottom navigation panel visibility
- Control sliders cannot be adjusted (Volume, Sensitivity, Movement Threshold, Time Threshold)
- Border thickness adjustment is disabled

**Enabled Functionality:**
- Bottom navigation bar remains visible and accessible
- Lock button can be tapped to unlock
- All other navigation buttons remain functional (Clock, Border, Motion, Recordings, Help, Settings)
- Border, Motion, and other features can still be toggled on/off
- Settings, Help, Recordings screens can still be accessed
- Alarm button remains fully functional
- Microphone button remains fully functional

### **Integration with Other Features:**

**When Lock Activates:**
- Does not affect alarm state (On/Paused/Off remains unchanged)
- Does not affect Border detection state
- Does not affect Motion detection state
- Does not affect Microphone state
- Does not affect Camera feed state
- Does not affect Recording state

**When Lock Deactivates:**
- Sleeping mode is immediately cancelled if active
- Grey overlay fades out instantly
- Normal screen interaction is restored
- Bottom panel toggle functionality returns

**With Other UI Hints:**
- "Display unlocked" message appears for 10 seconds after sliding to unlock
- If Border hint, Motion hint, or Hold hint appears, "Display unlocked" message is hidden
- "Display unlocked" message hides Hold hint if hold hint is visible

### **Bottom Navigation Panel Behavior:**

**When Unlocked:**
- Tapping anywhere on main screen toggles panel visibility
- Panel can be shown/hidden
- Panel has 5-second auto-hide timer when visible

**When Locked:**
- Screen taps do NOT toggle panel visibility
- Panel remains in its current state (visible or hidden)
- Panel can still be accessed and buttons remain functional
- Auto-hide timer is disabled

---

## **QA Validation Notes:**

### **Test Scenarios:**

#### **1. Basic Lock/Unlock via Button:**

**Steps:**
1. Verify Lock button is in bottom navigation (fourth position)
2. Verify button shows Lock icon with "Lock" label in grey
3. Tap Lock button → Verify "Slide to unlock" slider appears
4. Verify slider shows "Slide to unlock" text with blue arrow handle
5. Tap Lock button again → Verify slider disappears and lock is disabled

**Expected Result:** Lock toggles on/off via button without requiring slider interaction

---

#### **2. Unlock via Slider - Success:**

**Steps:**
1. Tap Lock button → Verify "Slide to unlock" slider appears
2. Press and hold slider handle (blue arrow on left)
3. Drag handle smoothly to the right
4. Continue dragging until handle reaches 90% or more of slider width
5. Release the drag

**Expected Result:**
- Handle follows finger/cursor smoothly during drag
- When reaching 90%, Lock Mode disables immediately
- Slider disappears
- "Display unlocked" message appears for 10 seconds
- Normal interaction is restored

---

#### **3. Unlock via Slider - Failed Attempt:**

**Steps:**
1. Enable Lock Mode
2. Drag slider handle to 50% of width
3. Release drag before reaching 90%

**Expected Result:**
- Handle snaps back to starting position
- Lock Mode remains active
- Slider remains visible
- No unlock message appears

---

#### **4. Sleeping Mode Entry:**

**Steps:**
1. Enable Lock Mode → Verify "Slide to unlock" slider appears
2. Do not interact with screen for 3 seconds
3. Observe screen changes

**Expected Result:**
- After 3 seconds, grey overlay appears over entire screen
- All UI elements become dimmed but remain visible
- "Slide to unlock" slider disappears
- Bottom navigation remains accessible

---

#### **5. Wake from Sleeping Mode:**

**Steps:**
1. Enable Lock Mode and wait for Sleeping Mode to activate
2. Tap anywhere on the screen

**Expected Result:**
- Grey overlay fades out immediately
- "Slide to unlock" slider reappears
- Screen returns to normal brightness
- 3-second timer resets

---

#### **6. Sleeping Mode Cycle:**

**Steps:**
1. Enable Lock Mode
2. Wait 3 seconds for Sleeping Mode
3. Tap to wake
4. Wait another 3 seconds without interaction
5. Tap to wake again
6. Repeat 2 more times

**Expected Result:**
- Each tap wakes the display
- Each time, 3-second timer resets
- Sleeping mode re-activates after each 3-second period
- Cycle continues indefinitely until unlocked

---

#### **7. Lock Mode Restrictions - Screen Taps:**

**Steps:**
1. Verify bottom panel is visible
2. Enable Lock Mode
3. Tap on main screen area (not on buttons)
4. Tap multiple times in different areas

**Expected Result:**
- Bottom panel does NOT toggle visibility
- Panel remains in current state (visible)
- No other UI changes occur from screen taps

---

#### **8. Lock Mode Restrictions - Sliders:**

**Steps:**
1. Enable Lock Mode
2. Attempt to drag Volume slider
3. Attempt to drag Sensitivity slider
4. Attempt to drag Movement Threshold slider (if Motion is active)
5. Attempt to drag Time Threshold slider (if Motion is active)

**Expected Result:**
- All sliders are non-responsive
- Slider values do not change
- Handles do not move

---

#### **9. Lock Mode - Navigation Buttons Still Functional:**

**Steps:**
1. Enable Lock Mode
2. Tap Clock button → Verify Clock Mode opens
3. Exit Clock Mode
4. Tap Border button → Verify Border activates/deactivates
5. Tap Motion button → Verify Motion activates/deactivates
6. Tap Recordings button → Verify Recordings screen opens
7. Exit Recordings
8. Tap Help button → Verify Help screen opens
9. Exit Help
10. Tap Settings button → Verify Settings screen opens

**Expected Result:**
- All navigation buttons remain fully functional
- All screens can be accessed normally
- Lock Mode does not restrict navigation

---

#### **10. Lock Mode - Alarm Button Functionality:**

**Steps:**
1. Ensure Alarm is enabled in Settings
2. Enable Lock Mode
3. Tap alarm button to cycle through states (Off → On → Paused → Off)
4. Test hold-to-turn-off functionality when alarm is On

**Expected Result:**
- Alarm button responds normally to all interactions
- State changes work correctly
- Hold-to-turn-off works as expected
- Lock Mode does not affect alarm functionality

---

#### **11. Lock Mode - Microphone Button Functionality:**

**Steps:**
1. Enable Lock Mode
2. Tap microphone button → Verify mic turns on
3. Verify volume picker appears
4. Tap microphone button again → Verify mic turns off

**Expected Result:**
- Microphone toggles normally
- Volume picker appears when mic is on
- Lock Mode does not affect microphone functionality

---

#### **12. Lock Mode Persistence with Feature States:**

**Steps:**
1. Enable Alarm (set to On)
2. Enable Border detection
3. Enable Motion detection
4. Turn on Microphone
5. Enable Lock Mode
6. Unlock via slider
7. Verify all states

**Expected Result:**
- Alarm remains On
- Border remains active
- Motion remains active
- Microphone remains on
- All states persist through lock/unlock cycle

---

#### **13. Display Unlocked Message:**

**Steps:**
1. Enable Lock Mode
2. Slide to unlock completely (reach 90%)
3. Observe message appearance
4. Wait and observe message duration

**Expected Result:**
- "Display unlocked" message appears immediately upon unlock
- Message displays for exactly 10 seconds
- Message then disappears automatically

---

#### **14. Message Interaction with Hints:**

**Steps:**
1. Enable Lock Mode
2. Unlock via slider → "Display unlocked" message appears
3. Activate Border → Verify Border hint appears
4. Verify "Display unlocked" message is hidden

**Repeat for:**
- Motion hint (activate Motion detection)
- Hold hint (hold alarm button when On)

**Expected Result:**
- When any hint appears, "Display unlocked" message is immediately hidden
- Only one message/hint is visible at a time

---

#### **15. Lock Button During Sleeping Mode:**

**Steps:**
1. Enable Lock Mode
2. Wait for Sleeping Mode to activate (3 seconds)
3. Tap Lock button in bottom navigation

**Expected Result:**
- Lock Mode is disabled immediately
- Grey overlay disappears
- Sleeping mode is cancelled
- Normal interaction is restored
- "Slide to unlock" slider is not required

---

#### **16. Border Thickness Adjustment Lock:**

**Steps:**
1. Enable Border detection
2. Enable Lock Mode
3. Attempt to drag border edge to adjust thickness

**Expected Result:**
- Border thickness cannot be adjusted
- Dragging border has no effect
- Lock Mode prevents border adjustment

---

#### **17. Slider Visibility During Sleeping Mode:**

**Steps:**
1. Enable Lock Mode → "Slide to unlock" slider appears
2. Wait 3 seconds for Sleeping Mode
3. Observe UI changes

**Expected Result:**
- "Slide to unlock" slider disappears when Sleeping Mode activates
- Slider is not visible during sleeping state
- Grey overlay is present

---

#### **18. Bottom Panel State Preservation:**

**Steps:**
1. Hide bottom panel (tap screen to toggle off)
2. Enable Lock Mode
3. Tap screen multiple times
4. Unlock via slider

**Expected Result:**
- Panel remains hidden throughout Lock Mode
- Screen taps do not toggle panel
- Panel state is preserved after unlocking

---

#### **19. Dragging Activity Prevents Sleeping:**

**Steps:**
1. Enable Lock Mode
2. Continuously drag the "Slide to unlock" slider back and forth without releasing
3. Continue for more than 3 seconds
4. Observe screen

**Expected Result:**
- Sleeping Mode does NOT activate during dragging
- Grey overlay does not appear
- Slider remains visible and responsive

---

#### **20. Slider Visual Feedback:**

**Steps:**
1. Enable Lock Mode
2. Drag slider handle from 0% to various positions:
   - 25%
   - 50%
   - 75%
   - 89%
   - 90%

**Expected Result:**
- Handle follows drag position smoothly
- Progress fill expands proportionally
- At 90%, unlocking triggers immediately
- Below 90%, slider remains locked

---

## **Future Enhancement Considerations:**

1. **Lock Mode Settings:**
   - Configurable sleeping mode timer (3 seconds default)
   - Option to disable sleeping mode entirely
   - Option to hide bottom navigation when locked

2. **Auto-Lock Feature:**
   - Automatic lock after period of inactivity
   - Configurable auto-lock timer

3. **Lock Mode Customization:**
   - Choose which features remain accessible when locked
   - Option to disable specific buttons during lock

4. **Enhanced Security:**
   - PIN code or pattern unlock option
   - Biometric unlock (Face ID/Touch ID)

5. **Visual Indicators:**
   - Lock icon badge on screen when locked
   - Visual indication of Lock state in bottom navigation

6. **Accessibility:**
   - Voice command to unlock
   - Alternative unlock methods for users with motor difficulties

---
