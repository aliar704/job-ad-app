import { NextFunction, Request, Response } from 'express';
import JobAdsServices from '../services/JobAdsService';

class JobAdsController {
  private jobAdsServices: JobAdsServices;

  constructor(jobAdsServices: JobAdsServices) {
    this.jobAdsServices = jobAdsServices;
  }

  createJobAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.jobAdsServices.createJobAd(req.user.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserJobAdsList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.jobAdsServices.getUserJobAds(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getJobAdsList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.jobAdsServices.getJobAds();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  getJobAdApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.jobAdsServices.getJobAdApplications(+req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateJobAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.jobAdsServices.updateJobAd(req.user.id, +req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteJobAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.jobAdsServices.deleteJobAd(req.user.id, +req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getTopJobAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topJobAds = await this.jobAdsServices.getTopJobAds();
      res.status(200).json(topJobAds);
    } catch (error) {
      next(error);
    }
  };
}

export default JobAdsController;
