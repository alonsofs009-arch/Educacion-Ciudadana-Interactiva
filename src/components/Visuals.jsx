import { useState } from "react";
import { articleGroups, articles, getArticleGroup } from "../data/articles.js";

const photoRoot = `${import.meta.env.BASE_URL}assets/photos/`;
const chileanRegions = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso",
  "Metropolitana de Santiago", "O’Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía",
  "Los Ríos", "Los Lagos", "Aysén", "Magallanes",
];
const regionPoints = [
  [174,40],[168,79],[172,125],[171,172],[174,215],[179,254],[182,294],[184,330],
  [186,365],[188,399],[190,431],[191,463],[193,494],[195,525],[197,567],[201,620],
];
const authorityDetails = [
  { name: "Gobernador regional", type: "Electo", body: "Encabeza el órgano ejecutivo del GORE; propone estrategias y políticas de desarrollo y preside el CORE." },
  { name: "Consejo Regional (CORE)", type: "Electo", body: "Aprueba planes, presupuesto e inversiones regionales y fiscaliza actos del Gobierno Regional conforme a la ley." },
  { name: "Delegado presidencial regional", type: "Designado", body: "Representa al Presidente y coordina el gobierno interior y los servicios del nivel central en la región." },
  { name: "Delegado presidencial provincial", type: "Designado", body: "Ejerce tareas de gobierno interior en la provincia cuando existe esa delegación, bajo coordinación regional." },
  { name: "Alcalde y concejo municipal", type: "Electos", body: "La alcaldía conduce la administración comunal; el concejo acuerda, aprueba instrumentos y fiscaliza dentro de sus competencias." },
];

function Photo({ file, alt, caption, credit }) {
  return <figure className="photo-figure"><img src={photoRoot + file} alt={alt} loading="lazy" /><figcaption><span>{caption}</span>{credit && <small>{credit}</small>}</figcaption></figure>;
}

function VisualCaption({ eyebrow, title, children }) {
  return <div className="visual-caption"><span className="visual-eyebrow">{eyebrow}</span><strong>{title}</strong><p>{children}</p></div>;
}

function HumanityVisual() {
  return <div className="visual-art visual-humanity">
    <svg viewBox="0 0 620 340" role="img" aria-label="Diagrama original sobre dignidad humana y derechos interdependientes">
      <defs><linearGradient id="humanSky" x1="0" x2="1"><stop stopColor="#b8caff"/><stop offset="1" stopColor="#eedcff"/></linearGradient></defs>
      <path d="M16 280C90 220 115 255 174 211s107-33 149-78 106-44 162-9 77 16 119-28v228H16Z" fill="url(#humanSky)" opacity=".78"/>
      <circle cx="307" cy="121" r="82" fill="#fff" stroke="#536dff" strokeWidth="2"/>
      <circle cx="307" cy="121" r="57" fill="#f2f3ff" stroke="#9377f5" strokeWidth="2"/>
      <circle cx="307" cy="101" r="19" fill="#e99c71"/><path d="M270 168c5-31 19-48 37-48s32 17 37 48" fill="#515acb"/>
      <path d="M58 213C126 127 196 103 246 104M369 102c67-27 125-10 187 44M118 283c73-56 130-76 170-79m42 0c66 2 119 23 170 70" fill="none" stroke="#6476e8" strokeWidth="2.2" strokeDasharray="5 7"/>
      <g fill="#fff" stroke="#6372dc" strokeWidth="2">
        <circle cx="75" cy="194" r="25"/><circle cx="121" cy="158" r="16"/><circle cx="187" cy="131" r="18"/>
        <circle cx="536" cy="162" r="23"/><circle cx="483" cy="133" r="17"/><circle cx="429" cy="126" r="14"/>
        <circle cx="124" cy="276" r="23"/><circle cx="212" cy="240" r="17"/><circle cx="501" cy="260" r="22"/><circle cx="420" cy="232" r="17"/>
      </g>
      <g fill="#32477c" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700">
        <text x="33" y="244">todas las personas</text><text x="407" y="55">igual dignidad</text>
        <text x="245" y="276">derechos conectados</text>
      </g>
      <path d="M105 224l14 29m358-70-16 26M310 204v37" fill="none" stroke="#e07b5b" strokeWidth="3"/>
    </svg>
    <div className="art-note art-note-top"><b>Valor intrínseco</b><span>La dignidad no depende de origen, cargo ni popularidad.</span></div>
    <div className="art-note art-note-bottom"><b>Una red de derechos</b><span>Educación y participación se refuerzan entre sí.</span></div>
  </div>;
}

