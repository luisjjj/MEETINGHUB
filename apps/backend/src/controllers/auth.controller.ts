import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';
import { registerSchema, loginSchema } from '../validators/auth.validator';

export class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await this.service.register(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.service.login(data);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  logout = async (_req: AuthRequest, res: Response) => {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Logout failed' });
    }
  };

  refreshToken = async (req: AuthRequest, res: Response) => {
    try {
      const result = await this.service.refreshToken(req.user!.id);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: 'Token refresh failed' });
    }
  };

  getMe = async (req: AuthRequest, res: Response) => {
    try {
      const user = await this.service.getUserById(req.user!.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  };
}
