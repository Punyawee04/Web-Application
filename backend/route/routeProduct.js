// นำเข้าโมดูลที่จำเป็น
const express = require('express');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// การตั้งค่า multer สำหรับจัดการไฟล์ที่อัปโหลด
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); // กำหนดโฟลเดอร์สำหรับจัดเก็บไฟล์ที่อัปโหลด
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// ใช้งาน multer พร้อมการตั้งค่า storage
const upload = multer({ storage });

// Testing: products
// method: GET
// URL: http://localhost:8080/api/products
// body:
// GET: ดึงข้อมูลสินค้าทั้งหมด
router.get('/products/', (req, res) => {
    const sql = `SELECT * FROM Product`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        console.log('Products Fetched:', results); 
        res.json(results);
    });
});

// Testing1: products/:id
// method: GET
// URL: http://localhost:8080/api/products/PD1
// body:

// Testing2: products/:id
// method: GET
// URL: http://localhost:8080/api/products/PD9
// body:
// GET: ดึงข้อมูลสินค้าตาม ID
router.get('/products/:id', (req, res) => {
    const productId = req.params.id;

    const query = `SELECT * FROM Product WHERE product_id = ?`;

    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(results[0]);
    });
});

// Testing1: products/:id
// method: PUT
// URL: http://localhost:8080/api/products/PD8
// body: raw JSON
// {
//     "product_id": "PD8",
//     "product_rating": 4.4,
//     "stock_quantity": 200,
//     "price": 400,
//     "description": "Micellar Cleansing Water",
//     "origin": "France",
//     "benefit": "Cleansing",
//     "skin_type": "All",
//     "quantity": 1,
//     "ingredients": "Micelles, Glycerin",
//     "brand": "Garnier",
//     "product_name": "Garnier SkinActive Micellar Cleansing Water",
//     "category_name": "Cleanser" 
// }

// Testing2: products/:id
// method: PUT
// URL: http://localhost:8080/api/products/PD7
// body: raw JSON
// {
//     "product_id": "PD7",
//     "product_rating": 5.0,
//     "stock_quantity": 100,
//     "price": 1000,
//     "description": "Green Tea Seed Serum",
//     "origin": "South Korea",
//     "benefit": "Soothing",
//     "skin_type": "All",
//     "quantity": 1,
//     "ingredients": "Green Tea, Betaine",
//     "brand": "Innisfree",
//     "product_name": "Innisfree Green Tea Seed Serum",
//     "category_name": "Serum" 
// }
// PUT: อัปเดตข้อมูลสินค้า
router.put("/products/:id", upload.single("image"), (req, res) => {
    const productId = req.params.id;
    const {
        product_name,
        category_name,
        price,
        description,
        product_rating,
        stock_quantity,
        origin,
        benefit,
        skin_type,
        quantity,
        ingredients,
        brand,
    } = req.body;

    // ดึงข้อมูลสินค้าปัจจุบันเพื่อตรวจสอบการอัปเดต
    const selectQuery = `SELECT * FROM Product WHERE product_id = ?`;

    db.query(selectQuery, [productId], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch product.",
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        const existingProduct = results[0];
        const newImageUrl = req.file ? `http://localhost:8080/images/${req.file.filename}` : existingProduct.image_url;

        // ลบภาพเก่าหากมีการอัปโหลดภาพใหม่
        if (req.file && existingProduct.image_url) {
            const oldImagePath = path.join(__dirname, existingProduct.image_url);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error("Error deleting old image:", err);
                } else {
                    console.log("Old image deleted:", oldImagePath);
                }
            });
        }

        // อัปเดตสินค้าในฐานข้อมูล
        const updateQuery = `
            UPDATE Product
            SET 
                product_name = ?, 
                category_name = ?, 
                price = ?, 
                description = ?, 
                product_rating = ?, 
                stock_quantity = ?, 
                origin = ?, 
                benefit = ?, 
                skin_type = ?, 
                quantity = ?, 
                ingredients = ?, 
                brand = ?, 
                image_url = ?
            WHERE product_id = ?
        `;

        const values = [
            product_name || existingProduct.product_name,
            category_name || existingProduct.category_name,
            parseFloat(price) || existingProduct.price,
            description || existingProduct.description,
            parseFloat(product_rating) || existingProduct.product_rating,
            parseInt(stock_quantity) || existingProduct.stock_quantity,
            origin || existingProduct.origin,
            benefit || existingProduct.benefit,
            skin_type || existingProduct.skin_type,
            parseInt(quantity) || existingProduct.quantity,
            ingredients || existingProduct.ingredients,
            brand || existingProduct.brand,
            newImageUrl,
            productId,
        ];

        db.query(updateQuery, values, (err, result) => {
            if (err) {
                console.error("Error updating product:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update product.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Product updated successfully.",
            });
        });
    });
});

// Testing: delete-product/:PD1
// method: DELETE
// URL: http://localhost:8080/api/delete-product/PD1
// body:
// DELETE: ลบสินค้า
router.delete("/delete-product/:id", (req, res) => {
    const productId = req.params.id;
    const query = "DELETE FROM product WHERE product_id = ?";

    db.query(query, [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to delete product from database.",
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }


        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    });
});