function DutiesVisual() {
  return <div className="visual-art visual-duties">
    <div className="duty-orbit">
      <svg viewBox="0 0 700 290" role="img" aria-label="Tres deberes del Estado conectados">
        <path d="M130 175C210 49 461 49 555 175M150 195h400" fill="none" stroke="#b7c5dc" strokeWidth="3" strokeDasharray="7 8"/>
        <path d="M349 46v52m-219 82v41m425-41v41" stroke="#374a70" strokeWidth="2"/>
        <circle cx="130" cy="177" r="83" fill="#dce8ff" stroke="#4c6eff" strokeWidth="3"/>
        <circle cx="350" cy="46" r="74" fill="#dff5f1" stroke="#198f83" strokeWidth="3"/>
        <circle cx="555" cy="177" r="83" fill="#ffead0" stroke="#e8872b" strokeWidth="3"/>
        <text x="130" y="162" textAnchor="middle" fill="#17264a" fontSize="20" fontWeight="700">RESPETAR</text>
        <text x="130" y="188" textAnchor="middle" fill="#374a70" fontSize="13">no interferir</text>
        <text x="350" y="42" textAnchor="middle" fill="#17264a" fontSize="18" fontWeight="700">GARANTIZAR</text>
        <text x="350" y="66" textAnchor="middle" fill="#374a70" fontSize="12">organizar y reparar</text>
        <text x="555" y="162" textAnchor="middle" fill="#17264a" fontSize="20" fontWeight="700">PROTEGER</text>
        <text x="555" y="188" textAnchor="middle" fill="#374a70" fontSize="13">actuar ante terceros</text>
        <path d="M214 177h75m126 0h56" stroke="#52647e" strokeWidth="3"/>
        <path d="m281 170 10 7-10 7m182-14 10 7-10 7" fill="none" stroke="#52647e" strokeWidth="2"/>
      </svg>
    </div>
    <VisualCaption eyebrow="ESQUEMA · TRES OBLIGACIONES" title="El Estado debe actuar en tres planos">Una acción puede incumplir el deber de respetar; una omisión puede comprometer protección o garantía.</VisualCaption>
  </div>;
}

function DistinctionVisual() {
  const [actor, setActor] = useState("privado");
  return <div className="visual-split visual-distinction">
    <div className="decision-tree">
      <div className="tree-question">¿Quién actuó u omitió?</div>
      <div className="tree-branches"><button className={actor === "privado" ? "selected" : ""} onClick={() => setActor("privado")}>Persona o empresa</button><button className={actor === "state" ? "selected" : ""} onClick={() => setActor("state")}>Agente del Estado</button></div>
      <div className="tree-result">
        <span>{actor === "privado" ? "POSIBLE VULNERACIÓN PRIVADA" : "POSIBLE ATRIBUCIÓN ESTATAL"}</span>
        <p>{actor === "privado" ? "Examina también si el Estado previno el riesgo y ofreció tutela efectiva." : "Analiza el derecho, la atribución, el deber estatal y la respuesta institucional."}</p>
      </div>
      <div className="tree-foot">En ambos casos: identifica derecho afectado + hechos que faltan.</div>
    </div>
    <Photo file="roosevelt-dudh.jpg" alt="Eleanor Roosevelt muestra el texto de la Declaración Universal de Derechos Humanos" caption="Dignidad y responsabilidad pública" credit="Foto histórica · 1949" />
  </div>;
}

function HistoryVisual() {
  return <div className="visual-split visual-history">
    <div className="history-track">
      {[["1945","Nace la ONU"],["1946","Comisión de DD. HH."],["1948","La Asamblea General proclama la DUDH"],["30","Artículos comunes"]].map((item, i) =>
        <div className="history-point" key={item[0]}><span className="history-dot">{i + 1}</span><div><b>{item[0]}</b><small>{item[1]}</small></div></div>
      )}
      <p className="visual-footnote">La fotografía muestra a Roosevelt con el texto en 1949; no representa la votación de 1948.</p>
    </div>
    <Photo file="roosevelt-dudh.jpg" alt="Eleanor Roosevelt con la Declaración Universal de los Derechos Humanos en español" caption="Eleanor Roosevelt presenta la Declaración Universal" credit="1949 · National Archives and Records Administration" />
  </div>;
}

function AtlasVisual() {
  const [active, setActive] = useState(1);
  const article = articles.find((item) => item.n === active);
  const group = getArticleGroup(article.group);
  return <div className="atlas-visual">
    <div className="atlas-stacks">
      {articleGroups.map((g) => <div className="atlas-band" key={g.id} style={{ "--group-color": g.color }}>
        <span className="atlas-band-title">{g.range}<small>{g.label}</small></span>
        <div className="atlas-numbers">{articles.filter((a) => a.group === g.id).map((a) =>
          <button className={active === a.n ? "active" : ""} key={a.n} onClick={() => setActive(a.n)} aria-label={"Artículo " + a.n + ": " + a.title} title={"Artículo " + a.n + ": " + a.title}>{String(a.n).padStart(2,"0")}</button>
        )}</div>
      </div>)}
    </div>
    <div className="article-inspector" style={{ "--group-color": group.color }}>
      <div className="article-inspector-head"><span>ARTÍCULO {String(article.n).padStart(2,"0")}</span><small>{group.label}</small></div>
      <h3>{article.title}</h3><p>{article.meaning}</p>
      <div className="article-example"><b>Asociación visual</b><span>{article.cue}</span></div>
      <div className="article-example"><b>Ejemplo</b><span>{article.example}</span></div>
    </div>
  </div>;
}

