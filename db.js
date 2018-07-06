require('dotenv').config();

const sqlite = require('sqlite');
const dbConnection = sqlite.open(process.env.DB_FILE, { Promise });

function selectTemperatures(dataPoints=60, sensorNumber=0) {
  console.log('getting temperatures');

  const limit = dataPoints === 0 ? '' : `limit ${dataPoints}`;
  
  return dbConnection.then(db => {
    return db.all(`
      SELECT * from 
          (
            select 
                (timestamp * 1000) as x, sensnum, temp as y
            from
                temps
            where
                sensnum = ${sensorNumber}
            order by x desc
            ${limit}
          )
      order by x asc;`
    );
    
  });  
}

/*
                and
                timestamp >= (strftime('%s', 'now') - 3600)
*/

// selectTemperatures()
  // .then((rows) => {    
    // console.log(rows);
    // console.log(`^^^ DATA!`);
    // console.log(rows.length);
  // })
  // .catch(err => console.log)

module.exports = {
  selectTemperatures
};
