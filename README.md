# 🌸Project-Web-Phase2🌸
ตอนนี้ยังไม่ได้เชื่อมต่อ web server (node.js หรือ ทำ data base MySQL)
<br> **ลองดู Demo Landing page** กด `codespace for Bloom`
![image](https://github.com/user-attachments/assets/14a46f78-c60a-4ef6-9894-a3091bb5b02d)

## Project Structure
1. **HTML File**
   - navigation bar
   - footer (ถ้าเสร็จจาอัปให้น้า)
   
2. **CSS File**
   - stylesheet สำหรับ navigation bar, saved as `nav-style.css`. (อย่าเปลี่ยนแปลง หากแก้ไขต้องcommit fileใหม่และบอกเพื่อนด้วยงับ)
   - stylesheet สำหรับ Homepage saved as `style.css`.
   - stylesheet page อื่นๆตั้งชื่อให้สอดคล้องกับแต่ละ page หรือ เรียกใช้ selector ใน css ให้เหมาะสม (ใช้ class, id) กันเวลารวมโค้ด HTML จะเรียก selector จาก Css ผิดตัว

## 💻 How to Use
- icon จาก (https://icons.getbootstrap.com/) **ใช้ตัวอื่นได้
- ไฟล์ css download ได้ที่ (https://github.com/thitiP11222/Project-Web-Phase2/blob/main/nav-style.css)
- **อย่าลืม embed css file**
  ```html
<head>
    <link rel="stylesheet" href="nav-style.css">
</head>
```
## Nav Bar HTML Part 🧩


```html
   <!-- Nav -->
    <nav>
        <!-- Logo -->
        <div class="logo">
            <a href="#"><img src="src/bloom logo.png " alt="Logo"></a>
        </div>

        <!-- Menu -->
        <ul class="menu">
            <li><a href="#">Home Page</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Categories</a></li>
            <li><a href="#">Contact Us</a></li>
        </ul>


        <!-- action -->
        <div class="user-cart">
            <a href="#"><i class="bi bi-search"></i></a>
            <a href="#"><i class="bi bi-person" style="font-size: 25px;"></i></a>
            <a href="#"><i class="bi bi-cart3" style="font-size: 22px;"></i></a>
        </div>
    </nav>
```


