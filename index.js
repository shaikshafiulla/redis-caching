const express = require('express');
const Redis = require('redis');
const app = express();
const PORT = 3000;

const products = {
    1: { id: 1, name: "Laptop", price: 999.99 },
    2: { id: 2, name: "Smartphone", price: 499.99 },
    3: { id: 3, name: "Headphones", price: 99.99 }
};

const redisClient = Redis.createClient({
    url: 'redis://localhost:6379'
});

(async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
})().catch(console.error);

redisClient.on('error', err => console.log('Redis Client Error', err));

app.use(express.json());

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const cachedProduct = await redisClient.get(`product:${productId}`);

        if (cachedProduct) {
            console.log('Cache hit');
            return res.json(JSON.parse(cachedProduct));
        }

        const product = products[productId];
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await redisClient.setEx(`product:${productId}`, 60 * 60, JSON.stringify(product));
        console.log('Cache miss - stored in Redis');

        res.json(product);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const cachedProducts = await redisClient.get('all_products');

        if (cachedProducts) {
            console.log('Cache hit - all products');
            return res.json(JSON.parse(cachedProducts));
        }

        await redisClient.setEx('all_products', 3600, JSON.stringify(products));
        console.log('Cache miss - stored all products');

        res.json(products);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/products', async (req, res) => {
    try {
        const { name, price } = req.body;
        const id = Object.keys(products).length + 1;

        const newProduct = { id, name, price };
        products[id] = newProduct;

        await redisClient.del('all_products');
        await redisClient.setEx(`product:${id}`, 3600, JSON.stringify(newProduct));

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/products/:id/cache', async (req, res) => {
    try {
        await redisClient.del(`product:${req.params.id}`);
        res.json({ message: 'Cache cleared' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    await redisClient.quit();
    process.exit();
});