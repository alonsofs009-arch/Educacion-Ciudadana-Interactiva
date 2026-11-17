import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Clock3, ExternalLink, Search, X } from "lucide-react";
import { glossary } from "../data/glossary.js";
import { lessons, units } from "../data/lessons.js";
import { officialSources, learningSources } from "../data/sources.js";

function DialogFrame({title,subtitle,onClose,children,wide=false}) {
  useEffect(()=>{const fn=(e)=>e.key==="Escape"&&onClose();window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[onClose]);
  return <div className="dialog-scrim" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><section className={"dialog-panel "+(wide?"dialog-wide":"")} role="dialog" aria-modal="true" aria-label={title}>
    <header className="dialog-head"><div><span>{subtitle}</span><h2>{title}</h2></div><button onClick={onClose} aria-label="Cerrar"><X size={19}/></button></header>{children}
  </section></div>;
}

export function GlossaryDialog({onClose}) {
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const filtered=useMemo(()=>glossary.filter(([term,definition])=>(term+" "+definition).toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"))),[query]);
  return <DialogFrame title="Glosario cívico" subtitle="CONCEPTOS PARA LEER Y RESPONDER" onClose={onClose} wide>
    <div className="dialog-search"><Search size={17}/><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Busca: autonomía, querella, comuna…"/></div>
    <div className="glossary-layout"><div className="glossary-list" role="list">{filtered.map(([term,definition])=><button key={term} className={selected?.[0]===term?"active":""} onClick={()=>setSelected([term,definition])}><b>{term}</b><span>{definition}</span></button>)}{!filtered.length&&<p className="empty-search">No hay coincidencias. Prueba otra palabra.</p>}</div><aside className="glossary-definition"><span>DEFINICIÓN</span><h3>{selected?.[0]||"Elige un concepto"}</h3><p>{selected?.[1]||"Busca un término o selecciona una entrada para abrir su explicación."}</p></aside></div>
  </DialogFrame>;
}

export function SearchDialog({onClose,onLesson,onGlossary}) {
  const [query,setQuery]=useState("");
  const inputRef=useRef(null);
  useEffect(()=>inputRef.current?.focus(),[]);
  const results=useMemo(()=>{
    if(!query.trim())return [];
    const q=query.toLocaleLowerCase("es");
    const lessonHits=lessons.filter((l)=>(l.title+" "+l.intro+" "+l.essential.map((b)=>b.text).join(" ")).toLocaleLowerCase("es").includes(q)).slice(0,8).map((lesson)=>({type:"lesson",title:lesson.title,subtitle:units.find((u)=>u.id===lesson.unit).title,lessonId:lesson.id}));
    const termHits=glossary.filter(([term,definition])=>(term+" "+definition).toLocaleLowerCase("es").includes(q)).slice(0,5).map(([term,definition])=>({type:"term",title:term,subtitle:definition}));
    return [...lessonHits,...termHits].slice(0,10);
  },[query]);
  return <DialogFrame title="Buscar en el curso" subtitle="LECCIONES · CONCEPTOS · CASOS" onClose={onClose} wide>
    <div className="dialog-search dialog-search-large"><Search size={19}/><input ref={inputRef} value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Escribe una institución, derecho o situación…"/><kbd>ESC</kbd></div>
    <div className="search-result-list">{results.map((result,index)=><button key={result.type+result.title} onClick={()=>result.type==="lesson"?(onLesson(result.lessonId),onClose()):(onGlossary(),onClose())}><span className="search-result-number">{String(index+1).padStart(2,"0")}</span><div><b>{result.title}</b><small>{result.subtitle}</small></div><BookOpen size={16}/></button>)}
    {!query&&<div className="search-suggestions"><span>PRUEBA BUSCANDO</span>{["formalización","INDH","Los Lagos","artículo 11","descentralización"].map((term)=><button key={term} onClick={()=>setQuery(term)}>{term}</button>)}</div>}
    {query&&results.length===0&&<p className="empty-search">No encontramos coincidencias. Prueba «derechos», «Fiscalía» o «comuna».</p>}</div>
  </DialogFrame>;
}

export function SourcesDialog({onClose}) {
  return <DialogFrame title="Fuentes y créditos" subtitle="CONSULTA PRIMARIA · RECURSOS LOCALES" onClose={onClose} wide>
    <div className="sources-scroll">
      <section className="sources-group"><div className="sources-group-head"><span>01</span><div><b>Fuentes oficiales del contenido</b><small>Instituciones públicas y normas vigentes</small></div></div><div className="source-list">{officialSources.map((source)=><a href={source.url} target="_blank" rel="noreferrer" key={source.name}><div><b>{source.name}</b><small>{source.organization} · {source.supports}</small></div><ExternalLink size={16}/></a>)}</div></section>
      <section className="sources-group"><div className="sources-group-head"><span>02</span><div><b>Referentes de aprendizaje y visualización</b><small>Aplicados al recorrido, las actividades y los diagramas</small></div></div><div className="learning-source-list">{learningSources.map((source)=><a href={source.url} target="_blank" rel="noreferrer" key={source.name}><b>{source.name}</b><span>{source.supports}</span><ExternalLink size={14}/></a>)}</div></section>
      <div className="source-note"><Clock3 size={16}/><p>Los ejemplos jurídicos son educativos. Para un caso real, consulta a una profesional o servicio competente. Los límites y competencias se explican con referencia a la norma aplicable.</p></div>
      <a className="credits-link" href={`${import.meta.env.BASE_URL}CREDITOS.md`} target="_blank" rel="noreferrer">Ver atribución y licencias de las fotografías locales <ExternalLink size={15}/></a>
    </div>
  </DialogFrame>;
}

export function StudyPlanDialog({onClose}) {
  const plan=[
    ["01","Derechos Humanos","30 min","#536dff"],
    ["02","Sistema Judicial","25 min","#e8872b"],
    ["03","Territorio y Ciudadanía","10 min","#168d79"],
    ["04","Repaso activo","10 min","#735bd6"],
    ["05","Evaluación semestral","35 min","#d7664c"],
    ["06","Corrección y refuerzo","10 min","#23799a"],
  ];
  const total=plan.reduce((sum,item)=>sum+Number.parseInt(item[2],10),0);
  return <DialogFrame title="Tu recorrido de 120 minutos" subtitle="PLAN PRINCIPAL · ESTIMACIÓN DE ESTUDIO" onClose={onClose}>
    <div className="plan-dialog-content">{plan.map(([n,label,time,color])=><div className="plan-row" key={n} style={{"--plan-color":color}}><span>{n}</span><b>{label}</b><i/><small>{time}</small></div>)}<div className="plan-total"><span>TOTAL</span><b>{total} minutos</b><small>La profundización queda disponible para después del recorrido principal.</small></div></div>
  </DialogFrame>;
}
