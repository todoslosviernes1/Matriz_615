import { DomainMeta, ModalTask, TaskPriority } from '../types';

export const DOMAINS: DomainMeta[] = [
  {
    id: 'prod_eng',
    name: 'Producto & Ingeniería',
    code: 'PRD',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    iconName: 'Cpu',
    substages: [
      { id: 'sub_0', name: 'Planificación de Producto y PRDs', domainId: 'prod_eng', indexInDomain: 0, globalSubstageIndex: 0 },
      { id: 'sub_1', name: 'Arquitectura de Software y Datos', domainId: 'prod_eng', indexInDomain: 1, globalSubstageIndex: 1 },
      { id: 'sub_2', name: 'Ingeniería de APIs y Servicios', domainId: 'prod_eng', indexInDomain: 2, globalSubstageIndex: 2 },
      { id: 'sub_3', name: 'Control de Calidad (QA) y Testing', domainId: 'prod_eng', indexInDomain: 3, globalSubstageIndex: 3 },
      { id: 'sub_4', name: 'DevOps, CI/CD y Cloud Ingress', domainId: 'prod_eng', indexInDomain: 4, globalSubstageIndex: 4 },
    ],
  },
  {
    id: 'ops_fin',
    name: 'Operaciones & Finanzas',
    code: 'OPS',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    iconName: 'Briefcase',
    substages: [
      { id: 'sub_5', name: 'Modelado Financiero y Presupuestos', domainId: 'ops_fin', indexInDomain: 0, globalSubstageIndex: 5 },
      { id: 'sub_6', name: 'Cadena de Suministro y Proveedores', domainId: 'ops_fin', indexInDomain: 1, globalSubstageIndex: 6 },
      { id: 'sub_7', name: 'Gestión de Riesgos y Continuidad', domainId: 'ops_fin', indexInDomain: 2, globalSubstageIndex: 7 },
      { id: 'sub_8', name: 'Monitoreo de SLAs y Costes Cloud', domainId: 'ops_fin', indexInDomain: 3, globalSubstageIndex: 8 },
      { id: 'sub_9', name: 'Auditoría Interna y Controles SOX', domainId: 'ops_fin', indexInDomain: 4, globalSubstageIndex: 9 },
    ],
  },
  {
    id: 'mkt_growth',
    name: 'Crecimiento & Marketing',
    code: 'MKT',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    iconName: 'TrendingUp',
    substages: [
      { id: 'sub_10', name: 'Inteligencia de Mercado y Competencia', domainId: 'mkt_growth', indexInDomain: 0, globalSubstageIndex: 10 },
      { id: 'sub_11', name: 'Estrategia de Contenidos y SEO/SEM', domainId: 'mkt_growth', indexInDomain: 1, globalSubstageIndex: 11 },
      { id: 'sub_12', name: 'Campañas de Adquisición Multicanal', domainId: 'mkt_growth', indexInDomain: 2, globalSubstageIndex: 12 },
      { id: 'sub_13', name: 'Pipeline Comercial y Cierre B2B', domainId: 'mkt_growth', indexInDomain: 3, globalSubstageIndex: 13 },
      { id: 'sub_14', name: 'Retención, Fidelización y Net Churn', domainId: 'mkt_growth', indexInDomain: 4, globalSubstageIndex: 14 },
    ],
  },
  {
    id: 'people_gov',
    name: 'Talento & Gobernanza',
    code: 'GOV',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
    iconName: 'ShieldCheck',
    substages: [
      { id: 'sub_15', name: 'Atracción y Selección de Talento', domainId: 'people_gov', indexInDomain: 0, globalSubstageIndex: 15 },
      { id: 'sub_16', name: 'Onboarding Técnico y Planes 30-60-90', domainId: 'people_gov', indexInDomain: 1, globalSubstageIndex: 16 },
      { id: 'sub_17', name: 'Evaluación de Rendimiento y OKRs', domainId: 'people_gov', indexInDomain: 2, globalSubstageIndex: 17 },
      { id: 'sub_18', name: 'Cumplimiento Legal, RGPD y Privacidad', domainId: 'people_gov', indexInDomain: 3, globalSubstageIndex: 18 },
      { id: 'sub_19', name: 'Gobernanza Corporativa y Consejo', domainId: 'people_gov', indexInDomain: 4, globalSubstageIndex: 19 },
    ],
  },
  {
    id: 'rnd_scale',
    name: 'I+D & Alta Escala',
    code: 'RND',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
    iconName: 'Atom',
    substages: [
      { id: 'sub_20', name: 'Spikes de Investigación e Hipótesis', domainId: 'rnd_scale', indexInDomain: 0, globalSubstageIndex: 20 },
      { id: 'sub_21', name: 'Prototipado Rápido y Sandboxes', domainId: 'rnd_scale', indexInDomain: 1, globalSubstageIndex: 21 },
      { id: 'sub_22', name: 'Propiedad Intelectual y Patentes', domainId: 'rnd_scale', indexInDomain: 2, globalSubstageIndex: 22 },
      { id: 'sub_23', name: 'Pruebas de Estrés y Alta Concurrencia', domainId: 'rnd_scale', indexInDomain: 3, globalSubstageIndex: 23 },
      { id: 'sub_24', name: 'Estrategia de Escalado Global y Resiliencia', domainId: 'rnd_scale', indexInDomain: 4, globalSubstageIndex: 24 },
    ],
  },
];

