## 1. Setup & Utilities
- [x] 1.1 (Note: Native browser print used for PDF, jspdf optional)
- [x] 1.2 Create `client/src/utils/MarkdownExport.js` for board-to-markdown conversion.
- [x] 1.3 Create `client/src/utils/PdfExport.js` for board-to-pdf conversion using native print.

## 2. Export UI
- [x] 2.1 Create `BoardExportModal.jsx` to allow users to choose export formats.
- [x] 2.2 Add an "Export" button to the `BoardPage.jsx` header.
- [x] 2.3 Implement the triggers for downloading generated files.

## 3. Formatting & Images
- [x] 3.1 Ensure Markdown output correctly handles card reactions and threaded replies.
- [x] 3.2 Ensure PDF output captures card images and reply images by pre-loading them as DataURIs (Native print handles this).
- [x] 3.3 Style the "Export View" (the DOM used for PDF capture) to be clean and readable.

## 4. Testing & Verification
- [x] 4.1 Verify Markdown export opens correctly in a markdown viewer.
- [x] 4.2 Verify PDF export includes all columns, cards, and reactions in a multi-page layout.
- [x] 4.3 Test export with a board contains large images and many replies.
