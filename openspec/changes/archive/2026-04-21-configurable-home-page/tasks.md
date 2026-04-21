## 1. Backend: Database & Handlers

- [x] 1.1 Add the `app_settings` table to `server/src/db/database.js`.
- [x] 1.2 Implement `getAppSettings` and `updateAppSetting` in `server/src/db/boardHandlers.js`.

## 2. Backend: API Endpoints

- [x] 2.1 Register the `GET /api/settings` route in `server/src/index.js` to return all settings.
- [x] 2.2 Register the `POST /api/settings` route in `server/src/index.js` to update application settings.

## 3. Frontend: Dynamic Rendering

- [x] 3.1 Update `HomePage.jsx` to fetch application settings on component mount.
- [x] 3.2 Replace the hardcoded Header branding in `HomePage.jsx` with dynamic state-driven values.

## 4. Frontend: Settings UI

- [x] 4.1 Add a "Settings" gear icon to the `HomePage` header that toggles a configuration UI.
- [x] 4.2 Implement a settings modal/panel to allow updating the Application Title, Subtitle, and Logo.
- [x] 4.3 Support both emoji selection and image uploads for the site logo in the settings UI.

## 5. Verification

- [x] 5.1 Verify that updating settings immediately reflects on the home page.
- [x] 5.2 Verify that custom uploaded images appear correctly as site logos.
- [x] 5.3 Verify persistence of settings after a full server restart.
