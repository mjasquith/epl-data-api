import app from './index';

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error', err);
    process.exit(1);
});

export default server;