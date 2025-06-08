import { NextFunction, Request, Response } from 'express';
import CompaniesServices from '../services/CompaniesService';

class CompaniesController {
  private companiesServices: CompaniesServices;

  constructor(companiesServices: CompaniesServices) {
    this.companiesServices = companiesServices;
  }

  createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const company = await this.companiesServices.createCompany(req.user.id, req.body);
      res.status(200).json(company);
    } catch (error) {
      next(error);
    }
  };

  getCompaniesList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companies = await this.companiesServices.getCompaniesList();
      res.status(200).json(companies);
    } catch (error) {
      next(error);
    }
  };

  getUserCompaniesList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userCompanies = await this.companiesServices.getUserCompaniesList(req.user.id);
      res.status(200).json(userCompanies);
    } catch (error) {
      next(error);
    }
  };

  getCompanyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = Number(req.params.id);
      const company = await this.companiesServices.getCompanyById(companyId);
      res.status(200).json(company);
    } catch (error) {
      next(error);
    }
  };

  getCityCompaniesList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companies = await this.companiesServices.getCityCompaniesList(req.body.city);
      res.status(200).json(companies);
    } catch (error) {
      next(error);
    }
  };

  updateCompanyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = Number(req.params.id);
      const updatedCompany = await this.companiesServices.updateCompany(req.user.id,companyId, req.body);
      res.status(200).json(updatedCompany);
    } catch (error) {
      next(error);
    }
  };

  deleteCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = Number(req.params.id);
      const deletedCompany = await this.companiesServices.deleteCompany(req.user.id, companyId);
      res.status(200).json(deletedCompany);
    } catch (error) {
      next(error);
    }
  };
}

export default CompaniesController;
