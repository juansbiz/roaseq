/**
 * EventTemplatePreview
 * Shows event name + first 120 chars of event payload / metadata
 */

import { Activity } from "lucide-react";

export default function EventTemplatePreview({ data }) {
  if (!data) return null;

  const name = data.name || data.event_name || "Untitled event";
  const payload =
    data.body || data.payload || data.metadata || data.content || "";
  const truncatedBody = String(payload).replace(/<[^>]+>/g, "").slice(0, 120);

  return (
    <div className="w-[240px] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-[#f2ff00] flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Event Preview
        </span>
      </div>
      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
        {name}
      </div>
      {truncatedBody && (
        <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {truncatedBody}
          {String(payload).length > 120 && "..."}
        </div>
      )}
    </div>
  );
}
