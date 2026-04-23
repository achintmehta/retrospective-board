# Design: Retro Board Export

## Overview
The export feature will be implemented primarily on the frontend to leverage the already hydrated board state and minimize server load. It will use specialized generators for Markdown and PDF.

## User Interface
- **Export Trigger**: A new "Export" button in the `BoardPage` header, next to the "Add Column" or "Settings" icons.
- **Export Options**: A dropdown or simple modal allowing the user to select "Download as Markdown" or "Download as PDF".

## Export Format: Markdown
- **Implementation**: A pure JavaScript utility that converts the board JSON object into a string.
- **Structure**:
  - `# [Board Name]`
  - `## [Column Name]`
  - For each card:
    - `### [Author] (if present)`
    - `[Content]`
    - `![Image](URL) (if present)`
    - **Reactions**: `👍 x3, ❤️ x1`
    - **Replies**:
      - `> [Author]: [Content]`
      - `> ![Image](URL)`

## Export Format: PDF
- **Option A (Print-based)**: Use a hidden print-optimized stylesheet and `window.print()`. While simple, it requires the browser's print dialog and can be inconsistent.
- **Option B (Library-based)**: Use `jspdf` and `html2canvas` to capture the board DOM or a dedicated hidden "Export View". This provides the best control over layout and embedding images.
- **Selected Approach**: Use `jspdf` for a predictable, single-file download experience.

## Image Handling
- Images are currently served via `/uploads/[filename]`.
- For Markdown: Use relative paths (e.g., `../uploads/...`) if used locally, or absolute URLs if the server is accessible.
- For PDF: The images must be fetched and converted to Base64/DataURIs to be embedded into the PDF file.

## Technical Components
- `BoardExportService.js`: Utility for generating Markdown.
- `BoardExportModal.jsx`: UI for selecting export format.
- `BoardPage.jsx`: Integration point.
