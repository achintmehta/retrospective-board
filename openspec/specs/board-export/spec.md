# Board Export Specification

## Purpose
Define the requirements for exporting retrospective board data into external formats for archival, sharing, and documentation purposes.

## Requirements

### Requirement: Dual-Format Export
The system SHALL allow users to export the current board state into two distinct formats:
- **Markdown (.md)**: A structured text format suitable for documentation and developer platforms.
- **PDF (.pdf)**: A visual snapshot of the board suitable for printing and formal reports.

### Requirement: Comprehensive Data Capture
Both export formats SHALL include the following board elements:
- Board Title
- Column Titles
- Card Contents
- Attachment Images (Cards and Replies)
- Author attribution (where present)
- Reactions (grouped by emoji with counts)
- Threaded Replies

### Requirement: Optimized Markdown Formatting
The Markdown export SHALL prioritize readability:
- **Emphasis**: Card content SHALL be highly visible, while authorship SHAll be de-emphasized using italics on a separate line.
- **Organization**: Data SHALL be organized hierarchically by column and card.
- **Images**: SHALL be embedded using standard markdown image syntax.

### Requirement: Clean PDF Capture
The PDF export SHALL provide a professional, read-only representation:
- **Summary Header**: SHALL include Board Name, current Date, and participation statistics (column/card counts).
- **Interface Scrubbing**: Interactive elements such as "Add Card/Column", "Reply", and "Reaction/Delete" buttons SHALL be hidden in the exported document.
- **Visual Fidelity**: Custom branding and theme colors SHALL be preserved in the output.
