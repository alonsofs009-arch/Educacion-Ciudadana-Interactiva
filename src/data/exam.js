// Distractors are built around common confusions between nearby legal concepts
// and institutional roles. Correct positions are balanced across the 32
// alternative questions so position alone cannot reveal the key.
const objectiveAnswerSlots = [2,0,3,1,3,2,1,0,1,3,0,2,0,1,2,3,3,0,2,1,2,3,1,0,1,2,0,3,0,1,3,2];
let objectiveQuestionIndex = 0;
const alternativeDecoys = {
  "dh-m1": [
    "La universalidad: ambos derechos corresponden a todas las personas, aunque la brecha educativa puede examinarse aparte de la participación.",
    "La igualdad formal: si la regla electoral es igual para todos, las diferencias de acceso a educación no alteran el ejercicio del voto.",
    "La progresividad: basta evaluar si el acceso a educación mejora con el tiempo, sin relacionarlo con la participación política.",
  ],
  "dh-m2": [
    "La DUDH es una declaración y el tratado es un pacto, pero solo este último importa jurídicamente cuando se incorpora a una ley interna.",
    "La ratificación vuelve vinculantes los derechos del tratado, mientras la DUDH posee el mismo rango convencional por haber sido proclamada por la ONU.",
    "La DUDH fijó el contenido inicial y el pacto lo desarrolla, por lo que los Estados solo responden por el tratado si aceptan cada caso individual.",
  ],
  "dh-m3": [
    "Libertad de pensamiento, conciencia y religión, artículo 18 de la DUDH.",
    "Reunión y asociación pacíficas, artículo 20 de la DUDH.",
    "Participación en el gobierno, artículo 21 de la DUDH.",
  ],
  "dh-m4": [
    "Artículo 9 y libertad personal; el artículo 8 se refiere a recursos frente a sentencias, no a privaciones de libertad.",
    "Artículo 10 y juicio imparcial; la falta de comunicación del motivo se revisa solo cuando comienza el juicio.",
    "Artículo 12 y vida privada; una retención sin motivo es principalmente una interferencia en el domicilio.",
  ],
  "dh-m5": [
    "Significa que ningún derecho admite regulación o límites, aunque sea necesario proteger los derechos de otras personas.",
    "Describe la universalidad: todas las personas son titulares, pero cada una puede ceder permanentemente su derecho si lo consiente.",
    "Describe la interdependencia: un derecho puede transferirse a otra persona siempre que se mantenga el resto del conjunto.",
  ],
  "dh-m6": [
    "Aprobó la Carta de las Naciones Unidas en 1945; el texto de la DUDH quedó adoptado como tratado por los Estados en 1948.",
    "Proclamó la DUDH y, mediante ese mismo acto, la convirtió en un pacto sujeto a ratificación individual de cada Estado.",
    "Redactó el texto en la Comisión de Derechos Humanos y luego la Corte Internacional de Justicia lo promulgó como sentencia.",
  ],
  "dh-m7": [
    "Artículo 11: presunción de inocencia y legalidad penal.",
    "Artículo 8: recurso efectivo ante tribunales competentes.",
    "Artículo 9: protección frente a detención, prisión o destierro arbitrarios.",
  ],
  "dh-m8": [
    "Respetar: prevenir daños de terceros; proteger: abstenerse de interferir; garantizar: ofrecer recursos y reparación.",
    "Respetar: abstenerse de interferir; proteger: organizar servicios públicos; garantizar: prevenir exclusivamente actos de particulares.",
    "Respetar: investigar a terceros; proteger: reconocer derechos en tratados; garantizar: evitar toda regulación del ejercicio.",
  ],
  "dh-m9": [
    "Es autónomo y puede informar, recomendar y presentar acciones; además dirige a Carabineros y PDI cuando observa delitos.",
    "Es autónomo y elabora informes; sus recomendaciones son sentencias obligatorias para los servicios públicos.",
    "Promueve derechos y realiza estudios, pero carece de atribuciones para interponer acciones judiciales ante tribunales.",
  ],
  "dh-m10": [
    "Artículo 19, que enumera derechos y libertades constitucionales.",
    "Artículo 20, que regula la acción de protección para ciertos derechos.",
    "Artículo 21, que regula el amparo o habeas corpus para la libertad personal.",
  ],
  "dh-c1": [
    "La regla es general, así que basta ofrecer el mismo acceso para todos; la barrera solo afecta igualdad si hubo intención explícita de excluir.",
    "Es un problema de infraestructura, pero no de educación ni de igualdad mientras la estudiante conserve su matrícula.",
    "La escuela no debe ajustar el espacio si no existe una prohibición escrita contra estudiantes con movilidad reducida.",
  ],
  "dh-c2": [
    "La empresa puede vulnerar derechos y, por ese solo hecho, toda la conducta se atribuye directamente al Estado aunque este haya investigado.",
    "Solo se aplica la legislación laboral porque los derechos humanos regulan relaciones entre autoridades y personas, no entre particulares.",
    "El INDH debe resolver el despido y ordenar la reincorporación, pues la actuación estatal ya agotó la vía judicial.",
  ],
  "dh-c3": [
    "El artículo 20 es pertinente, pero el artículo 19 no puede analizarse porque la reunión ocurre en un espacio público.",
    "La participación del artículo 21 es el derecho principal, ya que una reunión política equivale a votar por representantes.",
    "La autoridad puede restringirla por razones de orden público aunque el único motivo sea que las opiniones sean impopulares.",
  ],
  "dh-c4": [
    "La acción de protección del artículo 20, que cubre de forma general cualquier afectación de derechos y libertad personal.",
    "Una denuncia ante Fiscalía, que reemplaza la revisión judicial urgente de la legalidad de la detención.",
    "Una presentación ante el INDH, que puede ordenar directamente la liberación sin acudir a un tribunal.",
  ],
  "sj-m1": [
    "Los tribunales juzgan; el Ministerio Público dirige la investigación, pero la Defensoría decide si se presenta la acusación.",
    "Fiscalía dirige la investigación y controla la legalidad de las audiencias; los tribunales solo ejecutan la sentencia.",
    "Defensoría investiga para la persona imputada y los tribunales realizan las diligencias que solicita Fiscalía.",
  ],
  "sj-m2": [
    "Los tribunales deciden sin órdenes políticas y por eso sus resoluciones no pueden revisarse mediante recursos legales.",
    "La independencia protege frente a instrucciones del Ejecutivo, aunque el gobierno pueda orientar el resultado en causas de interés público.",
    "La independencia es una garantía del Poder Judicial como conjunto, pero cada juez puede recibir instrucciones sobre cómo resolver.",
  ],
  "sj-m3": [
    "Controlar las audiencias y revisar que la investigación fiscal reúna antecedentes suficientes antes de dirigir las diligencias policiales.",
    "Conocer el juicio y dictar el veredicto; las medidas cautelares se revisan solo después de que se pruebe la acusación.",
    "Representar los intereses de la víctima y decidir si Fiscalía debe presentar acusación al terminar la investigación.",
  ],
  "sj-m4": [
    "Comunica formalmente una acusación ya presentada y obliga al Tribunal Oral a realizar el juicio.",
    "Comunica hechos investigados ante el juez y acredita que Fiscalía tiene antecedentes suficientes para obtener una condena.",
    "Notifica una decisión judicial de apertura de juicio, aunque todavía no se haya definido qué hechos se investigan.",
  ],
  "sj-m5": [
    "Son decisiones provisionales que puede imponer Fiscalía si estima que existe riesgo, sujetas a revisión judicial posterior.",
    "Pueden restringir derechos antes de la sentencia y por eso constituyen una pena anticipada cuando se dicta prisión preventiva.",
    "Buscan asegurar el proceso y se justifican principalmente por la gravedad del delito, aunque no exista riesgo procesal específico.",
  ],
  "sj-m6": [
    "El veredicto fija los hechos probados; la sentencia decide culpabilidad y se limita a resumir la audiencia.",
    "El veredicto anuncia la decisión y la sentencia la fundamenta, pero Fiscalía determina en ella las consecuencias penales.",
    "El veredicto y la sentencia nombran la misma decisión; la diferencia depende de si se interpone un recurso.",
  ],
  "sj-m7": [
    "Corte Suprema, porque toda apelación de una decisión de primera instancia se presenta directamente ante el máximo tribunal.",
    "Juzgado de Garantía, que revisa las resoluciones apelables dictadas por cualquier tribunal inferior.",
    "Tribunal de Juicio Oral en lo Penal, que conoce los recursos contra decisiones de jueces de garantía.",
  ],
  "sj-m8": [
    "Juzgado Civil, porque la pensión de alimentos consiste en el cobro periódico de una obligación económica.",
    "Juzgado de Garantía, porque el incumplimiento de alimentos puede relacionarse con una investigación penal.",
    "Corte de Apelaciones, que conoce normalmente las demandas de alimentos como tribunal de primera instancia.",
  ],
  "sj-m9": [
    "Debe indagar hechos de cargo y descargo, pero solo incorporar los exculpatorios cuando la defensa los solicite expresamente.",
    "Debe mantener una postura neutral y dejar que la defensa reúna los antecedentes favorables a la persona imputada.",
    "Debe valorar la prueba en la audiencia y decidir qué hechos quedaron acreditados antes de formular acusación.",
  ],
  "sj-m10": [
    "La persona mantiene su condición de inocente, pero debe aportar prueba suficiente para refutar la imputación antes del juicio.",
    "La carga de probar recae en la acusación, aunque desde la formalización se presume provisionalmente la responsabilidad.",
    "La inocencia rige hasta la acusación; desde ese momento el tribunal debe partir de que la persona probablemente es culpable.",
  ],
  "sj-c1": [
    "Tomar declaración ampliada al testigo y postergar la verificación de la ubicación distinta hasta decidir si presenta acusación.",
    "Formalizar y pedir una cautelar, ya que un reconocimiento cercano al lugar del hecho basta para sostener participación.",
    "Cerrar la investigación por falta de certeza inmediata, sin comprobar si las dos ubicaciones pueden explicarse con nuevas diligencias.",
  ],
  "sj-c2": [
    "Condenar si la acusación parece más probable que la hipótesis de inocencia, aunque subsista una duda razonable.",
    "Absolver únicamente cuando la defensa acredita de manera positiva quién cometió el delito en realidad.",
    "Mantener la cautelar hasta que aparezca nueva prueba, porque la falta de certeza impide emitir un veredicto.",
  ],
  "sj-c3": [
    "Formalización ante Garantía; al cerrar la investigación, ese hito reemplaza la acusación y permite ir a juicio oral.",
    "Auto de apertura de juicio oral, que Fiscalía presenta al Tribunal Oral para definir los hechos probados.",
    "Solicitud de procedimiento abreviado, necesaria en todas las causas en que Fiscalía considera posible obtener condena.",
  ],
  "tr-m1": [
    "Región → comuna → provincia.",
    "Provincia → región → comuna.",
    "Comuna → provincia → región.",
  ],
  "tr-m2": [
    "Es comuna y capital regional, pero pertenece a la Provincia de Osorno.",
    "Es comuna y capital de Llanquihue, pero la capital regional de Los Lagos está en Osorno.",
    "Es ciudad portuaria de la Región de Los Ríos y capital de la Provincia de Llanquihue.",
  ],
  "tr-m3": [
    "Gobernador regional y delegado presidencial regional son designados por el Presidente, pero el primero preside el CORE.",
    "Gobernador regional y delegado presidencial regional son electos; el primero encabeza el GORE y el segundo el gobierno interior.",
    "El CORE elige al delegado presidencial regional y el Presidente designa al gobernador regional.",
  ],
  "tr-m4": [
    "Descentralización: el servicio se instala en la región y conserva dependencia jerárquica del ministerio central.",
    "Delegación presidencial: cualquier oficina regional de un ministerio pasa a tener autonomía y patrimonio propios.",
    "Descentralización fiscal: se trasladan recursos y tareas a un servicio regional que sigue sujeto a órdenes del nivel central.",
  ],
  "tr-c1": [
    "La plaza corresponde al municipio; la ruta intercomunal es competencia exclusiva del Gobierno Regional, sin coordinación sectorial.",
    "La plaza y la ruta son municipales porque ambas afectan principalmente a residentes de Puerto Montt, aunque la ruta cruce comunas.",
    "La plaza es municipal y la ruta debe resolverla el CORE, que dirige directamente el transporte público regional.",
  ],
};

