import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, ClipboardCheck, Clock3, RotateCcw, Target } from "lucide-react";
import { calculateGrade, examBlueprint, examQuestions, examTypes, scoreBreakdown } from "../data/exam.js";
import { units } from "../data/lessons.js";

function diagnosticQuestions() {
  return examBlueprint.flatMap(({unit})=>examQuestions.filter((q)=>q.unit===unit&&(q.type==="mc"||q.type==="case")).slice(0,4));
}
function answerLabel(question,value) {
  if(value===undefined||value===null)return "Sin respuesta";
  if(question.type==="vf")return value?"Verdadero":"Falso";
  if(question.type==="develop")return value||"Respuesta sin texto";
  return question.options[value]??"Sin respuesta";
}
function maxPoints(question) {
  return question.type==="develop"?4:question.type==="vf"?2:1;
}
function questionScore(question,answers,rationaleScores,developmentScores) {
  const value=answers[question.id];
  if(question.type==="develop")return developmentScores[question.id]?.reduce((total,point)=>total+Number(Boolean(point)),0)??0;
  if(question.type==="vf")return Number(value===question.answer)+Number(rationaleScores[question.id]??0);
  return Number(value===question.answer);
}

function AssessmentIntro({onStart}) {
  const groups=[
    {name:"Derechos Humanos",count:16,minutes:30,color:"#536dff"},
    {name:"Sistema Judicial",count:16,minutes:25,color:"#e8872b"},
    {name:"Territorio y Ciudadanía",count:8,minutes:10,color:"#168d79"},
  ];
  return <div className="assessment-intro">
    <header className="mode-header evaluation-mode-header"><div><span>ÚLTIMO TRAMO · APLICACIÓN Y DOMINIO</span><h1>Comprueba lo que aprendiste</h1><p>Responde sin pistas. Durante la prueba no verás soluciones; tus avances se guardan en este dispositivo.</p></div><div className="assessment-seal"><Target size={22}/><b>56</b><small>puntos</small></div></header>
    <div className="evaluation-choice">
      <section className="evaluation-primary"><div className="eval-label"><ClipboardCheck size={17}/>PRUEBA SEMESTRAL</div><h2>40 preguntas · dificultad alta</h2><p>Casos nuevos, alternativas plausibles, verdadero o falso con justificación y desarrollos breves con rúbrica.</p><div className="eval-facts"><span><Clock3 size={15}/>35 min sugeridos</span><span>32 puntos objetivos</span><span>56 puntos máximos</span></div><button onClick={()=>onStart("exam")}>Comenzar prueba <ArrowRight size={17}/></button></section>
      <section className="evaluation-diagnostic"><div className="eval-label"><Target size={17}/>DIAGNÓSTICO</div><h2>12 preguntas · 8 minutos</h2><p>Encuentra tus temas débiles antes de la evaluación completa.</p><div className="diagnostic-units">{groups.map((g)=><span key={g.name} style={{"--unit-color":g.color}}><i/>{g.name}</span>)}</div><button onClick={()=>onStart("diagnostic")}>Hacer diagnóstico <ArrowRight size={17}/></button></section>
    </div>
    <section className="exam-blueprint"><div className="blueprint-heading"><span>ESTRUCTURA DE LA EVALUACIÓN</span><h2>Distribución por unidad</h2><small>40 preguntas · cada acierto o criterio tiene puntaje visible al corregir</small></div><div className="blueprint-units">{groups.map((g)=><div key={g.name} style={{"--unit-color":g.color}}><b>{g.count}</b><span>preguntas</span><small>{g.name}</small><i><em style={{width:(g.count/40*100)+"%"}}/></i></div>)}</div><div className="exam-types-line"><span>24 selección múltiple</span><span>8 casos aplicados</span><span>4 verdadero / falso</span><span>4 desarrollos</span></div></section>
    <p className="assessment-rule">Exigencia referencial: 60 %. El primer puntaje entero que alcanza 60 % es 34/56 y corresponde a 4,0. La escala se muestra en el resultado.</p>
  </div>;
}

