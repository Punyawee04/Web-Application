
ขั้นตอนการใช้งาน Web Application

1. Clone Repository
ดาวน์โหลดโค้ดจาก Git repository ลงในเครื่องของคุณ:
git clone <repository-url>
cd <repository-folder>

2. เข้าไปในโฟลเดอร์ Backend และ Frontend
โครงสร้างของโปรเจกต์จะแบ่งออกเป็น backend และ frontend ดังนั้นต้องติดตั้ง dependencies ในแต่ละส่วนแยกกัน:
cd backend และ cd frontend

3. ติดตั้ง Dependencies
รันคำสั่งนี้ในโฟลเดอร์ backend และ frontend เพื่อดาวน์โหลด dependencies ที่จำเป็น:

- สำหรับ Backend:
  npm install express nodemon mysql2 dotenv bcryptjs cors crypto-js jsonwebtoken multer

- สำหรับ Frontend:
  npm install express nodemon mysql2 dotenv axios

4. เชื่อมต่อกับฐานข้อมูล MySQL
- เปิด MySQL Workbench แล้วสร้างฐานข้อมูล
จากไฟล์ bloom_db ที่เตรียมให้
ซึ่งกำหนดการตั้งค่า .env ดังนี้
PORT=8080
DB_NAME=Bloom_db
DB_HOST=localhost
DB_PASS=ict555
DB_USER=bloom

5. รัน Backend และ Frontend Servers
รันเซิร์ฟเวอร์ทั้งสองส่วน:
- Backend:
  npm start
- Frontend:
  npm start

6. เข้าใช้งาน Web Application
เปิดเบราว์เซอร์และไปที่:
- Frontend: http://localhost:8081
- Backend: http://localhost:8080

โครงสร้างการใช้งาน

Homepage (Landing Page)
- เมื่อเข้าเว็บไซต์ คุณจะเข้าสู่หน้าแรก (Homepage) ที่แสดงสินค้าพร้อมข้อมูลโปรโมชั่นและแถบเมนู (Navigation Bar) ซึ่งประกอบด้วย:
  - Best Sellers: แสดงสินค้าขายดี
  - Categories: หมวดหมู่สินค้า
  - Search Icon: ค้นหาสินค้า
  - Login: เข้าสู่ระบบ

Contact Us Page
- เข้าถึงได้ที่ http://localhost:8081/team
- หน้านี้แสดงข้อมูลผู้จัดทำเว็บไซต์ เช่น:
  - รูปโปรไฟล์
  - ชื่อ
  - ข้อมูลโซเชียลมีเดีย

Search Page
- ในหน้าค้นหา คุณสามารถค้นหาสินค้าได้ 3 วิธี:
  1. พิมพ์ชื่อสินค้าในช่องค้นหา
  2. ใช้ปุ่ม Product Search: All
  3. ใช้ตัวกรอง (Filter) เช่น Brand, Category, และ Price
- ผลลัพธ์จะแสดงรายการสินค้า พร้อมปุ่ม Buy Now เพื่อไปยังหน้ารายละเอียดสินค้า (Product Detail Page).

Product Detail Page
- หน้านี้แสดงรายละเอียดของสินค้า เช่น:
  - รูปภาพสินค้า
  - ชื่อ
  - จำนวนสินค้า
  - รายละเอียดสินค้า (Description)
  - ที่มาของสินค้า (Origin)

Login Page
- กรอกข้อมูลการเข้าสู่ระบบ:
  - Username: admin1
  - Password: 1111
- ข้อมูลสำรอง:
  - Username: admin2
  - Password: 2222
- หลังจากเข้าสู่ระบบสำเร็จ ระบบจะพาไปที่หน้า Account Page.

Account Page
- หน้านี้แสดงข้อมูลบัญชีผู้ใช้งาน:
  - ช่อง Account Owner แสดงบัญชีที่ใช้งานอยู่
  - กรอบ Staff Account แสดงข้อมูลบัญชีอื่น ๆ
- ฟังก์ชัน:
  1. Add Staff: เพิ่มบัญชีใหม่พร้อมข้อมูล เช่น ชื่อ, Email, Password, Status.
     - เมื่อเพิ่มเสร็จแล้วให้กด Refresh หน้าจอ
  2. Search: ค้นหาบัญชีผู้ใช้งาน
  3. Edit/Delete: แก้ไขหรือลบข้อมูลบัญชีในระบบ

Product Management Page
- หน้านี้แสดงรายการสินค้า (Products List) พร้อมฟังก์ชัน:
  - Add Product: เพิ่มสินค้าใหม่
  - Edit/Delete: แก้ไขหรือลบสินค้า
  - Search: ค้นหาสินค้า
  - Show All Products: แสดงสินค้าทั้งหมด

