import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMeetings } from '@/hooks/useMeetings';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500',
  in_progress: 'bg-success',
  completed: 'bg-gray-400',
  cancelled: 'bg-destructive',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const navigate = useNavigate();
  const { data: meetingsData, isLoading } = useMeetings({ limit: 100 });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const meetings = useMemo(() => {
    if (!meetingsData?.meetings) return [];
    return meetingsData.meetings.map((m: Record<string, unknown>) => {
      const startTime = m.startTime as string;
      return {
        id: m.id as string,
        title: m.title as string,
        date: new Date(startTime).getDate(),
        month: new Date(startTime).getMonth(),
        year: new Date(startTime).getFullYear(),
        color: statusColors[(m.status as string)] || 'bg-gray-400',
      };
    });
  }, [meetingsData]);

  const currentMonthMeetings = meetings.filter(
    (m: { month: number; year: number }) => m.month === currentMonth && m.year === currentYear
  );

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const getMeetingsForDay = (day: number) => currentMonthMeetings.filter((m: { date: number }) => m.date === day);

  const selectedDayMeetings = selectedDate ? getMeetingsForDay(selectedDate) : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View and manage your meetings</p>
        </div>
        <Button onClick={() => navigate('/dashboard/meetings/create')}>
          <Plus className="mr-2 h-4 w-4" />New Meeting
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{months[currentMonth]} {currentYear}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {daysOfWeek.map((day) => (
                <div key={day} className="bg-muted p-2 text-center text-sm font-medium">{day}</div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-card p-2 min-h-[100px]" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayMeetings = getMeetingsForDay(day);
                const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                return (
                  <div
                    key={day}
                    className={cn(
                      'bg-card p-2 min-h-[100px] cursor-pointer hover:bg-accent/50 transition-colors',
                      selectedDate === day && 'ring-2 ring-primary-500'
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span className={cn(
                      'text-sm font-medium',
                      isToday && 'flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white'
                    )}>{day}</span>
                    <div className="mt-1 space-y-1">
                      {dayMeetings.map((meeting: { id: string; title: string; color: string }) => (
                        <div
                          key={meeting.id}
                          className={cn('rounded px-1 py-0.5 text-xs text-white truncate cursor-pointer', meeting.color)}
                          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/meetings/${meeting.id}`); }}
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
      )}

      {selectedDate && selectedDayMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meetings on {months[currentMonth]} {selectedDate}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedDayMeetings.map((m: { id: string; title: string; color: string }) => (
              <div
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                onClick={() => navigate(`/dashboard/meetings/${m.id}`)}
              >
                <div className={cn('h-3 w-3 rounded-full', m.color)} />
                <span className="font-medium">{m.title}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
