import { useEffect } from "react";
import { ArrowLeft, ArrowRight, BookmarkCheck, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { units } from "../data/lessons.js";
import { LessonVisual } from "./Visuals.jsx";
import { ActivityCard } from "./Activity.jsx";

function LessonProgress({ lessonId, completed }) {
  const unit=units.find((item)=>lessonId>=item.range[0]&&lessonId<=item.range[1]);
  return <div className="lesson-progress-band" style={{"--unit-color":unit?.color}}>
    <span>{unit?.title}</span><i/><span>LECCIÓN {lessonId} DE 17</span><span className="lesson-progress-state">{completed?"ESTUDIADA":"EN CURSO"}</span>
  </div>;
}

export function LessonPage({ lesson, progress, onNavigate, onComplete, onActivity, onDifficult, onOpenGlossary }) {
  const complete=progress.completedLessons.includes(lesson.id);
  const unit=units.find((item)=>item.id===lesson.unit);

  useEffect(()=>{document.title=lesson.title+" · Educación Ciudadana";},[lesson.title]);

  return <article className={"lesson-page lesson-page-"+lesson.unit} style={{"--unit-color":unit.color}}>
    <div className="lesson-breadcrumb"><span>APRENDER</span><b>/</b><span>{unit.title.toUpperCase()}</span><b>/</b><strong>LECCIÓN {String(lesson.id).padStart(2,"0")}</strong></div>
    <section className="lesson-hero">
      <div className="lesson-hero-copy">
        <LessonProgress lessonId={lesson.id} completed={complete}/>
        <h1>{lesson.title}</h1>
        <p>{lesson.intro}</p>
        <div className="lesson-meta"><span><Clock3 size={16}/>{lesson.minutes} min de estudio</span><button onClick={onOpenGlossary}><Sparkles size={15}/>Abrir glosario</button></div>
      </div>
      <div className="lesson-hero-art"><LessonVisual lesson={lesson}/></div>
    </section>

    <section className="lesson-section essential-section">
      <div className="section-heading"><div><span className="section-kicker">NIVEL ESENCIAL</span><h2>Lo que debes poder explicar</h2></div><p>Lee, conecta ideas y prueba una respuesta sin mirar.</p></div>
      <div className="essential-grid">
        {lesson.essential.map((item,index)=><section className={"essential-block essential-block-"+index} key={item.heading}><div className="essential-number">{String(index+1).padStart(2,"0")}</div><div><h3>{item.heading}</h3><p>{item.text}</p></div></section>)}
      </div>
    </section>

    {lesson.example&&<section className="lesson-example">
      <div className="example-heading"><span>RESOLVEMOS JUNTOS</span><h2>{lesson.example.title}</h2></div>
      <div className="example-content">
        <div className="example-situation"><span>EL CASO</span><p>{lesson.example.situation}</p></div>
        <ol className="worked-steps">{lesson.example.steps.map((step,index)=><li key={step}><span>{String(index+1).padStart(2,"0")}</span><p>{step}</p></li>)}</ol>
        {lesson.example.outcome&&<div className="example-outcome"><b>Conclusión</b><p>{lesson.example.outcome}</p></div>}
      </div>
    </section>}

    {!!lesson.distinctions?.length&&<section className="lesson-section distinction-section">
      <div className="section-heading"><div><span className="section-kicker">NO LOS CONFUNDAS</span><h2>Distinciones que suben puntos</h2></div><p>En una alternativa compleja, la diferencia suele estar en el actor o en el momento.</p></div>
      <div className="distinction-list">{lesson.distinctions.map((item,index)=><div className="distinction-row" key={item.heading}><span>{String(index+1).padStart(2,"0")}</span><div><b>{item.heading}</b><p>{item.text}</p></div><i aria-hidden="true">↗</i></div>)}</div>
    </section>}

    <section className="lesson-section exam-cues-section">
      <div className="cue-block"><span className="section-kicker">CÓMO RECONOCERLO EN LA PRUEBA</span><h2>Busca las pistas</h2><ul>{lesson.clues.map((item)=><li key={item}>{item}</li>)}</ul></div>
      <div className="mistake-block"><span className="section-kicker">ERRORES FRECUENTES</span><h2>Evita estas trampas</h2><ul>{lesson.mistakes.map((item)=><li key={item}>{item}</li>)}</ul></div>
    </section>

    <details className="deep-dive">
      <summary><span><b>PROFUNDIZACIÓN</b><strong>Matices para preguntas difíciles</strong></span><span className="deep-hint">Opcional · amplía tu respuesta</span></summary>
      <div className="deep-content"><p>{lesson.deep}</p><div className="keyword-row"><span>CONCEPTOS CLAVE</span>{lesson.terms.map((term)=><button key={term} onClick={onOpenGlossary}>{term}</button>)}</div></div>
    </details>

    <section className="lesson-section activities-section">
      <div className="section-heading"><div><span className="section-kicker">RECUPERACIÓN ACTIVA</span><h2>Ahora inténtalo tú</h2></div><p>Responde primero. Después lee por qué tu razonamiento funciona o necesita ajuste.</p></div>
      <div className="activities-grid">{lesson.activities.map((activity,index)=>{
        const key=lesson.id+"-"+index;
        return <ActivityCard key={key} activity={activity} activityKey={key} onComplete={(correct)=>onActivity(key,correct)} onDifficult={(isDifficult)=>onDifficult?.(lesson.id,activity.title,isDifficult)}/>;
      })}</div>
    </section>

    <section className="synthesis-strip">
      <div className="synthesis-mark">{complete?<CheckCircle2 size={22}/>:<Sparkles size={22}/>}</div><div><span>SÍNTESIS</span><p>{lesson.summary}</p></div><button className={complete?"is-complete":""} onClick={()=>onComplete(lesson.id)}>{complete?<><BookmarkCheck size={17}/>Lección aprendida</>:<>Marcar como aprendida<CheckCircle2 size={17}/></>}</button>
    </section>

    <nav className="lesson-pager" aria-label="Navegación entre lecciones">
      <button onClick={()=>onNavigate(Math.max(1,lesson.id-1))} disabled={lesson.id===1}><ArrowLeft size={16}/>Lección anterior</button>
      <span>{String(lesson.id).padStart(2,"0")} <i>/</i> 17</span>
      <button className="pager-next" onClick={()=>onNavigate(Math.min(17,lesson.id+1))} disabled={lesson.id===17}>Siguiente lección<ArrowRight size={16}/></button>
    </nav>
  </article>;
}
