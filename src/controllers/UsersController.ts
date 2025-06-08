import { NextFunction, Request, Response } from 'express';
import UsersServices from '../services/UsersService';

class UsersController {
  private usersServices: UsersServices;

  constructor(usersServices: UsersServices) {
    this.usersServices = usersServices;
  }

  getUsersList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.usersServices.getUsersList();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const user = await this.usersServices.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assumes req.user.id is typed and present from auth middleware
      const loggedUserId = Number(req.user.id);
      const updatedUser = await this.usersServices.updateUserById(loggedUserId, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  deleteLoggedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedUserId = Number(req.user.id);
      const deletedUser = await this.usersServices.deleteLoggedUser(loggedUserId);
      res.status(200).json(deletedUser);
    } catch (error) {
      next(error);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const deletedUser = await this.usersServices.deleteUserByIdAdmin(userId);
      res.status(200).json(deletedUser);
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
