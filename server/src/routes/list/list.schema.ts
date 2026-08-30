import * as yup from 'yup';

const VALIDATORS = {
	number: (key: string, required?: boolean) => {
		const rule = yup
			.number()
			.integer(key + ' must be int')
			.typeError(key + ' typeError');

		return required ? rule.required(key + ' required') : rule;
	},
};

export default {
	getList: yup
		.object({
			id: VALIDATORS.number('id').optional(),
			limit: VALIDATORS.number('limit').default(20),
			offset: VALIDATORS.number('offset').default(0),
		})
		.default({ limit: 20, offset: 0 }),
	addItemToList: VALIDATORS.number('id', true),
	updateItemOrder: yup.object({
		fromPos: VALIDATORS.number('fromPos', true),
		toPos: VALIDATORS.number('fromPos', true),
	}),
};
