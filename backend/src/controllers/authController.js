const bcrypt = require('bcryptjs');
const User = require('../models/User');
const tokens = require('../utils/tokens');
exports.register = async (req, res, next) => { try {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) return res.status(400).json({ success:false, message:'Name, valid email and password (8+ characters) are required' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: 'student' });
  res.status(201).json({ success:true, user: { id:user._id, name:user.name, email:user.email, role:user.role }, accessToken:tokens.access(user), refreshToken:tokens.refresh(user) });
} catch(e){ next(e); } };
exports.login = async (req,res,next) => { try {
  const { email, password } = req.body; const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({success:false,message:'Invalid email or password'});
  res.json({success:true,user:{id:user._id,name:user.name,email:user.email,role:user.role},accessToken:tokens.access(user),refreshToken:tokens.refresh(user)});
} catch(e){next(e);} };
exports.me = (req,res) => res.json({success:true,user:{id:req.user._id,name:req.user.name,email:req.user.email,role:req.user.role}});
