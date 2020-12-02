const oracledb = require('oracledb')
    , fdk=require('@fnproject/fdk')
;

oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

let pool;

fdk.handle(async function(input){

  let result = [];

  if (!input.orderid) {
    return result;
  }

  if (!pool) {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING_JSON,
    });
  }

  const connection = await pool.getConnection();
  const sql = `select data from pizzaorder where id = :id`;
  const bindings = [input.orderid];
  const records = await connection.execute(sql, bindings);
  if (records.rows.length > 0) {
    result.push(JSON.parse(records.rows[0].DATA));
  }
  return result;
})
