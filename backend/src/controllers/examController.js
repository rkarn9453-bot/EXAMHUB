const Exam = require('../models/Exam');
const Attempt = require('../models/Attempt');
const audit = require('../events/audit');
const safeExam = exam => ({ id: exam._id, title: exam.title, description: exam.description, subject: exam.subject, durationMinutes: exam.durationMinutes, startsAt: exam.startsAt, endsAt: exam.endsAt, questions: exam.questions.map(q => ({ id:q._id, prompt:q.prompt, options:q.options, marks:q.marks, negativeMarks:q.negativeMarks })) });
exports.list = async (req,res,next) => { try { const docs = await Exam.find(req.user.role === 'student' ? {published:true} : {}).sort({createdAt:-1}); res.json({success:true, exams:docs.map(safeExam)}); } catch(e){next(e);} };
exports.create = async (req,res,next) => { try { const exam = await Exam.create({...req.body, createdBy:req.user._id}); res.status(201).json({success:true,exam:safeExam(exam)}); } catch(e){next(e);} };
exports.get = async (req,res,next) => { try { const exam=await Exam.findById(req.params.id); if(!exam) return res.status(404).json({success:false,message:'Exam not found'}); if(req.user.role==='student' && !exam.published) return res.sendStatus(404); res.json({success:true,exam:safeExam(exam)}); } catch(e){next(e);} };
exports.update = async (req,res,next) => { try { const exam=await Exam.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}); if(!exam)return res.sendStatus(404); res.json({success:true,exam:safeExam(exam)}); } catch(e){next(e);} };
exports.remove = async (req,res,next) => { try { const exam=await Exam.findByIdAndDelete(req.params.id); if(!exam)return res.sendStatus(404); res.json({success:true,message:'Exam deleted'}); } catch(e){next(e);} };
exports.start = async (req,res,next) => { try {
 const exam=await Exam.findOne({_id:req.params.id,published:true}); if(!exam)return res.status(404).json({success:false,message:'Exam unavailable'});
 const now=new Date(); if(exam.startsAt && now<exam.startsAt || exam.endsAt && now>exam.endsAt) return res.status(400).json({success:false,message:'Exam is outside its availability window'});
 let attempt=await Attempt.findOne({exam:exam._id,student:req.user._id}); if(attempt && attempt.status==='submitted')return res.status(409).json({success:false,message:'Exam already submitted'});
 if(!attempt) attempt=await Attempt.create({exam:exam._id,student:req.user._id,totalMarks:exam.questions.reduce((s,q)=>s+q.marks,0)});
 res.json({success:true,attemptId:attempt._id,startedAt:attempt.startedAt,deadline:new Date(attempt.startedAt.getTime()+exam.durationMinutes*60000),exam:safeExam(exam)});
 } catch(e){next(e);} };
exports.submit = async (req,res,next) => { try {
 const exam=await Exam.findOne({_id:req.params.id,published:true}); if(!exam)return res.status(404).json({success:false,message:'Exam unavailable'});
 const attempt=await Attempt.findOne({exam:exam._id,student:req.user._id}); if(!attempt || attempt.status==='submitted')return res.status(409).json({success:false,message:'No active attempt'});
 const deadline=attempt.startedAt.getTime()+exam.durationMinutes*60000; if(Date.now()>deadline+30000)return res.status(400).json({success:false,message:'Submission window expired'});
 const answers=Array.isArray(req.body.answers)?req.body.answers:[]; let score=0;
 for(const q of exam.questions){ const a=answers.find(x=>String(x.questionId)===String(q._id)); if(!a || !Number.isInteger(a.selectedOption))continue; if(a.selectedOption===q.correctOption)score+=q.marks; else if(a.selectedOption>=0 && a.selectedOption<q.options.length)score-=q.negativeMarks; }
 attempt.answers=answers; attempt.score=Math.max(0,score); attempt.submittedAt=new Date(); attempt.status='submitted'; await attempt.save();
 audit.emit('exam:submitted',{studentId:req.user._id,examId:exam._id,score:attempt.score});
 req.app.get('io')?.to(`exam:${exam._id}`).emit('exam:submission-count',{examId:exam._id});
 res.json({success:true,result:{attemptId:attempt._id,score:attempt.score,totalMarks:attempt.totalMarks,submittedAt:attempt.submittedAt}});
 } catch(e){next(e);} };
exports.myResults=async(req,res,next)=>{try{const results=await Attempt.find({student:req.user._id,status:'submitted'}).populate('exam','title subject durationMinutes').sort({submittedAt:-1});res.json({success:true,results});}catch(e){next(e);}};
exports.analytics=async(req,res,next)=>{try{const summary=await Attempt.aggregate([{$match:{status:'submitted'}},{$group:{_id:'$exam',attempts:{$sum:1},averageScore:{$avg:'$score'},highestScore:{$max:'$score'}}},{$sort:{attempts:-1}}]);const totals=await Attempt.aggregate([{$match:{status:'submitted'}},{$group:{_id:null,totalAttempts:{$sum:1},averageScore:{$avg:'$score'}}}]);res.json({success:true,byExam:summary,overall:totals[0]||{totalAttempts:0,averageScore:0}});}catch(e){next(e);}};