function FrameworkVisual() {
  return <div className="framework-visual">
    <div className="framework-stack">
      <div className="framework-layer framework-constitutional"><b>CONSTITUCIÓN</b><span>Arts. 5 · 19 · 20 · 21</span></div>
      <div className="framework-layer framework-treaties"><b>TRATADOS VIGENTES</b><span>PIDCP · PIDESC · Convenciones</span></div>
      <div className="framework-layer framework-laws"><b>LEYES Y PROCEDIMIENTOS</b><span>Reglas que desarrollan derechos y vías</span></div>
      <div className="framework-layer framework-institutions"><b>INSTITUCIONES Y RECURSOS</b><span>Tribunales · INDH · servicios públicos</span></div>
    </div>
    <div className="institution-photos">
      <Photo file="palacio-moneda.jpg" alt="Palacio de La Moneda en Santiago de Chile" caption="Ejecutivo" credit="Gobierno central" />
      <Photo file="congreso-valparaiso.jpg" alt="Edificio del Congreso Nacional de Chile en Valparaíso" caption="Legislativo" credit="Congreso Nacional" />
      <Photo file="tribunales-santiago.jpg" alt="Palacio de los Tribunales de Justicia de Santiago" caption="Judicial" credit="Poder Judicial" />
    </div>
  </div>;
}

function IndhVisual() {
  return <div className="indh-visual">
    <div className="indh-hub">
      <div className="indh-center"><span>INDH</span><small>autónomo</small></div>
      <div className="indh-spoke spoke-a"><b>OBSERVA</b><span>registra hechos</span></div>
      <div className="indh-spoke spoke-b"><b>INFORMA</b><span>informe anual</span></div>
      <div className="indh-spoke spoke-c"><b>RECOMIENDA</b><span>propone medidas</span></div>
      <div className="indh-spoke spoke-d"><b>ACUDE</b><span>acciones legales autorizadas</span></div>
      <svg viewBox="0 0 680 300" aria-hidden="true"><path d="M340 145 125 58M340 145 552 58M340 145 126 241M340 145 552 241" fill="none" stroke="#8e9abc" strokeDasharray="5 7" strokeWidth="2"/></svg>
    </div>
    <div className="indh-limit"><b>Su límite institucional</b><span>El INDH no investiga delitos comunes ni declara culpabilidad. Fiscalía investiga; tribunales deciden.</span></div>
    <Photo file="carabineras-chile.jpg" alt="Carabineras de Chile en un espacio público" caption="Institución observada" credit="Carabineras de Chile" />
  </div>;
}

function BranchesVisual() {
  return <div className="branches-visual">
    <svg viewBox="0 0 760 270" role="img" aria-label="Diagrama de separación y colaboración de los poderes del Estado">
      <path d="M145 131H615M250 100 379 49l130 51M250 169 379 219l130-50" fill="none" stroke="#7c88a1" strokeWidth="3"/>
      <circle cx="145" cy="131" r="68" fill="#e3edff" stroke="#526eff" strokeWidth="3"/>
      <circle cx="380" cy="44" r="66" fill="#fff0d8" stroke="#e8872b" strokeWidth="3"/>
      <circle cx="615" cy="131" r="68" fill="#dff4ef" stroke="#168d79" strokeWidth="3"/>
      <circle cx="380" cy="222" r="37" fill="#f3ecff" stroke="#9073db" strokeWidth="2"/>
      <g textAnchor="middle" fontFamily="Arial,sans-serif" fill="#17264a">
        <text x="145" y="127" fontSize="18" fontWeight="700">EJECUTIVO</text><text x="145" y="151" fontSize="13">administra</text>
        <text x="380" y="41" fontSize="18" fontWeight="700">LEGISLATIVO</text><text x="380" y="64" fontSize="13">legisla y fiscaliza</text>
        <text x="615" y="127" fontSize="18" fontWeight="700">JUDICIAL</text><text x="615" y="151" fontSize="13">resuelve causas</text>
        <text x="380" y="226" fontSize="10" fontWeight="700">DERECHOS</text>
      </g>
      <path d="M180 178c48 37 94 55 158 53M422 230c68 2 118-17 155-53M560 101c-29-29-56-43-115-51M315 49c-59 8-91 22-117 51" fill="none" stroke="#d66c51" strokeWidth="2.5" strokeDasharray="3 6"/>
    </svg>
    <div className="branches-legend"><span>Funciones distintas</span><span>Controles y límites jurídicos</span><span>Protección de derechos</span></div>
  </div>;
}

