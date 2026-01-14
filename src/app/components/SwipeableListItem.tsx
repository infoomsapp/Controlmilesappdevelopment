// SwipeableListItem - Reusable swipeable list item with actions

import { ReactNode, useState, useRef, TouchEvent } from 'react';
import { Trash2, Edit3, Eye, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface SwipeAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color: 'red' | 'blue' | 'green' | 'gray';
}

interface SwipeableListItemProps {
  children: ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
  customActions?: SwipeAction[];
  deleteThreshold?: number;
  disabled?: boolean;
}

export function SwipeableListItem({
  children,
  onDelete,
  onEdit,
  onView,
  customActions,
  deleteThreshold = 120,
  disabled = false,
}: SwipeableListItemProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build actions array
  const actions: SwipeAction[] = customActions || [];
  
  if (!customActions) {
    if (onView) {
      actions.push({
        icon: <Eye className="h-4 w-4" />,
        label: 'View',
        onClick: onView,
        color: 'blue',
      });
    }
    if (onEdit) {
      actions.push({
        icon: <Edit3 className="h-4 w-4" />,
        label: 'Edit',
        onClick: onEdit,
        color: 'gray',
      });
    }
    if (onDelete) {
      actions.push({
        icon: <Trash2 className="h-4 w-4" />,
        label: 'Delete',
        onClick: onDelete,
        color: 'red',
      });
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping || disabled) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Only allow horizontal swipes (prevent vertical scroll interference)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      
      // Only allow swipe left (show actions on right)
      if (deltaX < 0) {
        const maxSwipe = -150; // Maximum swipe distance
        const newOffset = Math.max(maxSwipe, deltaX);
        setOffsetX(newOffset);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping || disabled) return;

    // If swiped past delete threshold, trigger delete
    if (onDelete && offsetX < -deleteThreshold) {
      handleDelete();
    } else if (offsetX < -60) {
      // Snap to show actions
      setOffsetX(-150);
    } else {
      // Snap back to original position
      setOffsetX(0);
    }

    setIsSwiping(false);
  };

  const handleDelete = () => {
    // Animate out before deleting
    setOffsetX(-500);
    setTimeout(() => {
      onDelete?.();
    }, 300);
  };

  const handleAction = (action: SwipeAction) => {
    action.onClick();
    setOffsetX(0); // Close swipe after action
  };

  const getActionColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'gray':
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (disabled || actions.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      {/* Actions background (revealed when swiping left) */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end gap-2 px-2">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            size="sm"
            className={`${getActionColor(action.color)} text-white min-w-[60px] h-full rounded-none`}
            onClick={() => handleAction(action)}
          >
            {action.icon}
            <span className="ml-1 text-xs hidden sm:inline">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Swipeable content */}
      <div
        className="relative bg-white"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
        
        {/* Swipe indicator */}
        {!isSwiping && offsetX === 0 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Delete threshold indicator */}
      {isSwiping && onDelete && offsetX < -deleteThreshold && (
        <div className="absolute left-0 top-0 bottom-0 right-0 bg-red-500 flex items-center justify-center pointer-events-none">
          <Trash2 className="h-6 w-6 text-white animate-pulse" />
        </div>
      )}
    </div>
  );
}
