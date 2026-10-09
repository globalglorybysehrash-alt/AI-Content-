import React, { useState, useEffect, useRef } from 'react';

interface InlineEmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

interface EmojiCategory {
  name: string;
  icon: string;
  emojis: { char: string; name: string }[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: 'Branded & Impact',
    icon: '🚀',
    emojis: [
      { char: '🚀', name: 'rocket launch growth' },
      { char: '💡', name: 'lightbulb idea insight tip' },
      { char: '🔥', name: 'fire hot trending popular' },
      { char: '✨', name: 'sparkles magic quality new' },
      { char: '📌', name: 'pin note important remember' },
      { char: '🎯', name: 'target goal accuracy focus' },
      { char: '⚡', name: 'lightning fast energy bolt' },
      { char: '📈', name: 'chart growth trending increase' },
      { char: '💎', name: 'gem diamond premium value' },
      { char: '🛠️', name: 'tools build practical framework' },
      { char: '📣', name: 'megaphone announcement broadcast' },
      { char: '🔑', name: 'key secret solution access' },
    ],
  },
  {
    name: 'CTA & Pointers',
    icon: '👇',
    emojis: [
      { char: '👇', name: 'point down read below comment' },
      { char: '👉', name: 'point right next slide here' },
      { char: '💬', name: 'speech bubble chat discussion reply' },
      { char: '📩', name: 'envelope dm message inbox email' },
      { char: '🔗', name: 'link bio url website' },
      { char: '🏷️', name: 'label tag discount category' },
      { char: '🔔', name: 'bell notification subscribe alert' },
      { char: '🗣️', name: 'speaking shout share voice' },
      { char: '👀', name: 'eyes look check see watch' },
      { char: '✍️', name: 'writing author write draft' },
      { char: '📲', name: 'phone mobile app call save' },
      { char: '🙋', name: 'hand raise question vote ask' },
    ],
  },
  {
    name: 'Engagement & Community',
    icon: '🙌',
    emojis: [
      { char: '❤️', name: 'red heart love like' },
      { char: '🙌', name: 'raising hands celebration praise' },
      { char: '👏', name: 'clapping applause bravo kudos' },
      { char: '💯', name: 'hundred percent truth exact agree' },
      { char: '🤝', name: 'handshake partnership deal collaborate' },
      { char: '🎉', name: 'party popper celebrate milestone' },
      { char: '🏆', name: 'trophy winner champion award' },
      { char: '🌟', name: 'glowing star feature highlight' },
      { char: '🙏', name: 'folded hands gratitude thank please' },
      { char: '🤩', name: 'star struck excited amazed' },
      { char: '🥳', name: 'partying happy festive' },
      { char: '💪', name: 'flexed bicep strong power work' },
    ],
  },
  {
    name: 'Structure & Lists',
    icon: '1️⃣',
    emojis: [
      { char: '1️⃣', name: 'one number step first' },
      { char: '2️⃣', name: 'two number step second' },
      { char: '3️⃣', name: 'three number step third' },
      { char: '4️⃣', name: 'four number step fourth' },
      { char: '5️⃣', name: 'five number step fifth' },
      { char: '▫️', name: 'white small square bullet' },
      { char: '▪️', name: 'black small square bullet' },
      { char: '•', name: 'bullet point dot list' },
      { char: '✔️', name: 'check mark done complete correct' },
      { char: '❌', name: 'cross mark mistake wrong avoid' },
      { char: '➡️', name: 'right arrow proceed next' },
      { char: '🔹', name: 'blue diamond bullet accent' },
    ],
  },
  {
    name: 'Expressions & Mood',
    icon: '😊',
    emojis: [
      { char: '😊', name: 'smiling warm happy friendly' },
      { char: '🤔', name: 'thinking wondering curious ponder' },
      { char: '😎', name: 'sunglasses cool confident smooth' },
      { char: '🤯', name: 'exploding head mindblown shocked' },
      { char: '🧐', name: 'monocle examining inspect thoughtful' },
      { char: '🫡', name: 'saluting respect acknowledge' },
      { char: '😌', name: 'relieved peaceful calm satisfied' },
      { char: '🤫', name: 'shushing secret quiet sneak peek' },
      { char: '🤓', name: 'nerd smart tech data geek' },
      { char: '😇', name: 'halo angel good honest innocent' },
    ],
  },
  {
    name: 'Creator & Workplace',
    icon: '📱',
    emojis: [
      { char: '📸', name: 'camera photography photo instagram' },
      { char: '📱', name: 'mobile phone smartphone screen' },
      { char: '💻', name: 'laptop computer code work remote' },
      { char: '📊', name: 'bar chart analytics metrics data' },
      { char: '📝', name: 'memo notebook checklist write' },
      { char: '☕', name: 'coffee morning work hustle break' },
      { char: '💼', name: 'briefcase business professional corporate' },
      { char: '🎧', name: 'headphones audio focus music' },
      { char: '🎙️', name: 'microphone podcast voice recording' },
      { char: '🎥', name: 'movie camera video youtube filming' },
      { char: '🎨', name: 'palette design branding aesthetics' },
      { char: '📚', name: 'books learn education reading guide' },
    ],
  },
];

