import Joi from 'joi';

const usersValidation = {
  signupSchema: Joi.object({
    full_name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('jobseeker', 'employer').required(),
    phone: Joi.string().required(),
    birth_date: Joi.date().optional(),
    city: Joi.string(),
  }),

  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateSchema: Joi.object({
    full_name: Joi.string().min(3).max(30).optional().disallow(null),
    phone: Joi.string().optional().disallow(null),
    birth_date: Joi.date().optional(),
    city: Joi.string().optional().disallow(null),
  }),
};

export default usersValidation;
