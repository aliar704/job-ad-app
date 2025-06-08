import { Application, CreateApplicationDTO, STATUS } from "../dataTypes/applicationData";

export interface IApplicationsRepository {
  applicationOwnershipCheck(loggedUserId: number, applicationId: number): Promise<boolean>;
  isAlreadyApplied(loggedUserId: number,jobAdId:number):  Promise<boolean>
  findApplication(applicationId: number): Promise<Application | null>;
  createApplication(loggedUserId: number, data: CreateApplicationDTO): Promise<Application>;
  listApplications(loggedUserId: number): Promise<Application[]>;
  cancelApplication(applicationId: number): Promise<Application>;
  
  changeApplicationStatus(applicationId: number,applicationStatus:STATUS): Promise<Application>
  listAllApplicationsInfo(applicationId: number): Promise<any[]>
  getTopJobSeekersByApplications(limit?: number): Promise<any[]>;
}
