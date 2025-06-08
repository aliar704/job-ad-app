import { NextFunction, Request, Response } from 'express';
import JobTagsServices from '../services/JobTagsService';

class JobTagsController {
  private jobTagsServices: JobTagsServices;

  constructor(jobTagsServices: JobTagsServices) {
    this.jobTagsServices = jobTagsServices;
  }

  addJobTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.jobTagsServices.addJobTags(+req.params.id, req.body);
      res.status(200).json({ result: 'Done' });
    } catch (error) {
      next(error);
    }
  };

  getAllJobTags = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.jobTagsServices.getAllJobTags();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteJobTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.jobTagsServices.deleteJobTag(req.user.id,+req.params.id, req.body.tag_id);
      res.status(200).json({ result: 'Done' });
    } catch (error) {
      next(error);
    }
  };
}

export default JobTagsController;
