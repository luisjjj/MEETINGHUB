import { z } from 'zod';

export const createMeetingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  meetingType: z.enum(['board', 'department', 'team', 'one_on_one', 'all_hands', 'training', 'other']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  timezone: z.string().default('UTC'),
  location: z.string().optional(),
  room: z.string().optional(),
  format: z.enum(['virtual', 'in_person', 'hybrid']),
  recordingEnabled: z.boolean().optional(),
  waitingRoomEnabled: z.boolean().optional(),
  passwordProtected: z.boolean().optional(),
  password: z.string().optional(),
});

export const updateMeetingSchema = createMeetingSchema.partial();

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;
