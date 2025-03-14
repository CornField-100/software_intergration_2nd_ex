const app = require('./src/app');
const { PORT,NODE_ENV } = require('./config');

const server = app.listen(PORT, () => {
	console.log(`Application running on port: ${PORT} in ${NODE_ENV} mode`);
});

module.exports = server;