import { Company, MappedCompany, NormalizedCompanyInput } from "../dataTypes/companyData";

export interface ICompaniesRepository {
  createCompany(loggedUserId: number, data: NormalizedCompanyInput): Promise<Company>;

  companyOwnershipCheck(loggedUserId: number, companyId: number): Promise<boolean>;

  listCompanies(): Promise<Company[]>;

  listUserCompanies(loggedUserId: number): Promise<Company[]>;

  listCityCompanies(cityId: number): Promise<Company[]>;

  findCompany(input: string | number): Promise<Company | null>

  getFullCompanyById(companyId: number): Promise<MappedCompany>;

  updateCompany(companyId: number, data: NormalizedCompanyInput): Promise<Company>;

  findCityIdByCompanyId(companyId: number): Promise<number>;

  softDeleteCompany(companyId: number): Promise<Company>;
}
