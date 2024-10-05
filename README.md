# 🌸Project-Web-Phase2🌸
ตอนนี้ยังไม่ได้เชื่อมต่อ web server (node.js หรือ ทำ data base MySQL)
<br> **ลองดู Demo Landing page**
![image](https://github.com/user-attachments/assets/14a46f78-c60a-4ef6-9894-a3091bb5b02d)

## 💻 How to Use 
- ใช้โค้ด HTML CSS ที่แปะให้
- icon จาก (https://icons.getbootstrap.com/) **ใช้ตัวอื่นได้
- **อย่าลืม embed css file**

## Project Template (ที่ต้องใช้)
**HTML File**
1. **navigation bar**
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

3. **footer**
   ```html
   <!-- Footer -->
    <footer class="footer">
        <div class="footer__addr">
            <img src="src\bloom logo.png" alt="bloom logo">

            <h2>Location</h2>

            <address>
                Bangkok, Thailand<br>
            </address>
        </div>

        <ul class="footer__nav">
            <li class="nav__item">
                <h2 class="nav__title">BLOOM</h2>

                <ul class="nav__ul">
                    <li>
                        <a href="#">Brand Story</a>
                    </li>

                    <li>
                        <a href="#">Contact Us</a>
                    </li>

                    <li>
                        <a href="#">Track Order</a>
                    </li>
                    <li>
                        <a href="#">Return / Refund</a>
                    </li>
                </ul>
            </li>

            <li class="nav__item nav__item--extra">
                <h2 class="nav__title">CATEGORY</h2>

                <ul class="nav__ul nav__ul--extra">
                    <li>
                        <a href="#">Body</a>
                    </li>

                    <li>
                        <a href="#">Mask</a>
                    </li>

                    <li>
                        <a href="#">Face Care</a>
                    </li>

                    <li>
                        <a href="#">Sunscreen</a>
                    </li>

                    <li>
                        <a href="#">Cleanser</a>
                    </li>

                    <li>
                        <a href="#">Acne Prevention</a>
                    </li>
                </ul>
            </li>

            <li class="nav__item">
                <h2 class="nav__title">Stay In Touch. </h2>
                <div class="email-container">
                    <input type="email" id="email" name="email" placeholder="Enter your email">
                    <span class="next-icon">&#10095;</span> <!-- Next arrow icon -->
                </div>
                <p style="font-size: 14px;">Please refer to our Privacy Policy and Terms of Use for more details or Contact Us</p>

                <ul class="nav__ul">
                    <i class="bi bi-facebook"></i>
                    <i class="bi bi-instagram"></i>
                    <i class="bi bi-tiktok"></i>

                </ul>
            </li>
        </ul>

        <div class="legal">
            <p>&copy; Bloom Inc. 2024. All rights reserved.</p>

            <div class="legal__links">
                <span>Terms & Conditions </span>
                <span>Privacy Policy </span>
            </div>
        </div>
    </footer>
   
## CSS File
   - [nav-style.css](https://github.com/thitiP11222/Project-Web-Phase2/blob/main/nav-style.css)
   - [footer.css](https://github.com/thitiP11222/Project-Web-Phase2/blob/main/footer.css)
  
     **note ‼️**
      - stylesheet สำหรับ navigation bar, saved as `nav-style.css`. (อย่าเปลี่ยนแปลง หากแก้ไขต้องcommit fileใหม่และบอกเพื่อนด้วยงับ)
      - stylesheet สำหรับ Homepage saved as `style.css`.
      - stylesheet page อื่นๆตั้งชื่อให้สอดคล้องกับแต่ละ page หรือ เรียกใช้ selector ใน css ให้เหมาะสม (ใช้ class, id) กันเวลารวมโค้ด HTML จะเรียก selector จาก Css ผิดตัว




