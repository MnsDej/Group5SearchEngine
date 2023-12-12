import fs from 'fs';
import musicMetadata from 'music-metadata';
import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: '161.97.144.27',
    port: 8095,
    user: 'root',
    password: 'guessagain95',
    database: 'Group5SearchEngine'
  });

async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

const files = await fs.readdirSync('client/music/');

for (let file of files) {

  let metadata = await musicMetadata.parseFile('client/music/' + file);

  delete metadata.native;
  delete metadata.quality;
  delete metadata.common.disk;

  let result = await query(`
    INSERT INTO music (music_filename, music_metadata)
    VALUES(?, ?)
  `, [file, metadata]);

  console.log(file, result);

}

process.exit();