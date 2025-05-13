export default {
    client: 'sqlite3',
    connection: {
        filename: './src/database/database.db',
    },
    pool: {
        afterCreate: (connection: any, done: any) => {
            connection.run("PRAGMA foreign_keys = ON", done);
        }
    },
    migrations: {
        extensions: "ts",
        directory: './src/database/migrations'
    },
    useNullAsDefault: true,
    seeds: {
        extensions: "ts",
        directory: './src/database/seeds'
    },
}