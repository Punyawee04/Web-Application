create database Bloom_db;
use Bloom_db;

-- Create a new user 'new_user' with a password
CREATE USER 'bloom'@'localhost' IDENTIFIED BY 'ict555';
GRANT SELECT, INSERT ON Bloom_db.* TO 'bloom'@'localhost';

ALTER TABLE Product ADD image_url VARCHAR(255);

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product1.jpg' 
WHERE product_id = 'PD1';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product5.jpg' 
WHERE product_id = 'PD5';
UPDATE Product 
SET image_url = 'http://localhost:8080/images/product9.jpg' 
WHERE product_id = 'PD9';

UPDATE Product 
SET image_url = 'http://localhost:8080/images/product7.jpg' 
WHERE product_id = 'PD7';

-- Table: LoginDetail
CREATE TABLE LoginDetail (
    login_id INT PRIMARY KEY,  -- LoginDetailID
    UserName VARCHAR(100),     -- Username
    Password VARCHAR(70),      -- Password
    Email VARCHAR(225),        -- Email
    login_Time TIME,           -- LoginTime (Format: HH:MM)
    logout_Time TIME,          -- LogoutTime (Format: HH:MM)
    login_Date DATE,           -- LoginDate (Format: YYYY-MM-DD)
    Status VARCHAR(20)         -- Login Status
);

-- Table: Administor
CREATE TABLE Administor (
    admin_id INT PRIMARY KEY,  -- Admin ID
    admin_name VARCHAR(100),   -- Admin Name
    login_Date DATE,           -- Login Date (Format: YYYY-MM-DD)
    login_Time TIME,           -- Login Time (Format: HH:MM)
    login_id INT,              -- Foreign Key to LoginDetail
    FOREIGN KEY (login_id) REFERENCES LoginDetail(login_id)
);

-- Table: Administor_phonenum
CREATE TABLE Administor_phonenum (
    admin_id INT PRIMARY KEY,               -- Admin ID
    admin_phone_number VARCHAR(15)          -- Admin phone number (Format: XXX-XXX-XXXX)
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
    description VARCHAR(255),              -- Product Description
    origin varchar(15),
    benefit varchar(30),
    skin_type varchar(15),
    quantity int,
    ingredients varchar(40),
    brand varchar(20),
    product_name VARCHAR(100)              -- Product Name
);

-- Table: Category
CREATE TABLE Category (
    category_id INT PRIMARY KEY,            -- Category ID
    category_name VARCHAR(100),             -- Category Name
    description VARCHAR(255)                -- Category Description
);

