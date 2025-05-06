import { initializeSocket } from './socket.js';

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize Socket.IO
initializeSocket(server); 