import { useState } from "react";
import { BookOpen, ChevronDown, CircleCheck, Circle, LibraryBig, Search, Sparkles, Target } from "lucide-react";
import { lessons, units } from "../data/lessons.js";

export function Sidebar({ view, selectedLesson, progress, onView, onLesson, onSearch, onGlossary, isOpen, onClose }) {
  const [collapsed,setCollapsed]=useState({});
  const total=lessons.length;
  const done=progress.completedLessons.length;
  return <aside className={"sidebar "+(isOpen?"sidebar-open":"")} aria-label="Navegación del curso">
    <div className="brand-lockup"><div className="brand-mark"><span>E</span><i/><i/></div><div><b>Educación<br/>Ciudadana</b><small>3.º MEDIO · CHILE</small></div><button className="sidebar-close" onClick={onClose} aria-label="Cerrar navegación">×</button></div>
    <div className="sidebar-main-nav">
      <button className={view==="learn"?"active":""} onClick={()=>{onView("learn");onClose?.();}}><BookOpen size={18}/><span>APRENDER</span></button>
      <button className={view==="review"?"active":""} onClick={()=>{onView("review");onClose?.();}}><Sparkles size={18}/><span>REPASAR</span><i className="nav-mini-dot"/></button>
      <button className={view==="eval"?"active":""} onClick={()=>{onView("eval");onClose?.();}}><Target size={18}/><span>EVALUARME</span></button>
    </div>
    <div className="side-section-heading"><span>RUTA SEMESTRAL</span><span>{done}/{total}</span></div>
    <div className="side-unit-list">
      {units.map((unit)=> {
        const unitLessons=lessons.filter((lesson)=>lesson.unit===unit.id);
        const finished=unitLessons.filter((lesson)=>progress.completedLessons.includes(lesson.id)).length;
        const isCollapsed=collapsed[unit.id]??false;
        return <section className={"side-unit side-unit-"+unit.id} style={{"--unit-color":unit.color}} key={unit.id}>
          <button className="side-unit-head" onClick={()=>setCollapsed({...collapsed,[unit.id]:!isCollapsed})} aria-expanded={!isCollapsed}>
            <span><b>{String(unit.range[0]).padStart(2,"0")} — {unit.title.toUpperCase()}</b><small>{finished} de {unitLessons.length} estudiadas · {unit.time} min</small></span><ChevronDown size={16} className={isCollapsed?"is-collapsed":""}/>
          </button>
          <div className="side-unit-progress"><i style={{width:(finished/unitLessons.length*100)+"%"}}/></div>
          {!isCollapsed&&<div className="side-lesson-list">{unitLessons.map((lesson)=> {
            const complete=progress.completedLessons.includes(lesson.id);
            return <button key={lesson.id} className={"side-lesson "+(selectedLesson===lesson.id&&view==="learn"?"active":"")} onClick={()=>{onLesson(lesson.id);onClose?.();}}>
              {complete?<CircleCheck size={14}/>:<Circle size={12}/>}<span>{lesson.id}. {lesson.title}</span>
            </button>;
          })}</div>}
        </section>;
      })}
    </div>
    <div className="sidebar-utilities">
      <button onClick={onSearch}><Search size={17}/><span>Buscar en el curso</span><kbd>⌘ K</kbd></button>
      <button onClick={onGlossary}><LibraryBig size={17}/><span>Glosario cívico</span></button>
      <div className="sidebar-progress"><div className="sidebar-progress-orbit"><span>{Math.round(done/total*100)}%</span></div><div><b>Tu progreso</b><small>{done===total?"Ruta completa":done+" de "+total+" lecciones"}</small></div></div>
    </div>
  </aside>;
}
