import * as React from 'react';
import { clsx } from 'clsx';
import { Check, Circle, AlertCircle } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'CLIENT_REVIEW' | 'UPCOMING' | 'DELAYED';
  owner?: string;
  dateLabel?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative border-l border-border-default ml-4 pl-6 space-y-8 font-body">
      {items.map((item) => {
        const iconStyles = {
          COMPLETED: 'bg-green-900 border-green-500 text-green-400',
          IN_PROGRESS: 'bg-blue-900 border-blue-500 text-blue-400 animate-pulse',
          CLIENT_REVIEW: 'bg-amber-900 border-amber-500 text-amber-400',
          UPCOMING: 'bg-bg-subtle border-border-default text-text-placeholder',
          DELAYED: 'bg-red-900 border-red-500 text-red-400',
        };

        return (
          <div key={item.id} className="relative">
            <div
              className={clsx(
                'absolute -left-[35px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10',
                iconStyles[item.status],
              )}
            >
              {item.status === 'COMPLETED' && <Check className="w-3.5 h-3.5" />}
              {item.status === 'IN_PROGRESS' && <Circle className="w-2.5 h-2.5 fill-current" />}
              {item.status === 'CLIENT_REVIEW' && <AlertCircle className="w-3.5 h-3.5" />}
              {item.status === 'DELAYED' && <AlertCircle className="w-3.5 h-3.5" />}
              {item.status === 'UPCOMING' && <div className="w-1.5 h-1.5 rounded-full bg-border-default" />}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h4 className="text-body-sm font-semibold text-text-primary">{item.title}</h4>
                {item.dateLabel && <span className="text-caption text-text-muted">{item.dateLabel}</span>}
              </div>

              {item.description && (
                <p className="text-body-xs text-text-secondary leading-relaxed">{item.description}</p>
              )}

              {item.owner && (
                <div className="flex items-center gap-2 mt-1 text-caption text-text-muted">
                  {item.owner && <span>Owner: {item.owner}</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Timeline;