// Quick Access top branded emojis for the one-click strip
export const QUICK_BRANDED_EMOJIS = ['🚀', '💡', '👇', '🔥', '✨', '📌', '🎯', '📈', '💬', '🤝', '✔️', '💯'];

export const InlineEmojiPicker: React.FC<InlineEmojiPickerProps> = ({ onSelectEmoji }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside or Esc key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (emoji: string) => {
    onSelectEmoji(emoji);
    // Don't auto-close immediately so creator can click 2 or 3 emojis in a row if desired
  };

  // Filter emojis by search query
  const filteredEmojis = searchQuery.trim()
    ? EMOJI_CATEGORIES.flatMap((cat) => cat.emojis).filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.char.includes(searchQuery)
      )
    : null;

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer flex items-center gap-1.5 ${
          isOpen
            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
            : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300 shadow-2xs'
        }`}
        title="Open Branded Emoji Picker"
        aria-expanded={isOpen}
      >
        <span>😀</span>
        <span className="hidden sm:inline">Add Emoji</span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-1.5 w-72 sm:w-80 bg-white rounded-xl border border-neutral-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          style={{ right: 0 }}
        >
          {/* Popover Header */}
          <div className="p-2.5 border-b border-neutral-100 bg-neutral-50/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                <span>✨</span> Branded Emojis
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search (rocket, tip, fire, arrow)..."
                className="w-full text-xs rounded-md border border-neutral-300 pl-7 pr-3 py-1.5 text-neutral-800 focus:border-neutral-900 focus:outline-none bg-white"
                autoFocus
              />
              <span className="absolute left-2.5 top-1.5 text-neutral-400 text-xs">
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs (if not searching) */}
          {!searchQuery && (
            <div className="flex items-center gap-0.5 px-2 py-1 bg-neutral-100/70 border-b border-neutral-200 overflow-x-auto text-sm">
              {EMOJI_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer text-xs ${
                    activeCategoryIndex === idx
                      ? 'bg-white shadow-xs text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  title={cat.name}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
          )}

          {/* Emoji Grid */}
          <div className="p-3 max-h-56 overflow-y-auto">
            {filteredEmojis ? (
              filteredEmojis.length > 0 ? (
                <div>
                  <div className="text-[10px] uppercase font-semibold text-neutral-400 mb-1.5">
                    Search Results ({filteredEmojis.length})
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {filteredEmojis.map((item, idx) => (
                      <button
                        key={`${item.char}-${idx}`}
                        type="button"
                        onClick={() => handleSelect(item.char)}
                        className="h-8 w-8 text-base rounded hover:bg-neutral-100 flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                        title={item.name}
                      >
                        {item.char}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-neutral-400">
                  No matching emojis found.
                </div>
              )
            ) : (
              <div>
                <div className="text-[11px] font-semibold text-neutral-700 mb-1.5 flex items-center gap-1">
                  <span>{EMOJI_CATEGORIES[activeCategoryIndex].icon}</span>
                  <span>{EMOJI_CATEGORIES[activeCategoryIndex].name}</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5 text-center">
                  {EMOJI_CATEGORIES[activeCategoryIndex].emojis.map((item) => (
                    <button
                      key={item.char}
                      type="button"
                      onClick={() => handleSelect(item.char)}
                      className="h-9 w-9 text-lg rounded-lg hover:bg-neutral-100 flex items-center justify-center transition-all hover:scale-120 cursor-pointer"
                      title={item.name}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Popover Footer */}
          <div className="px-3 py-1.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
            <span>Click to insert at cursor</span>
            <span>Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
};
