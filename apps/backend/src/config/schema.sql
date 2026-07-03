-- MeetingHub Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  firebase_uid VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  department_id UUID,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  head_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for department head
ALTER TABLE departments ADD CONSTRAINT fk_department_head
  FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add foreign key for user department
ALTER TABLE users ADD CONSTRAINT fk_user_department
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- Meeting Rooms table
CREATE TABLE meeting_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  capacity INTEGER NOT NULL DEFAULT 10,
  equipment TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  meeting_type VARCHAR(50) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  location VARCHAR(255),
  room VARCHAR(255),
  format VARCHAR(20) NOT NULL DEFAULT 'virtual',
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_pattern VARCHAR(100),
  zoom_meeting_id VARCHAR(100),
  zoom_join_url TEXT,
  zoom_host_url TEXT,
  outlook_event_id VARCHAR(100),
  recording_enabled BOOLEAN NOT NULL DEFAULT true,
  waiting_room_enabled BOOLEAN NOT NULL DEFAULT false,
  password_protected BOOLEAN NOT NULL DEFAULT false,
  password VARCHAR(100),
  created_by UUID REFERENCES users(id),
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  role VARCHAR(20) NOT NULL DEFAULT 'attendee',
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id, user_id)
);

-- Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) NOT NULL DEFAULT 'absent',
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id, user_id)
);

-- Recordings table
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  zoom_recording_id VARCHAR(100),
  url TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  file_size BIGINT NOT NULL DEFAULT 0,
  transcript TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'processing',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Summaries table
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  executive_summary TEXT,
  detailed_summary TEXT,
  action_items TEXT,
  key_decisions TEXT,
  risks TEXT,
  questions TEXT,
  follow_up_tasks TEXT,
  who_said_what TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Action Items table
CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  summary_id UUID REFERENCES summaries(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES users(id),
  due_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) NOT NULL,
  service VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_name VARCHAR(255) NOT NULL DEFAULT 'MeetingHub',
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  date_format VARCHAR(20) NOT NULL DEFAULT 'MM/DD/YYYY',
  time_format VARCHAR(10) NOT NULL DEFAULT '12h',
  default_meeting_duration INTEGER NOT NULL DEFAULT 60,
  enable_zoom_integration BOOLEAN NOT NULL DEFAULT true,
  enable_outlook_integration BOOLEAN NOT NULL DEFAULT true,
  enable_ai BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_meetings_department_id ON meetings(department_id);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_created_by ON meetings(created_by);

CREATE INDEX idx_participants_meeting_id ON participants(meeting_id);
CREATE INDEX idx_participants_user_id ON participants(user_id);
CREATE INDEX idx_participants_status ON participants(status);

CREATE INDEX idx_attendance_meeting_id ON attendance(meeting_id);
CREATE INDEX idx_attendance_user_id ON attendance(user_id);

CREATE INDEX idx_recordings_meeting_id ON recordings(meeting_id);
CREATE INDEX idx_recordings_status ON recordings(status);

CREATE INDEX idx_summaries_meeting_id ON summaries(meeting_id);
CREATE INDEX idx_summaries_status ON summaries(status);

CREATE INDEX idx_action_items_meeting_id ON action_items(meeting_id);
CREATE INDEX idx_action_items_assignee_id ON action_items(assignee_id);
CREATE INDEX idx_action_items_status ON action_items(status);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

CREATE INDEX idx_files_meeting_id ON files(meeting_id);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
