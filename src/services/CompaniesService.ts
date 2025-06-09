import { ICompaniesRepository } from '../types/repositories';

import { NotFoundException } from '../exceptions/not-found-exception';
import { getOrSetCache } from '../cache/cacheUtils';
import { RedisKeys } from '../types/redisKeys';
import _ from 'lodash';
import { invalidateAllCompaniesCache } from '../cache/companiesCache';
import CitiesServices from './CitiesServices';
import {
  normalizeCreateCompanyInput,
  normalizeUpdateCompanyInput,
} from '../utils/normalizationUtils';
import { BadRequestException } from '../exceptions/bad-request-exception';
import {
  AddCompanyDTO,
  Company,
  MappedCompany,
  UpdateCompanyDTO,
} from '../types/dataTypes/companyData';
import { ErrorCode } from '../types/errorCodes';
import { City } from '../types/dataTypes/cityData';
import { ConflictException } from '../exceptions/conflict-exception';

class CompaniesServices {
  private companiesRepository: ICompaniesRepository;
  private citiesServices: CitiesServices;

  constructor(companiesRepository: ICompaniesRepository, citiesServices: CitiesServices) {
    this.companiesRepository = companiesRepository;
    this.citiesServices = citiesServices;
  }
  //helper
  private async resolveCity(cityInput: string | number): Promise<City> {
    let city = await this.citiesServices.findCity(cityInput);
    if (!city) {
      if (typeof cityInput === 'string') {
        city = await this.citiesServices.addCity({ name: cityInput.toLowerCase() });
      } else {
        throw new NotFoundException('City not found', ErrorCode.NOT_FOUND_CITY_EXCEPTION);
      }
    }
    return city;
  }

  async createCompany(loggedUserId: number, data: AddCompanyDTO): Promise<MappedCompany> {
    const city = await this.resolveCity(data.city);
    data.city = city.id;
    const normalizedData = normalizeCreateCompanyInput(data);
    const foundCompany = await this.companiesRepository.findCompany(normalizedData.name as string);
    if (foundCompany) {
      throw new ConflictException(
        'Company with this name already exists',
        ErrorCode.CONFLICT_EXCEPTION
      );
    }

    const company = await this.companiesRepository.createCompany(loggedUserId, normalizedData);
    invalidateAllCompaniesCache();
    return await this.companiesRepository.getFullCompanyById(company.id);
  }

  async getCompaniesList(): Promise<Company[]> {
    return await getOrSetCache(RedisKeys.ALL_COMPANIES, () =>
      this.companiesRepository.listCompanies()
    );
  }

  async getUserCompaniesList(loggedUserId: number): Promise<Company[]> {
    return await this.companiesRepository.listUserCompanies(loggedUserId);
  }

  async getCityCompaniesList(inputCity: number | string): Promise<MappedCompany[]> {
    const city = await this.citiesServices.findCity(inputCity);
    if (!city) throw new NotFoundException('City not found', ErrorCode.NOT_FOUND_CITY_EXCEPTION);

    const companies = await this.companiesRepository.listCityCompanies(city.id);
    if (!companies.length)
      throw new NotFoundException('No Companies found', ErrorCode.NOT_FOUND_COMPANY_EXCEPTION);

    const fullCompanies = await Promise.all(
      companies.map((company) => this.companiesRepository.getFullCompanyById(company.id))
    );
    return fullCompanies;
  }

  async getCompanyById(id: number): Promise<MappedCompany> {
    const foundCompany = await this.companiesRepository.findCompany(id);
    if (!foundCompany)
      throw new NotFoundException('Company not found!', ErrorCode.NOT_FOUND_COMPANY_EXCEPTION);
    return await this.companiesRepository.getFullCompanyById(foundCompany.id);
  }

  async updateCompany(
    loggedUserId: number,
    companyId: number,
    data: UpdateCompanyDTO
  ): Promise<MappedCompany> {
    const foundCompany = await this.companiesRepository.findCompany(companyId);
    if (!foundCompany)
      throw new NotFoundException('Company not found!', ErrorCode.NOT_FOUND_COMPANY_EXCEPTION);
    const isOwner = await this.companiesRepository.companyOwnershipCheck(loggedUserId, companyId);
    if (!isOwner)
      throw new BadRequestException(
        'Company doesn not belong to you',
        ErrorCode.BAD_REQUEST_EXCEPTION
      );
    if (data.city) {
      const city = await this.resolveCity(data.city);
      data.city = city.id;
    }
    const normalizedData = normalizeUpdateCompanyInput(data);

    const res = await this.companiesRepository.updateCompany(companyId, normalizedData);
    return await this.companiesRepository.getFullCompanyById(res.id);
  }

  async deleteCompany(loggedUserId: number, companyId: number): Promise<Company> {
    const isOwner = await this.companiesRepository.companyOwnershipCheck(loggedUserId, companyId);
    if (!isOwner)
      throw new NotFoundException(
        "The company either doesn't exist or isn't owned by the user",
        ErrorCode.NOT_FOUND_COMPANY_EXCEPTION
      );
    return await this.companiesRepository.softDeleteCompany(companyId);
  }
}

export default CompaniesServices;
