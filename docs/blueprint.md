# **App Name**: TrafficPilot Dashboard

## Core Features:

- Real-time Traffic Light Status: Display the current status (Red, Yellow, Green) and timer for each traffic light in real-time, reflecting the data from Firebase RTDB.
- Manual Override Control: Allow users to manually control the traffic lights, overriding the automated system via toggle switch. Toggle status will be saved on Firebase RTDB.
- Traffic Mode Toggle: Switch between normal and peak hour traffic modes with a toggle, adjusting light timing accordingly based on parameters in the configuration section.
- Configuration Panel: Enable administrators to adjust timing configurations such as normal green time, peak green time, yellow time and all-red time intervals via dedicated panel, which are updated in Firebase RTDB.
- System Status Indicators: Show real-time status of rain detection, vehicle presence on roads, system status, current traffic phase, and operation mode, to reflect various conditions on the road, and alert when something may be wrong.
- Alerts via SMS: Allow users to setup GSM alerts, by providing phone number and configuration to enable and disable them, allowing notifications of system errors and traffic updates via SMS. System online status alerts admin when system has an error.

## Style Guidelines:

- Primary color: Electric Purple (#BE69FF) to convey innovation and control.
- Background color: Very dark blue (#0A0E1B), providing contrast and focus.
- Accent color: Cyan (#00FFFF), used for interactive elements and key information display, highlighting real-time updates.
- Body and headline font: 'Space Grotesk', sans-serif for a techy, modern feel
- Font Awesome icons: Use consistent, minimalist icons from Font Awesome to represent different data points and actions, ensuring clarity.
- Responsive grid layout: Maintain a clean and adaptable layout using CSS Grid to ensure usability across different screen sizes.
- Subtle transitions: Implement smooth transitions and subtle animations for status changes and data updates, enhancing the user experience.