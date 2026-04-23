import React from 'react';
import './BoardExportModal.css';
import { downloadMarkdown } from '../utils/MarkdownExport';
import { downloadPdf } from '../utils/PdfExport';

const BoardExportModal = ({ board, onClose }) => {
  const handleExportMarkdown = () => {
    downloadMarkdown(board);
    onClose();
  };

  const handleExportPdf = () => {
    downloadPdf();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Export Board</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body-export">
          <p className="export-desc">
            Choose a format to save your current board state, including all columns, cards, reactions, and replies.
          </p>
          
          <div className="export-options">
            <button className="btn-export-option" onClick={handleExportMarkdown}>
              <div className="option-icon">📄</div>
              <div className="option-text">
                <span className="option-title">Markdown (.md)</span>
                <span className="option-subtitle">Best for docs, GitHub, or easy editing</span>
              </div>
            </button>

            <button className="btn-export-option" onClick={handleExportPdf}>
              <div className="option-icon">🖼️</div>
              <div className="option-text">
                <span className="option-title">PDF (.pdf)</span>
                <span className="option-subtitle">Best for printing or visual snapshots</span>
              </div>
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BoardExportModal;
