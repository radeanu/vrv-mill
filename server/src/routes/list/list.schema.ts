import * as yup from 'yup';

const VALIDATORS = {
	number: (key: string) => {
		return yup
			.number()
			.integer(key + ' must be int')
			.typeError(key + ' typeError');
	},
};

export default {
	getList: yup
		.object({
			id: VALIDATORS.number('id').optional(),
			page: VALIDATORS.number('page').default(1),
		})
		.default({ page: 0 }),
	addItemToList: yup
		.object({
			key: yup.string().required('idempotency_key required'),
			id: VALIDATORS.number('id').required(),
		})
		.required('id required'),
	updateItemOrder: yup.object({
		fromPos: VALIDATORS.number('fromPos').required(),
		toPos: VALIDATORS.number('fromPos').required(),
	}),
};