// Flattened list of 25 substages
export const ALL_SUBSTAGES = DOMAINS.flatMap((d) => d.substages);

// 25 Specialized Operational Action Archetypes (Rows in each substage)
const TASK_ARCHETYPES = [
  { prefix: 'Definición de Alcance y Criterios de Aceptación', tag: 'Alcance', hours: 6, priority: 'high' as TaskPriority, complexity: 3 },
  { prefix: 'Análisis de Riesgos Críticos y Dependencias', tag: 'Riesgos', hours: 8, priority: 'critical' as TaskPriority, complexity: 4 },
  { prefix: 'Diseño de Especificación Técnica & Diagrama de Flujo', tag: 'Especificación', hours: 12, priority: 'high' as TaskPriority, complexity: 4 },
  { prefix: 'Validación de Conformidad Normativa y Cumplimiento', tag: 'Compliance', hours: 5, priority: 'medium' as TaskPriority, complexity: 3 },
  { prefix: 'Revisión Cruzada de Arquitectura y Peer Review', tag: 'Revisión', hours: 4, priority: 'medium' as TaskPriority, complexity: 3 },
  { prefix: 'Ejecución de Sandbox y Validación de Pruebas de Concepto', tag: 'PoC', hours: 16, priority: 'high' as TaskPriority, complexity: 4 },
  { prefix: 'Definición de Métricas Clave y Cuadro de Mando (KPIs)', tag: 'Métricas', hours: 6, priority: 'medium' as TaskPriority, complexity: 2 },
  { prefix: 'Elaboración de Plan de Contingencia y Rollback', tag: 'Seguridad', hours: 8, priority: 'critical' as TaskPriority, complexity: 5 },
  { prefix: 'Optimización de Rendimiento y Benchmark de Latencia', tag: 'Performance', hours: 10, priority: 'medium' as TaskPriority, complexity: 3 },
  { prefix: 'Auditoría de Seguridad y Vector de Vulnerabilidades', tag: 'Seguridad', hours: 14, priority: 'critical' as TaskPriority, complexity: 5 },
  { prefix: 'Documentación Operativa y Guía de Despliegue', tag: 'Documentación', hours: 5, priority: 'low' as TaskPriority, complexity: 2 },
  { prefix: 'Evaluación de Impacto Presupuestario y TCO', tag: 'Costes', hours: 6, priority: 'medium' as TaskPriority, complexity: 3 },
  { prefix: 'Configuración de Alertas y Telemetría en Tiempo Real', tag: 'Monitoreo', hours: 7, priority: 'high' as TaskPriority, complexity: 3 },
  { prefix: 'Pruebas de Carga y Simulación de Caídas del Sistema', tag: 'Resiliencia', hours: 15, priority: 'high' as TaskPriority, complexity: 4 },
  { prefix: 'Capacitación a Equipos Operativos y Stakeholders', tag: 'Training', hours: 6, priority: 'low' as TaskPriority, complexity: 2 },
  { prefix: 'Estandarización de Procesos y Plantillas Automatizadas', tag: 'Automatización', hours: 9, priority: 'medium' as TaskPriority, complexity: 3 },
  { prefix: 'Mapeo de Integraciones y Contratos de Interfaces', tag: 'Integraciones', hours: 11, priority: 'high' as TaskPriority, complexity: 4 },
  { prefix: 'Validación de Accesibilidad y Ergonomía Funcional', tag: 'UX/Calidad', hours: 6, priority: 'low' as TaskPriority, complexity: 2 },
  { prefix: 'Negociación y Acuerdos de Nivel de Servicio (SLA)', tag: 'SLA', hours: 8, priority: 'medium' as TaskPriority, complexity: 3 },
  { prefix: 'Pruebas de Regresión y Automatización de Casos de Uso', tag: 'QA', hours: 12, priority: 'high' as TaskPriority, complexity: 4 },
  { prefix: 'Revisión de Licenciamiento y Restricciones de Terceros', tag: 'Legal', hours: 4, priority: 'medium' as TaskPriority, complexity: 2 },
  { prefix: 'Plan de Comunicación de Cambios para Usuarios Finales', tag: 'Comunicación', hours: 5, priority: 'low' as TaskPriority, complexity: 2 },
  { prefix: 'Inspección de Cuellos de Botella y Optimización de Flujo', tag: 'Eficiencia', hours: 10, priority: 'high' as TaskPriority, complexity: 4 },
  { prefix: 'Firma de Aprobación Formal y Entrega de Entregable', tag: 'Sign-off', hours: 3, priority: 'high' as TaskPriority, complexity: 3 },
  { prefix: 'Sesión Post-Mortem y Registro de Lecciones Aprendidas', tag: 'Mejora Continua', hours: 4, priority: 'low' as TaskPriority, complexity: 2 },
];

