import { JobAd } from '../types/dataTypes/jobAdData';
import { SearchJobAdsDTO } from '../types/dataTypes/searchData';
import { ISearchRepository } from '../types/repositories';
import { normalizeSearchJobAdsDTO } from '../utils/normalizationUtils';

class SearchService {
  private searchRepository: ISearchRepository;

  constructor(searchRepository: ISearchRepository) {
    this.searchRepository = searchRepository;
  }

  async searchJobs(filters: SearchJobAdsDTO): Promise<JobAd[]> {
    const normalizedData = normalizeSearchJobAdsDTO(filters)
    
    return await this.searchRepository.searchJobAds(normalizedData);
  }
}

export default SearchService;
