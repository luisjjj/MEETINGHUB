import { Request, Response } from 'express';
import { MeetingService } from '../services/meeting.service';
import { AuthRequest } from '../middleware/auth';
import { createMeetingSchema, updateMeetingSchema } from '../validators/meeting.validator';

export class MeetingController {
  private service = new MeetingService();

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 20, status, departmentId, startDate, endDate } = req.query;
      const result = await this.service.getAll({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        departmentId: departmentId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch meetings' });
    }
  };

  getById = async (req: AuthRequest, res: Response) => {
    try {
      const meeting = await this.service.getById(req.params.id);
      res.json(meeting);
    } catch (error) {
      res.status(404).json({ message: 'Meeting not found' });
    }
  };

  create = async (req: AuthRequest, res: Response) => {
    try {
      const data = createMeetingSchema.parse(req.body);
      const meeting = await this.service.create(data, req.user!.id);
      res.status(201).json(meeting);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create meeting' });
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      const data = updateMeetingSchema.parse(req.body);
      const meeting = await this.service.update(req.params.id, data);
      res.json(meeting);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update meeting' });
    }
  };

  delete = async (req: AuthRequest, res: Response) => {
    try {
      await this.service.delete(req.params.id);
      res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete meeting' });
    }
  };

  getParticipants = async (req: AuthRequest, res: Response) => {
    try {
      const participants = await this.service.getParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch participants' });
    }
  };

  startMeeting = async (req: AuthRequest, res: Response) => {
    try {
      const meeting = await this.service.startMeeting(req.params.id);
      res.json(meeting);
    } catch (error) {
      res.status(400).json({ message: 'Failed to start meeting' });
    }
  };

  endMeeting = async (req: AuthRequest, res: Response) => {
    try {
      const meeting = await this.service.endMeeting(req.params.id);
      res.json(meeting);
    } catch (error) {
      res.status(400).json({ message: 'Failed to end meeting' });
    }
  };
}
