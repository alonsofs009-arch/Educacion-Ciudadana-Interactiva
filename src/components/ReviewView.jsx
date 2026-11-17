import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, CircleAlert, RotateCcw, Sparkles } from "lucide-react";
import { lessons, units } from "../data/lessons.js";

export function ReviewView({progress,onLesson,onDifficult}) {
  const cards=useMemo(()=>lessons.flatMap((lesson)=>lesson.activities.filter((activity)=>activity.type==="flash").map((activity,index)=>({lesson,activity,id:lesson.id+"-f"+index}))),[]);
  const [filter,setFilter]=useState("all");
  const filtered=filter==="difficult"?cards.filter(({lesson,activity})=>progress.difficult.some((item)=>item.lessonId===lesson.id&&item.label===activity.title)):cards;
  const [index,setIndex]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [rated,setRated]=useState(false);
  const card=filtered[Math.min(index,Math.max(0,filtered.length-1))];
  const next=(amount)=>{setIndex((i)=>(i+amount+filtered.length)%filtered.length);setRevealed(false);setRated(false);};
  const wrong=Object.entries(progress.activities).filter(([,result])=>result?.correct===false).slice(-8).reverse();
  return <div className="review-view">
    <header className="mode-header review-mode-header"><div><span>REPASO ESPACIADO</span><h1>Recupera antes de mirar</h1><p>Practica conceptos breves y vuelve primero a lo que te costó la última vez.</p></div><div className="review-count"><Sparkles size={19}/><b>{filtered.length}</b><small>tarjetas</small></div></header>
    <div className="review-layout">
      <section className="review-stage">
        <div className="review-filter"><button className={filter==="all"?"active":""} onClick={()=>{setFilter("all");setIndex(0);setRevealed(false);}}>Todas <span>{cards.length}</span></button><button className={filter==="difficult"?"active":""} onClick={()=>{setFilter("difficult");setIndex(0);setRevealed(false);}}>Difíciles <span>{progress.difficult.length}</span></button></div>
        {card?<div className="review-flash" style={{"--unit-color":units.find((u)=>u.id===card.lesson.unit)?.color}}>
          <div className="review-card-top"><span>{units.find((u)=>u.id===card.lesson.unit)?.title.toUpperCase()}</span><small>{index+1} / {filtered.length}</small></div>
          <button className={"review-card "+(revealed?"revealed":"")} onClick={()=>setRevealed(true)} aria-expanded={revealed}><span>{revealed?"RESPUESTA":"RECUPERA DE MEMORIA"}</span><b>{revealed?card.activity.back:card.activity.front}</b><small>{revealed?"Revisa y califica tu recuerdo":"Pulsa para revelar la explicación"}</small></button>
          {revealed&&!rated&&<div className="review-rating"><button onClick={()=>{setRated(true);onDifficult(card.lesson.id,card.activity.title,false);}}><Check size={16}/> Lo recordé</button><button onClick={()=>{setRated(true);onDifficult(card.lesson.id,card.activity.title,true);}}><Bookmark size={15}/> Necesito repetirla</button></div>}
          {rated&&<p className="review-feedback">{card.activity.back}</p>}
          <div className="review-controls"><button onClick={()=>next(-1)}><ArrowLeft size={17}/>Anterior</button><button onClick={()=>next(1)}>Siguiente<ArrowRight size={17}/></button></div>
          <button className="review-lesson-link" onClick={()=>onLesson(card.lesson.id)}>Abrir lección {String(card.lesson.id).padStart(2,"0")} <ArrowRight size={14}/></button>
        </div>:<div className="review-empty"><CircleAlert size={26}/><h2>Aún no hay tarjetas difíciles</h2><p>Marca una tarjeta para volver a verla aquí. Mientras tanto, practica el conjunto completo.</p><button onClick={()=>{setFilter("all");setIndex(0);}}>Ver todas las tarjetas</button></div>}
      </section>
      <aside className="review-mistakes">
        <div className="mistakes-heading"><span>RETROALIMENTACIÓN GUARDADA</span><h2>Donde tropezaste</h2><p>Los errores quedan guardados en este dispositivo para reforzarlos.</p></div>
        {wrong.length?wrong.map(([key])=>{const lessonId=Number(key.split("-")[0]);const lesson=lessons.find((l)=>l.id===lessonId);return lesson?<button className="mistake-link" key={key} onClick={()=>onLesson(lesson.id)}><CircleAlert size={16}/><span><b>{lesson.title}</b><small>Revisar actividad de la lección {lesson.id}</small></span><ArrowRight size={15}/></button>:null;}):<div className="mistakes-clear"><Check size={18}/><p>Aún no hay respuestas incorrectas guardadas. Al resolver actividades, tus errores aparecerán aquí.</p></div>}
        <div className="review-note"><RotateCcw size={16}/><span>Vuelve a intentar una idea al rato. Recordar sin mirar fortalece la memoria más que releerla.</span></div>
      </aside>
    </div>
  </div>;
}
