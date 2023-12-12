import fs from 'fs';
import pdfParse from 'pdf-parse-fork';
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
 
const files = await fs.readdirSync('client/PDF/');
 
for (let file of files) {
 
  let metadata = await pdfParse(fs.readFileSync('client/PDF/' + file));
 
  let result = await query(`
    INSERT INTO PDF (pdf_fileName, pdf_metadata)
    VALUES(?, ?)
  `, [file, metadata]);
 
 
  console.log(file, result);
 
}
 
 
process.exit();