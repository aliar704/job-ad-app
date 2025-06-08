import { NextFunction, Request, Response } from 'express';
import ApplicationsServices from '../services/ApplicationsService';
import { ChangeApplicationStatusDTO } from '../types/dataTypes/applicationData';

class ApplicationsController {
  private applicationsServices: ApplicationsServices;

  constructor(applicationsServices: ApplicationsServices) {
    this.applicationsServices = applicationsServices;
  }

  createApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.applicationsServices.createApplication(req.user.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getApplicationsList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.applicationsServices.getUserApplications(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  cancelApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicationId = Number(req.params.id);
      const result = await this.applicationsServices.cancelApplication(req.user.id, applicationId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  changeApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicationId = Number(req.params.id);
      const result = await this.applicationsServices.changeApplicationStatus(req.body as ChangeApplicationStatusDTO,applicationId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getTopJobSeekers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topUsers = await this.applicationsServices.getTopJobSeekers();
      res.status(200).json(topUsers);
    } catch (error) {
      next(error);
    }
  };

  getAllApplicationsInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.applicationsServices.getAllApplicationsInfo(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default ApplicationsController;
