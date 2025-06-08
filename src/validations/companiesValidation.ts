import Joi from 'joi';

const companiesValidation = {
  createCompanySchema: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().optional(),
    website: Joi.string().optional(),
    phone: Joi.string().optional(),
    city: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    address: Joi.string().optional(),
  }),
  updateCompanySchema: Joi.object({
    name: Joi.string().min(3).max(100).optional().disallow(null),
    description: Joi.string().optional(),
    website: Joi.string().optional(),
    phone: Joi.string().optional(),
    city: Joi.alternatives().try(Joi.string(), Joi.number()).optional().disallow(null),
    address: Joi.string().optional(),
  }),
};

export default companiesValidation;
