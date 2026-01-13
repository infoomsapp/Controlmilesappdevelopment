// i18n Service - Internationalization for ControlMiles

export type Language = 'en' | 'es' | 'zh' | 'am' | 'ar' | 'fr' | 'pt';

interface Translations {
  // App General
  appName: string;
  
  // Dashboard
  dashboard: string;
  milestoday: string;
  incomeToday: string;
  estimatedDeduction: string;
  startTracking: string;
  stopTracking: string;
  tracking: string;
  applyCorrection: string;
  earnings: string;
  viewHistory: string;
  
  // Requirements
  requirements: string;
  completeBeforeStart: string;
  odometerPhotoInitial: string;
  photoCaptured: string;
  captureOdometerPhoto: string;
  activeGigApp: string;
  selectGigApp: string;
  readyToStart: string;
  
  // Corrections
  mileageCorrection: string;
  immutableRecords: string;
  originalMiles: string;
  totalCorrections: string;
  displayedMiles: string;
  correctionHistory: string;
  applyNewCorrection: string;
  adjustmentMiles: string;
  correctionReason: string;
  protected: string;
  
  // Permissions
  permissionsRequired: string;
  forPhysicalActivity: string;
  locationGPS: string;
  physicalActivity: string;
  camera: string;
  allowAccess: string;
  cancel: string;
  
  // Gig Apps
  selectActiveGig: string;
  
  // Toast Messages
  permissionsGranted: string;
  photosCaptured: string;
  trackingStarted: string;
  mustCapturePhoto: string;
  mustSelectGig: string;
  
  // Common
  close: string;
  apply: string;
  save: string;
  delete: string;
  edit: string;
  