function QuestionInput({question,value,onChange}) {
  if(question.type==="mc"||question.type==="case")return <div className="exam-options">{question.options.map((option,index)=><button key={option} onClick={()=>onChange(index)} className={value===index?"selected":""}><span>{String.fromCharCode(65+index)}</span><b>{option}</b>{value===index&&<Check size={17}/>}</button>)}</div>;
  if(question.type==="vf")return <div className="exam-vf"><p className="vf-statement">{question.prompt}</p><div>{[true,false].map((choice)=><button key={String(choice)} onClick={()=>onChange(choice)} className={value===choice?"selected":""}>{choice?"Verdadero":"Falso"}</button>)}</div></div>;
  return <div className="exam-development"><p>{question.prompt}</p><textarea value={value||""} onChange={(e)=>onChange(e.target.value)} placeholder="Organiza tu respuesta: concepto → explicación → relación → ejemplo" rows={6}/><small>En corrección podrás contrastar tu respuesta con el modelo y marcar los criterios que cumpliste.</small></div>;
}

function RunningAssessment({assessment,onUpdate,onSubmit}) {
  const questionList=assessment.mode==="diagnostic"?diagnosticQuestions():examQuestions;
  const index=Math.max(0,Math.min(questionList.length-1,assessment.currentIndex||0));
  const current=questionList[index];
  const answer=assessment.answers?.[current.id];
  const [warnMissing,setWarnMissing]=useState(false);
  const answered=(q)=>{const value=assessment.answers?.[q.id];if(q.type==="vf")return typeof value==="boolean"&&Boolean(assessment.answers?.[q.id+"-reason"]?.trim());if(q.type==="develop")return Boolean(value?.trim());return value!==undefined&&value!==null;};
  const doneCount=questionList.filter(answered).length;
  const saveAnswer=(value)=>onUpdate({...assessment,answers:{...assessment.answers,[current.id]:value}});
  const finalClick=()=>{if(doneCount<questionList.length&&!warnMissing){setWarnMissing(true);return;}onSubmit();};
  return <div className="assessment-running">
    <header className="exam-topline"><div><span>{assessment.mode==="exam"?"PRUEBA SEMESTRAL":"DIAGNÓSTICO"}</span><b>{doneCount} / {questionList.length} respondidas</b></div><div className="exam-save-indicator"><CheckCircle2 size={15}/>Guardado local</div></header>
    <div className="exam-progress-track"><i style={{width:(doneCount/questionList.length*100)+"%"}}/></div>
    <div className="exam-body">
      <aside className="exam-question-nav"><span>NAVEGADOR</span><div>{questionList.map((q,i)=><button key={q.id} onClick={()=>onUpdate({...assessment,currentIndex:i})} className={(i===index?"current ":"")+(answered(q)?"answered":"")} aria-label={"Pregunta "+(i+1)}>{String(i+1).padStart(2,"0")}</button>)}</div><p>Guarda tu primera intuición y vuelve a las preguntas marcadas.</p></aside>
      <main className="exam-question-panel">
        <div className="exam-question-heading"><span>{examTypes[current.type]} · {units.find((unit)=>unit.id===current.unit)?.title}</span><b>PREGUNTA {String(index+1).padStart(2,"0")} <i>/ {questionList.length}</i></b></div>
        <h2>{current.prompt}</h2>
        <QuestionInput question={current} value={answer} onChange={saveAnswer}/>
        {current.type==="vf"&&<div className="exam-justification"><label htmlFor="vf-reason">Justifica en una o dos frases <small>(cuenta para el puntaje)</small></label><textarea id="vf-reason" rows={3} value={assessment.answers?.[current.id+"-reason"]||""} onChange={(e)=>onUpdate({...assessment,answers:{...assessment.answers,[current.id+"-reason"]:e.target.value}})} placeholder="Nombra el concepto o regla que sostiene tu decisión."/></div>}
        <div className="exam-question-footer"><span>{assessment.mode==="exam"?maxPoints(current)+" punto"+(maxPoints(current)===1?"":"s"):"Diagnóstico"}</span><div><button onClick={()=>onUpdate({...assessment,currentIndex:Math.max(0,index-1)})} disabled={index===0}><ArrowLeft size={16}/>Anterior</button><button onClick={()=>onUpdate({...assessment,currentIndex:Math.min(questionList.length-1,index+1)})} disabled={index===questionList.length-1}>Siguiente<ArrowRight size={16}/></button></div></div>
      </main>
    </div>
    <div className="exam-submit-row">{warnMissing&&<p>Faltan {questionList.length-doneCount} respuestas. Puedes volver a completarlas o corregir ahora; las preguntas vacías valdrán cero.</p>}<button onClick={finalClick} className="exam-finish">{warnMissing?"Corregir y terminar":"Finalizar y corregir"}<CheckCircle2 size={17}/></button></div>
  </div>;
}

