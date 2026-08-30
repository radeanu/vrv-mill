import compression from 'compression';
import { type Express } from 'express';

export default function (app: Express) {
	app.use(
		compression({
			filter: (req, res) => {
				if (req.headers['x-no-compression']) {
					return false;
				}

				return compression.filter(req, res);
			}
		})
	);
}
