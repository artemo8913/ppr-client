import { exec } from 'node:child_process';

export async function reloadDatabase() {
    const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    return new Promise<void>((resolve, reject) => {
        exec(`mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < tests/mock/dump.sql`, (error) => {
            error ? reject(error) : resolve();
        });
    });
}