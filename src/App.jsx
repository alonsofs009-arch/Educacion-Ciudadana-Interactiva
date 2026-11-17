import { useCallback, useEffect, useState } from "react";
import { Activity, ArrowUp, PanelLeftClose } from "lucide-react";
import { lessons } from "./data/lessons.js";
import { EvaluationView } from "./components/EvaluationView.jsx";
import { GlossaryDialog, SearchDialog, SourcesDialog, StudyPlanDialog } from "./components/Dialogs.jsx";
import { LessonPage } from "./components/LessonPage.jsx";
import { ReviewView } from "./components/ReviewView.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Topbar } from "./components/Topbar.jsx";

const STORAGE_KEY="educacion-ciudadana-progreso-v1";
const emptyProgress={schema:1,completedLessons:[],lastLesson:1,activities:{},difficult:[],exam:null};

function loadProgress() {
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
    if(!saved||saved.schema!==1)return emptyProgress;
    return {
      ...emptyProgress,
      ...saved,
      completedLessons:Array.isArray(saved.completedLessons)?saved.completedLessons:[],
      activities:saved.activities&&typeof saved.activities==="object"?saved.activities:{},
      difficult:Array.isArray(saved.difficult)?saved.difficult:[],
    };
  } catch { return emptyProgress; }
}

export default function App() {
  const [progress,setProgress]=useState(loadProgress);
  const [selectedLesson,setSelectedLesson]=useState(()=>loadProgress().lastLesson||1);
  const [view,setView]=useState(()=>{
    const saved=loadProgress();
    return saved.exam?.status==="running"||saved.exam?.status==="submitted"?"eval":"learn";
  });
  const [mobileSidebar,setMobileSidebar]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [glossaryOpen,setGlossaryOpen]=useState(false);
  const [sourcesOpen,setSourcesOpen]=useState(false);
  const [planOpen,setPlanOpen]=useState(false);

  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));}catch{}},[progress]);

  const navigateLesson=useCallback((id)=>{
    const safe=Math.min(lessons.length,Math.max(1,Number(id)||1));
    setSelectedLesson(safe);
    setView("learn");
    setProgress((previous)=>({...previous,lastLesson:safe}));
    window.scrollTo({top:0,behavior:"smooth"});
  },[]);
  const changeView=(next)=>{setView(next);setMobileSidebar(false);window.scrollTo({top:0,behavior:"smooth"});};
  const markComplete=(id)=>setProgress((previous)=>previous.completedLessons.includes(id)?previous:{...previous,completedLessons:[...previous.completedLessons,id]});
  const recordActivity=(key,correct)=>setProgress((previous)=>({...previous,activities:{...previous.activities,[key]:{correct,updatedAt:Date.now()}}}));
  const recordDifficult=(lessonId,label,isDifficult)=>setProgress((previous)=>{
    const exists=previous.difficult.some((item)=>item.lessonId===lessonId&&item.label===label);
    if(isDifficult&&!exists)return {...previous,difficult:[...previous.difficult,{lessonId,label}]};
    if(!isDifficult&&exists)return {...previous,difficult:previous.difficult.filter((item)=>!(item.lessonId===lessonId&&item.label===label))};
    return previous;
  });
  const startAssessment=(mode)=>{setProgress((previous)=>({...previous,exam:{mode,status:"running",currentIndex:0,answers:{},rationaleScores:{},developmentScores:{},startedAt:Date.now()}}));setView("eval");window.scrollTo({top:0,behavior:"smooth"});};
  const updateAssessment=(exam)=>setProgress((previous)=>({...previous,exam}));
  const submitAssessment=()=>setProgress((previous)=>previous.exam?{...previous,exam:{...previous.exam,status:"submitted",submittedAt:Date.now()}}:previous);
  const restartAssessment=()=>setProgress((previous)=>({...previous,exam:null}));

  useEffect(()=>{
    const handleKey=(event)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();setSearchOpen(true);}};
    window.addEventListener("keydown",handleKey);
    return()=>window.removeEventListener("keydown",handleKey);
  },[]);

  useEffect(()=>{
    const handleUnit=(event)=>{
      const lesson=lessons.find((item)=>item.unit===event.detail?.unit);
      if(lesson)navigateLesson(lesson.id);
    };
    window.addEventListener("ec-open-lesson",handleUnit);
    return()=>window.removeEventListener("ec-open-lesson",handleUnit);
  },[navigateLesson]);

  return <div className="app-shell">
    <Sidebar view={view} selectedLesson={selectedLesson} progress={progress} onView={changeView} onLesson={navigateLesson} onSearch={()=>setSearchOpen(true)} onGlossary={()=>setGlossaryOpen(true)} isOpen={mobileSidebar} onClose={()=>setMobileSidebar(false)}/>
    <div className="app-main">
      <Topbar view={view} selectedLesson={selectedLesson} progress={progress} onSearch={()=>setSearchOpen(true)} onGlossary={()=>setGlossaryOpen(true)} onPlan={()=>setPlanOpen(true)} onSources={()=>setSourcesOpen(true)} onMenu={()=>setMobileSidebar(true)}/>
      <main className="page-scroll" key={view+"-"+(view==="learn"?selectedLesson:"")} id="main-content">
        {view==="learn"&&<LessonPage lesson={lessons.find((lesson)=>lesson.id===selectedLesson)||lessons[0]} progress={progress} onNavigate={navigateLesson} onComplete={markComplete} onActivity={recordActivity} onDifficult={recordDifficult} onOpenGlossary={()=>setGlossaryOpen(true)}/>}
        {view==="review"&&<ReviewView progress={progress} onLesson={navigateLesson} onDifficult={recordDifficult}/>}
        {view==="eval"&&<EvaluationView assessment={progress.exam} onStart={startAssessment} onUpdate={updateAssessment} onSubmit={submitAssessment} onRestart={restartAssessment}/>}
      </main>
      <footer className="app-footer"><span><i/> SIN CONEXIÓN · PROGRESO GUARDADO EN ESTE DISPOSITIVO</span><button onClick={()=>setSourcesOpen(true)}>Fuentes y créditos <Activity size={14}/></button><button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="Volver arriba"><ArrowUp size={15}/></button></footer>
    </div>
    {searchOpen&&<SearchDialog onClose={()=>setSearchOpen(false)} onLesson={navigateLesson} onGlossary={()=>setGlossaryOpen(true)}/>}
    {glossaryOpen&&<GlossaryDialog onClose={()=>setGlossaryOpen(false)}/>}
    {sourcesOpen&&<SourcesDialog onClose={()=>setSourcesOpen(false)}/>}
    {planOpen&&<StudyPlanDialog onClose={()=>setPlanOpen(false)}/>}
    {mobileSidebar&&<button className="mobile-scrim" onClick={()=>setMobileSidebar(false)} aria-label="Cerrar navegación"/>}
  </div>;
}
