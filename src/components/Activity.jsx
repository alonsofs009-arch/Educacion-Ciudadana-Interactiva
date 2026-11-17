import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Check, ChevronDown, RotateCcw, Sparkles } from "lucide-react";

function ChoiceActivity({ activity, onComplete }) {
  const [selected,setSelected]=useState(null);
  const [checked,setChecked]=useState(false);
  const correct=selected===activity.answer;
  const finish=()=>{if(selected!==null){setChecked(true);onComplete(correct);}};
  const retry=()=>{setSelected(null);setChecked(false);};
  return <div className="activity-body">
    <p className="activity-question">{activity.question}</p>
    <div className="answer-options">{activity.options.map((option,index)=><button key={option} className={"answer-option "+(selected===index?"selected ":"")+(checked&&index===activity.answer?"is-correct":"")+(checked&&selected===index&&!correct?"is-wrong":"")} onClick={()=>!checked&&setSelected(index)} disabled={checked}><span className="option-letter">{String.fromCharCode(65+index)}</span><span>{option}</span>{checked&&index===activity.answer&&<Check size={18}/>}</button>)}</div>
    {!checked?<button className="activity-submit" disabled={selected===null} onClick={finish}>Comprobar respuesta <Check size={16}/></button>:<div className={"activity-feedback "+(correct?"feedback-good":"feedback-review")}><div><b>{correct?"¡Bien razonado!":"Revisa la pista"}</b><p>{correct?activity.feedback:"La opción elegida no corresponde. "+activity.feedback+" La respuesta correcta es "+activity.options[activity.answer]}</p></div><button onClick={retry} className="activity-retry" aria-label="Intentar nuevamente"><RotateCcw size={16}/></button></div>}
  </div>;
}

function FlashActivity({activity,onComplete,onDifficult}) {
  const [open,setOpen]=useState(false);
  const [rated,setRated]=useState(false);
  return <div className="flashcard-activity">
    <button className={"flashcard "+(open?"is-open":"")} onClick={()=>setOpen(!open)} aria-expanded={open}>
      <span>{open?"RESPUESTA":"RECUERDA SIN MIRAR"}</span><b>{open?activity.back:activity.front}</b><small>{open?"Pulsa para volver a la pregunta":"Pulsa para revelar la respuesta"}</small>
    </button>
    {open&&!rated&&<div className="flashcard-rating"><button onClick={()=>{setRated(true);onComplete(true);onDifficult?.(false);}}>La recordé <Check size={15}/></button><button onClick={()=>{setRated(true);onComplete(false);onDifficult?.(true);}}>La practico más <RotateCcw size={15}/></button></div>}
    {rated&&<p className="flashcard-saved">{activity.back}</p>}
  </div>;
}

function ClassifyActivity({activity,onComplete}) {
  const [selected,setSelected]=useState(null);
  const [checked,setChecked]=useState(false);
  const correct=selected===activity.answer;
  return <div className="activity-body">
    <p className="activity-question">{activity.question}</p>
    <div className="classification-options">{activity.categories.map((category,i)=><button key={category} className={selected===i?"selected":""} onClick={()=>!checked&&setSelected(i)} disabled={checked}>{category}</button>)}</div>
    {!checked?<button className="activity-submit" disabled={selected===null} onClick={()=>{setChecked(true);onComplete(correct);}}>Clasificar <Check size={16}/></button>:<div className={"activity-feedback "+(correct?"feedback-good":"feedback-review")}><div><b>{correct?"Clasificación correcta":"Vuelve al actor del caso"}</b><p>{correct?activity.feedback:"La clasificación no corresponde. "+activity.feedback+" La categoría correcta es «"+activity.categories[activity.answer]+"»."}</p></div><button onClick={()=>{setSelected(null);setChecked(false);}} className="activity-retry" aria-label="Intentar nuevamente"><RotateCcw size={16}/></button></div>}
  </div>;
}

