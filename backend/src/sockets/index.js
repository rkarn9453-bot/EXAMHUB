const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
module.exports = function attachSocket(server) {
  const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN, methods: ['GET', 'POST'] } });
  io.use((socket, next) => {
    try { socket.user = jwt.verify(socket.handshake.auth?.token, process.env.JWT_ACCESS_SECRET); next(); }
    catch { next(new Error('Unauthorized')); }
  });
  io.on('connection', socket => {
    socket.on('exam:join', examId => { if (typeof examId === 'string' && /^[a-f\d]{24}$/i.test(examId)) socket.join(`exam:${examId}`); });
  });
  return io;
};
