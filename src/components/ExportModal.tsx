import React, { useState } from 'react';
import { FullGeneratedContent } from '../types/generator';
import {
  exportToText,
  exportToMarkdown,
  exportCalendarToCsv,
  downloadFile,
} from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: FullGeneratedContent | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, content }) => {
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen || !content) return null;

  const handleDownloadTxt = () => {
    const text = exportToText(content);
    downloadFile(text, `book-kaaro-content-pack-${new Date().toISOString().slice(0, 10)}.txt`, 'text/plain;charset=utf-8;');
  };

  const handleDownloadMd = () => {
    const md = exportToMarkdown(content);
    downloadFile(md, `book-kaaro-content-pack-${new Date().toISOString().slice(0, 10)}.md`, 'text/markdown;charset=utf-8;');
  };

  const handleDownloadCsv = () => {
    const csv = exportCalendarToCsv(content.calendar || []);
    downloadFile(csv, `book-kaaro-calendar-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleCopyAll = async () => {
    try {
      const text = exportToText(content);
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Export Content Pack</h3>
            <p className="text-xs text-neutral-500">Download or copy your complete generated social pack.</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Plain Text (.txt) */}
            <button
              onClick={handleDownloadTxt}
              className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all cursor-pointer group"
            >
              <div className="font-semibold text-xs text-neutral-900 group-hover:text-black">
                📄 Plain Text (.txt)
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Complete package formatted for quick notepad review and copy-pasting.
              </div>
            </button>

            {/* Markdown (.md) */}
            <button
              onClick={handleDownloadMd}
              className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all cursor-pointer group"
            >
              <div className="font-semibold text-xs text-neutral-900 group-hover:text-black">
                📝 Markdown (.md)
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Formatted with headers and markdown tables for Notion or Obsidian.
              </div>
            </button>

            {/* Calendar CSV */}
            <button
              onClick={handleDownloadCsv}
              className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all cursor-pointer group"
            >
              <div className="font-semibold text-xs text-neutral-900 group-hover:text-black">
                📊 Calendar CSV (.csv)
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                7-Day schedule table ready for Google Sheets, Excel, or Buffer/Airtable import.
              </div>
            </button>

            {/* Copy All to Clipboard */}
            <button
              onClick={handleCopyAll}
              className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-left transition-all cursor-pointer group"
            >
              <div className="font-semibold text-xs text-neutral-900 group-hover:text-black">
                {copiedAll ? '✓ Copied to Clipboard!' : '📋 Copy Everything'}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Instantly copy the entire generated kit text to your clipboard.
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