  // Gig App Types
  gigAppRideshare: string;
  gigAppDelivery: string;
  gigAppPersonalCommute: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'ControlMiles',
    dashboard: 'Dashboard',
    milestoday: 'Miles Today',
    incomeToday: 'Income Today',
    estimatedDeduction: 'Estimated Deduction',
    startTracking: 'Start Tracking',
    stopTracking: 'Stop Tracking',
    tracking: 'Tracking',
    applyCorrection: 'Apply Correction',
    earnings: 'Earnings',
    viewHistory: 'View History',
    requirements: 'Requirements to Start Tracking',
    completeBeforeStart: 'Complete these steps before starting',
    odometerPhotoInitial: '1. Initial Odometer Photo',
    photoCaptured: 'Photo captured - Odometer:',
    captureOdometerPhoto: 'Capture odometer photo at the start of your shift',
    activeGigApp: '2. Active Gig App',
    selectGigApp: 'Select the gig app you are using',
    readyToStart: 'All set to start GPS tracking',
    mileageCorrection: 'Apply Mileage Correction',
    immutableRecords: 'Immutable and Auditable Correction System',
    originalMiles: 'Original Miles (Immutable)',
    totalCorrections: 'Total Corrections',
    displayedMiles: 'Displayed Miles',
    correctionHistory: 'Correction History',
    applyNewCorrection: 'New Correction',
    adjustmentMiles: 'Miles Adjustment',
    correctionReason: 'Correction Reason (Min. 10 characters)',
    protected: 'Protected',
    permissionsRequired: 'Permissions Required',
    forPhysicalActivity: 'To track your physical activity',
    locationGPS: 'GPS Location',
    physicalActivity: 'Physical Activity & Motion',
    camera: 'Camera',
    allowAccess: 'Allow Access',
    cancel: 'Cancel',
    selectActiveGig: 'Select Active Gig App',
    permissionsGranted: 'Permissions granted successfully',
    photosCaptured: 'Initial photo captured successfully',
    trackingStarted: 'Tracking started with',
    mustCapturePhoto: 'You must capture the initial odometer photo first',
    mustSelectGig: 'You must select the active gig app first',
    close: 'Close',
    apply: 'Apply',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    gigAppRideshare: 'Rideshare / Taxi',
    gigAppDelivery: 'Delivery',
    gigAppPersonalCommute: 'Personal Commute',
  },
  es: {
    appName: 'ControlMiles',
    dashboard: 'Panel Principal',
    milestoday: 'Millas Hoy',
    incomeToday: 'Ingresos Hoy',
    estimatedDeduction: 'Deducción Estimada',
    startTracking: 'Iniciar Rastreo',
    stopTracking: 'Detener Rastreo',
    tracking: 'Rastreando',
    applyCorrection: 'Aplicar Corrección',
    earnings: 'Ganancias',
    viewHistory: 'Ver Historial',
    requirements: 'Requisitos para Iniciar Rastreo',
    completeBeforeStart: 'Completa estos pasos antes de comenzar',
    odometerPhotoInitial: '1. Foto Inicial del Odómetro',
    photoCaptured: 'Foto capturada - Odómetro:',
    captureOdometerPhoto: 'Captura la foto del odómetro al inicio de tu jornada',
    activeGigApp: '2. App Gig Activa',
    selectGigApp: 'Selecciona la app gig que estás usando',
    readyToStart: 'Todo listo para iniciar el rastreo GPS',
    mileageCorrection: 'Aplicar Corrección de Millaje',
    immutableRecords: 'Sistema de correcciones inmutables y auditables',
    originalMiles: 'Millas Originales (Inmutables)',
    totalCorrections: 'Total de Correcciones',
    displayedMiles: 'Millas Mostradas',
    correctionHistory: 'Historial de Correcciones',
    applyNewCorrection: 'Nueva Corrección',
    adjustmentMiles: 'Ajuste de Millas',
    correctionReason: 'Razón de la Corrección (Mín. 10 caracteres)',
    protected: 'Protegidas',
    permissionsRequired: 'Permisos Requeridos',
    forPhysicalActivity: 'Para rastrear tu actividad física',
    locationGPS: 'Ubicación GPS',
    physicalActivity: 'Actividad Física y Movimiento',
    camera: 'Cámara',
    allowAccess: 'Permitir Acceso',
    cancel: 'Cancelar',
    selectActiveGig: 'Seleccionar App Gig Activa',
    permissionsGranted: 'Permisos concedidos correctamente',
    photosCaptured: 'Foto inicial capturada correctamente',
    trackingStarted: 'Rastreo iniciado con',
    mustCapturePhoto: 'Debes capturar la foto inicial del odómetro primero',
    mustSelectGig: 'Debes seleccionar la app gig activa primero',
    close: 'Cerrar',
    apply: 'Aplicar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    gigAppRideshare: 'Transporte / Taxi',
    gigAppDelivery: 'Entrega',
    gigAppPersonalCommute: 'Uso Personal/Trabajo',
  },
  zh: {
    appName: 'ControlMiles',
    dashboard: '仪表板',
    milestoday: '今日英里',
    incomeToday: '今日收入',
    estimatedDeduction: '估计扣除',
    startTracking: '开始追踪',
    stopTracking: '停止追踪',
    tracking: '追踪中',
    applyCorrection: '应用更正',
    earnings: '收入',
    viewHistory: '查看历史',
    requirements: '开始追踪要求',
    completeBeforeStart: '开始前完成这些步骤',
    odometerPhotoInitial: '1. 初始里程表照片',
    photoCaptured: '照片已捕获 - 里程表：',
    captureOdometerPhoto: '在轮班开始时拍摄里程表照片',
    activeGigApp: '2. 活动零工应用',
    selectGigApp: '选择您正在使用的零工应用',
    readyToStart: '准备好开始GPS追踪',
    mileageCorrection: '应用里程更正',
    immutableRecords: '不可变和可审计的更正系统',
    originalMiles: '原始英里（不可变）',
    totalCorrections: '总更正',
    displayedMiles: '显示英里',
    correctionHistory: '更正历史',
    applyNewCorrection: '新更正',
    adjustmentMiles: '英里调整',
    correctionReason: '更正原因（最少10个字符）',
    protected: '受保护',
    permissionsRequired: '需要权限',
    forPhysicalActivity: '追踪您的身体活动',
    locationGPS: 'GPS位置',
    physicalActivity: '身体活动和运动',
    camera: '相机',
    allowAccess: '允许访问',
    cancel: '取消',
    selectActiveGig: '选择活动零工应用',
    permissionsGranted: '权限已成功授予',
    photosCaptured: '初始照片已成功捕获',
    trackingStarted: '追踪已开始',
    mustCapturePhoto: '您必须先捕获初始里程表照片',
    mustSelectGig: '您必须先选择活动零工应用',
    close: '关闭',
    apply: '应用',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    gigAppRideshare: '共乘/出租车',
    gigAppDelivery: '配送',
    gigAppPersonalCommute: '个人通勤',
  },
  am: {
    appName: 'ControlMiles',
    dashboard: 'ዳሽቦርድ',
    milestoday: 'ዛሬ ማይልስ',
    incomeToday: 'ዛሬ ገቢ',
    estimatedDeduction: 'የተገመተ ቅናሽ',
    startTracking: 'ክትትል ጀምር',
    stopTracking: 'ክትትል አቁም',
    tracking: 'በመከታተል ላይ',
    applyCorrection: 'ማስተካከያ ተግብር',
    earnings: 'ገቢዎች',
    viewHistory: 'ታሪክ አሳይ',
    requirements: 'ክትትል ለመጀመር መስፈርቶች',
    completeBeforeStart: 'ከመጀመርዎ በፊት እነዚህን ደረጃዎች ያጠናቅቁ',
    odometerPhotoInitial: '1. የመጀመሪያ ኦዶሜትር ፎቶ',
    photoCaptured: 'ፎቶ ተይዟል - ኦዶሜትር፡',
    captureOdometerPhoto: 'በሽፍትዎ መጀመሪያ ላይ የኦዶሜትር ፎቶ ያንሱ',
    activeGigApp: '2. ንቁ ጊግ መተግበሪያ',
    selectGigApp: 'እየተጠቀሙበት ያለውን ጊግ መተግበሪያ ይምረጡ',
    readyToStart: 'የጂፒኤስ ክትትል ለመጀመር ሁሉም ዝግጁ ነው',
    mileageCorrection: 'የማይልስ ማስተካከያ ተግብር',
    immutableRecords: 'የማይለወጥ እና ሊመረመር የሚችል የማስተካከያ ስርዓት',
    originalMiles: 'ዋና ማይልስ (የማይለወጥ)',
    totalCorrections: 'ጠቅላላ ማስተካከያዎች',
    displayedMiles: 'የታዩ ማይልስ',
    correctionHistory: 'የማስተካከያ ታሪክ',
    applyNewCorrection: 'አዲስ ማስተካከያ',
    adjustmentMiles: 'የማይልስ ማስተካከያ',
    correctionReason: 'የማስተካከያ ምክንያት (ቢያንስ 10 ቁምፊዎች)',
    protected: 'የተጠበቀ',
    permissionsRequired: 'ፈቃዶች ያስፈልጋሉ',
    forPhysicalActivity: 'የአካል እንቅስቃሴዎን ለመከታተል',
    locationGPS: 'የጂፒኤስ አካባቢ',
    physicalActivity: 'የአካል እንቅስቃሴ እና እንቅስቃሴ',
    camera: 'ካሜራ',
    allowAccess: 'መዳረሻ ፍቀድ',
    cancel: 'ሰርዝ',
    selectActiveGig: 'ንቁ ጊግ መተግበሪያ ምረጥ',
    permissionsGranted: 'ፈቃዶች በተሳካ ሁኔታ ተሰጥተዋል',
    photosCaptured: 'የመጀመሪያ ፎቶ በተሳካ ሁኔታ ተይዟል',
    trackingStarted: 'ክትትል ተጀምሯል ከ',
    mustCapturePhoto: 'መጀመሪያ የመጀመሪያውን የኦዶሜትር ፎቶ መያዝ አለብዎት',
    mustSelectGig: 'መጀመሪያ ንቁውን ጊግ መተግበሪያ መምረጥ አለብዎት',
    close: 'ዝጋ',
    apply: 'ተግብር',
    save: 'አስቀምጥ',
    delete: 'አጥፋ',
    edit: 'አርትዕ',
    gigAppRideshare: 'መጓጓዣ / ታክሲ',
    gigAppDelivery: 'አቅርቦት',
    gigAppPersonalCommute: 'የግል ጉዞ',
  },
  ar: {
    appName: 'ControlMiles',
    dashboard: 'لوحة القيادة',
    milestoday: 'أميال ا��يوم',
    incomeToday: 'دخل اليوم',
    estimatedDeduction: 'الخصم المقدر',
    startTracking: 'بدء التتبع',
    stopTracking: 'إيقاف التتبع',
    tracking: 'جاري التتبع',
    applyCorrection: 'تطبيق التصحيح',
    earnings: 'الأرباح',
    viewHistory: 'عرض السجل',
    requirements: 'متطلبات بدء التتبع',
    completeBeforeStart: 'أكمل هذه الخطوات قبل البدء',
    odometerPhotoInitial: '1. صورة عداد المسافات الأولية',
    photoCaptured: 'تم التقاط الصورة - عداد المسافات:',
    captureOdometerPhoto: 'التقط صورة عداد المسافات في بداية نوبتك',
    activeGigApp: '2. تطبيق العمل النشط',
    selectGigApp: 'حدد تطبيق العمل الذي تستخدمه',
    readyToStart: 'جاهز لبدء تتبع GPS',
    mileageCorrection: 'تطبيق تصحيح المسافة',
    immutableRecords: 'نظام تصحيح ثابت وقابل للمراجعة',
    originalMiles: 'الأميال الأصلية (ثابتة)',
    totalCorrections: 'إجمالي التصحيحات',
    displayedMiles: 'الأميال المعروضة',
    correctionHistory: 'سجل التصحيحات',
    applyNewCorrection: 'تصحيح جديد',
    adjustmentMiles: 'تعديل الأميال',
    correctionReason: 'سبب التصحيح (10 أحرف على الأقل)',
    protected: 'محمي',
    permissionsRequired: 'الأذونات المطلوبة',
    forPhysicalActivity: 'لتتبع نشاطك البدني',
    locationGPS: 'موقع GPS',
    physicalActivity: 'النشاط البدني والحركة',
    camera: 'الكاميرا',
    allowAccess: 'السماح بالوصول',
    cancel: 'إلغاء',
    selectActiveGig: 'حدد تطبيق العمل النشط',
    permissionsGranted: 'تم منح الأذونات بنجاح',
    photosCaptured: 'تم التقاط الصورة الأولية بنجاح',
    trackingStarted: 'بدأ التتبع مع',
    mustCapturePhoto: 'يجب عليك التقاط صورة عداد المسافات الأولية أولاً',
    mustSelectGig: 'يجب عليك تحديد تطبيق العمل النشط أولاً',
    close: 'إغلاق',
    apply: 'تطبيق',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    gigAppRideshare: 'مشاركة الركوب / تاكسي',
    gigAppDelivery: 'التوصيل',
    gigAppPersonalCommute: 'التنقل الشخصي',
  },
  fr: {
    appName: 'ControlMiles',
    dashboard: 'Tableau de bord',
    milestoday: 'Miles aujourd\'hui',
    incomeToday: 'Revenu aujourd\'hui',
    estimatedDeduction: 'Déduction estimée',
    startTracking: 'Démarrer le suivi',
    stopTracking: 'Arrêter le suivi',
    tracking: 'Suivi en cours',
    applyCorrection: 'Appliquer la correction',
    earnings: 'Gains',
    viewHistory: 'Voir l\'historique',
    requirements: 'Exigences pour démarrer le suivi',
    completeBeforeStart: 'Complétez ces étapes avant de commencer',
    odometerPhotoInitial: '1. Photo initiale de l\'odomètre',
    photoCaptured: 'Photo capturée - Odomètre:',
    captureOdometerPhoto: 'Capturez la photo de l\'odomètre au début de votre quart',
    activeGigApp: '2. Application de travail active',
    selectGigApp: 'Sélectionnez l\'application que vous utilisez',
    readyToStart: 'Prêt à démarrer le suivi GPS',
    mileageCorrection: 'Appliquer la correction de kilométrage',
    immutableRecords: 'Système de correction immuable et vérifiable',
    originalMiles: 'Miles originaux (Immuables)',
    totalCorrections: 'Total des corrections',
    displayedMiles: 'Miles affichés',
    correctionHistory: 'Historique des corrections',
    applyNewCorrection: 'Nouvelle correction',
    adjustmentMiles: 'Ajustement des miles',
    correctionReason: 'Raison de la correction (Min. 10 caractères)',
    protected: 'Protégé',
    permissionsRequired: 'Autorisations requises',
    forPhysicalActivity: 'Pour suivre votre activité physique',
    locationGPS: 'Localisation GPS',
    physicalActivity: 'Activité physique et mouvement',
    camera: 'Caméra',
    allowAccess: 'Autoriser l\'accès',
    cancel: 'Annuler',
    selectActiveGig: 'Sélectionner l\'application active',
    permissionsGranted: 'Autorisations accordées avec succès',
    photosCaptured: 'Photo initiale capturée avec succès',
    trackingStarted: 'Suivi commencé avec',
    mustCapturePhoto: 'Vous devez d\'abord capturer la photo initiale de l\'odomètre',
    mustSelectGig: 'Vous devez d\'abord sélectionner l\'application active',
    close: 'Fermer',
    apply: 'Appliquer',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    gigAppRideshare: 'Covoiturage / Taxi',
    gigAppDelivery: 'Livraison',
    gigAppPersonalCommute: 'Trajet personnel',
  },
  pt: {
    appName: 'ControlMiles',
    dashboard: 'Painel',
    milestoday: 'Milhas Hoje',
    incomeToday: 'Renda Hoje',
    estimatedDeduction: 'Dedução Estimada',
    startTracking: 'Iniciar Rastreamento',
    stopTracking: 'Parar Rastreamento',
    tracking: 'Rastreando',
    applyCorrection: 'Aplicar Correção',
    earnings: 'Ganhos',
    viewHistory: 'Ver Histórico',
    requirements: 'Requisitos para Iniciar Rastreamento',
    completeBeforeStart: 'Complete estas etapas antes de começar',
    odometerPhotoInitial: '1. Foto Inicial do Odômetro',
    photoCaptured: 'Foto capturada - Odômetro:',
    captureOdometerPhoto: 'Capture a foto do odômetro no início do seu turno',
    activeGigApp: '2. Aplicativo de Trabalho Ativo',
    selectGigApp: 'Selecione o aplicativo que você está usando',
    readyToStart: 'Pronto para iniciar o rastreamento GPS',
    mileageCorrection: 'Aplicar Correção de Quilometragem',
    immutableRecords: 'Sistema de correção imutável e auditável',
    originalMiles: 'Milhas Originais (Imutáveis)',
    totalCorrections: 'Total de Correções',
    displayedMiles: 'Milhas Exibidas',
    correctionHistory: 'Histórico de Correções',
    applyNewCorrection: 'Nova Correção',
    adjustmentMiles: 'Ajuste de Milhas',
    correctionReason: 'Motivo da Correção (Mín. 10 caracteres)',
    protected: 'Protegido',
    permissionsRequired: 'Permissões Necessárias',
    forPhysicalActivity: 'Para rastrear sua atividade física',
    locationGPS: 'Localização GPS',
    physicalActivity: 'Atividade Física e Movimento',
    camera: 'Câmera',
    allowAccess: 'Permitir Acesso',
    cancel: 'Cancelar',
    selectActiveGig: 'Selecionar Aplicativo Ativo',
    permissionsGranted: 'Permissões concedidas com sucesso',
    photosCaptured: 'Foto inicial capturada com sucesso',
    trackingStarted: 'Rastreamento iniciado com',
    mustCapturePhoto: 'Você deve capturar a foto inicial do odômetro primeiro',
    mustSelectGig: 'Você deve selecionar o aplicativo ativo primeiro',
    close: 'Fechar',
    apply: 'Aplicar',
    save: 'Salvar',
    delete: 'Excluir',
    edit: 'Editar',
    gigAppRideshare: 'Compartilhamento / Táxi',
    gigAppDelivery: 'Entrega',
    gigAppPersonalCommute: 'Deslocamento Pessoal',
  },
};

let currentLanguage: Language = 'en'; // Default to English

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  localStorage.setItem('controlmiles_language', lang);
}

export function getLanguage(): Language {
  const stored = localStorage.getItem('controlmiles_language') as Language;
  return stored || 'en';
}

export function t(key: keyof Translations): string {
  const lang = getLanguage();
  return translations[lang][key] || translations.en[key] || key;
}

// Initialize language from localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('controlmiles_language');
  if (stored) {
    currentLanguage = stored as Language;
  }
}
