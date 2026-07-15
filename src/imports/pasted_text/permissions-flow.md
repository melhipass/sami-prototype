As a new Sami user, I want to understand why the application requires permissions, trigger the native OS authorization modals, and receive clear recovery instructions if I deny them, so that the application can discover and connect with my Sami camera.

Acceptance Criteria (AC)

AC 1: Location Permission Explainer

Action: The app must present an educational explainer view to the user.

Title: Access Permissions.

Copy Text: “Sami needs access to your location and Wi-Fi to identify available networks and help you connect your camera to your home network.“

Navigation Nodes:

Tapping the primary "Continue" button must dismiss the explainer and immediately request the native OS system location dialog.

Tapping the secondary "Cancel" or "Go Back" button must abort onboarding and return the user to the preceding Camera Ready Verification screen.

AC 2: Location Permission Dialog

Action: The application must call the native OS location permission engine modal.

Sub Title: Use the Sub Title provided by the OS or the one on Sami3

Options:

"Allow Once" or "Allow While Using App": The app must record the active authorization state change in memory and advance automatically to trigger the Local Network prompt.

"Do Not Allow": The app must halt progression and route the user to the Permissions Required Error Screen.

AC 3: Local Network Permission Dialog

Action: The app must request the native OS system local network permission modal.

Sub Title: Use the Sub Title provided by the OS or the one on Sami3

Options:

"Allow": The app registers the active local token and forwards the application flow to the Network Check/Camera Discovery screen.

"Do Not Allow": The app registers the denial state and drops the user directly onto the Permissions Required Error Screen.

AC 4: Permissions Required Error Screen

Error State View: When any required permission is denied, a view titled "Permissions Required" must be presented to block forward use.

Actionable Remediation Text: The user interface text must output exactly: "Sami needs Location and Network permissions to discover and connect to your Sami camera. Please go to your device's Settings > Sami > Permissions and enable Location and Local Network access." add a note in the text that the user needs to close and open again the app

Try Again: Tapping the prominent "Try Again" button must evaluate the app's current OS privilege tokens. If authorizations are resolved manually, it must route to camera discovery; if permissions are still missing, it must loop back to the app-controlled explainer screen.

Exit Setup: Tapping the "Exit Setup" button must cancel onboarding operations entirely and return the user to the base Welcome Screen.

Recovery After Closing App: If the user closes the app from the error state and returns, the app must evaluate the tokens again, show the error screen, and request the user to change them manually on the Phone System Settings.

Manual Revocation Recovery: If the user previously accepted the permissions but later manually denied them in the System Settings, attempting to pair a camera again must trigger the error screen to request manual permission re-enabling.

QA Validation Notes

Onboarding Happy Path Test: Complete a clean installation of the app. Advance through verification steps to the permission explainer view. Tap "Continue" and verify the native OS location dialog appears immediately. Tap "Allow While Using App", verify the native Local Network dialog displays next, and tap "Allow". Confirm the app routes natively into network discovery with zero interruption errors.

Location Re-Prompt Loop Test: Perform a clean installation. On the native Location window prompt, tap "Do Not Allow". Verify that the system routes you to the "Permissions Required" view layout. Tap "Try Again" and verify that it routes back to the app explainer screen rather than letting you bypass the security check or crashing the view cycle.

Manual Settings Update Recovery Test: Select "Do Not Allow" on the Local Network native modal window. When the "Permissions Required" screen displays, manually leave the app bundle, launch the native OS Settings tool, locate the application parameters container, and manually enable local network permissions. Re-enter the app and tap "Try Again". Verify that the engine identifies the new authorization tokens and moves straight to device discovery.

Onboarding Abort Routing Test: On the "Permissions Required" view, tap the secondary "Exit Setup" option row asset. Verify that all active provisioning steps clear out of local volatile storage memory and that you are returned directly to the default Welcome layout context.

App Closure and Return Test: From the "Permissions Required" screen, force close the app entirely. Relaunch the app and verify it runs background checks, blocks entry, and places you back onto the manual recovery error screen automatically.

Manual Revocation Test: Complete the happy path so all permissions are active. Exit the app, open the OS System Settings, and manually revoke location or network access. Re-open the app. Verify that the app catches the revocation and smoothly presents the "Permissions Required" screen to guide the user to fix it.