function HierarchyVisual() {
  const [active, setActive] = useState("corte");
  const details = {
    corte: ["Corte Suprema", "Encabeza el Poder Judicial y conoce recursos y materias que la Constitución y la ley le asignan."],
    apelaciones: ["Cortes de Apelaciones", "Revisan resoluciones recurribles en su territorio y conocen otros asuntos legales."],
    primera: ["Tribunales de primera instancia", "Conocen inicialmente causas según materia y competencia: penal, civil, laboral o familia."],
  };
  return <div className="hierarchy-visual">
    <div className="hierarchy-chart">
      {[
        ["corte","CORTE SUPREMA"],
        ["apelaciones","CORTES DE APELACIONES"],
        ["primera","TRIBUNALES DE PRIMERA INSTANCIA"],
      ].map(([id,label],i)=><div key={id} className="hierarchy-level">
        {i>0 && <div className="hierarchy-line"/>}
        <button className={active===id?"active":""} onClick={()=>setActive(id)}>{label}</button>
      </div>)}
      <div className="court-branches"><button onClick={()=>setActive("primera")}>Garantía</button><button onClick={()=>setActive("primera")}>TOP</button><button onClick={()=>setActive("primera")}>Civil</button><button onClick={()=>setActive("primera")}>Familia</button><button onClick={()=>setActive("primera")}>Laboral</button></div>
    </div>
    <div className="hierarchy-detail"><span>NIVEL SELECCIONADO</span><b>{details[active][0]}</b><p>{details[active][1]}</p><small>Una resolución solo sube si existe un recurso procedente.</small></div>
  </div>;
}

function CourtTypesVisual() {
  const [active,setActive] = useState("penal");
  const tabs = [
    ["penal","Penal"],["civil","Civil"],["family","Familia"],["labor","Laboral"],
  ];
  const detail={
    penal:["Garantía → TOP","Control judicial e investigación en las etapas previas; el juicio oral llega al TOP cuando corresponde."],
    civil:["Juzgado Civil","Contratos, obligaciones, cobros y otras controversias patrimoniales conforme a competencia."],
    family:["Juzgado de Familia","Alimentos, cuidado personal, relación directa y regular y protección familiar."],
    labor:["Juzgado Laboral","Conflictos de contratos, despidos, remuneraciones y seguridad social."],
  };
  return <div className="court-types-visual">
    <div className="court-tabs">{tabs.map(([id,label])=><button className={active===id?"active":""} key={id} onClick={()=>setActive(id)}>{label}</button>)}</div>
    <div className="court-type-detail"><div className="court-type-mark"><span>COMPETENCIA</span><b>{detail[active][0]}</b></div><p>{detail[active][1]}</p><small>El caso y la ley determinan la competencia precisa.</small></div>
    <Photo file="tribunales-santiago.jpg" alt="Vista del Palacio de los Tribunales de Justicia de Santiago" caption="Edificio judicial" credit="Chile · Santiago" />
  </div>;
}

const courtroomPeople = [
  { id:"judge", name:"Juez / tribunal", role:"Controla la audiencia; en juicio oral delibera y decide con independencia.", left:"48%", top:"8%" },
  { id:"fiscal", name:"Fiscalía", role:"Presenta la acusación y prueba; la Fiscalía dirige la investigación antes del juicio.", left:"19%", top:"54%" },
  { id:"defense", name:"Defensa", role:"Representa al acusado, controvierte pruebas y presenta argumentos.", left:"71%", top:"54%" },
  { id:"accused", name:"Acusado", role:"Persona acusada; conserva presunción de inocencia y puede ser representada por su defensa.", left:"71%", top:"76%" },
  { id:"victim", name:"Víctima / querellante", role:"Persona afectada; la víctima tiene derechos propios y puede participar como querellante bajo las reglas legales.", left:"19%", top:"76%" },
  { id:"witness", name:"Testigo", role:"Declara sobre hechos que conoce; no decide culpabilidad.", left:"48%", top:"35%" },
  { id:"police", name:"Policía", role:"Carabineros o PDI pueden ejecutar diligencias bajo dirección fiscal; no deciden el caso.", left:"89%", top:"30%" },
];

