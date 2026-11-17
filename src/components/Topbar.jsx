import { Menu, Search, LibraryBig, Clock3, BookmarkCheck, Compass, ExternalLink } from "lucide-react";
import { lessons } from "../data/lessons.js";

export function Topbar({view,selectedLesson,progress,onSearch,onGlossary,onPlan,onSources,onMenu}) {
  const lesson=lessons.find((item)=>item.id===selectedLesson);
  const percent=Math.round(progress.completedLessons.length/lessons.length*100);
  const label=view==="learn"?(lesson?"UNIDAD "+(lesson.unit==="ddhh"?"I":lesson.unit==="justicia"?"II":"III")+" · "+lesson.title:"APRENDER"):view==="review"?"REPASAR · RECUPERACIÓN ACTIVA":view==="eval"?"EVALUARME · PRUEBA Y DIAGNÓSTICO":"EDUCACIÓN CIUDADANA";
  return <header className="topbar">
    <button className="mobile-menu" onClick={onMenu} aria-label="Abrir navegación"><Menu size={20}/></button>
    <div className="topbar-crumb"><span>INICIO</span><b>›</b><strong>{label}</strong></div>
    <button className="top-search" onClick={onSearch}><Search size={17}/><span>Buscar lección, concepto o caso…</span><kbd>Ctrl K</kbd></button>
    <button className="top-util top-plan" onClick={onPlan}><Clock3 size={16}/><span>Ruta 120 min</span></button>
    <button className="top-util top-glossary" onClick={onGlossary}><LibraryBig size={16}/><span>Glosario</span></button>
    <button className="top-progress" onClick={onPlan} aria-label={"Tu progreso "+percent+" por ciento"}><span><b>Mi progreso</b><strong>{percent}%</strong></span><i><em style={{width:percent+"%"}}/></i><BookmarkCheck size={17}/></button>
    <button className="top-sources" onClick={onSources} aria-label="Fuentes y créditos"><ExternalLink size={15}/></button>
  </header>;
}
