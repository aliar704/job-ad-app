import Joi from 'joi';

const citiesValidation = {
  addCitySchema: Joi.object({
    name: Joi.string().required(),
    country: Joi.string().optional(),
  }),
};

export default citiesValidation;
