import 'dotenv/config';
import { knexSnakeCaseMappers } from 'objection';

const knexConfig = {
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    migrations: {
        directory: './src/database/migrations'
    },
    seeds: {
        directory: './src/database/seeds',
    },
    ...knexSnakeCaseMappers(),
}

export default knexConfig;
