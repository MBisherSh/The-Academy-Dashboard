import Joi from 'joi';
/**
 *
 * @param schema
 * @param data
 */
const generator = async (schema, data) => {
	const object = Joi.object(schema);
	await object.validateAsync(data);
};

const JoiUtil = { generator };

export default JoiUtil