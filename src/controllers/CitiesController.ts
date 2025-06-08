import { NextFunction, Request, Response } from 'express';
import CitiesServices from '../services/CitiesServices';

class CitiesController {
  private citiesServices: CitiesServices;

  constructor(citiesServices: CitiesServices) {
    this.citiesServices = citiesServices;
  }

  addCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const city = await this.citiesServices.addCity(req.body);
      res.status(200).json(city);
    } catch (error) {
      next(error);
    }
  };

  getAllCities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cities = await this.citiesServices.getAllCities();
      res.status(200).json(cities);
    } catch (error) {
      next(error);
    }
  };

  deleteCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cityId = Number(req.params.id);
      const deletedCity = await this.citiesServices.deleteCity(cityId);
      res.status(200).json(deletedCity);
    } catch (error) {
      next(error);
    }
  };
}

export default CitiesController;
