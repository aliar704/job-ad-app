import { NextFunction, Request, Response } from 'express';
import ResumesServices from '../services/ResumesService';

class ResumesController {
  private resumesServices: ResumesServices;

  constructor(resumesServices: ResumesServices) {
    this.resumesServices = resumesServices;
  }

  createResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file! ;
      const fileUrl = `/uploads/resumes/${file.filename}`;
      req.body.file_url = fileUrl
      const result = await this.resumesServices.createResume(req.user.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getResumesList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.resumesServices.getUserResumes(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.resumesServices.updateResume(req.user.id, +req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.resumesServices.deleteResume(req.user.id, +req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default ResumesController;
