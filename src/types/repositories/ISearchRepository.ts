import { JobAd } from "../dataTypes/jobAdData";
import { SearchJobAdsDTO } from "../dataTypes/searchData";

export interface ISearchRepository {
  searchJobAds(filters: SearchJobAdsDTO): Promise<JobAd[]>;
}
