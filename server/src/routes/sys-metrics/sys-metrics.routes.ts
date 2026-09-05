import os from 'os';
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
	});

	if (typeof res.flush === 'function') res.flush();

	const sendMetrics = () => {
		getCPUUsage((cpuPercent: number) => {
			const totalMemory = os.totalmem();
			const serverTotalMB = (totalMemory / 1024 / 1024).toFixed(0);

			const nodeAppUsed = process.memoryUsage().rss;
			const nodeAppUsedMB = nodeAppUsed / 1024 / 1024;

			const payload = JSON.stringify({
				cpu: `${cpuPercent}%`,
				ram: {
					serverTotal: `${serverTotalMB} MB`,
					nodeAppUsed: `${nodeAppUsedMB.toFixed(0)} MB`,
					nodeAppUsedPercent: `${((nodeAppUsed / totalMemory) * 100).toFixed(1)}%`,
				},
			});

			res.write(`data: ${payload}\n\n`);
			if (typeof res.flush === 'function') res.flush();
		});
	};

	const intervalId = setInterval(sendMetrics, 2000);
	sendMetrics();

	req.on('close', () => {
		clearInterval(intervalId);
		res.end();
	});
});

function getCPUUsage(callback: Function) {
	const stats1 = os.cpus();
	setTimeout(() => {
		const stats2 = os.cpus();
		let totalDiff = 0,
			idleDiff = 0;
		for (let i = 0; i < stats1.length; i++) {
			const cpu1 = stats1[i].times;
			const cpu2 = stats2[i].times;
			totalDiff +=
				cpu2.user -
				cpu1.user +
				(cpu2.nice - cpu1.nice) +
				(cpu2.sys - cpu1.sys) +
				(cpu2.idle - cpu1.idle) +
				(cpu2.irq - cpu1.irq);
			idleDiff += cpu2.idle - cpu1.idle;
		}
		const percentage = ((totalDiff - idleDiff) / totalDiff) * 100;
		callback(percentage.toFixed(1));
	}, 1000);
}

export default router;
