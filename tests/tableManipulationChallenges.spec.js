const { readFileSync } = require('fs');
const { Sequelize } = require('sequelize');
const {credentials, importer, runQuery} = require('./helper');

describe('Desafios de manipulação de tabelas', () => {
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
    
  afterAll(async () => sequelize.close());
    
  beforeEach(async () => runQuery(sequelize, 'USE northwind;', { type: 'RAW' }));
  
  afterEach(async () => {
    await runQuery(sequelize, `DROP DATABASE ${credentials.database};`, { type: 'RAW' });
    await importer(credentials.database);
  });

  describe('Queries de inserção', () => {
    const countOrderDetailsQuery = `SELECT COUNT(*) AS details_count FROM northwind.order_details
      WHERE order_id = 69
            AND product_id = 80
            AND quantity = 15.0000
            AND unit_price = 15.0000
            AND discount = 0
            AND status_id = 2
            AND date_allocated IS NULL
            AND purchase_order_id IS NULL
            AND inventory_id = 129`;

    const lastOrderDetailsIdsQuery = (limit = 1) =>
      `SELECT id FROM northwind.order_details ORDER BY id DESC LIMIT ${limit};`;
    
    it('20: Adicione ao `order_details` uma linha com os seguintes dados: `order_id`: 69, `product_id`: 80, `quantity`: 15.0000, `unit_price`: 15.0000, `discount`: 0, `status_id`: 2, `date_allocated`: NULL, `purchase_order_id`: NULL e `inventory_id`: 129', async () => {
      const challengeQuery = readFileSync('desafio20.sql', 'utf8').trim();
      const lastOrderDetailsId = (
        await runQuery(sequelize, lastOrderDetailsIdsQuery(), { type: 'SELECT' })
      )[0].id;

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 0 }]);

      await runQuery(sequelize, challengeQuery, { type: 'INSERT' });

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 1 }]);

      expect(await runQuery(sequelize, lastOrderDetailsIdsQuery(), { type: 'SELECT' }))
        .toEqual([{ id: lastOrderDetailsId + 1 }]);
    });
  
    it('21: Adicione, com um único `INSERT`, duas linhas ao `order_details` com os mesmos dados. Esses dados são novamente os mesmos do requisito 20', async () => {
      const challengeQuery = readFileSync('desafio21.sql', 'utf8').trim();
      const lastOrderDetailsId = (
        await runQuery(sequelize, lastOrderDetailsIdsQuery(), { type: 'SELECT' })
      )[0].id;

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 0 }]);

      await runQuery(sequelize, challengeQuery, { type: 'INSERT' });

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 2 }]);

      expect(await runQuery(sequelize, lastOrderDetailsIdsQuery(2), { type: 'SELECT' }))
        .toEqual([{ id: lastOrderDetailsId + 2 }, { id: lastOrderDetailsId + 1 }]);
    });
  });

  describe('Queries de atualização', () => {
    const countOrderDetailsByDiscountQuery = (discount) =>
      `SELECT COUNT(*) AS details_count FROM order_details WHERE discount = ${discount};`;
    
    it('22: Atualize os dados de `discount` do `order_details` para 15', async () => {
      const challengeQuery = readFileSync('desafio22.sql', 'utf8').trim();

      expect(await runQuery(sequelize, countOrderDetailsByDiscountQuery(15), { type: 'SELECT' }))
        .toEqual([{ details_count: 0 }]);

      await runQuery(sequelize, challengeQuery, { type: 'UPDATE' });

      expect(await runQuery(sequelize, countOrderDetailsByDiscountQuery(15), { type: 'SELECT' }))
        .toEqual([{ details_count: 58 }]);
    });
  
    it('23: Atualize os dados de `discount` da tabela `order_details` para 30 cuja `unit_price` seja menor que 10.0000', async () => {
      const challengeQuery = readFileSync('desafio23.sql', 'utf8').trim();

      expect(await runQuery(sequelize, countOrderDetailsByDiscountQuery(30), { type: 'SELECT' }))
        .toEqual([{ details_count: 0 }]);

      await runQuery(sequelize, challengeQuery, { type: 'UPDATE' });

      expect(await runQuery(sequelize, countOrderDetailsByDiscountQuery(30), { type: 'SELECT' }))
        .toEqual([{ details_count: 17 }]);
    });
  
    it('24: Atualize os dados de `discount` da tabela `order_details` para 45 cuja `unit_price` seja maior que 10.0000 e o id seja um número entre 30 a 40', async () => {
      const challengeQuery = readFileSync('desafio24.sql', 'utf8').trim();

      expect(await runQuery(sequelize, countOrderDetailsByDiscountQuery(45), { type: 'SELECT' }))
        .toEqual([{ details_count: 0 }]);

      await runQuery(sequelize, challengeQuery, { type: 'UPDATE' });

      expect(await runQuery(sequelize, countOrderDetailsByDiscountQuery(45), { type: 'SELECT' }))
        .toEqual([{ details_count: 7 }]);
    });
  });

  describe('Queries de deleção', () => {
    const countOrderDetailsQuery = 'SELECT COUNT(*) AS details_count FROM order_details;';

    it('25: Delete todos os dados em que a `unit_price` da tabela `order_details` seja menor que 10.0000', async () => {
      const challengeQuery = readFileSync('desafio25.sql', 'utf8').trim();

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 58 }]);

      await runQuery(sequelize, challengeQuery, { type: 'DELETE' });

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 41 }]);
    });
  
    it('26: Delete todos os dados em que a `unit_price` da tabela `order_details` seja maior que 10.0000', async () => {
      const challengeQuery = readFileSync('desafio26.sql', 'utf8').trim();

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 58 }]);

      await runQuery(sequelize, challengeQuery, { type: 'DELETE' });

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 20 }]);
    });
  
    it('27: Delete todos os dados da tabela `order_details`', async () => {
      const challengeQuery = readFileSync('desafio27.sql', 'utf8').trim();

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 58 }]);

      await runQuery(sequelize, challengeQuery, { type: 'DELETE' });

      expect(await runQuery(sequelize, countOrderDetailsQuery, { type: 'SELECT' }))
        .toEqual([{ details_count: 0 }]);
    });
  });
});