function DevelopmentRubric({question,assessment,onUpdate}) {
  const chosen=assessment.developmentScores?.[question.id]||[false,false,false,false];
  const answer=assessment.answers?.[question.id]||"";
  return <details className="result-rubric"><summary>Desarrollo breve · máximo 4 puntos <span>{chosen.filter(Boolean).length}/4</span></summary>
    <div className="rubric-body"><div className="rubric-student-answer"><b>Tu respuesta</b><p>{answer||"Sin respuesta."}</p></div><div className="rubric-model"><b>Respuesta modelo</b><p>{question.model}</p></div><div className="rubric-criteria">{question.rubric.map((criterion,index)=><button className={chosen[index]?"selected":""} key={criterion} onClick={()=>onUpdate({...assessment,developmentScores:{...assessment.developmentScores,[question.id]:chosen.map((value,i)=>i===index?!value:value)}})}><span>{chosen[index]?<Check size={14}/>:index+1}</span><b>{criterion}</b><small>{chosen[index]?"1 punto":"Marcar si tu respuesta lo incluye"}</small></button>)}</div></div>
  </details>;
}

function TrueFalseRubric({question,assessment,onUpdate}) {
  const score=Number(assessment.rationaleScores?.[question.id]??0);
  return <details className="result-rubric"><summary>Justificación · máximo 1 punto <span>{score}/1</span></summary><div className="rubric-body">
    <div className="rubric-model"><b>Justificación esperada</b><p>{question.explanation}</p></div>
    <div className="rationale-rating"><span>¿Tu explicación nombra la regla o concepto que justifica el V/F?</span><div><button className={score===1?"selected":""} onClick={()=>onUpdate({...assessment,rationaleScores:{...assessment.rationaleScores,[question.id]:1}})}>Sí, 1 punto</button><button className={score===0?"selected":""} onClick={()=>onUpdate({...assessment,rationaleScores:{...assessment.rationaleScores,[question.id]:0}})}>Aún no, 0 puntos</button></div></div>
  </div></details>;
}

