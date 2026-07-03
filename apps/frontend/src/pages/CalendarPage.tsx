import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const meetings = [
  { id: '1', title: 'Board Meeting', date: 15, color: 'bg-primary-500' },
  { id: '2', title: 'Team Standup', date: 15, color: 'bg-blue-500' },
  { id: '3', title: 'Product Review', date: 18, color: 'bg-purple-500' },
  { id: '4', title: 'Strategy Session', date: 22, color: 'bg-success' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getMeetingsForDay = (day: number) => {
    return meetings.filter((m) => m.date === day);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View and manage your meetings</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {months[currentMonth]} {currentYear}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-muted p-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-card p-2 min-h-[100px]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayMeetings = getMeetingsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={cn(
                    'bg-card p-2 min-h-[100px] cursor-pointer hover:bg-accent/50 transition-colors',
                    selectedDate === day && 'ring-2 ring-primary-500'
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isToday && 'flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white'
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className={cn('rounded px-1 py-0.5 text-xs text-white truncate', meeting.color)}
                      >
                        {meeting.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