// Helper to format ID to "MOD-001"
export const formatModalCode = (id: number): string => {
  return `MOD-${String(id).padStart(3, '0')}`;
};

// Generate all 625 modals programmatically with deterministic, high-fidelity content
export const generateAllModals = (): ModalTask[] => {
  const modals: ModalTask[] = [];

  for (let substageIdx = 0; substageIdx < 25; substageIdx++) {
    const substage = ALL_SUBSTAGES[substageIdx];
    const domain = DOMAINS.find((d) => d.id === substage.domainId)!;

    for (let taskIdx = 0; taskIdx < 25; taskIdx++) {
      const globalId = substageIdx * 25 + taskIdx + 1; // 1..625
      const code = formatModalCode(globalId);
      const archetype = TASK_ARCHETYPES[taskIdx];

      const title = `${archetype.prefix} en ${substage.name}`;
      const objective = `Estructurar, ejecutar y auditar el protocolo de "${archetype.prefix}" correspondiente a la etapa de ${substage.name} bajo el dominio estratégico de ${domain.name}, garantizando estándares de calidad, trazabilidad y gobernanza operativa.`;
      
      const protocolGuidelines = `1. Revisar los pre-requisitos de la sub-etapa "${substage.name}".\n2. Ejecutar la lista de verificación metodológica y documentar evidencias verificables.\n3. Evaluar el impacto en el sistema antes de autorizar transiciones de estado.\n4. Notificar a las partes interesadas mediante el resumen estructurado de este modal.`;

      const defaultChecklist = [
        `Verificar documentación previa y dependencias de entrada para ${archetype.tag}`,
        `Convocar y alinear a los responsables técnicos y de negocio`,
        `Ejecutar protocolo específico de validación según normativas vigentes`,
        `Comprobar métricas cuantitativas y criterios de éxito definidos`,
        `Archivar evidencias y registrar el estado en la bitácora operativa`,
      ];

      modals.push({
        id: globalId,
        code,
        title,
        domainId: domain.id,
        domainName: domain.name,
        substageId: substage.id,
        substageName: substage.name,
        objective,
        protocolGuidelines,
        defaultPriority: archetype.priority,
        complexity: archetype.complexity as 1 | 2 | 3 | 4 | 5,
        estimatedHours: archetype.hours,
        tags: [domain.code, archetype.tag, `Etapa-${substageIdx + 1}`],
        defaultChecklist,
      });
    }
  }

  return modals;
};

// Single memoized cache of 625 tasks for instant synchronous performance
export const ALL_MODALS: ModalTask[] = generateAllModals();

export const MODAL_BY_ID: Record<number, ModalTask> = ALL_MODALS.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {} as Record<number, ModalTask>);

export const getModalById = (id: number): ModalTask | undefined => {
  return MODAL_BY_ID[id];
};

export const getModalByCode = (code: string): ModalTask | undefined => {
  const clean = code.trim().toUpperCase();
  const num = parseInt(clean.replace('MOD-', '').replace('#', ''), 10);
  if (!isNaN(num) && num >= 1 && num <= 625) {
    return MODAL_BY_ID[num];
  }
  return undefined;
};
