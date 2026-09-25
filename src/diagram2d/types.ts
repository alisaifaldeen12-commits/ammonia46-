/**
 * types.ts - Process Flow Diagram Shared Interfaces
 */

export interface PFDStreamData {
  id: number;
  name: string;
  nameAr: string;
  pressure: string; // kg/cm2A
  temperature: string; // °C
  flowKgH?: string;
  flowMolH?: string;
  dryGasMolH: string;
  wetGasMolH: string;
  h2oMolH: string;
  dryGasNm3h?: string;
  wetGasNm3h?: string;
  dryGasTh?: string;
  wetGasTh?: string;
  dryMw: string;
  wetMw: string;
  comp: {
    co?: string;
    co2?: string;
    h2?: string;
    n2?: string;
    ar?: string;
    ch4?: string;
    nh3?: string;
    h2o?: string;
    urea?: string;
    inerts?: string;
    air?: string;
    biuret?: string;
    c2h6?: string;
    c3h8?: string;
    c4h10?: string;
    c5h12?: string;
    c6plus?: string;
    o2?: string;
  };
}

export interface PFDEquipment {
  tag: string;
  name: string;
  nameAr: string;
  duty?: string; // Q in 10^6 kcal/h
  deltaP?: string; // kg/cm2
  tempIn?: string;
  tempOut?: string;
  pressIn?: string;
  pressOut?: string;
  catalyst?: string;
  descAr: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PFDSheetInfo {
  id: 'reform_100' | 'co2_200' | 'comp_300' | 'synth_400' | 'urea_500' | 'steam_bfw' | 'steam_header';
  dwgNo: string;
  title: string;
  titleAr: string;
  orderNo: string;
  date: string;
  customer: string;
  filters: { id: string; label: string; labelAr: string }[];
}
