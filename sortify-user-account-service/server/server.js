const http = require('http');
const Hapi = require('@hapi/hapi');
const authRoutes = require('../routes/routes');
require("dotenv").config();

(async () => {
    const server = Hapi.server({
        port: process.env.APP_PORT || 8080, 
        host: process.env.APP_HOST || "localhost",
        routes: {
            cors: {
                origin: ["*"], // Mengizinkan semua origin (ubah sesuai kebutuhan)
            },
        },
    });
    server.route(authRoutes);
    await server.start();
    console.log(`Server is running at: ${server.info.uri}`);

})();
