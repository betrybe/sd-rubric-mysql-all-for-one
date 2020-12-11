const { throws } = require('assert');
const { exec } = require('child_process');
const path = require('path');

const credentials = { user: process.env.MYSQL_USER, password: process.env.MYSQL_PASSWORD, host: process.env.HOSTNAME, port: 3306, database: 'northwind' };

const importer = (db) => new Promise((resolve,reject)=>{
  exec(`mysql -u ${credentials.user} --password=${credentials.password} -q -r < ${path.join(__dirname,"..",`${db}.sql`)}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return reject(false);
    }
    return resolve(true);
  });
});

const runQuery = async (sequelize, challengeQuery, props) => {
  if(!sequelize){
    console.error('Sequelize has not been initialized.');
    return;
  }

  let sequelizeResult = "No results";
  try {
    sequelizeResult = await sequelize.query(challengeQuery, props);
  } catch (error) {
    console.error(error.stack);
  } finally {
    return sequelizeResult;
  }
}

module.exports = { credentials, importer, runQuery}
