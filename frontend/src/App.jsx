import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const blank = { title:'', description:'', subject:'', durationMinutes:20, published:false, questions:[{prompt:'',options:['','','',''],correctOption:0,marks:2,negativeMarks:0}] };
const input = {width:'100%',padding:12,border:'1px solid #e1e5ee',borderRadius:9,font:'inherit',marginTop:7};
const label = {display:'block',fontSize:13,fontWeight:600,margin:'14px 0'};

export default function App() {
  const [token,setToken]=useState(localStorage.getItem('token')||'');
  const [user,setUser]=useState(null),[exams,setExams]=useState([]);
  const [email,setEmail]=useState('admin@examhub.test'),[password,setPassword]=useState('');
  const [message,setMessage]=useState(''),[page,setPage]=useState('dashboard');
  const [form,setForm]=useState(blank),[editing,setEditing]=useState(null);
  const [active,setActive]=useState(null),[answers,setAnswers]=useState({}),[analytics,setAnalytics]=useState(null);
  const staff=user&&['admin','teacher'].includes(user.role);

  async function call(path,opts={}) {
    const res=await fetch(API+path,{...opts,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{ }),...opts.headers}});
    const data=await res.json(); if(!res.ok) throw Error(data.message||'Request failed'); return data;
  }
  async function load() {
    try { const me=await call('/auth/me');setUser(me.user);const d=await call('/exams');setExams(d.exams||[]); }
    catch(e){setMessage(e.message);localStorage.removeItem('token');setToken('');setUser(null);}
  }
  useEffect(()=>{if(token)load();},[token]);
  async function login(e){e.preventDefault();try{const d=await call('/auth/login',{method:'POST',body:JSON.stringify({email,password})});localStorage.setItem('token',d.accessToken);setUser(d.user);setToken(d.accessToken);setMessage('Login successful');}catch(e){setMessage(e.message);}}
  function logout(){localStorage.removeItem('token');setToken('');setUser(null);setActive(null);}
  function qUpdate(i,k,v){setForm(old=>{const qs=[...old.questions];qs[i]={...qs[i],[k]:v};return {...old,questions:qs};});}
  function optUpdate(i,j,v){setForm(old=>{const qs=[...old.questions],opts=[...qs[i].options];opts[j]=v;qs[i]={...qs[i],options:opts};return {...old,questions:qs};});}
  function addQuestion(){setForm(old=>({...old,questions:[...old.questions,{prompt:'',options:['','','',''],correctOption:0,marks:2,negativeMarks:0}]}));}
  async function saveExam(e){e.preventDefault();try{const payload={...form,durationMinutes:Number(form.durationMinutes),questions:form.questions.map(q=>({...q,correctOption:Number(q.correctOption),marks:Number(q.marks),negativeMarks:Number(q.negativeMarks)}))};await call(editing?`/exams/${editing}`:'/exams',{method:editing?'PATCH':'POST',body:JSON.stringify(payload)});setMessage(editing?'Exam updated':'Exam created');setForm(blank);setEditing(null);setPage('exams');await load();}catch(e){setMessage(e.message);}}
  function editExam(exam){setForm({...blank,...exam,published:exam.published??true,questions:(exam.questions||[]).map(q=>({...q,correctOption:q.correctOption??0,options:[...(q.options||['','','',''])]}))});setEditing(exam.id);setPage('create');}
  async function deleteExam(id){if(!confirm('Delete this exam?'))return;try{await call(`/exams/${id}`,{method:'DELETE'});setMessage('Exam deleted');await load();}catch(e){setMessage(e.message);}}
  async function showAnalytics(){try{setAnalytics(await call('/exams/analytics'));setPage('analytics');}catch(e){setMessage(e.message);}}
  async function startExam(exam){try{setActive(await call(`/exams/${exam.id}/start`,{method:'POST'}));setAnswers({});setPage('attempt');}catch(e){setMessage(e.message);}}
  async function submitExam(){try{const d=await call(`/exams/${active.exam.id}/submit`,{method:'POST',body:JSON.stringify({answers:Object.entries(answers).map(([questionId,selectedOption])=>({questionId,selectedOption:Number(selectedOption)}))})});setMessage(`Exam submitted. Score: ${d.result.score}/${d.result.totalMarks}`);setActive(null);setPage('exams');await load();}catch(e){setMessage(e.message);}}

  if(!user)return <main className="auth">
    <section className="brand"><div className="logo">E</div><p className="eyebrow">SMART EXAMINATION PLATFORM</p><h1>Exams made<br/><span>simpler.</span></h1><p className="muted">Create, manage and take online examinations in one place.</p><div className="stats"><div><strong>01</strong><small>One platform</small></div><div><strong>24/7</strong><small>Learn anywhere</small></div></div></section>
    <form className="login" onSubmit={login}><p className="eyebrow">WELCOME BACK</p><h2>Sign in</h2><p className="muted">Enter your account details to continue.</p><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="primary">Sign in to ExamHub</button>{message&&<p className="notice">{message}</p>}<p className="hint">Secure online examination portal</p></form>
  </main>;

  return <main className="dashboard">
    <header><div className="brandmark"><div className="logo small">E</div><span>ExamHub</span></div><div className="profile"><span>{user.name} · {user.role}</span><button className="ghost" onClick={logout}>Sign out</button></div></header>
    <nav style={{display:'flex',gap:9,flexWrap:'wrap',margin:'22px 0'}}><button className="ghost" onClick={()=>setPage('dashboard')}>Dashboard</button><button className="ghost" onClick={()=>setPage('exams')}>All Exams</button>{staff&&<><button className="ghost" onClick={()=>{setForm(blank);setEditing(null);setPage('create');}}>+ Create Exam</button><button className="ghost" onClick={showAnalytics}>Analytics</button></>}</nav>
    {message&&<p className="notice">{message}</p>}
    {(page==='dashboard'||page==='exams')&&<>
      <section className="welcome"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Welcome, {user.name}</h1><p className="muted">Manage your examinations from one place.</p></div><div className="welcomeicon">✦</div></section>
      <section className="metrics"><article><small>{user.role==='student'?'AVAILABLE EXAMS':'TOTAL EXAMS'}</small><h2>{exams.length}</h2><p>Examinations on the platform</p></article><article><small>ACCOUNT TYPE</small><h2>{user.role}</h2><p>Your access level</p></article><article><small>PLATFORM STATUS</small><h2>Active</h2><p>ExamHub is ready to use</p></article></section>
      <div className="sectionhead"><p className="eyebrow">EXAM LIBRARY</p><h2>{page==='dashboard'?'Recent examinations':'All examinations'}</h2></div>
      {!exams.length?<p className="muted">No exams found.</p>:<section className="examgrid">{exams.map(exam=><article className="examcard" key={exam.id}><span className="tag">{exam.subject||'GENERAL'}</span><h3>{exam.title}</h3><p className="muted">{exam.description||'No description provided.'}</p><div className="cardfoot"><span>{exam.durationMinutes} min · {exam.questions?.length||0} questions</span><span>{user.role==='student'&&<button onClick={()=>startExam(exam)}>Start exam →</button>}{staff&&<><button onClick={()=>editExam(exam)}>Edit</button>{user.role==='admin'&&<button onClick={()=>deleteExam(exam.id)}>Delete</button>}</>}</span></div></article>)}</section>}
    </>}
    {page==='create'&&staff&&<><div className="sectionhead"><p className="eyebrow">EXAM MANAGEMENT</p><h1>{editing?'Edit examination':'Create examination'}</h1></div><form onSubmit={saveExam} style={{background:'#fff',border:'1px solid #e8ebf2',borderRadius:13,padding:22}}>
      <label style={label}>Exam title<input style={input} required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
      <label style={label}>Description<textarea style={input} rows="3" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></label>
      <label style={label}>Subject<input style={input} value={form.subject||''} onChange={e=>setForm({...form,subject:e.target.value})}/></label>
      <label style={label}>Duration (minutes)<input style={input} type="number" min="1" value={form.durationMinutes} onChange={e=>setForm({...form,durationMinutes:e.target.value})}/></label>
      <label style={{...label,display:'flex',gap:9,alignItems:'center'}}><input type="checkbox" checked={!!form.published} onChange={e=>setForm({...form,published:e.target.checked})}/>Publish exam</label>
      <h2>Questions</h2>{form.questions.map((q,i)=><article className="question" key={i}><h3>Question {i+1}</h3><label style={label}>Question text<input style={input} required value={q.prompt} onChange={e=>qUpdate(i,'prompt',e.target.value)}/></label>{q.options.map((op,j)=><label style={label} key={j}>Option {j+1}<input style={input} required value={op} onChange={e=>optUpdate(i,j,e.target.value)}/></label>)}<label style={label}>Correct option<select style={input} value={q.correctOption} onChange={e=>qUpdate(i,'correctOption',e.target.value)}>{q.options.map((_,j)=><option key={j} value={j}>Option {j+1}</option>)}</select></label><label style={label}>Marks<input style={input} type="number" min="0" value={q.marks} onChange={e=>qUpdate(i,'marks',e.target.value)}/></label><label style={label}>Negative marks<input style={input} type="number" min="0" value={q.negativeMarks} onChange={e=>qUpdate(i,'negativeMarks',e.target.value)}/></label></article>)}
      <button type="button" className="ghost" onClick={addQuestion}>+ Add question</button> <button className="primary">{editing?'Update exam':'Save exam'}</button> <button type="button" className="ghost" onClick={()=>setPage('exams')}>Cancel</button>
    </form></>}
    {page==='analytics'&&analytics&&<><div className="sectionhead"><p className="eyebrow">PERFORMANCE</p><h1>Exam analytics</h1></div><section className="metrics"><article><small>TOTAL ATTEMPTS</small><h2>{analytics.overall?.totalAttempts??0}</h2></article><article><small>AVERAGE SCORE</small><h2>{Number(analytics.overall?.averageScore||0).toFixed(2)}</h2></article><article><small>EXAMS TRACKED</small><h2>{analytics.byExam?.length||0}</h2></article></section>{(analytics.byExam||[]).map(item=><article className="examcard" style={{marginTop:12}} key={item._id}><h3>Exam performance</h3><p>Attempts: {item.attempts}</p><p>Average: {Number(item.averageScore||0).toFixed(2)}</p><p>Highest: {item.highestScore}</p></article>)}</>}
    {page==='attempt'&&active&&<div className="examview"><div className="sectionhead"><p className="eyebrow">ONLINE EXAMINATION</p><h1>{active.exam.title}</h1><p className="muted">Duration: {active.exam.durationMinutes} minutes</p></div>{active.exam.questions.map((q,i)=><article className="question" key={q.id}><span className="tag">QUESTION {i+1}</span><p>{q.prompt}</p>{q.options.map((op,j)=><label className="option" key={j}><input type="radio" name={q.id} checked={String(answers[q.id])===String(j)} onChange={()=>setAnswers({...answers,[q.id]:j})}/>{op}</label>)}</article>)}<button className="primary submit" onClick={submitExam}>Submit examination</button></div>}
  </main>;
}