function AssessmentResults({assessment,onUpdate,onRestart}) {
  const questionList=assessment.mode==="diagnostic"?diagnosticQuestions():examQuestions;
  const semestral=assessment.mode==="exam";
  const total=questionList.reduce((sum,q)=>sum+questionScore(q,assessment.answers||{},assessment.rationaleScores||{},assessment.developmentScores||{}),0);
  const maximum=semestral?scoreBreakdown.total:questionList.length;
  const percentage=Math.round(total/maximum*100);
  const results=examBlueprint.map((group)=>{
    const groupQuestions=questionList.filter((q)=>q.unit===group.unit);
    const points=groupQuestions.reduce((sum,q)=>sum+questionScore(q,assessment.answers||{},assessment.rationaleScores||{},assessment.developmentScores||{}),0);
    const max=groupQuestions.reduce((sum,q)=>sum+maxPoints(q),0);
    return {...group,questions:groupQuestions.length,points,max,percent:max?Math.round(points/max*100):0};
  });
  const objectivePending=questionList.filter((q)=>q.type==="vf"&&assessment.rationaleScores?.[q.id]===undefined).length;
  const developmentPending=questionList.filter((q)=>q.type==="develop"&&assessment.developmentScores?.[q.id]===undefined).length;
  const setGrade=(updated)=>onUpdate(updated);
  return <div className="assessment-results">
    <header className={"result-hero "+(semestral?"result-hero-exam":"result-hero-diagnostic")}>
      <div><span>{semestral?"EVALUACIÓN CORREGIDA":"DIAGNÓSTICO COMPLETADO"}</span><h1>{semestral?"Tu resultado semestral":"Tu mapa de fortalezas"}</h1><p>{semestral?"Corrige tus desarrollos con la rúbrica para ajustar la nota y elegir qué reforzar.":"Revisa el desempeño por unidad; el diagnóstico no cambia tu nota semestral."}</p></div>
      <div className="result-score"><strong>{total}<small> / {maximum}</small></strong><span>{percentage}%</span>{semestral&&<b>Nota {calculateGrade(total).toFixed(1)}</b>}</div>
    </header>
    {semestral&&<div className="grade-explanation"><span>ESCALA REFERENCIAL CHILENA</span><p>34/56 es el primer puntaje entero que alcanza el 60 % y corresponde a 4,0. Tu nota usa una escala lineal por tramo, de 1,0 a 7,0.</p><small>0 → 1,0 · 33 → {calculateGrade(33).toFixed(1)} · 34 → {calculateGrade(34).toFixed(1)} · 56 → {calculateGrade(56).toFixed(1)}</small></div>}
    <section className="result-units"><div className="result-section-heading"><span>POR UNIDAD</span><h2>Qué conviene reforzar</h2></div><div>{results.map((unit)=> <div className="result-unit-row" key={unit.unit} style={{"--unit-color":unit.color}}><span className="unit-dot"/><b>{unit.label}</b><small>{unit.questions} preguntas</small><i><em style={{width:unit.percent+"%"}}/></i><strong>{unit.points} / {unit.max} pts</strong><span>{unit.percent}%</span><button onClick={()=>window.dispatchEvent(new CustomEvent("ec-open-lesson",{detail:{unit:unit.unit}}))}>Refuerzo<ArrowRight size={14}/></button></div>)}</div></section>
    <section className="answer-review-section"><div className="result-section-heading"><span>REVISIÓN COMPLETA</span><h2>Respuestas y explicaciones</h2><p>Las alternativas se corrigen automáticamente. Los V/F y desarrollos permiten autocorregir criterios parciales.</p></div>
      <div className="answer-review-list">{questionList.map((question,index)=>{
        const user=assessment.answers?.[question.id];
        const points=questionScore(question,assessment.answers||{},assessment.rationaleScores||{},assessment.developmentScores||{});
        const max=maxPoints(question);
        const correct=question.type==="develop"?null:question.type==="vf"?user===question.answer:user===question.answer;
        return <article className={"answer-review-item "+(correct===false?"review-incorrect":"")} key={question.id}>
          <div className="answer-review-top"><span>{String(index+1).padStart(2,"0")} · {units.find((u)=>u.id===question.unit)?.title}</span><b>{points}/{max} pt{max===1?"":"s"}</b></div>
          <h3>{question.prompt}</h3>
          {(question.type==="mc"||question.type==="case")&&<div className="answer-review-detail"><span>Tu respuesta</span><p>{answerLabel(question,user)}</p><span>Respuesta correcta</span><p className="answer-correct">{question.options[question.answer]}</p></div>}
          {question.type==="vf"&&<div className="answer-review-detail"><span>Tu respuesta</span><p>{answerLabel(question,user)}</p><span>Respuesta correcta</span><p className="answer-correct">{question.answer?"Verdadero":"Falso"}</p><p className="answer-explanation">{question.explanation}</p><TrueFalseRubric question={question} assessment={assessment} onUpdate={setGrade}/></div>}
          {question.type==="develop"&&<DevelopmentRubric question={question} assessment={assessment} onUpdate={setGrade}/>}
          {(question.type==="mc"||question.type==="case")&&<p className="answer-explanation">{question.explanation}</p>}
        </article>;
      })}</div>
    </section>
    <div className="result-actions"><div>{objectivePending+developmentPending>0&&<p>Autocorrecciones pendientes: {objectivePending} justificaciones V/F y {developmentPending} desarrollos.</p>}</div><button onClick={onRestart}><RotateCcw size={17}/>Repetir evaluación</button></div>
  </div>;
}

export function EvaluationView({assessment,onStart,onUpdate,onSubmit,onRestart}) {
  if(!assessment)return <AssessmentIntro onStart={onStart}/>;
  if(assessment.status==="running")return <RunningAssessment assessment={assessment} onUpdate={onUpdate} onSubmit={onSubmit}/>;
  return <AssessmentResults assessment={assessment} onUpdate={onUpdate} onRestart={onRestart}/>;
}
