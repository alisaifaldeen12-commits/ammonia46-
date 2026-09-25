// Types and Data Models for Unit Operations DCS Center (التشغيل المركزي للأقسام)

export type SectionId = 
  | 'sec_desulf'
  | 'sec_reformer'
  | 'sec_comp_k301'
  | 'sec_comp_k302'
  | 'sec_comp_k303'
  | 'sec_comp_k401'
  | 'sec_purif'
  | 'sec_synloop';

export type ControllerMode = 'AUTO' | 'MAN' | 'CAS';
export type SectionStatus = 'SHUTDOWN' | 'WARMING' | 'RUNNING' | 'TRIPPED';

export interface AlarmLimits {
  hh?: number; // High-High (ESD Trip)
  h?: number;  // High Alarm
  l?: number;  // Low Alarm
  ll?: number; // Low-Low (ESD Trip)
}

export interface PIDTuning {
  kp: number; // Proportional Gain
  ti: number; // Integral Time (seconds)
  td: number; // Derivative Time (seconds)
}

export interface ControllerPoint {
  tag: string;
  nameEn: string;
  nameAr: string;
  type: 'PIC' | 'FIC' | 'FRC' | 'TRC' | 'TIC' | 'LIC' | 'SIC' | 'HIC' | 'ARC' | 'PDC';
  unit: string;
  min: number;
  max: number;
  decimals: number;
  sp: number;        // Set Point
  pv: number;        // Process Variable
  mv: number;        // Manipulated Variable (0 - 100% Valve / Output)
  mode: ControllerMode;
  alarms: AlarmLimits;
  pid: PIDTuning;
  history: { time: number; sp: number; pv: number; mv: number }[];
  description: string;
  valveTag?: string;
  isTripped?: boolean;
}

export interface SectionKPI {
  id: string;
  labelAr: string;
  labelEn: string;
  value: number | string;
  unit: string;
  status: 'normal' | 'warn' | 'alarm';
}

export interface DisturbanceScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  severity: 'low' | 'medium' | 'critical';
  applied: boolean;
  effect: (controllers: Record<string, ControllerPoint>, state: any) => void;
  recoveryHintAr: string;
}

export interface UnitSectionData {
  id: SectionId;
  category: 'feed' | 'reforming' | 'compressors' | 'purification' | 'synthesis';
  numberStr: string;
  nameAr: string;
  nameEn: string;
  equipmentSummary: string;
  descriptionAr: string;
  status: SectionStatus;
  loadPct: number; // 0 to 120%
  controllers: ControllerPoint[];
  kpis: SectionKPI[];
  disturbances: DisturbanceScenario[];
  interlocks: { tag: string; conditionAr: string; actionAr: string; status: 'healthy' | 'armed' | 'tripped' }[];
  operatingGuide: {
    startupStepsAr: string[];
    shutdownStepsAr: string[];
    safetyNotesAr: string[];
  };
}
