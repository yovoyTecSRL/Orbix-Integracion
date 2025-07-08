const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
	res.json({ message: 'Server is running successfully!' });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
