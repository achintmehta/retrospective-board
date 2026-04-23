# Proposal: Retro Board Export (Markdown & PDF)

## Summary
Implement a feature that allows users to export the current state of a retrospective board into either a **Markdown (.md)** or **PDF (.pdf)** file. This enables teams to archive their findings, share them in other platforms (like GitHub or Slack), or print them for physical record-keeping.

## Problem
Currently, the retrospective data is confined to the application database. There is no easy way to:
- Share board results with stakeholders who don't have access to the app.
- Incorporate retrospective outcomes into project documentation (e.g., GitHub READMEs).
- Preserve a static "snapshot" of a session for historical reference.

## Proposed Solution
Add an **"Export Board"** functionality to the board view. This feature will:
- Collect the entire board state (columns, cards, authors, reactions, and replies).
- Generate a formatted **Markdown** file that preserves structure and includes image links.
- Generate a printable **PDF** file that includes visual representations of the cards and embedded images.

### Key Features:
- **Comprehensive Data**: Export includes all columns, cards, reactions (with counts), and threaded replies.
- **Image Support**: Exported files will include or link to images attached to cards and replies.
- **Dual Formats**: Choice of Markdown for easy editing/integration or PDF for visual fidelity.

## Non-goals
- Exporting multiple boards at once.
- Exporting to Excel or CSV (initially, can be added later).
- Real-time collaborative editing of the exported file.
