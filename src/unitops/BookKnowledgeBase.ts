// Master Operational Data Model strictly compiled from the Provided Plant Operations Manual (ملزمة مصنع الأمونيا)
// إعداد: المهندس ماجد مرسي داود (أمونيا / 1)

export interface SteamHeaderSpec {
  name: string;
  type: string;
  temp: string;
  consumers: string[];
  generationSources: string[];
  controllers: string[];
  ventValve: string;
  notes: string;
}

export interface SectionEquipmentSpec {
  tag: string;
  nameAr: string;
  functionAr: string;
  opConditions: { temp?: string; pressure?: string; dp?: string; speed?: string; other?: string };
  controllers: string[];
  valves: string[];
}

export interface InterlockRule {
  id: string;
  initiator: string; // Sensor tag or condition
  setpoint: string;
  actionAr: string;
  type: 'Total S/D' | 'Partial S/D' | 'Trip' | 'Auto-Switch';
  valvesAffected: { tag: string; state: 'close' | 'open' | 'min' | 'still open' | 'still close' }[];
}

export interface CalculationModel {
  id: string;
  titleAr: string;
  descriptionAr: string;
  formulaTex: string;
  parameters: { key: string; nameAr: string; defaultVal: number; unit: string; min?: number; max?: number }[];
  calculate: (inputs: Record<string, number>) => { result: number; unit: string; steps: string[]; statusNote?: string };
}

export interface TroubleScenario {
  id: string;
  titleAr: string;
  causeAr: string;
  indicatorsAr: string[];
  effectsAr: string[];
  ccrActionsAr: string[];
  fieldActionsAr: string[];
  valvesState: Record<string, string>;
}

export interface StartupStepItem {
  stepNum: number;
  stageNameAr: string;
  descAr: string;
  checksAr: string[];
  controllersAction: { tag: string; action: string }[];
  cautionAr?: string;
}

export interface ShutdownStepItem {
  stepNum: number;
  stageNameAr: string;
  type: 'Normal S/D' | 'Partial S/D' | 'Total S/D' | 'Emergency Trip';
  descAr: string;
  valvesSequence: { tag: string; state: string }[];
  cautionAr?: string;
}
