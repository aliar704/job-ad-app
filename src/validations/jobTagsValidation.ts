import Joi from 'joi';

const jobTagsValidation = {
  addJobTagSchema: Joi.object({
    tags: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())).required(),
  }),
};

export default jobTagsValidation;