function CourtroomVisual() {
  const [person,setPerson] = useState(courtroomPeople[0]);
  return <div className="courtroom-visual">
    <div className="courtroom-map">
      <svg viewBox="0 0 760 380" role="img" aria-label="Planta esquemática de una sala de juicio oral">
        <rect x="55" y="28" width="650" height="323" rx="9" fill="#f7f4ec" stroke="#be9a63" strokeWidth="4"/>
        <path d="M80 58H680M80 317H680M178 154h147v90H178zM432 154h147v90H432z" fill="none" stroke="#967952" strokeWidth="3"/>
        <path d="M250 60v70M510 60v70M380 154v90M129 154v90M630 154v90" stroke="#b79a72" strokeWidth="2"/>
        <rect x="304" y="74" width="150" height="56" rx="7" fill="#dae6ff" stroke="#5876e9" strokeWidth="3"/>
        <rect x="185" y="162" width="132" height="58" rx="8" fill="#ffecd4" stroke="#e49134" strokeWidth="3"/>
        <rect x="443" y="162" width="132" height="58" rx="8" fill="#dff4ed" stroke="#198d79" strokeWidth="3"/>
        <rect x="320" y="168" width="120" height="63" rx="8" fill="#f0e9ff" stroke="#936dd3" strokeWidth="3"/>
        <rect x="440" y="272" width="132" height="35" rx="7" fill="#ffeadf" stroke="#d56f55" strokeWidth="2"/>
        <rect x="185" y="272" width="132" height="35" rx="7" fill="#e8eef6" stroke="#5c6d87" strokeWidth="2"/>
        <g fontFamily="Arial,sans-serif" fill="#20304d" fontWeight="700" textAnchor="middle">
          <text x="379" y="96" fontSize="15">TRIBUNAL</text><text x="379" y="115" fontSize="11">jueces</text>
          <text x="251" y="187" fontSize="14">FISCALÍA</text><text x="251" y="205" fontSize="10">parte acusadora</text>
          <text x="509" y="187" fontSize="14">DEFENSA</text><text x="509" y="205" fontSize="10">representación</text>
          <text x="380" y="193" fontSize="13">TESTIGO</text><text x="380" y="211" fontSize="10">declara</text>
          <text x="506" y="295" fontSize="12">ACUSADO</text><text x="251" y="295" fontSize="12">VÍCTIMA</text>
          <text x="654" y="90" fontSize="10">PÚBLICO</text>
        </g>
      </svg>
      {courtroomPeople.map((p)=><button key={p.id} className={"courtroom-hotspot "+(person.id===p.id?"active":"")} style={{left:p.left,top:p.top}} onClick={()=>setPerson(p)} aria-label={"Seleccionar "+p.name} title={p.name}/>)}
    </div>
    <div className="courtroom-person"><span>PARTICIPANTE SELECCIONADO</span><b>{person.name}</b><p>{person.role}</p></div>
  </div>;
}

function VocabularyVisual() {
  const [active,setActive]=useState("hitos");
  const lanes={
    hitos:["HECHO","DENUNCIA","INVESTIGA","FORMALIZA","ACUSA"],
    guarantees:["PRESUNCIÓN","DEFENSA","PRUEBA","DEBIDO PROCESO"],
    result:["VEREDICTO","SENTENCIA","RECURSO","EJECUCIÓN"],
  };
  return <div className="vocabulary-visual">
    <div className="vocabulary-tabs"><button className={active==="hitos"?"active":""} onClick={()=>setActive("hitos")}>Etapas</button><button className={active==="guarantees"?"active":""} onClick={()=>setActive("guarantees")}>Garantías</button><button className={active==="result"?"active":""} onClick={()=>setActive("result")}>Decisión</button></div>
    <div className="word-chain">{lanes[active].map((word,i)=><div className="word-step" key={word}><span>{String(i+1).padStart(2,"0")}</span><b>{word}</b>{i<lanes[active].length-1&&<i aria-hidden="true">→</i>}</div>)}</div>
    <div className="word-reminder">Observa el verbo y el momento procesal antes de elegir una definición.</div>
  </div>;
}

const timelineStages=[
  ["Noticia","Denuncia, querella o conocimiento de oficio."],
  ["Investiga","Fiscalía dirige; policías realizan diligencias legales."],
  ["Formaliza","Fiscal comunica ante Garantía hechos investigados."],
  ["Cierra","Fiscalía acusa, solicita salida o no persevera según proceda."],
  ["Prepara","Garantía define acusación y prueba; dicta auto de apertura."],
  ["Juzga","TOP escucha prueba oral, argumentos y testigos."],
  ["Decide","Veredicto, sentencia y recursos que la ley autorice."],
];
function TimelineVisual() {
  const [active,setActive]=useState(0);
  return <div className="timeline-visual">
    <div className="timeline-rail">{timelineStages.map(([title],i)=><button key={title} className={active===i?"active":""} onClick={()=>setActive(i)}><span>{i+1}</span><b>{title}</b></button>)}</div>
    <div className="timeline-detail"><div className="timeline-detail-number">{String(active+1).padStart(2,"0")}</div><div><span>ETAPA SELECCIONADA</span><h3>{timelineStages[active][0]}</h3><p>{timelineStages[active][1]}</p></div><small>El proceso puede terminar antes del juicio oral.</small></div>
    <Photo file="tribunales-santiago.jpg" alt="Palacio de Justicia en Santiago" caption="Etapas judiciales" credit="Control y decisión en tribunales" />
  </div>;
}

