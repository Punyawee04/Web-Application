create database Bloom_db;
use Bloom_db;

-- Create a new user 'new_user' with a password
CREATE USER 'bloom'@'localhost' IDENTIFIED BY 'ict555';
GRANT ALL PRIVILEGES ON Bloom_db.* TO 'bloom'@'localhost';

-- Table: LoginDetail
CREATE TABLE LoginDetail (
    login_id VARCHAR(255) NOT NULL UNIQUE,       -- Automatically incrementing ID
    UserName VARCHAR(255) NOT NULL UNIQUE,     -- Unique username
    Password VARCHAR(255) NOT NULL,            -- Hashed password
    Email VARCHAR(255),                        -- Optional email
    login_Time TIME,                           -- Login time (optional)
    logout_Time TIME,                          -- Logout time (optional)
    login_Date DATE,                           -- Login date (optional)
    Status VARCHAR(50),                        -- Account status (e.g., Active/Inactive)
    PRIMARY KEY (login_id)                     -- Primary key on login_id
) ENGINE=InnoDB;

<<<<<<< HEAD

-- Table: Administor
CREATE TABLE Administor (
=======
-- Table: Administrator_phonenum
CREATE TABLE Administrator_phonenum (
    admin_id INT PRIMARY KEY,               -- Admin ID
    admin_phone_number VARCHAR(15)          -- Admin phone number (Format: XXX-XXX-XXXX)
);

-- Table: Administrator
CREATE TABLE Administrator (
>>>>>>> 54b9df74c6945fbf481821cb672c3655cf52ae85
    admin_id INT PRIMARY KEY auto_increment,  -- Admin ID
    admin_name VARCHAR(100),   -- Admin Name
    login_Date DATE,           -- Login Date (Format: YYYY-MM-DD)
    login_Time TIME,           -- Login Time (Format: HH:MM)
    login_id VARCHAR(500) NOT NULL UNIQUE,              -- Foreign Key to LoginDetail
    image_url  VARCHAR(500),
    FOREIGN KEY (login_id) REFERENCES LoginDetail(login_id)
);

-- Table: Email
CREATE TABLE Email (
    admin_id INT PRIMARY KEY,               -- Admin ID
    admin_email VARCHAR(225)                -- Admin Email (Format: XXX@XXXX)
);

-- Table: Product
CREATE TABLE Product (
    product_id varchar(5) PRIMARY KEY,             -- Product ID
    product_rating DECIMAL(3,2) CHECK (product_rating BETWEEN 0.0 AND 5.0), -- Product Rating
    stock_quantity INT CHECK (stock_quantity BETWEEN 0 AND 1000),           -- Stock Quantity
    price DECIMAL(10,2) CHECK (price BETWEEN 0.00 AND 999999.99),           -- Product Price
    description VARCHAR(500),              -- Product Description
    origin varchar(15),
    benefit varchar(30),
    skin_type varchar(15),
    quantity int,
    ingredients varchar(40),
    brand varchar(20),
    product_name VARCHAR(100) ,             -- Product Name
    category_name  VARCHAR(100) ,
    image_url  VARCHAR(500)
);


-- ----------------------------------------------------------------------------------------------------------------
-- INSERT ------------------------------------------------------------------------------------------------------
-- ----------------------------------------------------------------------------------------------------------------


-- Insert data into LoginDetail table
INSERT INTO LoginDetail (UserName, Password, Email, login_Time, logout_Time, login_Date, Status)
VALUES 
('admin1', '1111', 'admin1@example.com', '08:00', '16:00', '2024-11-01', 'Active'),
('admin2', '2222', 'admin2@example.com', '09:00', '17:00', '2024-11-02', 'Inactive'),
('testUser', 'hashedPassword', 'test@example.com', '10:00', '18:00', '2024-11-17', 'Active');



-- Insert data into Administor table
INSERT INTO Administor (admin_id, admin_name, login_Date, login_Time, login_id)
VALUES 
(1001, 'Alice Johnson', '2024-11-01', '08:00', 1),
(1002, 'Bob Smith', '2024-11-02', '09:00', 2);

-- Insert data into Administor_phonenum table
INSERT INTO Administor_phonenum (admin_id, admin_phone_number)
VALUES 
(1001, '123-456-7890'),
(1002, '987-654-3210');


-- Insert data into Email table
INSERT INTO Email (admin_id, admin_email)
VALUES 
(1001, 'alice.johnson@example.com'),
(1002, 'bob.smith@example.com');

-- DO NOT insert FORM MySQL Insert from Web form
INSERT INTO Product (product_id, product_rating, stock_quantity, price, description, origin, benefit, skin_type, quantity, ingredients, brand, product_name, category_name)
VALUES 
('PD1', 4.8, 100, 500, 'Hydrating Facial Cleanser', 'USA', 'Hydration', 'All', 1, 'Hyaluronic Acid, Glycerin', 'CeraVe', 'CeraVe Hydrating Cleanser', 'Cleanser'),
('PD2', 4.6, 150, 279, 'Gentle Facial Cleanser', 'Canada', 'Cleansing', 'Sensitive', 1, 'Glycerin, Water', 'Cetaphil', 'Cetaphil Gentle Cleanser', 'Cleanser'),
('PD3', 4.7, 200, 549, 'Vitamin C Brightening Serum', 'USA', 'Brightening', 'All', 1, 'Vitamin C, Hyaluronic Acid', 'Obagi', 'Obagi Professional-C Serum', 'Serum'),
('PD4', 4.5, 180, 620, 'Oil-Free Gel Moisturizer', 'South Korea', 'Hydration', 'Oily', 1, 'Water, Glycerin', 'COSRX', 'COSRX Oil-Free Ultra Moisturizing Lotion', 'Moisturizer'),
('PD5', 4.9, 120, 879, 'Anti-Aging Retinol Night Cream', 'USA', 'Anti-Aging', 'All', 1, 'Retinol, Peptides', 'Olay', 'Olay Regenerist Retinol 24 Night Moisturizer', 'Moisturizer'),
('PD6', 4.3, 130, 300, 'Daily Sunscreen SPF 50', 'France', 'Sun Protection', 'All', 1, 'Zinc Oxide, Vitamin E', 'La Roche-Posay', 'La Roche-Posay Anthelios Melt-in Milk SPF 50', 'Sunscreen'),
('PD7', 4.6, 90, 935, 'Green Tea Seed Serum', 'South Korea', 'Soothing', 'All', 1, 'Green Tea, Betaine', 'Innisfree', 'Innisfree Green Tea Seed Serum', 'Serum'),
('PD8', 4.4, 110, 398, 'Micellar Cleansing Water', 'France', 'Cleansing', 'All', 1, 'Micelles, Glycerin', 'Garnier', 'Garnier SkinActive Micellar Cleansing Water', 'Cleanser'),
('PD9', 4.8, 75, 9800, 'Advanced Night Repair Serum', 'USA', 'Repairing', 'All', 1, 'Hyaluronic Acid, Peptides', 'Estée Lauder', 'Estée Lauder Advanced Night Repair', 'Serum'),
('PD10', 4.5, 140, 280, 'Smoothing Body Lotion', 'USA', 'Exfoliating', 'All', 1, 'Lactic Acid, Glycerin', 'AmLactin', 'AmLactin Daily Moisturizing Body Lotion', 'Body');


UPDATE Product 
SET image_url = 'http://localhost:8080/images/product1.jpg' 
WHERE product_id = 'PD1';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product2.jpeg' 
WHERE product_id = 'PD2';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product3.png' 
WHERE product_id = 'PD3';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product4.jpg' 
WHERE product_id = 'PD4';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product5.jpg' 
WHERE product_id = 'PD5';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product6.jpg' 
WHERE product_id = 'PD6';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product7.jpg' 
WHERE product_id = 'PD7';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product8.jpg' 
WHERE product_id = 'PD8';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product9.jpg' 
WHERE product_id = 'PD9';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product10.jpg' 
WHERE product_id = 'PD10';


-- Insert data into LoginDetail table
INSERT INTO LoginDetail (UserName, Password, Email, login_Time, logout_Time, login_Date, Status)
VALUES 
('admin1', '1111', 'admin1@example.com', '08:00', '16:00', '2024-11-01', 'Active'),
('admin2', '2222', 'admin2@example.com', '09:00', '17:00', '2024-11-02', 'Inactive'),
('testUser', 'hashedPassword', 'test@example.com', '10:00', '18:00', '2024-11-17', 'Active');



-- Insert data into Administor table
INSERT INTO Administor (admin_id, admin_name, login_Date, login_Time, login_id)
VALUES 
(1001, 'Alice Johnson', '2024-11-01', '08:00', 1),
(1002, 'Bob Smith', '2024-11-02', '09:00', 2);

-- Insert data into Administor_phonenum table
INSERT INTO Administor_phonenum (admin_id, admin_phone_number)
VALUES 
(1001, '123-456-7890'),
(1002, '987-654-3210');


-- Insert data into Email table
INSERT INTO Email (admin_id, admin_email)
VALUES 
(1001, 'alice.johnson@example.com'),
(1002, 'bob.smith@example.com');


-- drop table product;
-- select * from product;
-- SHOW COLUMNS FROM Product;

select * from Administor;
select * from LoginDetail;

drop table LoginDetail;
drop table Administor;


SELECT (LoginDetail.email) AS email,(Administor.image_url) AS img_url,(LoginDetail.UserName) AS userName FROM LoginDetail INNER JOIN Administor WHERE login_id != ? AND LoginDetail.login_id = Administor.login_id;


