/**
 * AttributionModelPreview
 * Shows a mini horizontal stepper of attribution model touchpoints
 * with the current stage highlighted.
 */

import { cn } from "@/lib/utils";

const DEFAULT_STAGES = [
  "First touch",
  "Engaged",
  "Consideration",
  "Intent",
  "Conversion",
  "Loyalty",
];

export default function AttributionModelPreview({ data, targetStage }) {
  if (!data) return null;

  const stages = data.stages || data.attribution_stages || DEFAULT_STAGES;
  const currentStage = targetStage || data.stage || data.status || stages[0];
  const currentIndex = stages.findIndex(
    (s) => s.toLowerCase() === (currentStage || "").toLowerCase(),
  );

  return (
    <div className="w-[280px] p-3 space-y-2">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Attribution Journey
      </div>
      <div className="flex items-center gap-0.5">
        {stages.map((stage, i) => {
          const isActive = i === currentIndex;
          const isPast = i < currentIndex;

          return (
            <div key={stage} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "h-2 w-full rounded-full transition-colors",
                  isActive && "bg-[#f2ff00]",
                  isPast && "bg-[#f2ff00]/50",
                  !isActive && !isPast && "bg-gray-200 dark:bg-gray-700",
                )}
              />
              <span
                className={cn(
                  "text-[9px] font-medium truncate max-w-full",
                  isActive && "text-[#f2ff00] font-bold",
                  isPast && "text-[#f2ff00]/70",
                  !isActive && !isPast && "text-gray-400 dark:text-gray-500",
                )}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
      {data.value && (
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700/30">
          Attributed revenue:{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            ${Number(data.value).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
