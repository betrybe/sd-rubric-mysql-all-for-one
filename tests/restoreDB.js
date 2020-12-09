const Importer = require('mysql-import');

const {
	MYSQL_USER,
	MYSQL_PASSWORD,
	HOSTNAME
} = process.env;
  
const restoreDB = async(name) => {
	const importer = new Importer(
		{ user: MYSQL_USER, password: MYSQL_PASSWORD, host: HOSTNAME }
	);

	await importer.import(`./${name}.sql`);

	importer.disconnect();
}

module.exports = restoreDB;