const q = (id, unit, type, prompt, options, answer, explanation, extra = {}) => {
  if (options?.length === 4 && (type === "mc" || type === "case")) {
    const correctOption = options[answer];
    const decoys = alternativeDecoys[id] ?? options.filter((_, index) => index !== answer);
    options = [correctOption, ...decoys];
    answer = objectiveAnswerSlots[objectiveQuestionIndex++];
    [options[0], options[answer]] = [options[answer], options[0]];
  }
  return { id, unit, type, prompt, options, answer, explanation, ...extra };
};

export const examQuestions = [
  q("dh-m1","ddhh","mc","Una ley protege la participación electoral, pero no hay acceso efectivo a educación para un grupo rural. ¿Qué idea permite analizar mejor el problema?",["La indivisibilidad: una privación social puede dificultar el ejercicio de derechos políticos.","La inalienabilidad: basta con que nadie venda su derecho a voto.","La nacionalidad: todo problema educativo se resuelve por ciudadanía.","La formalización: el acceso requiere decisión de un juez penal."],0,"Los derechos son interdependientes: educación y participación se refuerzan, aunque cada derecho conserve su contenido."),
  q("dh-m2","ddhh","mc","Un Estado ratifica un tratado de derechos humanos y este entra en vigor para el país. ¿Qué afirmación distingue mejor esa fuente de la DUDH?",["El tratado crea obligaciones convencionales para el Estado parte; la DUDH es una declaración con enorme influencia y efectos jurídicos que deben describirse con precisión.","La DUDH es el tratado ratificado, mientras el pacto es una recomendación.","Ambos documentos tienen idéntica forma jurídica porque mencionan derechos.","El tratado solo tiene efectos si cada persona lo firma individualmente."],0,"La DUDH fue proclamada como declaración; un tratado ratificado y vigente obliga al Estado según sus disposiciones."),
  q("dh-m3","ddhh","mc","Una autoridad prohíbe toda crítica a un programa municipal, sin explicar una base legal ni un riesgo concreto. ¿Qué derecho se afecta de manera más directa?",["Opinión y expresión, artículo 19 de la DUDH.","Educación, artículo 26 de la DUDH.","Propiedad, artículo 17 de la DUDH.","Nacionalidad, artículo 15 de la DUDH."],0,"La restricción se refiere directamente a expresar una opinión; su validez requiere análisis jurídico, no una prohibición general."),
  q("dh-m4","ddhh","mc","Un funcionario ordena retener a una persona sin fundamento legal y no permite conocer el motivo. ¿Qué combinación de garantías se relaciona más directamente?",["Libertad y seguridad personal, prohibición de arbitrariedad y posibilidad de recurso efectivo.","Propiedad privada, cultura y descanso semanal.","Educación, trabajo y participación científica.","Nacionalidad, asilo y formación de una familia."],0,"Los artículos 3, 8 y 9 conectan libertad, seguridad, recurso y protección frente a detención arbitraria."),
  q("dh-m5","ddhh","mc","¿Cuál respuesta describe mejor qué significa que los derechos sean inalienables?",["No pueden venderse ni retirarse arbitrariamente; el ejercicio puede tener límites legales compatibles con otros derechos.","Una persona puede renunciar a todos sus derechos en un contrato privado.","El Estado puede suspenderlos sin base legal cuando lo estime conveniente.","Cada derecho se transfiere a otra persona si cambia el domicilio."],0,"La titularidad no se vende ni se pierde arbitrariamente; el ejercicio concreto puede regularse con criterios jurídicos."),
  q("dh-m6","ddhh","mc","¿Qué función corresponde a la Asamblea General de la ONU respecto de la DUDH?",["Proclamó la Declaración Universal el 10 de diciembre de 1948.","Ratificó en 1948 un tratado chileno llamado DUDH.","Creó el INDH chileno mediante la Ley 20.405.","Dictó sentencias obligatorias para tribunales nacionales."],0,"La Asamblea General proclamó la DUDH en París en 1948; la Ley 20.405 creó después el INDH chileno."),
  q("dh-m7","ddhh","mc","Una pregunta describe una audiencia pública ante tribunal independiente e imparcial. ¿Qué artículo de la DUDH es el más específico?",["Artículo 10.","Artículo 11.","Artículo 20.","Artículo 30."],0,"El artículo 10 aborda una audiencia justa y pública ante tribunal independiente e imparcial."),
  q("dh-m8","ddhh","mc","¿Cuál conjunto expresa con mayor precisión los deberes del Estado?",["Respetar: no interferir ilegítimamente; proteger: actuar frente a terceros; garantizar: organizar condiciones y tutela efectiva.","Respetar: castigar a toda empresa; proteger: sustituir tribunales; garantizar: evitar cualquier conflicto.","Respetar: dictar condena; proteger: acusar; garantizar: realizar diligencias policiales.","Respetar: elegir autoridades; proteger: redactar tratados; garantizar: abolir todo límite."],0,"Los tres deberes son distintos y se complementan: abstención, protección diligente frente a terceros y organización de garantías."),
  q("dh-m9","ddhh","mc","¿Qué afirmación sobre el INDH es correcta?",["Es autónomo, elabora informes y puede ejercer acciones judiciales delimitadas por ley; no es fiscalía ni tribunal.","Depende de los jueces y puede condenar funcionarios en sus informes.","Investiga todos los delitos comunes y dirige a la policía en cada causa.","Es una oficina municipal que decide sobre presupuestos regionales."],0,"La Ley 20.405 establece autonomía, promoción y protección, informes y acciones legales dentro de competencias; no le entrega función de juzgar."),
  q("dh-m10","ddhh","mc","¿Qué artículo de la Constitución chilena impone a los órganos del Estado el deber de respetar y promover derechos garantizados por la Constitución y tratados ratificados y vigentes?",["Artículo 5, inciso segundo.","Artículo 21 de la DUDH.","Artículo 76, inciso primero.","Artículo 20 del Código Procesal Penal."],0,"El artículo 5 inciso segundo incluye ese deber y limita el ejercicio de la soberanía por derechos esenciales."),
  q("dh-c1","ddhh","case","Un colegio solo permite participar en una actividad a estudiantes que puedan subir una escalera; la sala no tiene otra entrada. ¿Cuál análisis es más completo?",["La situación puede afectar igualdad y educación; pregunta qué ajustes razonables y medidas de garantía permiten acceso efectivo.","No hay problema de derechos porque la regla es igual para todas las personas.","Solo existe un conflicto entre estudiantes, sin deber institucional.","La estudiante pierde sus derechos al no poder entrar a esa sala."],0,"La igualdad formal de una regla no elimina barreras. Examina derechos relacionados y medidas accesibles que debe adoptar la institución."),
  q("dh-c2","ddhh","case","Una empresa despide a una trabajadora al saber que está embarazada. Ella reclama y el Estado investiga con diligencia y ofrece vías de reparación. ¿Qué lectura distingue responsabilidades?",["La empresa puede vulnerar igualdad y derechos laborales; la actuación diligente del Estado debe analizarse separadamente.","El acto privado se convierte automáticamente en violación directa del Estado aunque este responda.","No puede existir vulneración porque solo el Estado afecta derechos.","El INDH debe reemplazar a los tribunales y ordenar la reincorporación."],0,"La conducta privada puede ser una vulneración; la obligación estatal de proteger y la respuesta ofrecida son un plano distinto."),
  q("dh-c3","ddhh","case","Un grupo pide reunirse pacíficamente en una plaza y la autoridad lo prohíbe solo porque algunas personas sostienen opiniones impopulares. ¿Qué lectura es más sólida?",["Puede afectar reunión pacífica (art. 20) y expresión (art. 19); la restricción requiere fundamento legal compatible con derechos.","Solo está involucrado el artículo 26, porque las plazas son educativas.","La autoridad siempre puede prohibir reuniones según la popularidad del mensaje.","La DUDH permite suprimir derechos cuando una mayoría discrepa."],0,"La situación compromete libertades públicas; cualquier límite debe analizarse bajo reglas legales y no por impopularidad."),
  q("dh-c4","ddhh","case","Una persona es detenida; la familia no sabe dónde está y solicita una revisión urgente de su libertad. ¿Qué vía constitucional chilena se relaciona más directamente?",["El amparo del artículo 21, sin perjuicio de otros procedimientos aplicables.","El recurso de protección del artículo 20 como vía universal para cualquier situación.","Una querella ante el Consejo Regional.","Una apelación a la Fiscalía para que dicte sentencia."],0,"El artículo 21 regula amparo o habeas corpus para proteger libertad y seguridad individual."),
  q("dh-v1","ddhh","vf","La Declaración Universal de 1948 contiene 30 artículos y, en sentido formal, es un tratado ratificado por Chile.","",true,"Tiene 30 artículos, pero es una declaración proclamada por la Asamblea General; no se ratifica como tratado. Los tratados posteriores sí pueden generar obligaciones convencionales."),
  q("dh-d1","ddhh","develop","Compara una vulneración cometida por una empresa con una posible violación atribuible al Estado. Explica qué preguntas permiten distinguirlas y da un ejemplo.",null,null,"Una respuesta sólida identifica el derecho afectado, al actor privado o estatal, el deber estatal correspondiente y la respuesta de las instituciones. No atribuye automáticamente al Estado todo acto privado.",{rubric:["Identifica una vulneración o derecho afectado con precisión.","Distingue acción privada de conducta atribuible al Estado u omisión estatal.","Explica el deber de proteger o garantizar y la respuesta que debe analizarse.","Aplica la diferencia a un ejemplo concreto y coherente."],model:"Una empresa puede discriminar a una trabajadora y vulnerar igualdad y derechos laborales. Eso no se atribuye automáticamente al Estado. Hay que examinar si las autoridades tenían deberes de prevención y ofrecieron investigación y tutela eficaces. Si un agente estatal ejerce violencia directamente, se analiza una conducta atribuible al Estado y, por separado, la responsabilidad individual del agente."}),

  q("sj-m1","justicia","mc","¿Cuál opción diferencia correctamente Poder Judicial y Ministerio Público?",["Los tribunales juzgan; el Ministerio Público, autónomo, dirige la investigación penal y ejerce acción pública cuando corresponde.","Ambos son tribunales y pueden dictar condenas indistintamente.","Fiscalía depende de la Corte Suprema y solo representa a víctimas.","Los jueces realizan todas las diligencias de investigación y Fiscalía resuelve recursos."],0,"Investigar y acusar corresponde a Fiscalía; conocer y resolver causas corresponde a tribunales."),
  q("sj-m2","justicia","mc","¿Qué describe mejor la independencia judicial?",["Los tribunales deciden casos conforme a derecho y prueba sin órdenes políticas sobre el resultado; siguen sujetos a competencias y recursos legales.","Los jueces pueden decidir sin ley ni revisión de ningún tipo.","El gobierno puede dirigir la sentencia mientras no la publique.","La independencia elimina toda relación jerárquica o superintendencia judicial."],0,"Independencia protege la decisión imparcial frente a presiones; no significa ausencia de ley o control jurisdiccional."),
  q("sj-m3","justicia","mc","¿Qué función corresponde al Juzgado de Garantía durante la investigación penal?",["Controlar derechos y legalidad, dirigir audiencias y resolver medidas cautelares.","Investigar delitos y ordenar a Fiscalía qué hechos probar.","Realizar todas las causas civiles y de familia.","Representar a la víctima en lugar de su abogado."],0,"Garantía controla derechos y dirige audiencias de etapas previas; Fiscalía investiga."),
  q("sj-m4","justicia","mc","Una persona escucha que el fiscal formalizó a alguien y concluye que ya fue condenado. ¿Cuál corrección es precisa?",["La formalización comunica ante el juez los hechos investigados respecto de una persona; no decide culpabilidad.","Formalizar es la decisión del TOP que fija la pena.","La formalización equivale a presentar denuncia por la víctima.","Toda formalización obliga a celebrar juicio oral y condenar."],0,"La formalización no es acusación ni condena; la presunción de inocencia permanece."),
  q("sj-m5","justicia","mc","¿Qué afirmación sobre medidas cautelares es correcta?",["Son decisiones provisionales sujetas a ley y control judicial; no constituyen por sí mismas una pena.","Son penas definitivas que impone Fiscalía antes de juicio.","Las determina unilateralmente la víctima con su querella.","Se usan para demostrar culpabilidad sin necesidad de juicio."],0,"La cautelar busca fines procesales y requiere fundamento; no anticipa una sentencia condenatoria."),
  q("sj-m6","justicia","mc","En un juicio oral penal, ¿qué diferencia veredicto y sentencia?",["El veredicto resuelve culpabilidad o absolución; la sentencia fundamenta y establece las consecuencias jurídicas.","El veredicto inicia la denuncia; la sentencia formaliza la investigación.","El veredicto lo formula Fiscalía y la sentencia la dicta la defensa.","Son nombres intercambiables para una medida cautelar."],0,"La decisión sobre culpabilidad precede a la sentencia fundada con consecuencias jurídicas."),
  q("sj-m7","justicia","mc","La defensa solicita revisar una resolución recurrible de primera instancia. ¿Qué órgano suele conocer una apelación en la jurisdicción correspondiente?",["Corte de Apelaciones.","Ministerio Público.","Consejo Regional.","Defensoría Penal Pública."],0,"La Corte de Apelaciones revisa resoluciones apelables cuando la ley contempla ese recurso."),
  q("sj-m8","justicia","mc","¿Qué tribunal conoce normalmente una demanda de alimentos?",["Juzgado de Familia.","Juzgado de Garantía.","Tribunal de Juicio Oral en lo Penal.","Corte Suprema como primera instancia general."],0,"Alimentos y cuidado corresponden a competencia de familia."),
  q("sj-m9","justicia","mc","¿Qué significa que Fiscalía actúe con objetividad en la investigación?",["Debe reunir antecedentes que puedan confirmar la ocurrencia y participación y también antecedentes que puedan apoyar la inocencia.","Debe defender al imputado y retirar todas las acusaciones.","Debe aceptar como verdadera toda denuncia.","Debe dictar una sentencia antes de que intervenga un juez."],0,"La objetividad exige investigar antecedentes incriminatorios y exculpatorios con sujeción a la ley."),
  q("sj-m10","justicia","mc","¿Qué derecho expresa la presunción de inocencia?",["La acusación debe probar la culpabilidad; hasta una condena dictada conforme a derecho la persona mantiene su condición de inocente.","Toda denuncia debe terminar en absolución automática.","La persona acusada debe demostrar su inocencia para iniciar un juicio.","La formalización crea una presunción de culpabilidad."],0,"La carga de probar recae en la acusación; la persona conserva presunción de inocencia durante el proceso."),
  q("sj-c1","justicia","case","Un testigo identifica a una persona cerca de una bicicleta sustraída, pero otra evidencia ubica esa bicicleta en un sitio distinto. ¿Qué debe hacer Fiscalía?",["Investigar ambas líneas y valorar evidencia de cargo y descargo antes de decidir si acusa.","Ignorar la evidencia que no coincide con la hipótesis inicial.","Pedir al testigo que dicte una condena.","Formalizar equivale a probar todos los elementos del delito."],0,"La Fiscalía debe indagar con objetividad; una pista no basta para cerrar la investigación ni para condenar."),
  q("sj-c2","justicia","case","En el juicio, la prueba no permite superar la duda razonable sobre quién tomó una bicicleta. ¿Cuál decisión es compatible con la presunción de inocencia?",["Absolver, porque la acusación no alcanzó el estándar requerido para condenar.","Condenar para compensar la pérdida de la víctima.","Entregar el veredicto al fiscal que investigó.","Mantener cautelar indefinidamente en reemplazo de una sentencia."],0,"La duda razonable impide una condena penal; el tribunal independiente debe absolver."),
  q("sj-c3","justicia","case","Tras cerrar la investigación de un hurto, Fiscalía concluye que tiene antecedentes suficientes para someter a la persona a juicio. ¿Qué hito debe presentar antes del juicio?",["Acusación; luego Garantía prepara el juicio y define la prueba admisible.","Sentencia condenatoria dictada por Fiscalía.","Veredicto de la policía.","Querella de la víctima como requisito universal de todo juicio."],0,"Fiscalía presenta acusación; después sigue la audiencia de preparación ante Garantía y, si procede, el juicio."),
  q("sj-v1","justicia","vf","La Defensoría Penal Pública representa a personas imputadas que no cuentan con defensa particular, y Fiscalía dirige la investigación penal.","",true,"Ambas funciones están correctamente atribuidas, aunque la prestación de defensa puede tener copagos excepcionales para personas con recursos."),
  q("sj-v2","justicia","vf","Toda causa penal debe terminar necesariamente en un juicio oral ante un Tribunal de Juicio Oral en lo Penal.","",false,"Una causa puede terminar antes mediante decisiones fiscales, sobreseimiento o salidas alternativas previstas por la ley; existen procedimientos simplificados y abreviados."),
  q("sj-d1","justicia","develop","Describe el recorrido desde una denuncia hasta un posible juicio oral. Distingue las funciones de Fiscalía, policías, defensa, Juzgado de Garantía y Tribunal Oral.",null,null,"La respuesta debe presentar etapas en orden y separar investigar, controlar garantías, preparar prueba, juzgar y sentenciar.",{rubric:["Ordena noticia del delito, investigación y formalización.","Asigna a Fiscalía dirección de investigación y a policías diligencias.","Explica defensa y control de Garantía, incluida preparación del juicio.","Describe audiencia oral, decisión del TOP y reconoce salidas previas posibles."],model:"Una denuncia comunica hechos y puede iniciar investigación. Fiscalía dirige diligencias de Carabineros o PDI e investiga a favor y en contra. Si procede, formaliza ante Garantía, que controla derechos y cautelares. Al cierre, Fiscalía acusa o solicita una salida legal; no toda causa llega a juicio. Si acusa, Garantía prepara la prueba y dicta auto de apertura. El TOP escucha a Fiscalía, defensa y testigos, delibera, emite veredicto y dicta sentencia."}),

  q("tr-m1","territorio","mc","¿Cuál es el orden correcto de la división político-administrativa de mayor a menor?",["Región → provincia → comuna.","Comuna → región → provincia.","Provincia → comuna → región.","Región → comuna → provincia."],0,"La organización se ordena en regiones, provincias y comunas."),
  q("tr-m2","territorio","mc","¿Qué descripción de Puerto Montt es correcta?",["Es comuna, capital de la Región de Los Lagos y de la Provincia de Llanquihue.","Es una provincia y una delegación presidencial.","Es una región separada de Los Lagos.","Es solo una localidad sin administración municipal."],0,"Puerto Montt es comuna y cabecera regional y provincial."),
  q("tr-m3","territorio","mc","¿Qué relación entre elección y cargo es correcta?",["Gobernador regional es electo; delegado presidencial regional es designado por el Presidente.","Gobernador regional es designado; delegado regional es electo.","Ambos son elegidos por el CORE.","El alcalde es designado por el delegado provincial."],0,"El gobernador representa el ejecutivo regional electo; el delegado representa al gobierno central y es designado."),
  q("tr-m4","territorio","mc","Una oficina regional de un ministerio sigue bajo la dirección jerárquica central. ¿Qué concepto describe mejor esa distribución?",["Desconcentración.","Descentralización territorial.","Federalismo.","Participación ciudadana."],0,"La desconcentración distribuye tareas territorialmente dentro de una estructura central jerárquica."),
  q("tr-c1","territorio","case","Vecinas de Puerto Montt proponen reparar una plaza barrial y una ruta de buses que conecta varias comunas. ¿Cuál análisis institucional es mejor?",["La plaza se relaciona principalmente con el municipio; la ruta intercomunal puede exigir coordinación regional y sectorial según competencias.","Ambas decisiones dependen exclusivamente de la Fiscalía.","La plaza debe resolverla el TOP y la ruta el delegado provincial en todo caso.","Puerto Montt es una región y por eso su alcalde decide ambas."],0,"La escala y materia orientan competencias; asuntos comunales y políticas intercomunales pueden implicar instituciones distintas."),
  q("tr-v1","territorio","vf","El Consejo Regional participa en la aprobación de planes, presupuesto e inversiones regionales y fiscaliza actos del Gobierno Regional conforme a sus atribuciones.","",true,"El CORE tiene funciones de aprobación y fiscalización previstas en la ley; no reemplaza al gobernador como órgano ejecutivo."),
  q("tr-d1","territorio","develop","Compara descentralización y desconcentración. Usa un ejemplo de Los Lagos y explica cómo puede participar la ciudadanía en una decisión territorial.",null,null,"La respuesta debe diferenciar entidad territorial con competencias/autonomía de una oficina central con dependencia jerárquica, y proponer un mecanismo realista de participación.",{rubric:["Define correctamente descentralización territorial.","Define correctamente desconcentración y señala permanencia de jerarquía central.","Aplica ambos conceptos a un ejemplo institucional de Los Lagos.","Describe un canal de participación o fiscalización y sus límites."],model:"El Gobierno Regional de Los Lagos es una entidad territorial descentralizada: gobernador electo y CORE ejercen competencias regionales. Una oficina de un ministerio en Puerto Montt puede ser desconcentrada si sigue instrucciones jerárquicas del nivel central. Vecinos pueden intervenir en una audiencia o consulta, organizarse y solicitar información; el efecto de cada mecanismo depende de la ley."}),
  q("tr-d2","territorio","develop","Una comunidad solicita coordinación de servicios centrales en la región, aprobación de un plan regional y reparación de una plaza comunal. Identifica la autoridad principal para cada tarea y justifica.",null,null,"Debe distinguir representante del Ejecutivo central, Gobierno Regional y nivel municipal, explicando sus competencias generales.",{rubric:["Asigna coordinación de servicios centrales al delegado presidencial regional.","Asigna políticas/planes regionales al gobernador y participación aprobatoria al CORE.","Asigna gestión de plaza comunal a Municipalidad y alcalde, con rol del concejo.","Justifica selección electa/designada y reconoce que la competencia concreta depende de la ley."],model:"El delegado presidencial regional, designado, representa al Presidente y coordina servicios del gobierno central. El gobernador regional, electo, formula estrategias y políticas de desarrollo; el CORE participa en su aprobación y fiscalización según la ley. La Municipalidad, dirigida por el alcalde y con acuerdos y control del concejo, gestiona asuntos comunales como la plaza dentro de sus atribuciones."}),
];

export const examTypes = { mc: "Selección múltiple", case: "Caso aplicado", vf: "Verdadero o falso", develop: "Desarrollo breve" };

export const examBlueprint = [
  { label: "Derechos Humanos", unit: "ddhh", count: 16, color: "#536dff" },
  { label: "Sistema Judicial", unit: "justicia", count: 16, color: "#e8872b" },
  { label: "Territorio y Ciudadanía", unit: "territorio", count: 8, color: "#168d79" },
];

export const scoreBreakdown = { alternatives: 32, trueFalse: 8, development: 16, total: 56, passingPoints: 34, exactPassPercent: 60 };

export const calculateGrade = (score) => {
  const s = Math.max(0, Math.min(56, Number(score) || 0));
  if (s < 34) return Math.round((1 + (s / 34) * 3) * 10) / 10;
  return Math.round((4 + ((s - 34) / 22) * 3) * 10) / 10;
};
