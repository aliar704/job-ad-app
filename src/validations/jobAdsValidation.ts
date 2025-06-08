import Joi from 'joi';
import { JobType, XPLVL } from '../types/dataTypes/jobAdData';

const jobAdsValidation = {
  createJobAdSchema: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    salary_min: Joi.number().optional(),
    salary_max: Joi.number().optional(),
    type: Joi.string()
      .valid(...Object.values(JobType))
      .required(),
    experience_level: Joi.string()
      .valid(...Object.values(XPLVL))
      .required(),
    company_id: Joi.number().required(),
    tags: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())).optional(),
  }),
  updateJobAdSchema: Joi.object({
    title: Joi.string().optional().disallow(null),
    description: Joi.string().optional().disallow(null),
    salary_min: Joi.number().optional(),
    salary_max: Joi.number().optional(),
    type: Joi.string()
      .valid(...Object.values(JobType))
      .optional().disallow(null),
    experience_level: Joi.string()
      .valid(...Object.values(XPLVL))
      .optional().disallow(null),
    company_id: Joi.number().optional().disallow(null),
    tags: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())).optional(),
  }),
};

export default jobAdsValidation;