function ComicVisual() {
  return <div className="comic-visual">
    <div className="comic-lead-photo"><Photo file="puerto-montt-costanera.jpg" alt="Vista de Puerto Montt desde la costanera" caption="Puerto Montt · contexto del caso ficticio" credit="Vista de la ciudad" /></div>
    <div className="comic-panels">
      {[
        ["01","La denuncia","Camila aporta número de serie y registro."],
        ["02","La investigación","Fiscalía encarga diligencias legales."],
        ["03","La formalización","Se comunican hechos; no hay condena."],
        ["04","La defensa","Diego y su abogada revisan evidencia."],
        ["05","La decisión","El tribunal escucha prueba y decide."],
      ].map(([number,title,text])=><div className={"comic-panel comic-panel-"+number} key={number}><span>{number}</span><div className="comic-art" aria-hidden="true">{number==="01"||number==="04"?<svg viewBox="0 0 100 65"><circle cx="35" cy="17" r="12" fill="#e9ae81"/><path d="M16 62c3-24 10-34 19-34 13 0 20 12 22 34" fill="#5866d9"/><circle cx="70" cy="43" r="16" fill="none" stroke="#29324a" strokeWidth="4"/><path d="M84 54l10 8M52 41h31M61 30v25" stroke="#29324a" strokeWidth="3"/></svg>:number==="02"?<svg viewBox="0 0 100 65"><rect x="14" y="10" width="72" height="45" rx="5" fill="#dce7fb" stroke="#5272dd" strokeWidth="3"/><path d="m27 42 12-12 10 8 15-17" fill="none" stroke="#dc8250" strokeWidth="4"/><circle cx="69" cy="24" r="6" fill="#25a18e"/></svg>:number==="03"?<svg viewBox="0 0 100 65"><path d="M15 55h70M26 55V20h48v35M21 20h58l-29-13z" fill="#fff0d6" stroke="#e8872b" strokeWidth="3"/><circle cx="50" cy="34" r="8" fill="#7779d4"/></svg>:<svg viewBox="0 0 100 65"><path d="M50 6v53M50 13l-25 10m25-10 25 10M18 24l-10 22h21L18 24m64 0L71 46h22L82 24" fill="#eaf0ff" stroke="#5065c9" strokeWidth="3"/><path d="M7 48h22m42 0h22" stroke="#5065c9" strokeWidth="3"/></svg>}</div><b>{title}</b><p>{text}</p></div>)}
    </div>
  </div>;
}

function ChileMap() {
  const [selected,setSelected]=useState(13);
  const regionNotes=["Extremo norte y frontera andina.","Altiplano, costa y minería.","Norte grande y desierto.","Valles transversales y costa.","Valle transversal y costa.","Región portuaria y centro urbano.","Capital nacional y administración central.","Valle central y actividad agrícola.","Valle central y cuencas.","Zona centro-sur.","Concepción y cuencas industriales.","Zona lacustre y comunidades mapuche.","Región fluvial.","Los Lagos: volcanes, lagos, islas y maritorio.","Patagonia norte.","Patagonia austral y archipiélagos."];
  return <div className="map-panel">
    <div className="chile-map-shell">
      <svg viewBox="0 0 350 690" role="img" aria-label="Mapa esquemático interactivo de las regiones de Chile">
        <path d="M169 16C151 34 145 52 153 70l-17 18 14 26-18 19 24 18-16 21 22 19-13 22 18 20-12 22 15 22-11 24 17 20-9 27 16 17-11 23 18 18-13 21 16 23-12 22 19 19-8 23 20 16-9 25 18 21-12 22 20 20-11 24 20 19-10 25 24 18-12 22 22 17-10 25 28 22 15-31-11-23 16-24-14-22 16-23-13-24 14-24-12-25 13-22-12-24 13-25-12-24 12-24-13-23 14-24-14-23 14-24-12-25 14-21-12-22 15-21-12-24 14-21-15-21 16-20-14-20 16-20-15-22 18-19-13-21 18-20-16-19 16-19-13-20 17-20-15-22 17-22-17-18 18-18-18-17 15-22-17-18 14-19-14-20 14-17-12-19 6-17Z" fill={selected===13?"#1ca48e":"#81c9b9"} stroke="#127866" strokeWidth="4"/>
        {regionPoints.map(([x,y],i)=><g key={i} onClick={()=>setSelected(i)} className="map-point" role="button" tabIndex="0" aria-label={chileanRegions[i]} onKeyDown={(e)=>e.key==="Enter"&&setSelected(i)}><circle cx={x} cy={y} r={selected===i?11:7} fill={selected===i?"#f28c46":"#fff"} stroke="#164b53" strokeWidth="3"/>{selected===i&&<circle cx={x} cy={y} r="17" fill="none" stroke="#f28c46" strokeWidth="2" opacity=".7"/>}</g>)}
        <path d="M203 604c28 0 55 10 63 26-20 17-40 28-65 26l-11-18zM240 656l23-7 11 14-18 13z" fill="#b5d6e6" stroke="#668ea0"/>
        <text x="262" y="638" fill="#355563" fontSize="10" fontWeight="700">Aysén</text><text x="267" y="678" fill="#355563" fontSize="10" fontWeight="700">Antártica</text>
      </svg>
    </div>
    <div className="map-description"><span>MAPA ESQUEMÁTICO · NO A ESCALA</span><b>{chileanRegions[selected]}</b><p>{regionNotes[selected]}</p><div className="map-region-list">{chileanRegions.map((name,i)=><button key={name} className={i===selected?"active":""} onClick={()=>setSelected(i)}>{String(i+1).padStart(2,"0")} {name}</button>)}</div></div>
  </div>;
}

