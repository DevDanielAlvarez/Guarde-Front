import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type CalendarDay = {
  date: Date;
  inMonth: boolean;
};

type CalendarWeek = {
  weekNumber: number;
  days: CalendarDay[];
};

function getISOWeek(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function buildMonthGrid(year: number, month: number): CalendarWeek[] {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - firstWeekday);

  return Array.from({ length: 6 }, (_, weekIndex) => {
    const days = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + weekIndex * 7 + dayIndex);
      return { date, inMonth: date.getMonth() === month };
    });
    return { weekNumber: getISOWeek(days[0].date), days };
  });
}

type MiniCalendarProps = {
  year: number;
  /** 0-indexed, like `Date#getMonth()` (0 = January). */
  month: number;
};

export function MiniCalendar({ year, month }: MiniCalendarProps) {
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);

  return (
    <View className="gap-3 rounded-3xl border border-hairline p-4 dark:border-neutral-800">
      <Text
        style={{ fontFamily: Fonts.semiBold }}
        className="text-center text-sm text-muted">
        {MONTH_LABELS[month]}
      </Text>

      <View className="flex-row">
        <View className="w-7" />
        {WEEKDAY_LABELS.map((label, index) => (
          <Text
            key={label}
            style={{ fontFamily: Fonts.semiBold }}
            className={`flex-1 text-center text-xs ${index >= 5 ? 'text-primary' : 'text-muted'}`}>
            {label}
          </Text>
        ))}
      </View>

      <View className="gap-2">
        {weeks.map((week) => (
          <View key={week.weekNumber} className="flex-row items-center">
            <View className="w-7 items-center">
              <View className="h-6 w-6 items-center justify-center rounded-lg bg-black dark:bg-white">
                <Text
                  style={{ fontFamily: Fonts.semiBold }}
                  className="text-[10px] text-white dark:text-black">
                  {String(week.weekNumber).padStart(2, '0')}
                </Text>
              </View>
            </View>
            {week.days.map(({ date, inMonth }, index) => {
              const isWeekend = index >= 5;
              return (
                <Text
                  key={date.toISOString()}
                  style={{ fontFamily: Fonts.medium }}
                  className={`flex-1 text-center text-sm ${
                    !inMonth
                      ? 'text-muted/50'
                      : isWeekend
                        ? 'text-primary'
                        : 'text-black dark:text-white'
                  }`}>
                  {date.getDate()}
                </Text>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
