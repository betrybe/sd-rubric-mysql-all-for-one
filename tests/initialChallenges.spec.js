const { readFileSync } = require('fs');
const { Sequelize } = require('sequelize');
const {credentials, importer, runQuery} = require('./helper');

describe('Desafios iniciais', () => {
  let sequelize;
  
  beforeAll(async () => {
    const { user, password, host, port, database } = credentials;
    jest.setTimeout(30000);
    
    await importer(database);

    sequelize = new Sequelize(
      `mysql://${user}:${password}@${host}:${port}/${database}`, { logging:false }
    );

    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error('Could not connect to the database:', error.message);
    }
  });

  afterAll(async () => {
    const { database } = credentials;
    await runQuery(sequelize, `DROP DATABASE ${database};`, { type: 'RAW' });
    sequelize.close();
    await importer(database);
  });

  it('1: Exiba apenas os nomes do produtos na tabela `products`', async () => {
    const challengeQuery = readFileSync('desafio1.sql', 'utf8').trim();
    const expectedResult = require('./challengesResults/challengeResult1');

    expect(await runQuery(sequelize, challengeQuery, { type: 'SELECT' })).toEqual(expectedResult);
  });

  it('2: Exiba os dados de todas as colunas da tabela `products`', async () => {
    const challengeQuery = readFileSync('desafio2.sql', 'utf8').trim();
    const expectedResult = require('./challengesResults/challengeResult2');

    expect(await runQuery(sequelize, challengeQuery, { type: 'SELECT' })).toEqual(expectedResult);
  });

  it('3: Escreva uma query que exiba os valores da coluna que representa a primary key da tabela `products`', async () => {
    const challengeQuery = readFileSync('desafio3.sql', 'utf8').trim();
    const expectedResult = require('./challengesResults/challengeResult3');

    expect(await runQuery(sequelize, challengeQuery, { type: 'SELECT' })).toEqual(expectedResult);
  });

  it('4: Conte quantos registros existem em `product_name` de `products`', async () => {
    const challengeQuery = readFileSync('desafio4.sql', 'utf8').trim();
    const expectedResult = require('./challengesResults/challengeResult4');

    expect(await runQuery(sequelize, challengeQuery, { type: 'SELECT' })).toEqual(expectedResult);
  });

  it('5: Monte uma query que exiba os dados da tabela `products` a partir do quarto registro até o décimo terceiro, incluindo tanto um quanto o outro', async () => {
    const challengeQuery = readFileSync('desafio5.sql', 'utf8').trim();
    const expectedResult = require('./challengesResults/challengeResult5');

    expect(await runQuery(sequelize, challengeQuery, { type: 'SELECT' })).toEqual(expectedResult);
  });

  it('6: Exiba os dados das colunas `product_name` e `id` da tabela `products` de maneira que os resultados estejam em ordem alfabética dos nomes', async () => {
    const challengeQuery = readFileSync('desafio6.sql', 'utf8').trim();
    const expectedResult = require('./challengesResults/challengeResult6');

    expect(await runQuery(sequelize, challengeQuery, { type: 'SELECT' })).toEqual(expectedResult);
  });

  it('7: Mostre apenas os ids dos 5 últimos registros da tabela `products` (a ordernação deve ser baseada na coluna `id`)', async () => {
    const challengeQuery = readFileSync('desafio7.sql', 'utf8').trim();
    const expectedResult = require('./challengesResults/challengeResult7');

    expect(await runQuery(sequelize, challengeQuery, { type: 'SELECT' })).toEqual(expectedResult);
  });

  it('8: Faça uma consulta que retorne três colunas contendo os nomes `A`, `Trybe` e `eh` com os valores `5 + 6`, `"de"` e `2 + 8`, respectivamente', async () => {
    const challengeQuery = readFileSync('desafio8.sql', 'utf8').trim();
    const expectedResult = require('./challengesResults/challengeResult8');

    expect(await runQuery(sequelize, challengeQuery, { type: 'SELECT' })).toEqual(expectedResult);
  });
});
