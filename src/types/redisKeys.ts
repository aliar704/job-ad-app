export const RedisKeys = {
  TOP_JOB_SEEKERS: 'jobseekers:top',
  ALL_COMPANIES: 'companies:all',
  CITY_COMPANIES: (cityId: number) => `companies:city:${cityId}`,
  ALL_CITIES: 'cities:all',
  COMPANY_DETAILS: (id: number) => `company:${id}`,
  JOBAD_DETAILS: (id: number) => `jobad:${id}`,
};
