import { exec } from 'child_process';

const globalStartup = async () => {
    console.log('\x1b[33m🚀 Starting backend server!');
    await new Promise<void>((resolve, reject) => {
        const process = exec('cd .. && cd BE && npm run dev', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error starting backend: ${stderr}`);
                reject(err);
            }
        });

        process.stdout?.on('data', (data) => {
            if (data.includes('Server is running')) {
                console.log('\x1b[32m✅ Server is now running, beginning tests!\x1b[0m');
                resolve();
            }
        });
    });
};

export default globalStartup;
