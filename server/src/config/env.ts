import dotenv from 'dotenv';

import { envSchema } from '@/common/yupSchemas';

console.log('📜 Create env variables...');

dotenv.config();

export const env = envSchema.validateSync(process.env, { stripUnknown: true });
