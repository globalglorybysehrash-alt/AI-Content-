import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Does this generator promise virality, guaranteed engagement, or follower growth?',
    answer:
      'No. We strictly refuse to promise virality, algorithmic shortcuts, or guaranteed follower numbers. Organic audience growth is the outcome of persistent value, topic resonance, and authentic engagement with your community. This tool provides structured writing drafts, creative hooks, and organized scheduling frameworks to save you time and maintain posting consistency.',
  },
  {
    question: 'How do I use the exported CSV Content Calendar?',
    answer:
      'Click the "Export CSV" button in the schedule section to download your 7-day schedule. You can immediately import this .csv file into Notion databases, Airtable social schedules, Google Sheets, or spreadsheet templates. Each row specifies the day, platform, theme, format, caption summary, and optimal posting window.',
  },
  {
    question: 'Can I regenerate only one section without re-running the full generator?',
    answer:
      'Yes. To conserve latency and API resources, you can selectively regenerate just the opening hooks, the calls to action, the 7-day calendar, or individual platform captions (e.g., just LinkedIn) using the dedicated "Regenerate" buttons on each section.',
  },
  {
    question: 'What are the generation limits and quota rules?',
    answer:
      'To prevent abuse and ensure sustainable server performance, each session is provisioned with a configurable quota (up to 20 generation runs per 10-minute sliding window). Live remaining calls are displayed in the header badge.',
  },
  {
    question: 'How does Hinglish language generation work?',
    answer:
      'When selecting "Hinglish", the generator formats captions using conversational Roman script (e.g. "Aaj ka simple takeaway...", "Agar aap bhi creator ho..."). This matches the authentic colloquial phrasing preferred by creators across South Asia without awkward machine translations.',
  },
  {
    question: 'Are unconfigured payment gateways or live auto-publishing accounts active?',
    answer:
      'No. We adhere to strict transparency: live auto-publishing to Instagram or LinkedIn and payment checkouts are not falsely claimed as active. All templates and marketplace previews are freely inspectable, and output text is ready for you to copy or schedule through your preferred tools.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq-section" className="py-12 md:py-16 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Transparent Answers on AI Content Generation
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Clear guidelines on algorithmic realism, export procedures, and responsible usage.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                >
                  <span className="font-semibold text-xs sm:text-sm text-neutral-900">
                    {faq.question}
                  </span>
                  <span className="text-neutral-400 font-mono text-sm shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
