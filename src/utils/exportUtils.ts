import { FullGeneratedContent, CalendarDay, PlatformKey } from '../types/generator';

export function exportToText(content: FullGeneratedContent): string {
  const lines: string[] = [];

  lines.push('========================================================');
  lines.push('BOOK KAARO AI SOCIAL MEDIA CONTENT GENERATION PACK');
  lines.push(`Generated: ${content.meta?.generatedAt || new Date().toISOString()}`);
  lines.push(`Topic: ${content.meta?.topic || 'N/A'}`);
  lines.push(`Tone: ${content.meta?.tone || 'N/A'} | Language: ${content.meta?.language || 'N/A'}`);
  lines.push('========================================================\n');

  // Captions
  lines.push('--- PLATFORM CAPTIONS ---\n');
  const platforms: PlatformKey[] = ['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter'];
  for (const p of platforms) {
    const item = content.platformCaptions[p];
    if (item) {
      lines.push(`[${p.toUpperCase()}]`);
      lines.push(`Format: ${item.suggestedFormat}`);
      lines.push(`Visual Note: ${item.visualPromptNote}`);
      lines.push('\nSHORT VARIATION:');
      lines.push(item.shortCaption);
      lines.push('\nLONG VARIATION:');
      lines.push(item.longCaption);
      if (item.hashtags && item.hashtags.length > 0) {
        lines.push(`\nHashtags: ${item.hashtags.join(' ')}`);
      }
      lines.push('\n----------------------------------------\n');
    }
  }

  // Hooks
  if (content.hooks && content.hooks.length > 0) {
    lines.push('--- HOOKS ---\n');
    content.hooks.forEach((h, i) => {
      lines.push(`${i + 1}. [${h.style.toUpperCase()}] ${h.text}`);
    });
    lines.push('\n----------------------------------------\n');
  }

  // CTAs
  if (content.ctas && content.ctas.length > 0) {
    lines.push('--- CALLS TO ACTION ---\n');
    content.ctas.forEach((c, i) => {
      lines.push(`${i + 1}. [${c.intent.toUpperCase()}] ${c.text}`);
    });
    lines.push('\n----------------------------------------\n');
  }

  // Content Ideas
  if (content.contentIdeas && content.contentIdeas.length > 0) {
    lines.push('--- CONTENT ANGLES & IDEAS ---\n');
    content.contentIdeas.forEach((idea, i) => {
      lines.push(`${i + 1}. ${idea.title} (${idea.format})`);
      lines.push(`   Angle: ${idea.angle}`);
    });
    lines.push('\n----------------------------------------\n');
  }

  // 7-Day Calendar
  if (content.calendar && content.calendar.length > 0) {
    lines.push('--- 7-DAY CONTENT CALENDAR ---\n');
    content.calendar.forEach((day) => {
      lines.push(`Day: ${day.day}`);
      lines.push(`Platform: ${day.platform.toUpperCase()} | Format: ${day.format}`);
      lines.push(`Theme: ${day.theme}`);
      lines.push(`Summary: ${day.captionSummary}`);
      lines.push(`Best Time Slot: ${day.bestTimeSlot}`);
      lines.push('');
    });
  }

  return lines.join('\n');
}

export function exportToMarkdown(content: FullGeneratedContent): string {
  const lines: string[] = [];

  lines.push('# Book Kaaro Social Media Content Pack');
  lines.push(`*Generated on ${content.meta?.generatedAt || new Date().toLocaleDateString()}*  `);
  lines.push(`**Topic:** ${content.meta?.topic || 'N/A'} | **Tone:** ${content.meta?.tone || 'N/A'} | **Language:** ${content.meta?.language || 'N/A'}\n`);

  lines.push('## Platform Captions\n');
  const platforms: PlatformKey[] = ['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter'];
  for (const p of platforms) {
    const item = content.platformCaptions[p];
    if (item) {
      lines.push(`### ${p.charAt(0).toUpperCase() + p.slice(1)}`);
      lines.push(`- **Suggested Format:** ${item.suggestedFormat}`);
      lines.push(`- **Visual Cue:** ${item.visualPromptNote}\n`);
      lines.push('#### Short Variation');
      lines.push(`> ${item.shortCaption.replace(/\n/g, '\n> ')}\n`);
      lines.push('#### Long Variation');
      lines.push(`${item.longCaption}\n`);
      if (item.hashtags && item.hashtags.length > 0) {
        lines.push(`**Hashtags:** \`${item.hashtags.join(' ')}\`\n`);
      }
    }
  }

  if (content.hooks && content.hooks.length > 0) {
    lines.push('## High-Impact Hooks');
    content.hooks.forEach((h) => {
      lines.push(`- **[${h.style}]** ${h.text}`);
    });
    lines.push('');
  }

  if (content.ctas && content.ctas.length > 0) {
    lines.push('## Calls to Action');
    content.ctas.forEach((c) => {
      lines.push(`- **[${c.intent}]** ${c.text}`);
    });
    lines.push('');
  }

  if (content.calendar && content.calendar.length > 0) {
    lines.push('## 7-Day Content Schedule');
    lines.push('| Day | Platform | Theme | Format | Recommended Time |');
    lines.push('|---|---|---|---|---|');
    content.calendar.forEach((d) => {
      lines.push(`| ${d.day} | ${d.platform.toUpperCase()} | ${d.theme} | ${d.format} | ${d.bestTimeSlot} |`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

export function exportCalendarToCsv(calendar: CalendarDay[]): string {
  const headers = ['Day', 'Platform', 'Theme', 'Format', 'Caption Summary', 'Best Time Slot'];

  const rows = calendar.map((day) => [
    `"${(day.day || '').replace(/"/g, '""')}"`,
    `"${(day.platform || '').replace(/"/g, '""')}"`,
    `"${(day.theme || '').replace(/"/g, '""')}"`,
    `"${(day.format || '').replace(/"/g, '""')}"`,
    `"${(day.captionSummary || '').replace(/"/g, '""')}"`,
    `"${(day.bestTimeSlot || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
