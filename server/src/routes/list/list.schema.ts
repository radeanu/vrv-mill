import * as yup from 'yup';

const VALIDATORS = {
	idpKey: yup.string().required('idempotency_key required'),
	number: (key: string) => {
		return yup
			.number()
			.integer(key + ' must be int')
			.typeError(key + ' typeError');
	},
};

export default {
	getList: yup.object({
		id: VALIDATORS.number('id').optional(),
		cursor: VALIDATORS.number('cursor').nullable().default(null),
	}),
	addItemToList: yup
		.object({
			key: VALIDATORS.idpKey,
			id: VALIDATORS.number('id').required(),
		})
		.required('id required'),
	selectItem: yup
		.object({
			key: VALIDATORS.idpKey,
			idx: VALIDATORS.number('idx').required(),
		})
		.required('id required'),
	updateItemOrder: yup.object({
		key: VALIDATORS.idpKey,
		oldPos: VALIDATORS.number('oldPos').required(),
		newPos: VALIDATORS.number('newPos').required(),
		searchId: VALIDATORS.number('searchId').optional(),
	}),
};
