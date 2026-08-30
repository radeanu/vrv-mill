import express, { type Express } from 'express';

export default function (app: Express) {
	app.use(express.json({ limit: '10mb' }));
}