// Testing1: add-product
// method: POST
// URL: http://localhost:8080/api/add-product
// body: raw JSON
// {
//     "product_id": "PD11",
//     "product_name": "Neutrogena Hydro Boost Water Gel",
//     "product_rating": 4.8,
//     "stock_quantity": 120,
//     "price": 599,
//     "description": "Hydrating gel for all skin types",
//     "origin": "USA",
//     "benefit": "Hydration",
//     "skin_type": "All",
//     "quantity": 1,
//     "ingredients": "Hyaluronic Acid, Water",
//     "brand": "Neutrogena",
//     "category_name": "Moisturizer"
// }

// Testing2: add-product
// method: POST
// URL: http://localhost:8080/api/add-product
// body: raw JSON
// {
//     "product_id": "PD12",
//     "product_name": "La Roche-Posay Retinol B3 Retinol Serum",
//     "product_rating": 5.0,
//     "stock_quantity": 200,
//     "price": 1600,
//     "description": "Hyaluronic acid to promote cell turnover",
//     "origin": "USA",
//     "benefit": "Retinol, niacinamide",
//     "skin_type": "All",
//     "quantity": 1,
//     "ingredients": "Hyaluronic Acid",
//     "brand": "La Roche-Posay",
//     "category_name": "Serum"
// }
// POST: เพิ่มสินค้าใหม่
router.post('/add-product', upload.single('image'), (req, res) => {
    const {
        product_id,
        product_name,
        category_name,
        price,
        description,
        product_rating,
        stock_quantity,
        origin,
        benefit,
        skin_type,
        quantity,
        ingredients,
        brand,
        image_url
    } = req.body;

    const imageUrl = req.file ? `http://localhost:8080/images/${req.file.filename}` : image_url || null;


    if (!product_id || !product_name || !price) {
        console.log('Validation failed: Missing required fields.');
        return res.status(400).json({
            success: false,
            message: 'Product ID, name, and price are required.',
        });
    }

    const query = `
        INSERT INTO Product (
            product_id, product_name, category_name, price, description, product_rating, stock_quantity, 
            origin, benefit, skin_type, quantity, ingredients, brand, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        product_id,
        product_name,
        category_name,
        price,
        description,
        product_rating || null,
        stock_quantity || null,
        origin || null,
        benefit || null,
        skin_type || null,
        quantity || null,
        ingredients || null,
        brand || null,
        imageUrl,
    ];

    db.query(query, values, (err) => {
        if (err) {
            console.error('Error saving product:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to add product. Please try again.',
            });
        }

        console.log('Product added successfully!');
        res.status(200).json({
            success: true,
            message: 'Product added successfully!',
        });
    });
});

// Testing1: product-detail/:id
// method: GET
// URL: http://localhost:8080/api/product-detail/PD5
// body:

// Testing2: product-detail/:id
// method: GET
// URL: http://localhost:8080/api/product-detail/PD6
// body:
// GET: ดึงรายละเอียดของสินค้าโดยระบุ product_id
router.get('/product-detail/:id', (req, res) => {
    const productId = req.params.id;
    const sql = `SELECT * FROM Product WHERE product_id = ?`;
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(results[0]);
    });
});

// Testing1: search
// method: POST
// URL: http://localhost:8080/api/search
// body: raw JSON
// {
//     "query": "Serum"
// }

// Testing2: search
// method: POST
// URL: http://localhost:8080/api/search
// body: raw JSON
// {
//     "query": "Sunscreen"
// }
// POST: ค้นหาสินค้าโดยใช้คำค้น (Query)
router.post('/search', (req, res) => {
    console.log('Request received at /api/search');

    const query = req.body.query;
    console.log('Query received:', query);

    if (!query) {
        console.log('Query is missing');
        return res.status(400).json({ error: 'Query is required' });
    }


    const sql = `
        SELECT * FROM Product 
        WHERE product_name LIKE ? 
           OR description LIKE ? 
           OR brand LIKE ? 
           OR benefit LIKE ?
    `;

    const searchValue = `%${query}%`;
    console.log('SQL Query:', sql, 'Search Value:', searchValue);

    db.query(sql, [searchValue, searchValue, searchValue, searchValue], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        console.log('Search Results:', results);
        res.setHeader('Content-Type', 'application/json');
        res.json(results);
    });
});

// Testing1: filter-search
// method: POST
// URL: http://localhost:8080/api/filter-search
// body: raw JSON
// {
//     "brand": "Innisfree",
//     "category": "Serum",
//     "priceMin": 500,
//     "priceMax": 1000
// }

// Testing2: filter-search
// method: POST
// URL: http://localhost:8080/api/filter-search
// body: raw JSON
// {
//     "brand": "AmLactin",
//     "category": "Body",
//     "priceMin": 200,
//     "priceMax": 1000
// }
// POST: ค้นหาสินค้าด้วยตัวกรอง
router.post('/filter-search', (req, res) => {
    const { brand, category, priceMin, priceMax } = req.body;

    let sql = `SELECT * FROM Product WHERE 1=1`;
    const params = [];

    if (brand) {
        sql += ` AND brand LIKE ?`;
        params.push(`%${brand}%`);
    }

    if (category) {
        sql += ` AND category_name = ?`;
        params.push(category);
    }

    if (priceMin) {
        sql += ` AND price >= ?`;
        params.push(priceMin);
    }

    if (priceMax) {
        sql += ` AND price <= ?`;
        params.push(priceMax);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.json(results);
    });
});


module.exports = router;