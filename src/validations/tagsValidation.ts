import Joi from 'joi';

const tagsValidation = {
  addTagSchema: Joi.object({
    name: Joi.string().required(),
  }),
};

export default tagsValidation;
