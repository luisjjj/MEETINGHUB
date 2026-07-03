import { db } from '../config/database';
import { logger } from '../utils/logger';

interface CreateMeetingData {
  title: string;
  description?: string;
  departmentId?: string;
  meetingType: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string;
  room?: string;
  format: string;
  recordingEnabled?: boolean;
  waitingRoomEnabled?: boolean;
  passwordProtected?: boolean;
  password?: string;
}

interface GetAllOptions {
  page: number;
  limit: number;
  status?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
}

export class MeetingService {
  async getAll(options: GetAllOptions) {
    const { page, limit, status, departmentId, startDate, endDate } = options;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM meetings WHERE 1=1';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (departmentId) {
      query += ` AND department_id = $${paramIndex++}`;
      params.push(departmentId);
    }

    if (startDate) {
      query += ` AND start_time >= $${paramIndex++}`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND end_time <= $${paramIndex++}`;
      params.push(endDate);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    query += ` ORDER BY start_time DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    return {
      meetings: result.rows.map(this.mapMeeting),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const result = await db.query('SELECT * FROM meetings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new Error('Meeting not found');
    }

    return this.mapMeeting(result.rows[0]);
  }

  async create(data: CreateMeetingData, userId: string) {
    const result = await db.query(
      `INSERT INTO meetings (
        title, description, department_id, meeting_type, start_time, end_time,
        timezone, location, room, format, recording_enabled, waiting_room_enabled,
        password_protected, password, created_by, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        data.title,
        data.description,
        data.departmentId,
        data.meetingType,
        data.startTime,
        data.endTime,
        data.timezone,
        data.location,
        data.room,
        data.format,
        data.recordingEnabled ?? true,
        data.waitingRoomEnabled ?? false,
        data.passwordProtected ?? false,
        data.password,
        userId,
        'scheduled',
      ]
    );

    logger.info(`Meeting created: ${result.rows[0].id}`);
    return this.mapMeeting(result.rows[0]);
  }

  async update(id: string, data: Partial<CreateMeetingData>) {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query(
      `UPDATE meetings SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Meeting not found');
    }

    return this.mapMeeting(result.rows[0]);
  }

  async delete(id: string) {
    const result = await db.query('DELETE FROM meetings WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw new Error('Meeting not found');
    }

    logger.info(`Meeting deleted: ${id}`);
  }

  async getParticipants(meetingId: string) {
    const result = await db.query(
      `SELECT p.*, u.display_name, u.email, u.avatar_url
       FROM participants p
       JOIN users u ON p.user_id = u.id
       WHERE p.meeting_id = $1`,
      [meetingId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      meetingId: row.meeting_id,
      userId: row.user_id,
      displayName: row.display_name,
      email: row.email,
      avatarUrl: row.avatar_url,
      status: row.status,
      role: row.role,
      invitedAt: row.invited_at,
      respondedAt: row.responded_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async startMeeting(id: string) {
    const result = await db.query(
      "UPDATE meetings SET status = 'in_progress', updated_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Meeting not found');
    }

    return this.mapMeeting(result.rows[0]);
  }

  async endMeeting(id: string) {
    const result = await db.query(
      "UPDATE meetings SET status = 'completed', updated_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Meeting not found');
    }

    return this.mapMeeting(result.rows[0]);
  }

  private mapMeeting(row: Record<string, unknown>) {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      departmentId: row.department_id,
      meetingType: row.meeting_type,
      startTime: row.start_time,
      endTime: row.end_time,
      timezone: row.timezone,
      location: row.location,
      room: row.room,
      format: row.format,
      status: row.status,
      isRecurring: row.is_recurring,
      recurringPattern: row.recurring_pattern,
      zoomMeetingId: row.zoom_meeting_id,
      zoomJoinUrl: row.zoom_join_url,
      zoomHostUrl: row.zoom_host_url,
      outlookEventId: row.outlook_event_id,
      recordingEnabled: row.recording_enabled,
      waitingRoomEnabled: row.waiting_room_enabled,
      passwordProtected: row.password_protected,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
