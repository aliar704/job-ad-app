import { NextFunction, Request, Response } from 'express';
import TagsServices from '../services/TagsService';

class TagsController {
  private tagsServices: TagsServices;

  constructor(tagsServices: TagsServices) {
    this.tagsServices = tagsServices;
  }

  addTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.tagsServices.addTag(req.body.name);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.tagsServices.getAllTags();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.tagsServices.deleteTag(+req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default TagsController;
