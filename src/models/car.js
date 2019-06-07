/* eslint-disable linebreak-style */
import Joi from '@hapi/joi';


export const cars = [
  {
    id: 1,
    owner: 1, // user id
    created_on: 'DateTime',
    state: 'new', // new,used
    status: 'available', // sold,available - default is available
    price: 'Float',
    manufacturer: 'String',
    model: 'String',
    body_type: 'String', // car, truck, trailer, van, etc
  },

];

export const carSchema = Joi.object().keys({
  state: Joi.string().valid(['new', 'used']).required(),
  status: Joi.string().valid(['sold', 'available']).default('available'),
  price: Joi.number().min(1).max(100000000000)
    .required(),
  manufacturer: Joi.string(),
  model: Joi.string().required(),
  body_type: Joi.string().required(),
});
