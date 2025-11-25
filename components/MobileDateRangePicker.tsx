'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface WeekData {
  weekStart: Date;
  days: Date[];
}

const WEEKS_BUFFER = 52;
const INITIAL_WEEK_INDEX = WEEKS_BUFFER;

export default function MobileDateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(INITIAL_WEEK_INDEX);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const generateWeeks = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weeksData: WeekData[] = [];

    for (let i = -WEEKS_BUFFER; i <= WEEKS_BUFFER; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + i * 7);

      const days: Date[] = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + j);
        days.push(day);
      }

      weeksData.push({ weekStart, days });
    }

    return weeksData;
  }, []);

  useEffect(() => {
    const weeksData = generateWeeks();
    setWeeks(weeksData);
  }, [generateWeeks]);

  useEffect(() => {
    if (weeks.length > 0 && scrollContainerRef.current) {
      const weekHeight = 120;
      const scrollPosition = INITIAL_WEEK_INDEX * weekHeight;
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, [weeks]);

  const handleDateClick = (date: Date) => {
    if (isScrollingRef.current) return;

    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);

    setDateRange((prev) => {
      if (!prev.start) {
        return { start: newDate, end: null };
      }

      if (!prev.end) {
        if (newDate < prev.start) {
          return { start: newDate, end: prev.start };
        }
        if (newDate.getTime() === prev.start.getTime()) {
          return { start: null, end: null };
        }
        return { start: prev.start, end: newDate };
      }

      return { start: newDate, end: null };
    });
  };

  const isInRange = (date: Date): boolean => {
    if (!dateRange.start || !dateRange.end) return false;
    return date >= dateRange.start && date <= dateRange.end;
  };

  const isRangeEdge = (date: Date): 'start' | 'end' | null => {
    if (dateRange.start && date.getTime() === dateRange.start.getTime()) return 'start';
    if (dateRange.end && date.getTime() === dateRange.end.getTime()) return 'end';
    return null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    isScrollingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;

    const touchY = e.touches[0].clientY;
    const diff = Math.abs(touchY - touchStartYRef.current);

    if (diff > 5) {
      isScrollingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isScrollingRef.current = false;
      touchStartYRef.current = null;
    }, 100);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const weekHeight = 120;
    const scrollTop = scrollContainerRef.current.scrollTop;
    const newIndex = Math.round(scrollTop / weekHeight);

    if (newIndex !== currentWeekIndex) {
      setCurrentWeekIndex(newIndex);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWeekLabel = (weekData: WeekData): string => {
    const middleDay = weekData.days[3];
    return middleDay.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Start Date</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(dateRange.start)}
            </p>
          </div>
          <div className="px-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs text-gray-500 mb-1">End Date</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(dateRange.end)}
            </p>
          </div>
        </div>

        {dateRange.start && dateRange.end && (
          <button
            onClick={() => setDateRange({ start: null, end: null })}
            className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear Selection
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-1 px-4 py-3 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="overflow-y-auto snap-y snap-mandatory"
          style={{
            height: '480px',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="snap-start"
              style={{ height: '120px' }}
            >
              <div className="px-4 py-2 text-xs font-medium text-gray-500 text-center">
                {getWeekLabel(week)}
              </div>

              <div className="grid grid-cols-7 gap-1 px-4 pb-4">
                {week.days.map((day, dayIndex) => {
                  const inRange = isInRange(day);
                  const edge = isRangeEdge(day);
                  const today = isToday(day);
                  const isCurrentMonth = day.getMonth() === week.days[3].getMonth();

                  return (
                    <button
                      key={dayIndex}
                      onClick={() => handleDateClick(day)}
                      className={`
                        relative aspect-square rounded-lg text-sm font-medium
                        transition-all duration-200 active:scale-95
                        ${!isCurrentMonth ? 'text-gray-300' : ''}
                        ${today && !edge ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                        ${edge === 'start' || edge === 'end'
                          ? 'bg-blue-600 text-white shadow-lg scale-110 z-10'
                          : inRange
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {day.getDate()}
                      {today && !edge && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            👆 Scroll to browse weeks
          </p>
        </div>
      </div>
    </div>
  );
}
