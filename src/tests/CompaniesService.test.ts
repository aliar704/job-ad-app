import CompaniesServices from '../services/CompaniesService';
import { NotFoundException } from '../exceptions/not-found-exception';
import { BadRequestException } from '../exceptions/bad-request-exception';

import { getOrSetCache } from '../cache/cacheUtils';
import {
  normalizeCreateCompanyInput,
  normalizeUpdateCompanyInput,
} from '../utils/normalizationUtils';
import { invalidateAllCompaniesCache } from '../cache/companiesCache';
import { City } from '../types/dataTypes/cityData';
import {
  AddCompanyDTO,
  Company,
  MappedCompany,
  UpdateCompanyDTO,
} from '../types/dataTypes/companyData';

// Mocks
jest.mock('../cache/cacheUtils');
jest.mock('../utils/normalizationUtils');
jest.mock('../cache/companiesCache');

const mockRepository = {
  createCompany: jest.fn(),
  getFullCompanyById: jest.fn(),
  listCompanies: jest.fn(),
  listUserCompanies: jest.fn(),
  listCityCompanies: jest.fn(),
  findCompany: jest.fn(),
  updateCompany: jest.fn(),
  companyOwnershipCheck: jest.fn(),
  softDeleteCompany: jest.fn(),
};

const mockCitiesServices = {
  findCity: jest.fn(),
  addCity: jest.fn(),
};

const service = new CompaniesServices(mockRepository as any, mockCitiesServices as any);

// Sample test data
const fakeCity: City = {
  id: 1,
  name: 'paris',
  country: 'france',
  created_at: new Date(),
};

const fakeCompany: Company = {
  id: 1,
  employer_id: 1,
  name: 'test company',
  city_id: 1,
  created_at: new Date(),
  deleted_at: null as unknown as Date,
};

const mappedCompany: MappedCompany = {
  id: 1,
  name: 'test company',
  created_at: new Date(),
  deleted_at: null as unknown as Date,
  employer: { id: 1, name: 'John Doe' },
  city: { id: 1, name: 'paris' },
};

describe('CompaniesServices', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createCompany', () => {
    it('creates a company successfully', async () => {
      const input: AddCompanyDTO = { name: 'TestCo', city: 'paris' };

      mockCitiesServices.findCity.mockResolvedValueOnce(null);
      mockCitiesServices.addCity.mockResolvedValueOnce(fakeCity);
      (normalizeCreateCompanyInput as jest.Mock).mockReturnValue({ name: 'testco', city_id: 1 });
      mockRepository.createCompany.mockResolvedValueOnce(fakeCompany);
      mockRepository.getFullCompanyById.mockResolvedValueOnce(mappedCompany);

      const result = await service.createCompany(1, input);
      expect(result).toEqual(mappedCompany);
      expect(invalidateAllCompaniesCache).toHaveBeenCalled();
    });
  });

  describe('getCompaniesList', () => {
    it('returns cached or fresh company list', async () => {
      const companyList: Company[] = [fakeCompany];
      (getOrSetCache as jest.Mock).mockImplementationOnce(async (_key, fn) => fn());

      mockRepository.listCompanies.mockResolvedValueOnce(companyList);
      const result = await service.getCompaniesList();

      expect(result).toEqual(companyList);
      expect(mockRepository.listCompanies).toHaveBeenCalled();
    });
  });

  describe('getUserCompaniesList', () => {
    it('returns user companies', async () => {
      mockRepository.listUserCompanies.mockResolvedValueOnce([fakeCompany]);

      const result = await service.getUserCompaniesList(1);
      expect(result).toEqual([fakeCompany]);
    });
  });

  describe('getCityCompaniesList', () => {
    it('throws if city not found', async () => {
      mockCitiesServices.findCity.mockResolvedValueOnce(null);

      await expect(service.getCityCompaniesList('nowhere')).rejects.toThrow(NotFoundException);
    });

    it('returns full mapped companies', async () => {
      mockCitiesServices.findCity.mockResolvedValueOnce(fakeCity);
      mockRepository.listCityCompanies.mockResolvedValueOnce([fakeCompany]);
      mockRepository.getFullCompanyById.mockResolvedValueOnce(mappedCompany);

      const result = await service.getCityCompaniesList(fakeCity.id);
      expect(result).toEqual([mappedCompany]);
    });

    it('throws if no companies found in city', async () => {
      mockCitiesServices.findCity.mockResolvedValueOnce(fakeCity);
      mockRepository.listCityCompanies.mockResolvedValueOnce([]);

      await expect(service.getCityCompaniesList(fakeCity.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCompanyById', () => {
    it('throws if not found', async () => {
      mockRepository.findCompany.mockResolvedValueOnce(undefined);

      await expect(service.getCompanyById(99)).rejects.toThrow(NotFoundException);
    });

    it('returns full company data', async () => {
      mockRepository.findCompany.mockResolvedValueOnce(fakeCompany);
      mockRepository.getFullCompanyById.mockResolvedValueOnce(mappedCompany);

      const result = await service.getCompanyById(1);
      expect(result).toEqual(mappedCompany);
    });
  });

  describe('updateCompany', () => {
    const updateInput: UpdateCompanyDTO = { name: 'UpdatedName', city: 1 };
    const updatedCompany: Company = {
      ...fakeCompany,
      name: 'updatedname',
    };
    const updatedMappedCompany: MappedCompany = {
      ...mappedCompany,
      name: 'updatedname',
    };

    it('throws if company not found', async () => {
      mockRepository.findCompany.mockResolvedValueOnce(undefined);

      await expect(service.updateCompany(1, 99, updateInput)).rejects.toThrow(NotFoundException);
    });

    it('throws if user is not owner', async () => {
      mockRepository.findCompany.mockResolvedValueOnce(fakeCompany);
      mockRepository.companyOwnershipCheck.mockResolvedValueOnce(false);

      await expect(service.updateCompany(2, 1, updateInput)).rejects.toThrow(BadRequestException);
    });

    it('updates successfully', async () => {
      mockRepository.findCompany.mockResolvedValueOnce(fakeCompany);
      mockRepository.companyOwnershipCheck.mockResolvedValueOnce(true);
      mockCitiesServices.findCity.mockResolvedValueOnce(fakeCity);
      (normalizeUpdateCompanyInput as jest.Mock).mockReturnValue({
        name: 'updatedname',
        city_id: 1,
      });
      mockRepository.updateCompany.mockResolvedValueOnce(updatedCompany);
      mockRepository.getFullCompanyById.mockResolvedValueOnce(updatedMappedCompany);

      const result = await service.updateCompany(1, 1, updateInput);
      expect(result).toEqual(updatedMappedCompany);
    });
  });

  describe('deleteCompany', () => {
    const deletedCompany: Company = {
      ...fakeCompany,
      deleted_at: new Date(),
    };
    it('throws if user not owner', async () => {
      mockRepository.companyOwnershipCheck.mockResolvedValueOnce(false);

      await expect(service.deleteCompany(2, 1)).rejects.toThrow(NotFoundException);
    });

    it('deletes successfully', async () => {
      mockRepository.companyOwnershipCheck.mockResolvedValueOnce(true);
      mockRepository.softDeleteCompany.mockResolvedValueOnce(deletedCompany);

      const result = await service.deleteCompany(1, 1);
      expect(result).toEqual(deletedCompany);
    });
  });
});
