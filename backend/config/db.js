// นำเข้าโมดูล mysql2 เพื่อใช้สำหรับการเชื่อมต่อกับฐานข้อมูล MySQL
const mysql = require('mysql2');
// นำเข้าโมดูล dotenv เพื่อช่วยจัดการตัวแปรสภาพแวดล้อม (Environment Variables)
const dotenv = require('dotenv');

// เรียกใช้ dotenv เพื่อโหลดค่าตัวแปรสภาพแวดล้อมจากไฟล์ .env
dotenv.config();

// สร้างการเชื่อมต่อฐานข้อมูลโดยใช้ค่าตัวแปรจากไฟล์ .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// เชื่อมต่อฐานข้อมูลและตรวจสอบว่าการเชื่อมต่อสำเร็จหรือไม่
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log(`Connected to DB: ${process.env.DB_NAME}`);
});
// ส่งออกโมดูล db เพื่อให้สามารถใช้ในไฟล์อื่น ๆ
module.exports = db;
