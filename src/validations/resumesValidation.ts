import Joi from 'joi';

const resumesValidation = {
  createResumeSchema: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    file_url: Joi.string().allow(null).optional(),
  }),
  updateResumeSchema: Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().optional(),
    file_url: Joi.string().allow(null).optional(),
  }),
};

export default resumesValidation;
