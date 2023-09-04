import Joi from 'joi';

const namesRequired = Joi.string().min(3).max(60).required();
const namesOptional = Joi.string().min(3).max(60).optional();
const emailRequired = Joi.string()
	.email({ minDomainSegments: 2, tlds: { allow: false } })
	.error(new Error('emailValidationError'))
	.required();
const emailOptional = Joi.string()
	.email({ minDomainSegments: 2, tlds: { allow: false } })
	.optional();
const passwordRequired = Joi.string().min(8).required();
const numberRequired = Joi.number().required();
const amountRequired = Joi.number().min(1000).required();
const numberOptional = Joi.number().optional();
const stringRequired = Joi.string().required();
const stringOptional = Joi.string().optional();
const stringOptionalEmpty = Joi.string().optional().allow('');
const booleanOptional = Joi.boolean().optional();
const booleanRequired = Joi.boolean().required();
const arrayRequired = Joi.array().required();
const arrayOptional = Joi.array().optional();
const dateOptional = Joi.date().optional();
const dateRequired = Joi.date().required();
const loginPasswordRequired = Joi.string().min(1).error(new Error('passwordValidationError')).required();
const commonChains = {
	namesOptional,
	namesRequired,
	emailRequired,
	emailOptional,
	passwordRequired,
	numberRequired,
	stringRequired,
	booleanOptional,
	stringOptional,
	stringOptionalEmpty,
	numberOptional,
	booleanRequired,
	arrayRequired,
	arrayOptional,
	dateOptional,
	dateRequired,
	loginPasswordRequired,
	amountRequired,
};
export default commonChains;