function LosLagosMap() {
  const [selected,setSelected]=useState("llanquihue");
  const provinces=[
    ["osorno","Osorno","Puyehue · Osorno · costa norte"],
    ["llanquihue","Llanquihue","Puerto Montt · Llanquihue · Calbuco"],
    ["chiloe","Chiloé","Archipiélago y canal de Chacao"],
    ["palena","Palena","Fiordos · Patagonia norte"],
  ];
  return <div className="los-lagos-map">
    <svg viewBox="0 0 430 350" role="img" aria-label="Mapa esquemático interactivo de las cuatro provincias de Los Lagos">
      <path d="M109 38 251 45 285 97 256 142 181 153 123 125Z" fill={selected==="osorno"?"#64b690":"#a9d5bd"} stroke="#27866c" strokeWidth="3"/>
      <path d="M181 153 256 142 303 197 256 244 175 230 142 190Z" fill={selected==="llanquihue"?"#4eaa90":"#b8dfca"} stroke="#27866c" strokeWidth="3"/>
      <path d="M74 155 132 151 125 277 88 319 67 268Z" fill={selected==="chiloe"?"#329c8d":"#a8d8cd"} stroke="#27866c" strokeWidth="3"/>
      <path d="M256 244 303 197 354 229 336 285 283 309 239 289Z" fill={selected==="palena"?"#18897d":"#add6d5"} stroke="#27866c" strokeWidth="3"/>
      <path d="M307 44c26 30 41 70 48 106M315 154c30 7 50 26 61 49M355 285l28 23" fill="none" stroke="#8bc4da" strokeWidth="8" strokeLinecap="round"/>
      {provinces.map(([id,name],i)=>{const c=[[193,93],[222,190],[94,229],[292,267]][i];return <g key={id} onClick={()=>setSelected(id)} role="button" tabIndex="0" aria-label={"Provincia de "+name} onKeyDown={(e)=>e.key==="Enter"&&setSelected(id)}><circle cx={c[0]} cy={c[1]} r={selected===id?19:14} fill={selected===id?"#f18c46":"#fff"} stroke="#176e61" strokeWidth="3"/><text x={c[0]} y={c[1]+4} textAnchor="middle" fill="#133c38" fontSize="12" fontWeight="700">{i+1}</text></g>})}
      <circle cx="250" cy="171" r="7" fill="#cd4d3c" stroke="white" strokeWidth="3"/><text x="260" y="167" fill="#7a352e" fontSize="11" fontWeight="700">Puerto Montt</text>
      <text x="20" y="341" fill="#6c817c" fontSize="9">Representación pedagógica · límites no catastrales</text>
    </svg>
    <div className="province-legend">{provinces.map(([id,name,sub],i)=><button key={id} className={selected===id?"active":""} onClick={()=>setSelected(id)}><span>{i+1}</span><b>{name}</b><small>{sub}</small></button>)}</div>
  </div>;
}

function MapsVisual() {
  const [tab,setTab]=useState("chile");
  return <div className="maps-visual">
    <div className="map-switch"><button className={tab==="chile"?"active":""} onClick={()=>setTab("chile")}>Chile · regiones</button><button className={tab==="lagos"?"active":""} onClick={()=>setTab("lagos")}>Los Lagos · provincias</button></div>
    {tab==="chile"?<ChileMap/>:<LosLagosMap/>}
    <div className="map-photo-band"><Photo file="parque-costanera-puerto-montt.jpg" alt="Bahía de Puerto Montt desde el parque Costanera" caption="Puerto Montt en su territorio costero" credit="Fotografía local · 2024"/></div>
  </div>;
}

