require('dotenv').config();

const sqlite = require('sqlite');
const dbConnection = sqlite.open(process.env.DB_FILE, { Promise });

function selectTemperatures(dataPoints=60, sensorNumber=0) {
  console.log('getting temperatures');
  
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
                and
                timestamp >= (strftime('%s', 'now') - 3600)
            order by x desc
            limit ${dataPoints}
          )
      order by x asc;`
    );
    
  });  
}

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
