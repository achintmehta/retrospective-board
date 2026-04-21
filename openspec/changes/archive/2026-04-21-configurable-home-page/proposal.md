## Why

The application currently has a hardcoded home page title, subtitle, and icon. This limits its appeal for teams who want to personalize their self-hosted instance. Providing a way to configure these elements allows the RetroBoard to feel like a native tool for any organization or project.

## What Changes

- **Application Settings Storage**: Implement a persistent key-value store in the database for global application settings.
- **Configurable Branding**: Allow the modification of the Home Page Title and Subtitle via the UI.
- **Custom Branding Icon**: Support uploading an image or selecting an emoji to be used as the application's logo/icon on the home page.
- **Admin Interface**: Introduce a simple "Settings" toggle on the home page to access these configuration options.

## Capabilities

### New Capabilities
- `app-settings`: Capabilities for managing global application configurations, including branding elements like titles and icons.

### Modified Capabilities
*(None)*

## Impact

- **Database**: New `settings` table in SQLite.
- **API**: New endpoints for retrieving (`GET /api/settings`) and updating (`POST /api/settings`) application configurations.
- **Frontend**: 
    - `HomePage.jsx` will fetch and display these settings dynamically.
    - New UI controls for editing settings and uploading branding images.
- **Storage**: Increased usage of the `uploads/` directory for application branding assets.