function AuthoritiesVisual() {
  const [active,setActive]=useState(0);
  const authority=authorityDetails[active];
  return <div className="authorities-visual">
    <div className="authority-ribbon">
      {authorityDetails.map((a,i)=><button key={a.name} className={i===active?"active":""} onClick={()=>setActive(i)}><span>{a.type==="Electo"||a.type==="Electos"?"VOTO":"NOMBRAMIENTO"}</span><b>{a.name}</b></button>)}
    </div>
    <div className="authority-inspector"><div className="authority-seal">{active<2?"REGIÓN":active===4?"COMUNA":"GOBIERNO INTERIOR"}</div><div><span>{authority.type}</span><h3>{authority.name}</h3><p>{authority.body}</p></div></div>
    <div className="authority-photo-row"><Photo file="congreso-valparaiso.jpg" alt="Edificio del Congreso Nacional en Valparaíso" caption="Instituciones nacionales" credit="Poder Legislativo"/><Photo file="puerto-montt-historico.jpg" alt="Costanera histórica de Puerto Montt con la municipalidad al fondo" caption="Instituciones en la ciudad" credit="Puerto Montt · 1953"/></div>
  </div>;
}

function AdministrationVisual() {
  const [active,setActive]=useState("decentral");
  const rows=[
    ["central","CENTRALIZACIÓN","El centro concentra decisiones","Un ministerio define una prioridad nacional."],
    ["decentral","DESCENTRALIZACIÓN","Entidad territorial con competencias propias","GORE y municipio deciden dentro de su marco legal."],
    ["deconcentrated","DESCONCENTRACIÓN","Oficina territorial bajo jerarquía central","Una dirección regional ejecuta instrucciones ministeriales."],
    ["participation","PARTICIPACIÓN","Personas influyen y fiscalizan","Vecinos proponen en audiencia y solicitan información."],
  ];
  return <div className="administration-visual">
    <div className="admin-tabs">{rows.map(([id,label])=><button key={id} className={active===id?"active":""} onClick={()=>setActive(id)}>{label}</button>)}</div>
    <div className={"admin-scale admin-scale-"+active}>
      <div className="admin-center"><span>{rows.find((r)=>r[0]===active)[1]}</span><small>{rows.find((r)=>r[0]===active)[2]}</small></div>
      <div className="admin-people"><i/><i/><i/><i/></div>
    </div>
    <div className="admin-example"><b>Ejemplo</b><span>{rows.find((r)=>r[0]===active)[3]}</span></div>
  </div>;
}

const visualComponents={
  humanity:HumanityVisual, duties:DutiesVisual, distinction:DistinctionVisual, history:HistoryVisual,
  atlas:AtlasVisual, framework:FrameworkVisual, indh:IndhVisual, branches:BranchesVisual,
  hierarchy:HierarchyVisual, courttypes:CourtTypesVisual, courtroom:CourtroomVisual, vocabulary:VocabularyVisual,
  timeline:TimelineVisual, comic:ComicVisual, maps:MapsVisual, authorities:AuthoritiesVisual, administration:AdministrationVisual,
};
const visualNames={
  humanity:["ANATOMÍA DE LOS DERECHOS","Dignidad humana"],
  duties:["DIAGRAMA DE OBLIGACIONES","Respetar · proteger · garantizar"],
  distinction:["ÁRBOL DE ANÁLISIS","Actor, deber y respuesta"],
  history:["LÍNEA HISTÓRICA","El documento y su contexto"],
  atlas:["ATLAS INTERACTIVO","30 artículos, 7 familias"],
  framework:["MAPA DE FUENTES","Niveles de protección en Chile"],
  indh:["INDH · MANDATO","Lo que hace y lo que no puede hacer"],
  branches:["ESTADO DE DERECHO","Separar para limitar el poder"],
  hierarchy:["ORGANIGRAMA SELECCIONABLE","Revisión por competencia legal"],
  courttypes:["TRIBUNALES POR MATERIA","Escoge el conflicto"],
  courtroom:["PLANTA DE AUDIENCIA","Selecciona un participante"],
  vocabulary:["MAPA DE TÉRMINOS","Sigue la secuencia antes de responder"],
  timeline:["LÍNEA DE TIEMPO","Etapas y decisiones posibles"],
  comic:["CASO ILUSTRADO","Una bicicleta, cinco momentos"],
  maps:["MAPA INTERACTIVO","Chile y la Región de Los Lagos"],
  authorities:["INFOGRAFÍA TERRITORIAL","Electos y designados"],
  administration:["DIAGRAMA COMPARATIVO","Dónde se concentra la decisión"],
};

export function LessonVisual({ lesson }) {
  const Component=visualComponents[lesson.visual];
  const [eyebrow,title]=visualNames[lesson.visual];
  return <section className={"lesson-visual lesson-visual-"+lesson.visual} aria-label={title}>
    <div className="lesson-visual-heading"><span>{eyebrow}</span><h2>{title}</h2></div>
    <Component />
  </section>;
}
