import * as yup from 'yup';

export const envSchema = yup.object({
	NODE_ENV: yup.string().oneOf(['development', 'production', 'test']).required('NODE_ENV not provided'),
	HOST: yup.string().trim().required(),
	CORS: yup.string().trim().required(),
	PORT: yup.number().integer().positive().required(),
});
