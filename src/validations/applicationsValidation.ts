import Joi from 'joi';
import { STATUS } from '../types/dataTypes/applicationData';
const allowedStatuses = Object.values(STATUS).filter((status) => status !== STATUS.CANCELLED);
const applicationsValidation = {
  createApplicationSchema: Joi.object({
    job_ad_id: Joi.number().required(),
    resume_id: Joi.number().required(),
  }),

  changeStatusSchema: Joi.object({
    status: Joi.string()
      .valid(...Object.values(allowedStatuses))
      .required(),
  }),
};

export default applicationsValidation;
