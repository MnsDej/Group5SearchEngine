import fs from 'fs'; 
import exifr from 'exifr';
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
 
const imageFolder = 'client/photos/';
const imageFiles = fs.readdirSync(imageFolder);
 
for (const imageFile of imageFiles) {
  if (imageFile.slice(-4) === '.JPG') {
    try {
      const imagePath = `${imageFolder}${imageFile}`;
 
      if (fs.existsSync(imagePath)) {
        console.log(`Processing file: ${imageFile}`);
        const metadata = await exifr.parse(imagePath);
 
        console.log('Metadata:', metadata);
 
        const result = await query(`
          INSERT INTO photos (Photo_filename, Photo_metadata)
          VALUES (?, ?)
        `, [imageFile, JSON.stringify(metadata)]);
 
        console.log('Query Result:', result);
        console.log(`File ${imageFile} processed successfully.`);
      } else {
        console.log(`File ${imageFile} does not exist.`);
      }
    } catch (error) {
      console.error(`Error processing file ${imageFile}: ${error.message}`);
    }
  }
}
 
await db.end();