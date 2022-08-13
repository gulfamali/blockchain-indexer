const knex = require('knex')({
    client: 'mysql2',
    port: 3306,
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME,
    },
    pool: { min: 1, max: 50 },
    log: {
        error(message) {
            console.log(`DB Error: ${message}`.red)
        }
    }
});

const check = () => {

    knex.raw('SELECT 1').then(() => {
        // Success / boot rest of app
    }).catch(err => {
        // Failure / timeout
        throw err
    });
}

module.exports = { knex, check };