-- Table: AdministratorProducts
CREATE TABLE AdministratorProducts (
    admin_id INT,                           -- Admin ID
    product_id INT,                         -- Product ID
    PRIMARY KEY (admin_id, product_id),     -- Composite Primary Key
    FOREIGN KEY (admin_id) REFERENCES Administor(admin_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- Table: ProductCategory
CREATE TABLE ProductCategory (
    product_id varchar(5),                         -- Product ID
    category_id INT,                        -- Category ID
    PRIMARY KEY (product_id, category_id),  -- Composite Primary Key
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

-- ----------------------------------------------------------------------------------------------------------------
-- INSERT ------------------------------------------------------------------------------------------------------
-- ----------------------------------------------------------------------------------------------------------------

-- Insert data into LoginDetail table
INSERT INTO LoginDetail (login_id, UserName, Password, Email, login_Time, logout_Time, login_Date, Status)
VALUES 
(101, 'admin1', '1111', 'admin1@example.com', '08:00', '16:00', '2024-11-01', 'Active'),
(102, 'admin2', '2222', 'admin2@example.com', '09:00', '17:00', '2024-11-02', 'Inactive');

-- Insert data into Administor table
INSERT INTO Administor (admin_id, admin_name, login_Date, login_Time, login_id)
VALUES 
(1001, 'Alice Johnson', '2024-11-01', '08:00', 101),
(1002, 'Bob Smith', '2024-11-02', '09:00', 102);
drop table LoginDetail;
-- Insert data into Administor_phonenum table
INSERT INTO Administor_phonenum (admin_id, admin_phone_number)
VALUES 
(1001, '123-456-7890'),
(1002, '987-654-3210');
SELECT UserName, Password FROM LoginDetail;

-- Insert data into Email table
INSERT INTO Email (admin_id, admin_email)
VALUES 
(1001, 'alice.johnson@example.com'),
(1002, 'bob.smith@example.com');

-- Insert categories into Category table
INSERT INTO Category (category_id, category_name, description)
VALUES 
(201, 'Body', 'Body care products'),
(202, 'Mask', 'Face masks and treatments'),
(203, 'Face Care', 'Facial care products'),
(204, 'Sunscreen', 'Sunscreen and sunblock products'),
(205, 'Cleanser', 'Cleansers for face and body'),
(206, 'Acne Prevention', 'Products for acne prevention and treatment');
drop table product; 
-- Insert data into Product table with well-known brand products
INSERT INTO Product (product_id, product_rating, stock_quantity, price, description, origin, benefit, skin_type, quantity, ingredients, brand, product_name)
VALUES 
('PD1', 4.8, 100, 500, 'Hydrating Facial Cleanser', 'USA', 'Hydration', 'All', 1, 'Hyaluronic Acid, Glycerin', 'CeraVe', 'CeraVe Hydrating Cleanser'),
('PD2', 4.6, 150, 279, 'Gentle Facial Cleanser', 'Canada', 'Cleansing', 'Sensitive', 1, 'Glycerin, Water', 'Cetaphil', 'Cetaphil Gentle Cleanser'),
('PD3', 4.7, 200, 549, 'Vitamin C Brightening Serum', 'USA', 'Brightening', 'All', 1, 'Vitamin C, Hyaluronic Acid', 'Obagi', 'Obagi Professional-C Serum'),
('PD4', 4.5, 180, 620, 'Oil-Free Gel Moisturizer', 'South Korea', 'Hydration', 'Oily', 1, 'Water, Glycerin', 'COSRX', 'COSRX Oil-Free Ultra Moisturizing Lotion'),
('PD5', 4.9, 120, 879, 'Anti-Aging Retinol Night Cream', 'USA', 'Anti-Aging', 'All', 1, 'Retinol, Peptides', 'Olay', 'Olay Regenerist Retinol 24 Night Moisturizer'),
('PD6', 4.3, 130, 300, 'Daily Sunscreen SPF 50', 'France', 'Sun Protection', 'All', 1, 'Zinc Oxide, Vitamin E', 'La Roche-Posay', 'La Roche-Posay Anthelios Melt-in Milk SPF 50'),
('PD7', 4.6, 90, 935, 'Green Tea Seed Serum', 'South Korea', 'Soothing', 'All', 1, 'Green Tea, Betaine', 'Innisfree', 'Innisfree Green Tea Seed Serum'),
('PD8', 4.4, 110, 398, 'Micellar Cleansing Water', 'France', 'Cleansing', 'All', 1, 'Micelles, Glycerin', 'Garnier', 'Garnier SkinActive Micellar Cleansing Water'),
('PD9', 4.8, 75, 9800, 'Advanced Night Repair Serum', 'USA', 'Repairing', 'All', 1, 'Hyaluronic Acid, Peptides', 'Estée Lauder', 'Estée Lauder Advanced Night Repair'),
('PD10', 4.5, 140, 280, 'Smoothing Body Lotion', 'USA', 'Exfoliating', 'All', 1, 'Lactic Acid, Glycerin', 'AmLactin', 'AmLactin Daily Moisturizing Body Lotion');


-- Insert data into ProductCategory table for category associations
INSERT INTO ProductCategory (product_id, category_id)
VALUES 
('PD1', 205),  -- CeraVe Hydrating Cleanser - Cleanser
('PD2', 205),  -- Cetaphil Gentle Cleanser - Cleanser
('PD3', 203),  -- Obagi Vitamin C Serum - Face Care
('PD4', 203),  -- COSRX Oil-Free Ultra Moisturizing Lotion - Face Care
('PD5', 203),  -- Olay Regenerist Retinol Night Moisturizer - Face Care
('PD6', 204),  -- La Roche-Posay Anthelios SPF 50 - Sunscreen
('PD7', 203),  -- Innisfree Green Tea Seed Serum - Face Care
('PD8', 205),  -- Garnier Micellar Cleansing Water - Cleanser
('PD9', 203),  -- Estée Lauder Advanced Night Repair - Face Care
('PD10', 201); -- AmLactin Daily Moisturizing Body Lotion - Body

