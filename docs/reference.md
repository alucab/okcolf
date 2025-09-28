## Code Modification & Dependency Management
The AI is empowered to modify the codebase autonomously based on user requests. The AI is creative and anticipates features that the user might need even if not explicitly requested.Core Code Assumption: The AI will primarily modify .html, .css, and .js files. It will create new files as needed and ensure they are correctly linked in index.html.

## Dependency Management: 
Include Onsen UI and jQuery via CDN links with Subresource Integrity (SRI) hashes for security, or install them via npm if a package.json is present. For backend, use Firebase SDK from CDN/npm or PocketBase JS client. Prefer ES Modules for JavaScript organization where possible, but integrate jQuery for DOM handling.

## UI Components with Onsen UI and Alpine.js
The AI will use Onsen UI to create mobile-first, hybrid UI elements that work seamlessly on web, iOS, and Android without heavy frameworks. the interface will be mobile first

### Setup: 
Include Onsen UI, Alpine and jQuery via CDN in index.html using always the last version not versioned links

### Core Components: 
Utilize built-in elements like <ons-page>, <ons-navigator>, <ons-button>, <ons-list>, <ons-tabbar>, and <ons-carousel> for navigation, lists, buttons, and more.

### Data aware and dynamic components amd Customization: 
Alpine.js gestisce i dati e il binding dichiarativo (liste, modelli, eventi).
- Con x-data dichiari i tuoi dati
- Con x-for fai il rendering automatico delle liste
- Con x-model ottieni binding bidirezionale (dati <-> input)
- Con x-on colleghi azioni agli eventi senza addEventListener

jQuery lo usi solo come “toolbox” per:
- manipolazioni DOM complesse (animazioni particolari, plugin jQuery già pronti)
- selezioni rapide ($('#id .class'))
- compatibilità con librerie legacy
⚠️ Devi stare attento a non rompere il binding di Alpine 

## Development Rules
### JavaScript with jQuery
The AI will write clean, efficient JavaScript, leveraging jQuery for DOM manipulation, events, and AJAX, while incorporating modern ES features.
- Use it for selectors ($('.class')), events (.on('click')), animations (.fadeIn()), and AJAX (.ajax()).
- ES Modules: Use import and export to organize code into reusable modules where modern JS is needed.
- Async/Await: Handle asynchronous operations (like $.ajax or fetch) with clean, readable syntax.
- The fetch API or jQuery AJAX: Make network requests to APIs or backends like Firebase/PocketBase.
- Promises: Work with asynchronous results in a structured way.
- Modern Syntax: Utilize arrow functions, destructuring, spread/rest operators, and optional chaining (?.), combined with jQuery methods.

### Backend Integration: Firebase or PocketBase
The AI will integrate either Firebase or PocketBase based on user preference or project needs (e.g., Firebase for serverless cloud, PocketBase for self-hosted).
All the operations related to backend will be abstracted in file api.js. 
The objective is to minimize the impact of backend technology change 

### Firebase Setup: 
Include Firebase SDK via CDN. Initialize with config: const app = firebase.initializeApp(firebaseConfig);. Use services like Firestore, Authentication, Storage, and Realtime Database.

### PocketBase Setup: 
Include PocketBase JS SDK via CDN. Initialize: 
const pb = new PocketBase('http://127.0.0.1:8090');. 
Use collections for database, auth, file uploads, and real-time subscriptions.
Data Handling: For both, implement CRUD operations, authentication (email/password, OAuth), and real-time updates (e.g., Firebase's onSnapshot or PocketBase's subscribe).

### Offline first operations 
The app will be designed to operate in ofline first mode.
Data operations will be done on sql.js file. All the operations will be abstracted in file db.js
Tha application will include a way to synchronize the database with the cloud without interrupting user operations.
Status of this will be accessible.

### Offline first login
Tha application will have a modern login and session system and it will persist the login so that a user opening the app from the phone within few days will not need to login again

### Hybrid Support: 
Ensure compatibility with Cordova/PhoneGap if targeting native apps.

## Visual Design
### Aesthetics: 
- The AI always makes a great first impression by creating a unique user experience that incorporates Onsen UI components, a visually balanced layout with clean spacing, and polished styles that are easy to understand.Build beautiful and intuitive user interfaces that follow modern design guidelines.
- Ensure your app is mobile responsive and adapts to different screen sizes, working perfectly on mobile and web (mobile is more important!)
- Propose colors, fonts, typography, iconography, animation, effects, layouts, texture, drop shadows, gradients, etc., integrated with Onsen UI.
- If images are needed, make them relevant and meaningful, with appropriate size, layout, and licensing (e.g., freely available). If real images are not available, provide placeholder images.
- If there are multiple pages, use Onsen UI's <ons-navigator> or <ons-tabbar> for intuitive navigation.

### Bold Definition: 
- The AI uses modern, interactive iconography, images, and UI components like buttons, text fields, animation, effects, gestures, sliders, carousels, navigation, etc.Fonts - Choose expressive and relevant typography. Stress and emphasize font sizes to ease understanding, e.g., hero text, section headlines, list headlines, keywords in paragraphs, etc.
- Color - Include a wide range of color concentrations and hues in the palette to create a vibrant and energetic look and feel, compatible with Onsen UI themes.
- Texture - Apply subtle noise texture to the main background to add a premium, tactile feel.
- Visual effects - Multi-layered drop shadows create a strong sense of depth. Cards have a soft, deep shadow to look "lifted."
- Iconography - Incorporate Onsen UI icons or third-party sets to enhance understanding and navigation.
- Interactivity - Buttons, checkboxes, sliders, lists, charts, graphs, and other elements use jQuery for interactions and Onsen UI for "glow" effects.

## Iterative Development, Planning & User Interaction
The AI's workflow is iterative, transparent, and responsive to user input.
Each time the user requests a change, the AI will first generate a clear plan overview and a list of actionable steps. This plan will then be used to create or update a blueprint.md file in the project's root directory.The blueprint.md file will serve as a single source of truth, containing:
- A section with a concise overview of the purpose and capabilities.
- A section with a detailed outline documenting the project, including all style, design, and features implemented in the application from the initial version to the current version.
- A section with a detailed section outlining the plan and steps for the current requested change.
- Before initiating any new change, the AI will reference the blueprint.md to ensure full context and understanding of the application's current state.
- Prompt Understanding: The AI will interpret user prompts to understand the desired changes. It will ask clarifying questions if the prompt is ambiguous.
- Contextual Responses: The AI will provide conversational responses, explaining its actions, progress, and any issues encountered. It will summarize changes made.
- Error Checking Flow:Code Change: AI applies a code modification.
- Dependency Check: If a package.json was modified, AI runs npm install.
- Preview Check: AI observes the browser preview and developer console for visual and runtime errors.
- Remediation/Report: If errors are found, AI attempts automatic fixes. If unsuccessful, it reports details to the user.
## Automated Error Detection & Remediation
A critical function of the AI is to continuously monitor for and automatically resolve errors to maintain a runnable and correct application state.
- Post-Modification Checks: After every code modification, the AI will:Monitor the IDE's diagnostics (problem pane) for errors.
- Check the browser preview's developer console for runtime errors, 404s, and rendering issues.
- Automatic Error Correction: The AI will attempt to automatically fix detected errors. This includes, but is not limited to:Syntax errors in HTML, CSS, or JavaScript.
Incorrect file paths in <script>, <link>, or <img> tags. Common jQuery or Onsen UI runtime errors.

- Problem Reporting: If an error cannot be automatically resolved, the AI will clearly report the specific error message, its location, and a concise explanation with a suggested manual intervention or alternative approach to the user.