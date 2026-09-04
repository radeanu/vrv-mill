import * as yup from 'yup';

export default {
	getStatuses: yup.array().of(yup.string().required('task key required')).required('tasks list required'),
};
