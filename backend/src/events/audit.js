const { EventEmitter } = require('events');
const audit = new EventEmitter();
audit.on('exam:submitted', ({ studentId, examId, score }) => console.log('[AUDIT] exam submitted', { studentId, examId, score, at: new Date().toISOString() }));
module.exports = audit;