function MatchActivity({activity,onComplete}) {
  const choices=useMemo(()=>[...activity.pairs.map((pair)=>pair.b)].reverse(),[activity.pairs]);
  const [answers,setAnswers]=useState({});
  const [checked,setChecked]=useState(false);
  const correct=activity.pairs.every((pair,i)=>answers[i]===pair.b);
  return <div className="match-activity">
    <p className="activity-question">Elige la definición que corresponde a cada término.</p>
    {activity.pairs.map((pair,i)=><label key={pair.a} className="match-row"><b>{pair.a}</b><span className="match-select-wrap"><select value={answers[i]||""} disabled={checked} onChange={(e)=>setAnswers({...answers,[i]:e.target.value})}><option value="">Elige una definición…</option>{choices.map((choice)=><option key={choice} value={choice}>{choice}</option>)}</select><ChevronDown size={16}/></span></label>)}
    {!checked?<button className="activity-submit" disabled={activity.pairs.some((_,i)=>!answers[i])} onClick={()=>{setChecked(true);onComplete(correct);}}>Revisar relaciones <Check size={16}/></button>:<div className={"activity-feedback "+(correct?"feedback-good":"feedback-review")}><div><b>{correct?"Todas las relaciones son correctas":"Revisa las funciones"}</b><p>{correct?"Cada institución o término conserva su función propia.":activity.pairs.map((pair)=>pair.a+" → "+pair.b).join(" · ")}</p></div><button onClick={()=>{setChecked(false);setAnswers({});}} className="activity-retry" aria-label="Intentar nuevamente"><RotateCcw size={16}/></button></div>}
  </div>;
}

function OrderActivity({activity,onComplete}) {
  const startingOrder=useMemo(()=>activity.items.map((item,i)=>({item,original:i})).sort((a,b)=>((a.original*7+3)%11)-((b.original*7+3)%11)),[activity.items]);
  const [order,setOrder]=useState(startingOrder);
  const [checked,setChecked]=useState(false);
  const correct=order.every((entry,index)=>entry.original===activity.correct[index]);
  const move=(index,delta)=>{const target=index+delta;if(target<0||target>=order.length)return;const next=[...order];[next[index],next[target]]=[next[target],next[index]];setOrder(next);};
  return <div className="order-activity">
    <p className="activity-question">Usa las flechas para ordenar las etapas desde el inicio hasta la decisión.</p>
    {order.map((entry,index)=><div className={"order-row "+(checked&&entry.original===activity.correct[index]?"order-right":"")} key={entry.original}><span>{String(index+1).padStart(2,"0")}</span><b>{entry.item}</b><div><button disabled={checked||index===0} onClick={()=>move(index,-1)} aria-label="Mover arriba"><ArrowUp size={15}/></button><button disabled={checked||index===order.length-1} onClick={()=>move(index,1)} aria-label="Mover abajo"><ArrowDown size={15}/></button></div></div>)}
    {!checked?<button className="activity-submit" onClick={()=>{setChecked(true);onComplete(correct);}}>Comprobar orden <Check size={16}/></button>:<div className={"activity-feedback "+(correct?"feedback-good":"feedback-review")}><div><b>{correct?"Secuencia correcta":"Vuelve a los hitos"}</b><p>{activity.feedback} Secuencia: {activity.correct.map((i)=>activity.items[i]).join(" → ")}.</p></div><button onClick={()=>{setChecked(false);setOrder(startingOrder);}} className="activity-retry" aria-label="Intentar nuevamente"><RotateCcw size={16}/></button></div>}
  </div>;
}

function AuthorityActivity({activity,onComplete}) {
  const names=[...new Set(activity.situations.map((item)=>item.answer))];
  const [answers,setAnswers]=useState({});
  const [checked,setChecked]=useState(false);
  const correct=activity.situations.every((s,i)=>answers[i]===s.answer);
  return <div className="authority-activity">
    {activity.instruction&&<p className="activity-question">{activity.instruction}</p>}
    {activity.situations.map((s,i)=><label className="authority-match-row" key={s.text}><span>{s.text}</span><select disabled={checked} value={answers[i]||""} onChange={(e)=>setAnswers({...answers,[i]:e.target.value})}><option value="">Selecciona…</option>{names.map((name)=><option key={name}>{name}</option>)}</select></label>)}
    {!checked?<button className="activity-submit" disabled={activity.situations.some((_,i)=>!answers[i])} onClick={()=>{setChecked(true);onComplete(correct);}}>Comprobar autoridades <Check size={16}/></button>:<div className={"activity-feedback "+(correct?"feedback-good":"feedback-review")}><div><b>{correct?"Roles bien identificados":"Revisa quién elige y qué administra"}</b><p>{activity.situations.map((s)=>s.answer+" — "+s.text).join(" · ")}</p></div><button onClick={()=>{setChecked(false);setAnswers({});}} className="activity-retry" aria-label="Intentar nuevamente"><RotateCcw size={16}/></button></div>}
  </div>;
}

