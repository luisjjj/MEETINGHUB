export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  departmentId?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'administrator' | 'ict_staff' | 'department_head' | 'employee' | 'guest';

export interface Department {
  id: string;
  name: string;
  description?: string;
  headId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  departmentId?: string;
  meetingType: MeetingType;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string;
  room?: string;
  format: MeetingFormat;
  status: MeetingStatus;
  isRecurring: boolean;
  recurringPattern?: string;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomHostUrl?: string;
  outlookEventId?: string;
  recordingEnabled: boolean;
  waitingRoomEnabled: boolean;
  passwordProtected: boolean;
  password?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type MeetingType =
  | 'board'
  | 'department'
  | 'team'
  | 'one_on_one'
  | 'all_hands'
  | 'training'
  | 'other';

export type MeetingFormat = 'virtual' | 'in_person' | 'hybrid';

export type MeetingStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export interface Participant {
  id: string;
  meetingId: string;
  userId: string;
  status: ParticipantStatus;
  role: ParticipantRole;
  invitedAt: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ParticipantStatus = 'pending' | 'accepted' | 'declined' | 'tentative';

export type ParticipantRole = 'organizer' | 'presenter' | 'attendee';

export interface MeetingRoom {
  id: string;
  name: string;
  location?: string;
  capacity: number;
  equipment?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  meetingId: string;
  userId: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export interface Recording {
  id: string;
  meetingId: string;
  zoomRecordingId?: string;
  url: string;
  duration: number;
  fileSize: number;
  transcript?: string;
  status: RecordingStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type RecordingStatus = 'processing' | 'ready' | 'failed' | 'deleted';

export interface Summary {
  id: string;
  meetingId: string;
  executiveSummary?: string;
  detailedSummary?: string;
  actionItems?: string;
  keyDecisions?: string;
  risks?: string;
  questions?: string;
  followUpTasks?: string;
  whoSaidWhat?: string;
  status: SummaryStatus;
  generatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SummaryStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface ActionItem {
  id: string;
  meetingId: string;
  summaryId?: string;
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  status: ActionItemStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export type NotificationType =
  | 'meeting_reminder'
  | 'recording_available'
  | 'summary_generated'
  | 'action_item_overdue'
  | 'invitation_accepted'
  | 'email_sent'
  | 'system';

export interface FileAttachment {
  id: string;
  meetingId?: string;
  name: string;
  url: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  service: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  organizationName: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  defaultMeetingDuration: number;
  enableZoomIntegration: boolean;
  enableOutlookIntegration: boolean;
  enableAI: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalMeetings: number;
  hoursScheduled: number;
  attendanceRate: number;
  aiSummariesPending: number;
  recordingsAvailable: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  meeting?: Meeting;
}

export interface SearchResult {
  type: 'meeting' | 'participant' | 'department' | 'recording' | 'summary' | 'file';
  id: string;
  title: string;
  description?: string;
  url: string;
  relevance: number;
}
