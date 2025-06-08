import { Request, Response, NextFunction } from 'express';
import SearchService from '../services/SearchService';
import { SearchJobAdsDTO } from '../types/dataTypes/searchData';

class SearchController {
  private searchService: SearchService;

  constructor(searchService: SearchService) {
    this.searchService = searchService;
  }

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, company, city, tags } = req.query;

      let parsedTags: string[] = [];
      if (typeof tags === 'string') {
        parsedTags = tags.split(',').map((tag) => tag.trim());
      } else if (Array.isArray(tags)) {
        parsedTags = tags.map((tag) => tag.toString().trim());
      }

      const filters: SearchJobAdsDTO = {
        title: title?.toString(),
        company: company?.toString(),
        city: city?.toString(),
        tags: parsedTags,
      };

      const result = await this.searchService.searchJobs(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default SearchController;