function MapMiniActivity({activity,onComplete}) {
  const [selected,setSelected]=useState(null);
  const [checked,setChecked]=useState(false);
  const correct=selected==="Llanquihue";
  return <div className="activity-body">
    <p className="activity-question">Puerto Montt, capital regional y comunal, se ubica en la Provincia de…</p>
    <div className="classification-options">{["Osorno","Llanquihue","Chiloé","Palena"].map((name)=><button key={name} className={selected===name?"selected":""} onClick={()=>!checked&&setSelected(name)} disabled={checked}>{name}</button>)}</div>
    {!checked?<button className="activity-submit" disabled={!selected} onClick={()=>{setChecked(true);onComplete(correct);}}>Ubicar <Check size={16}/></button>:<div className={"activity-feedback "+(correct?"feedback-good":"feedback-review")}><div><b>{correct?"Correcto":"Revisa el mapa de Los Lagos"}</b><p>Puerto Montt está en la Provincia de Llanquihue. {activity.instruction}</p></div><button onClick={()=>{setChecked(false);setSelected(null);}} className="activity-retry" aria-label="Intentar nuevamente"><RotateCcw size={16}/></button></div>}
  </div>;
}

const participantRoles={
  "Juez":"El tribunal oral valora la prueba presentada en audiencia y decide si la acusación se probó. Debe actuar con independencia e imparcialidad.",
  "Fiscalía":"Dirige la investigación antes del juicio y, si corresponde, presenta la acusación y sostiene la prueba de cargo.",
  "Defensa":"Asesora y representa a la persona imputada o acusada; controvierte la prueba y presenta argumentos a su favor.",
  "Imputado":"Persona a quien se atribuye participación en una investigación. Mantiene la presunción de inocencia y derecho a defensa.",
  "Víctima":"Persona directamente ofendida por el delito. Tiene derechos de información, protección y participación conforme a la ley.",
  "Testigo":"Declara sobre hechos que conoce. Su relato es prueba que el tribunal debe valorar junto con los demás antecedentes.",
  "Policía":"Carabineros o PDI realizan diligencias investigativas bajo dirección de Fiscalía; no acusan ni deciden culpabilidad.",
};

function CourtroomActivity({activity,onComplete}) {
  const [selected,setSelected]=useState(null);
  const [checked,setChecked]=useState(false);
  const role=activity.roles[selected];
  const correct=role==="Juez";
  return <div className="activity-body participant-activity">
    <p className="activity-question">¿Quién decide la culpabilidad después de valorar la prueba del juicio oral?</p>
    <div className="classification-options">{activity.roles.map((name,index)=><button key={name} className={selected===index?"selected":""} onClick={()=>!checked&&setSelected(index)} disabled={checked}>{name}</button>)}</div>
    {role&&<div className="participant-detail"><b>{role}</b><p>{participantRoles[role]}</p></div>}
    {!checked?<button className="activity-submit" disabled={selected===null} onClick={()=>{setChecked(true);onComplete(correct);}}>Comprobar función <Check size={16}/></button>:<div className={"activity-feedback "+(correct?"feedback-good":"feedback-review")}><div><b>{correct?"Decisión judicial identificada":"Separa acusar de juzgar"}</b><p>{correct?"El tribunal oral decide tras escuchar la prueba. Fiscalía acusa; la defensa controvierte; testigos declaran; la policía investiga bajo dirección fiscal.":"La respuesta correcta es Juez / Tribunal Oral. "+participantRoles.Juez}</p></div><button onClick={()=>{setSelected(null);setChecked(false);}} className="activity-retry" aria-label="Intentar nuevamente"><RotateCcw size={16}/></button></div>}
  </div>;
}

export function ActivityCard({activity,activityKey,onComplete=()=>{},onDifficult}) {
  return <section className="activity-card">
    <div className="activity-card-head"><div className="activity-mark"><Sparkles size={16}/></div><div><span>APLICA Y COMPRUEBA</span><h3>{activity.title}</h3></div></div>
    {activity.type==="flash"?<FlashActivity activity={activity} onComplete={onComplete} onDifficult={onDifficult}/>:
     activity.type==="classify"?<ClassifyActivity activity={activity} onComplete={onComplete}/>:
     activity.type==="match"?<MatchActivity activity={activity} onComplete={onComplete}/>:
     activity.type==="order"?<OrderActivity activity={activity} onComplete={onComplete}/>:
     activity.type==="authority"?<AuthorityActivity activity={activity} onComplete={onComplete}/>:
     activity.type==="courtroom"?<CourtroomActivity activity={activity} onComplete={onComplete}/>:
     activity.type==="map"?<MapMiniActivity activity={activity} onComplete={onComplete}/>:
     <ChoiceActivity activity={activity} onComplete={onComplete}/>}
  </section>;
}
