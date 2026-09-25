/**
 * PlantDiagram2D.ts
 * Multi-Sheet Interactive 2D Process Flow Diagram (PFD) Suite
 * 
 * Blueprints supported:
 * 1. DWG NO. 6112P 100-100-00: GAS REFORM SECTION
 * 2. DWG NO. 6112P 100-200-00: CO2 REMOVAL SECTION (CATACARB)
 * 3. DWG NO. 6112P 100-300-00: COMPRESSION SECTION (K-301 / K-302 / K-303)
 * 4. DWG NO. 6112P 300-401/402: SYNTHESIS & REFRIGERATION SECTION (R-401 / K-401)
 * 
 * Project: M.O.I. IRAQ - FERTILIZER PROJECT, KHOR AL-ZUBAIR PHASE-1
 * AMMONIA UNIT 
 */

import { PFDStreamData, PFDEquipment, PFDSheetInfo } from './types';
import { SHEET_REFORM_100_INFO, STREAMS_REFORM_100, EQUIPMENT_REFORM_100 } from './data_reform_100';
import { SHEET_CO2_200_INFO, STREAMS_CO2_200, EQUIPMENT_CO2_200 } from './data_co2_200';
import { SHEET_COMP_300_INFO, STREAMS_COMP_300, EQUIPMENT_COMP_300 } from './data_comp_300';
import { SHEET_SYNTH_400_INFO, STREAMS_SYNTH_400, EQUIPMENT_SYNTH_400 } from './data_synth_400';
import { SHEET_UREA_500_INFO, STREAMS_UREA_500, EQUIPMENT_UREA_500 } from './data_urea_500';
import { SHEET_STEAM_BFW_INFO, STREAMS_STEAM_BFW, EQUIPMENT_STEAM_BFW } from './data_steam_bfw';
import { SHEET_STEAM_HEADER_INFO, STREAMS_STEAM_HEADER, EQUIPMENT_STEAM_HEADER } from './data_steam_header';
import { renderReform100SVG } from './render_reform_100_svg';
import { renderCompression300SVG } from './render_comp_300_svg';
import { renderCO2Removal200SVG } from './render_co2_200_svg';
import { renderSynthesis400SVG } from './render_synth_400_svg';
import { renderUrea500SVG } from './render_urea_500_svg';
import { renderSteamBFWSVG } from './render_steam_bfw_svg';
import { renderSteamHeaderSVG } from './render_steam_header_svg';

export interface DCSControllerLoop {
  tag: string;
  name: string;
  nameAr: string;
  unit: string;
  pv: number;
  sp: number;
  mv: number;
  mode: 'AUTO' | 'MAN' | 'CAS';
  min: number;
  max: number;
  hh: number;
  h: number;
  l: number;
  ll: number;
  sheetId: 'reform_100' | 'co2_200' | 'comp_300' | 'synth_400' | 'urea_500' | 'steam_bfw' | 'steam_header';
  descAr: string;
}

export const DCS_LOOPS: Record<string, DCSControllerLoop> = {
  'PIC-001': { tag: 'PIC-001', name: 'NG Feed Header Pressure Controller', nameAr: 'متحكم ضغط مجمع استلام الغاز الطبيعي', unit: 'kg/cm²G', pv: 45.0, sp: 45.0, mv: 62.4, mode: 'AUTO', min: 0, max: 60, hh: 52, h: 48, l: 38, ll: 30, sheetId: 'reform_100', descAr: 'ضبط ضغط الغاز القادم من الأنبوب الرئيسي وتأمين ضغط مستقر للمجمع.' },
  'PIC-101': { tag: 'PIC-101', name: 'NG Compressor K-303 Suction Controller', nameAr: 'متحكم ضغط سحب وتدوير ضاغط الغاز K-303', unit: 'kg/cm²G', pv: 19.0, sp: 19.0, mv: 45.2, mode: 'AUTO', min: 0, max: 30, hh: 24, h: 22, l: 17, ll: 15, sheetId: 'reform_100', descAr: 'صمام تدوير وتخفيض الضغط لمنع حدوث ظاهرة الاندفاع Surge في كباس K-303.' },
  'TIC-101': { tag: 'TIC-101', name: 'Fired Preheater H-101 Temp Controller', nameAr: 'متحكم حرارة مخرج مسخن الغاز H-101', unit: '°C', pv: 380.0, sp: 380.0, mv: 58.0, mode: 'AUTO', min: 0, max: 500, hh: 410, h: 395, l: 360, ll: 340, sheetId: 'reform_100', descAr: 'تأمين حرارة 380°C المثالية لتنشيط محفز إزالة الكبريت Co-Mo و ZnO.' },
  'FRC-103': { tag: 'FRC-103', name: 'Process Steam Feed Flow Controller', nameAr: 'متحكم تدفق بخار العملية للمصلح الأولي', unit: 't/h', pv: 104.5, sp: 104.5, mv: 71.0, mode: 'CAS', min: 0, max: 150, hh: 135, h: 120, l: 80, ll: 60, sheetId: 'reform_100', descAr: 'التحكم بنسبة البخار إلى الكربون (Steam to Carbon Ratio S/C = 3.20).' },
  'FRC-105': { tag: 'FRC-105', name: 'Natural Gas Process Feed Flow Controller', nameAr: 'متحكم تدفق الغاز الطبيعي لفرن الإصلاح', unit: 't/h', pv: 34.5, sp: 34.5, mv: 68.5, mode: 'AUTO', min: 0, max: 50, hh: 45, h: 40, l: 25, ll: 18, sheetId: 'reform_100', descAr: 'معدل التغذية الهيدروكربونية الأساسية لإنتاج غاز التخليق.' },
  'TIC-102': { tag: 'TIC-102', name: 'Primary Reformer Radiant Outlet Temp', nameAr: 'متحكم حرارة مخرج أنابيب فرن الإصلاح R-101', unit: '°C', pv: 750.0, sp: 750.0, mv: 78.5, mode: 'AUTO', min: 500, max: 900, hh: 820, h: 780, l: 710, ll: 680, sheetId: 'reform_100', descAr: 'ضبط احتراق المشاعل في فرن الإصلاح الأولي لتحقيق أقصى تحويل للميثان.' },
  'FRCA-107': { tag: 'FRCA-107', name: 'Process Air Flow to Secondary Reformer', nameAr: 'متحكم تدفق الهواء المضغوط للمصلح الثانوي R-103', unit: 't/h', pv: 48.2, sp: 48.2, mv: 64.0, mode: 'CAS', min: 0, max: 80, hh: 70, h: 60, l: 35, ll: 25, sheetId: 'reform_100', descAr: 'تأمين النتروجين بالنسب المتكافئة N2:H2 = 1:3 ورفع الحرارة إلى 900°C.' },
  'TIC-104': { tag: 'TIC-104', name: 'HTS Shift Reactor R-104 Outlet Temp', nameAr: 'متحكم حرارة مفاعل التحويل العالي HTS', unit: '°C', pv: 390.0, sp: 390.0, mv: 52.0, mode: 'AUTO', min: 200, max: 500, hh: 440, h: 415, l: 350, ll: 320, sheetId: 'reform_100', descAr: 'أكسدة أول أكسيد الكربون CO + H2O -> CO2 + H2 فوق محفز Fe-Cr.' },
  'TIC-105': { tag: 'TIC-105', name: 'LTS Shift Reactor R-105 Outlet Temp', nameAr: 'متحكم حرارة مفاعل التحويل الواطئ LTS', unit: '°C', pv: 220.0, sp: 220.0, mv: 48.0, mode: 'AUTO', min: 150, max: 300, hh: 250, h: 235, l: 195, ll: 180, sheetId: 'reform_100', descAr: 'خفض نسبة CO إلى أقل من 0.3% فوق محفز Cu-Zn-Al.' },
  'TIC-106': { tag: 'TIC-106', name: 'Methanator R-106 Peak Bed Temp', nameAr: 'متحكم حرارة طبقة مفاعل الميثانايتر R-106', unit: '°C', pv: 295.0, sp: 295.0, mv: 54.0, mode: 'AUTO', min: 200, max: 400, hh: 350, h: 320, l: 260, ll: 240, sheetId: 'reform_100', descAr: 'تحويل بقايا أكاسيد الكربون السامة لمحفز الأمونيا إلى ميثان خامل (< 5 ppm).' },
  'LIC-201': { tag: 'LIC-201', name: 'Catacarb Absorber T-201 Sump Level', nameAr: 'متحكم مستوى قعر برج الامتصاص T-201', unit: '%', pv: 55.0, sp: 55.0, mv: 55.0, mode: 'AUTO', min: 0, max: 100, hh: 85, h: 75, l: 30, ll: 15, sheetId: 'co2_200', descAr: 'تنظيم تدفق المحلول الغني Rich Solution إلى توربين الاسترجاع وبرج التجريد.' },
  'TIC-201': { tag: 'TIC-201', name: 'Regenerator T-202 Reboiler Temp', nameAr: 'متحكم حرارة مرجل إعادة غلي كاتاكارب E-201', unit: '°C', pv: 125.0, sp: 125.0, mv: 63.0, mode: 'AUTO', min: 80, max: 160, hh: 140, h: 132, l: 115, ll: 105, sheetId: 'co2_200', descAr: 'تجريد غاز CO2 من محلول كربونات البوتاسيوم بواسطة الحرارة والبخار.' },
  'PIC-301': { tag: 'PIC-301', name: 'Syngas Compressor K-301 Suction Press', nameAr: 'متحكم ضغط سحب ضاغط غاز التخليق K-301', unit: 'kg/cm²G', pv: 25.5, sp: 25.5, mv: 50.0, mode: 'AUTO', min: 0, max: 40, hh: 32, h: 28, l: 20, ll: 16, sheetId: 'comp_300', descAr: 'المحافظة على ثبات ضغط سحب المرحلة الأولى لضاغط K-301.' },
  'SIC-301': { tag: 'SIC-301', name: 'Steam Turbine K-301T Speed Controller', nameAr: 'متحكم سرعة توربين ضاغط غاز التخليق K-301T', unit: 'RPM', pv: 10850, sp: 10850, mv: 74.0, mode: 'AUTO', min: 0, max: 13000, hh: 11800, h: 11200, l: 9500, ll: 8500, sheetId: 'comp_300', descAr: 'حاكم السرعة الهيدروليكي Electronic Governor لتوربين البخار عالي الضغط.' },
  'PIC-122': { tag: 'PIC-122', name: 'Fresh Syngas Supply Pressure Controller', nameAr: 'متحكم ضغط الغاز المصنع القادم من R-106', unit: 'kg/cm²G', pv: 25.0, sp: 25.0, mv: 65.0, mode: 'AUTO', min: 0, max: 40, hh: 32, h: 28, l: 20, ll: 16, sheetId: 'synth_400', descAr: 'تنظيم ضغط الغاز المصنع القادم من مفاعل الميثانايتر R-106 عند 135°م وضغط 25 كغم/سم² وتغذيته للضاغط K-301.' },
  'TRC-402': { tag: 'TRC-402', name: 'R-401 Bed 1 Temp Controller', nameAr: 'متحكم حرارة الطبقة الأولى للمفاعل R-401 (380°م)', unit: '°C', pv: 380.0, sp: 380.0, mv: 42.0, mode: 'AUTO', min: 250, max: 450, hh: 410, h: 395, l: 360, ll: 340, sheetId: 'synth_400', descAr: 'مسيطر حرارة الطبقة الحفازة الأولى لمفاعل تخليق الأمونيا R-401 وضبط حرارة التفاعل عند 380°م.' },
  'TRC-403': { tag: 'TRC-403', name: 'R-401 Bed 2 Quench Temp Controller', nameAr: 'متحكم حرارة كوينش الطبقة الثانية للمفاعل (420°م)', unit: '°C', pv: 420.0, sp: 420.0, mv: 52.0, mode: 'AUTO', min: 300, max: 500, hh: 460, h: 440, l: 390, ll: 370, sheetId: 'synth_400', descAr: 'حقن غاز كوينش بارد لضبط حرارة الطبقة الحفازة الثانية عند 420°م.' },
  'TRC-404': { tag: 'TRC-404', name: 'R-401 Bed 3 Quench Temp Controller', nameAr: 'متحكم حرارة كوينش الطبقة الثالثة للمفاعل (430°م)', unit: '°C', pv: 430.0, sp: 430.0, mv: 55.0, mode: 'AUTO', min: 300, max: 500, hh: 470, h: 450, l: 400, ll: 380, sheetId: 'synth_400', descAr: 'حقن غاز كوينش بارد لضبط حرارة الطبقة الحفازة الثالثة عند 430°م.' },
  'LIC-401': { tag: 'LIC-401', name: 'Primary Separator V-401 Level Controller', nameAr: 'متحكم مستوى سائل الفاصل الأولي V-401', unit: '%', pv: 50.0, sp: 50.0, mv: 50.0, mode: 'AUTO', min: 0, max: 100, hh: 80, h: 70, l: 30, ll: 20, sheetId: 'synth_400', descAr: 'تصريف سائل الأمونيا المتكثفة أولياً عند 40°م إلى خزان التخفيف V-409.' },
  'LIC-402': { tag: 'LIC-402', name: 'Secondary Chiller E-406 Level Controller', nameAr: 'متحكم مستوى سائل الأمونيا في مبرد E-406', unit: '%', pv: 55.0, sp: 55.0, mv: 52.0, mode: 'AUTO', min: 0, max: 100, hh: 85, h: 75, l: 30, ll: 15, sheetId: 'synth_400', descAr: 'السيطرة على منسوب سائل التثليج في شيل المبرد E-406 عند حرارة -10°م.' },
  'LIC-403': { tag: 'LIC-403', name: 'Secondary Separator V-402 Level Controller', nameAr: 'متحكم مستوى سائل الفاصل الثانوي V-402', unit: '%', pv: 48.0, sp: 48.0, mv: 48.0, mode: 'AUTO', min: 0, max: 100, hh: 80, h: 70, l: 30, ll: 15, sheetId: 'synth_400', descAr: 'تصريف سائل الأمونيا المستخلصة بالتبريد العميق (-3°م إلى 2°م) إلى خزان V-409.' },
  'LIC-406': { tag: 'LIC-406', name: 'E-405 Primary Chiller NH3 Supply Level', nameAr: 'متحكم تزويد سائل الأمونيا من V-409 لمبرد E-405', unit: '%', pv: 52.0, sp: 52.0, mv: 50.0, mode: 'AUTO', min: 0, max: 100, hh: 80, h: 70, l: 30, ll: 20, sheetId: 'synth_400', descAr: 'تنظيم مستوى سائل التبريد في شيل E-405 (+8°م).' },
  'LIC-427': { tag: 'LIC-427', name: 'E-405 NH3 Auxiliary Supply Level', nameAr: 'متحكم تزويد سائل التبريد من V-408 لمبرد E-405', unit: '%', pv: 50.0, sp: 50.0, mv: 48.0, mode: 'AUTO', min: 0, max: 100, hh: 80, h: 70, l: 30, ll: 20, sheetId: 'synth_400', descAr: 'تغذية تعويضية لسائل التبريد من مستقبل V-408 إلى مبرد E-405.' },
  'LIC-425': { tag: 'LIC-425', name: 'E-408 Purge Condenser Level Controller', nameAr: 'متحكم سائل التبريد لمكثف التطهير E-408', unit: '%', pv: 45.0, sp: 45.0, mv: 45.0, mode: 'AUTO', min: 0, max: 100, hh: 80, h: 70, l: 25, ll: 15, sheetId: 'synth_400', descAr: 'السيطرة على سائل الأمونيا في شيل E-408 لتكثيف الأمونيا من غاز التطهير.' },
  'LIC-426': { tag: 'LIC-426', name: 'Purge Separator V-403 Level Controller', nameAr: 'متحكم مستوى سائل فاصل التطهير V-403', unit: '%', pv: 40.0, sp: 40.0, mv: 40.0, mode: 'AUTO', min: 0, max: 100, hh: 75, h: 65, l: 20, ll: 10, sheetId: 'synth_400', descAr: 'تصريف سائل الأمونيا من قعر V-403 عند -25°م وضغط 180 كغم/سم² إلى V-409.' },
  'FIC-424': { tag: 'FIC-424', name: 'Purge Gas Total Flow Controller', nameAr: 'متحكم ومسجل تدفق غاز التطهير الكلي', unit: 'Nm³/h', pv: 3200, sp: 3200, mv: 40.0, mode: 'AUTO', min: 0, max: 8000, hh: 6500, h: 5500, l: 1500, ll: 500, sheetId: 'synth_400', descAr: 'قياس وضبط معدل إخراج غاز التطهير لمنع تراكم الغازات الخاملة (CH4, Ar) في الحلقة.' },
  'PIC-403': { tag: 'PIC-403', name: 'Purge Gas Letdown Pressure Controller', nameAr: 'متحكم تخفيض ضغط غاز التطهير (6 كغم/سم²)', unit: 'kg/cm²G', pv: 6.0, sp: 6.0, mv: 35.0, mode: 'AUTO', min: 0, max: 20, hh: 12, h: 9, l: 4, ll: 2, sheetId: 'synth_400', descAr: 'تخفيض ضغط غاز التطهير من 180 كغم/سم² إلى 6 كغم/سم² لتغذيته كوقود للغلايات أو مشعل 401-H.' },
  'LIC-407': { tag: 'LIC-407', name: 'Vent Condenser E-409 Level Controller', nameAr: 'متحكم مستوى سائل التبريد في E-409', unit: '%', pv: 50.0, sp: 50.0, mv: 50.0, mode: 'AUTO', min: 0, max: 100, hh: 80, h: 70, l: 30, ll: 15, sheetId: 'synth_400', descAr: 'السيطرة على سائل الأمونيا في شيل E-409 لتكثيف أبخرة غاز التنفيس إلى -25°م.' },
  'LIC-408': { tag: 'LIC-408', name: 'Vent Separator V-404 Level Controller', nameAr: 'متحكم مستوى سائل فاصل التنفيس V-404', unit: '%', pv: 42.0, sp: 42.0, mv: 42.0, mode: 'AUTO', min: 0, max: 100, hh: 75, h: 65, l: 20, ll: 10, sheetId: 'synth_400', descAr: 'تصريف سائل الأمونيا من قعر V-404 عند -25°م إلى المرحلة الأولى V-405.' },
  'PIC-501': { tag: 'PIC-501', name: 'Urea Reactor R-501 Pressure Controller', nameAr: 'متحكم ضغط مفاعل تصنيع اليوريا R-501', unit: 'kg/cm²G', pv: 155.0, sp: 155.0, mv: 72.0, mode: 'AUTO', min: 0, max: 200, hh: 175, h: 165, l: 135, ll: 120, sheetId: 'urea_500', descAr: 'تفاعل الأمونيا السائلة وثاني أكسيد الكربون لإنتاج كاربامات الأمونيوم واليوريا.' },
  'TIC-501': { tag: 'TIC-501', name: 'Urea Reactor R-501 Temperature', nameAr: 'متحكم حرارة تفاعل اليوريا R-501', unit: '°C', pv: 188.0, sp: 188.0, mv: 60.0, mode: 'AUTO', min: 100, max: 250, hh: 205, h: 195, l: 175, ll: 160, sheetId: 'urea_500', descAr: 'تأمين حرارة 188°C لتحقيق التوازن الثرموديناميكي الأمثل لتحويل الكاربامات.' },
  'LIC-102': { tag: 'LIC-102', name: 'HP Steam Drum V-102 Water Level', nameAr: 'متحكم مستوى ماء مرجل البخار عالي الضغط V-102', unit: '%', pv: 50.0, sp: 50.0, mv: 50.0, mode: 'AUTO', min: 0, max: 100, hh: 75, h: 65, l: 35, ll: 25, sheetId: 'steam_bfw', descAr: 'تحكم ثلاثي العناصر (3-Element Control: Level + Steam Flow + BFW Flow).' },
  'TIC-203': { tag: 'TIC-203', name: 'E-204 BFW Preheater Temp Controller', nameAr: 'متحكم حرارة مسخن ماء المرجل E-204', unit: '°C', pv: 90.0, sp: 90.0, mv: 45.0, mode: 'AUTO', min: 40, max: 130, hh: 110, h: 100, l: 75, ll: 65, sheetId: 'steam_bfw', descAr: 'تنظيم صمام الالتفاف Bypass للحفاظ على حرارة الدخول لنازع الغازات V-103 عند 90°C.' },
  'LIC-151': { tag: 'LIC-151', name: 'Deaerator V-103 Water Level Controller', nameAr: 'متحكم منسوب ماء نازع الغازات V-103', unit: '%', pv: 58.0, sp: 58.0, mv: 55.0, mode: 'AUTO', min: 0, max: 100, hh: 85, h: 75, l: 35, ll: 20, sheetId: 'steam_bfw', descAr: 'تنظيم تدفق الماء القادم من E-204 لتأمين استقرار مخزون مياه المراجل.' },
  'FRC-153': { tag: 'FRC-153', name: 'V-102 Steam Drum BFW Flow Controller', nameAr: 'متحكم تدفق ماء تغذية المرجل الرئيسي V-102', unit: 't/h', pv: 95.0, sp: 95.0, mv: 65.0, mode: 'CAS', min: 0, max: 160, hh: 140, h: 120, l: 50, ll: 30, sheetId: 'steam_bfw', descAr: 'تنظيم تدفق مياه التغذية إلى خزان البخار الأساسي V-102 مع موازنة إنتاج البخار.' },
  'FRC-153S': { tag: 'FRC-153S', name: 'V-102A Steam Drum BFW Flow Controller', nameAr: 'متحكم تدفق ماء تغذية المرجل الثانوي V-102A', unit: 't/h', pv: 65.0, sp: 65.0, mv: 48.0, mode: 'CAS', min: 0, max: 100, hh: 85, h: 75, l: 30, ll: 20, sheetId: 'steam_bfw', descAr: 'تنظيم تدفق مياه التغذية إلى خزان البخار الثانوي V-102A.' },
  'TIC-154': { tag: 'TIC-154', name: 'Steam Desuperheater Attemperator Spray', nameAr: 'متحكم حرارة ماء التبريد والرش العطري', unit: '°C', pv: 190.0, sp: 190.0, mv: 38.0, mode: 'AUTO', min: 100, max: 300, hh: 250, h: 220, l: 160, ll: 140, sheetId: 'steam_bfw', descAr: 'حقن رذاذ مياه BFW منخفضة الضغط للسيطرة الدقيقة على درجة حرارة البخار.' },
  'PIC-165': { tag: 'PIC-165', name: 'S-65 Superheated Steam Header Press', nameAr: 'متحكم ضغط مجمع البخار العالي S-65', unit: 'kg/cm²G', pv: 65.0, sp: 65.0, mv: 58.0, mode: 'AUTO', min: 0, max: 90, hh: 78, h: 72, l: 56, ll: 50, sheetId: 'steam_header', descAr: 'مجمع التغذية الرئيسي لتوربينات ضواغط K-301 و K-302 ومحطات التخفيض.' },
  'PRCA-341': { tag: 'PRCA-341', name: 'PRDS Station 1V (S-65 to S-39 Letdown)', nameAr: 'متحكم تخفيض ضغط البخار الأول (65 إلى 39 كغم)', unit: 'kg/cm²G', pv: 39.0, sp: 39.0, mv: 45.0, mode: 'AUTO', min: 20, max: 70, hh: 55, h: 46, l: 32, ll: 26, sheetId: 'steam_header', descAr: 'محطة خفض الضغط الرئيسية 1V وتمرير البخار من مجمع 65 كغم إلى 39 كغم.' },
  'PRCA-342': { tag: 'PRCA-342', name: 'PRDS Station 2V (S-65 to S-39 Letdown)', nameAr: 'متحكم تخفيض ضغط البخار الثاني (65 إلى 39 كغم)', unit: 'kg/cm²G', pv: 39.0, sp: 39.0, mv: 40.0, mode: 'AUTO', min: 20, max: 70, hh: 55, h: 46, l: 32, ll: 26, sheetId: 'steam_header', descAr: 'محطة خفض الضغط التفرعية 2V لضمان استمرارية الإمداد عند ذروة الاستهلاك.' },
  'PICA-162': { tag: 'PICA-162', name: 'HP Steam Header Atmospheric Vent', nameAr: 'متحكم صمام تنفيس البخار عالي الضغط للجو', unit: 'kg/cm²G', pv: 65.0, sp: 67.0, mv: 0.0, mode: 'AUTO', min: 0, max: 90, hh: 75, h: 70, l: 50, ll: 40, sheetId: 'steam_header', descAr: 'صمام أمان وتحكم هوائي PICA-162 للتنفيس للجو وحماية شبكة البخار العالي.' },
  'PICA-164': { tag: 'PICA-164', name: 'PRDS Station (S-39 to S-12 Letdown)', nameAr: 'متحكم تخفيض ضغط البخار (39 إلى 12 كغم)', unit: 'kg/cm²G', pv: 12.0, sp: 12.0, mv: 52.0, mode: 'AUTO', min: 0, max: 45, hh: 22, h: 16, l: 8, ll: 5, sheetId: 'steam_header', descAr: 'محطة خفض الضغط والتبريد من مجمع 39 كغم إلى مجمع 12 كغم.' },
  'TICA-152': { tag: 'TICA-152', name: 'Superheater Interstage Spray Attemperator', nameAr: 'متحكم رذاذ تبريد البخار المسخن الفائق TICA-152', unit: '°C', pv: 415.0, sp: 415.0, mv: 48.0, mode: 'AUTO', min: 250, max: 550, hh: 470, h: 445, l: 375, ll: 340, sheetId: 'steam_header', descAr: 'حقن مياه BFW بين المرحلتين E-103B و E-103A للحفاظ على حرارة البخار 435°C بدقة.' },
  'PIC-139': { tag: 'PIC-139', name: 'S-39 Medium Pressure Steam Header', nameAr: 'متحكم ضغط مجمع البخار المتوسط S-39', unit: 'kg/cm²G', pv: 39.0, sp: 39.0, mv: 62.0, mode: 'AUTO', min: 0, max: 60, hh: 48, h: 44, l: 32, ll: 26, sheetId: 'steam_header', descAr: 'تغذية بخار التفاعل للمصلح الأولي R-101 وتوربين ضاغط K-303.' },
  'PIC-112': { tag: 'PIC-112', name: 'S-12 Low Pressure Steam Header', nameAr: 'متحكم ضغط مجمع البخار المنخفض S-12', unit: 'kg/cm²G', pv: 12.0, sp: 12.0, mv: 44.0, mode: 'AUTO', min: 0, max: 25, hh: 18, h: 15, l: 9, ll: 6, sheetId: 'steam_header', descAr: 'تغذية مراجل إعادة غلي كاتاكارب E-201 ومسخنات إزالة الغازات.' },
  'PIC-103': { tag: 'PIC-103', name: 'S-3 Deaerator LP Steam Header', nameAr: 'متحكم ضغط مجمع بخار نازع الغازات S-3', unit: 'kg/cm²G', pv: 3.2, sp: 3.2, mv: 40.0, mode: 'AUTO', min: 0, max: 10, hh: 6.0, h: 4.5, l: 2.2, ll: 1.5, sheetId: 'steam_header', descAr: 'تأمين بخار التجريد الحراري لنازع الأكسجين والغازات V-103 عند 125°C.' }
};

export class PlantDiagram2D {
  public static readonly BASE_H = 1150;

  public get baseW(): number {
    if (this.currentSheet === 'urea_500' || this.currentSheet === 'steam_bfw') return 3050;
    if (this.currentSheet === 'steam_header') return 1850;
    return 2300;
  }

  public get baseH(): number {
    return PlantDiagram2D.BASE_H;
  }

  private container: HTMLElement | null = null;
  private svgElem: SVGSVGElement | null = null;
  private zoomGroup: SVGGElement | null = null;
  private currentSheet: 'reform_100' | 'co2_200' | 'comp_300' | 'synth_400' | 'urea_500' | 'steam_bfw' | 'steam_header' = 'steam_header';
  
  // Ultra-HD ViewBox Camera State (Vector-Native Clarity)
  private vbX = 0;
  private vbY = 0;
  private vbW = 1850;
  private vbH = 1150;
  private currentZoom = 1.0;

  private isDragging = false;
  private dragMoved = false;
  private startMouseX = 0;
  private startMouseY = 0;
  private isLocked = false;
  private isDcsSidebarOpen = true;

  private selectedItem: string | null = null;
  private activeFaceplateTag: string | null = null;
  private faceplateInterval: any = null;
  private showParticles = true;
  private activeFilter = 'all';

  public getSheetInfo(): PFDSheetInfo {
    if (this.currentSheet === 'steam_header') return SHEET_STEAM_HEADER_INFO;
    if (this.currentSheet === 'steam_bfw') return SHEET_STEAM_BFW_INFO;
    if (this.currentSheet === 'urea_500') return SHEET_UREA_500_INFO;
    if (this.currentSheet === 'synth_400') return SHEET_SYNTH_400_INFO;
    if (this.currentSheet === 'comp_300') return SHEET_COMP_300_INFO;
    if (this.currentSheet === 'co2_200') return SHEET_CO2_200_INFO;
    return SHEET_REFORM_100_INFO;
  }

  public getStreams(): Record<number, PFDStreamData> {
    if (this.currentSheet === 'steam_header') return STREAMS_STEAM_HEADER;
    if (this.currentSheet === 'steam_bfw') return STREAMS_STEAM_BFW;
    if (this.currentSheet === 'urea_500') return STREAMS_UREA_500;
    if (this.currentSheet === 'synth_400') return STREAMS_SYNTH_400;
    if (this.currentSheet === 'comp_300') return STREAMS_COMP_300;
    if (this.currentSheet === 'co2_200') return STREAMS_CO2_200;
    return STREAMS_REFORM_100;
  }

  public getEquipment(): Record<string, PFDEquipment> {
    if (this.currentSheet === 'steam_header') return EQUIPMENT_STEAM_HEADER;
    if (this.currentSheet === 'steam_bfw') return EQUIPMENT_STEAM_BFW;
    if (this.currentSheet === 'urea_500') return EQUIPMENT_UREA_500;
    if (this.currentSheet === 'synth_400') return EQUIPMENT_SYNTH_400;
    if (this.currentSheet === 'comp_300') return EQUIPMENT_COMP_300;
    if (this.currentSheet === 'co2_200') return EQUIPMENT_CO2_200;
    return EQUIPMENT_REFORM_100;
  }

  public init(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  public switchSheet(sheetId: 'reform_100' | 'co2_200' | 'comp_300' | 'synth_400' | 'urea_500' | 'steam_bfw' | 'steam_header') {
    this.currentSheet = sheetId;
    this.activeFilter = 'all';
    this.selectedItem = null;
    this.vbX = 0;
    this.vbY = 0;
    this.vbW = this.baseW;
    this.vbH = this.baseH;
    this.currentZoom = 1.0;
    this.render();
  }

  public render() {
    if (!this.container) return;
    const sheet = this.getSheetInfo();
    const equipment = this.getEquipment();
    const eqKeys = Object.keys(equipment);
    const sheetLoops = Object.values(DCS_LOOPS).filter(l => l.sheetId === this.currentSheet);

    this.container.innerHTML = `
      <div class="pfd-root-container">
        <!-- TOP INDUSTRIAL DCS STATUS & KPI RIBBON -->
        <div class="dcs-kpi-ribbon">
          <div class="dcs-kpi-badge">
            <span class="dcs-led-pulse"></span>
            <span>DCS: CENTUM-VP ONLINE (AMM-PH1)</span>
          </div>
          <div class="dcs-kpi-item">
            <span class="dcs-kpi-label">حمولة المصنع (PLANT LOAD):</span>
            <span class="dcs-kpi-val highlight">100.0% DESIGN</span>
          </div>
          <div class="dcs-kpi-item">
            <span class="dcs-kpi-label">الغاز الطبيعي (NG FEED):</span>
            <span class="dcs-kpi-val">34.5 t/h @ 45 kg/cm²</span>
          </div>
          <div class="dcs-kpi-item">
            <span class="dcs-kpi-label">نسبة البخار (S/C RATIO):</span>
            <span class="dcs-kpi-val" style="color:#38bdf8;">3.20 (OPTIMUM)</span>
          </div>
          <div class="dcs-kpi-item">
            <span class="dcs-kpi-label">حلقة التخليق (SYNTH LOOP):</span>
            <span class="dcs-kpi-val" style="color:#00e5aa;">215 kg/cm²G | 440°C</span>
          </div>
          <div class="dcs-kpi-item">
            <span class="dcs-kpi-label">إنتاج الأمونيا (NH3 RATE):</span>
            <span class="dcs-kpi-val" style="color:#c084fc;">41.67 t/h (1,000 MTPD)</span>
          </div>
          <div class="dcs-kpi-item">
            <span class="dcs-kpi-label">إنتاج اليوريا (UREA RATE):</span>
            <span class="dcs-kpi-val" style="color:#fbbf24;">72.9 t/h (1,750 MTPD)</span>
          </div>
          <div class="dcs-kpi-item">
            <span class="dcs-kpi-label">البخار العالي (HP STEAM S-65):</span>
            <span class="dcs-kpi-val" style="color:#f97316;">210 t/h @ 65 kg/cm² 435°C</span>
          </div>
        </div>

        <!-- DCS Navigation & Header Toolbar -->
        <div class="pfd-header-bar">
          <div class="pfd-title-group">
            <button id="pfd-btn-toggle-dcs-sidebar" class="dcs-toggle-sb-btn" title="إظهار/إخفاء لوحة التحكم والأقسام الجانبية">
              <span>🎛</span>
              <span>لوحة الأقسام DCS</span>
            </button>
            <div class="pfd-badge">${sheet.dwgNo}</div>
            <div>
              <div class="pfd-main-title">${sheet.title}</div>
              <div class="pfd-sub-title">${sheet.titleAr} | ${sheet.customer}</div>
            </div>
          </div>

          <!-- Section Sub-filters -->
          <div class="pfd-filter-tabs">
            ${sheet.filters.map(f => `
              <button class="pfd-ftab ${this.activeFilter === f.id ? 'active' : ''}" data-sec="${f.id}">
                ${f.labelAr}
              </button>
            `).join('')}
          </div>

          <!-- Action & Canvas Controls -->
          <div class="pfd-actions-group">
            <button id="pfd-btn-lock" class="pfd-btn ${this.isLocked ? 'dcs-btn-locked' : ''}" title="قفل / فتح تحريك اللوحة لتثبيت العرض التام">
              <span>${this.isLocked ? '🔒' : '🔓'}</span>
              <span>${this.isLocked ? 'اللوحة مقفلة (ثابتة)' : 'قفل اللوحة'}</span>
            </button>

            <button id="pfd-btn-zoom-reset" class="pfd-btn" title="تثبيت وملاءمة وتوسيط اللوحة بالكامل (Fit All)">
              <span>🎯</span> ملاءمة وتوسيط
            </button>

            <!-- Ultra-HD Zoom Controls with Live Percentage Badge -->
            <div style="display:inline-flex;align-items:center;gap:3px;background:#f8fafc;border:1px solid #cbd5e1;padding:2px 4px;border-radius:6px;">
              <button id="pfd-btn-zoom-out" class="pfd-btn" style="min-width:28px;padding:3px 8px;font-weight:900;" title="تصغير (Zoom Out)">−</button>
              <span id="pfd-zoom-label" class="pfd-zoom-indicator" title="نسبة التكبير الحالية">100%</span>
              <button id="pfd-btn-zoom-in" class="pfd-btn" style="min-width:28px;padding:3px 8px;font-weight:900;" title="تكبير (Zoom In)">+</button>
              <button id="pfd-btn-zoom-100" class="pfd-btn" style="min-width:32px;padding:3px 6px;font-size:11px;font-weight:700;" title="العرض الطبيعي 1:1">1:1</button>
            </div>

            <button id="pfd-btn-stream-table" class="pfd-btn" title="عرض جدول موازنة المواد والغازات">
              <span>📊</span> جدول المسارات
            </button>

            <button id="pfd-btn-anim" class="pfd-btn" title="تشغيل / إيقاف جريان الخطوط">
              <span>⚡</span> ${this.showParticles ? 'إيقاف الحركة' : 'تشغيل الحركة'}
            </button>

            <button id="pfd-btn-exit" class="pfd-btn pfd-btn-close" title="العودة لشاشة التحكم">
              <span>✕</span> خروج
            </button>
          </div>
        </div>

        <!-- WORKSPACE VIEWPORT -->
        <div class="pfd-workspace-viewport">
          <!-- DCS INTEGRATED LEFT NAVIGATION SIDEBAR -->
          <div id="dcsSectionSidebar" class="dcs-section-sidebar ${this.isDcsSidebarOpen ? 'open' : ''}">
            <div class="dcs-sb-header">
              <div class="dcs-sb-title">
                <span>📑</span>
                <span>أقسام مجمع الأمونيا (PFD 6112P)</span>
              </div>
              <button id="dcs-sb-close-btn" class="dcs-sb-close" title="إغلاق اللوحة الجانبية">✕</button>
            </div>

            <!-- 1. Blueprint Sheets List -->
            <div class="dcs-sb-section">
              <div class="dcs-sb-sec-label">المخططات الهندسية السبعة (7 Process Sheets)</div>
              <div class="dcs-sheets-list">
                <button class="dcs-sheet-item ${this.currentSheet === 'steam_header' ? 'active' : ''}" data-sheet="steam_header">
                  <div class="dcs-sheet-icon">♨️</div>
                  <div class="dcs-sheet-info">
                    <div class="dcs-sheet-code">DWG 6112P-100-104</div>
                    <div class="dcs-sheet-name">مجمعات البخار ومحطات التخفيض (Steam Headers)</div>
                  </div>
                  <span class="dcs-tag-badge">S-65/39/12/3</span>
                </button>

                <button class="dcs-sheet-item ${this.currentSheet === 'steam_bfw' ? 'active' : ''}" data-sheet="steam_bfw">
                  <div class="dcs-sheet-icon">💧</div>
                  <div class="dcs-sheet-info">
                    <div class="dcs-sheet-code">DWG 6112P-100-103</div>
                    <div class="dcs-sheet-name">مياه المراجل وتوليد البخار (BFW & Steam Drum)</div>
                  </div>
                  <span class="dcs-tag-badge">V-102/V-103</span>
                </button>

                <button class="dcs-sheet-item ${this.currentSheet === 'urea_500' ? 'active' : ''}" data-sheet="urea_500">
                  <div class="dcs-sheet-icon">🌾</div>
                  <div class="dcs-sheet-info">
                    <div class="dcs-sheet-code">DWG 6112P-100-501</div>
                    <div class="dcs-sheet-name">إنتاج وتحبيب اليوريا (Urea Synthesis & Prilling)</div>
                  </div>
                  <span class="dcs-tag-badge">R-501/T-571</span>
                </button>

                <button class="dcs-sheet-item ${this.currentSheet === 'synth_400' ? 'active' : ''}" data-sheet="synth_400">
                  <div class="dcs-sheet-icon">💠</div>
                  <div class="dcs-sheet-info">
                    <div class="dcs-sheet-code">DWG 6112P-300-400</div>
                    <div class="dcs-sheet-name">تخليق وتبريد الأمونيا (NH3 Synthesis & Chilling)</div>
                  </div>
                  <span class="dcs-tag-badge">R-401/K-401</span>
                </button>

                <button class="dcs-sheet-item ${this.currentSheet === 'comp_300' ? 'active' : ''}" data-sheet="comp_300">
                  <div class="dcs-sheet-icon">⚙️</div>
                  <div class="dcs-sheet-info">
                    <div class="dcs-sheet-code">DWG 6112P-100-300</div>
                    <div class="dcs-sheet-name">ضواغط الغاز والهواء (Compression K-301/302/303)</div>
                  </div>
                  <span class="dcs-tag-badge">K-301/2/3</span>
                </button>

                <button class="dcs-sheet-item ${this.currentSheet === 'co2_200' ? 'active' : ''}" data-sheet="co2_200">
                  <div class="dcs-sheet-icon">🧪</div>
                  <div class="dcs-sheet-info">
                    <div class="dcs-sheet-code">DWG 6112P-100-200</div>
                    <div class="dcs-sheet-name">إزالة واستخلاص CO₂ كاتاكارب (Catacarb Removal)</div>
                  </div>
                  <span class="dcs-tag-badge">T-201/T-202</span>
                </button>

                <button class="dcs-sheet-item ${this.currentSheet === 'reform_100' ? 'active' : ''}" data-sheet="reform_100">
                  <div class="dcs-sheet-icon">🔥</div>
                  <div class="dcs-sheet-info">
                    <div class="dcs-sheet-code">DWG 6112P-100-100</div>
                    <div class="dcs-sheet-name">تحويل الغاز والإصلاح والميثانايتر (Reforming & Shift)</div>
                  </div>
                  <span class="dcs-tag-badge">R-101/3/4/5/6</span>
                </button>
              </div>
            </div>

            <!-- 2. Active Sheet Equipment List -->
            <div class="dcs-sb-section">
              <div class="dcs-sb-sec-label">معدات المخطط النشط (${eqKeys.length} معدة)</div>
              <div class="dcs-eq-quick-list">
                ${eqKeys.map(k => {
                  const eq = equipment[k];
                  return `
                    <div class="dcs-eq-pill" data-eq="${eq.tag}" title="${eq.nameAr} - انقر للتركيز والمواصفات">
                      <span class="dcs-eq-tag">${eq.tag}</span>
                      <span class="dcs-eq-name">${eq.nameAr}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- 3. Active Sheet PID Control Loops (DCS Faceplates) -->
            <div class="dcs-sb-section">
              <div class="dcs-sb-sec-label">أجهزة وحلقات التحكم DCS (${sheetLoops.length} حلقة PID)</div>
              <div class="dcs-loops-quick-list">
                ${sheetLoops.map(loop => `
                  <div class="dcs-loop-pill" data-loop="${loop.tag}" title="انقر لفتح لوحة تحكم DCS Faceplate">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span class="dcs-loop-tag">${loop.tag}</span>
                      <span class="dcs-loop-mode">${loop.mode}</span>
                    </div>
                    <div class="dcs-loop-desc">${loop.nameAr}</div>
                    <div class="dcs-loop-readout">
                      <span>PV: <b>${loop.pv}</b> ${loop.unit}</span>
                      <span>SP: <b>${loop.sp}</b></span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- SVG Canvas Container -->
          <div class="pfd-canvas-wrapper ${this.isLocked ? 'locked-canvas' : ''}" id="pfdCanvasWrapper">
            ${this.isLocked ? `
              <div class="dcs-canvas-lock-badge">
                <span>🔒</span> اللوحة مثبتة بالكامل ومقفلة (Canvas Locked)
              </div>
            ` : ''}

            <svg id="pfdSvg" class="pfd-svg-element" viewBox="${this.vbX} ${this.vbY} ${this.vbW} ${this.vbH}" preserveAspectRatio="xMidYMid meet">
              <defs>
                <!-- 3D Realistic Metallic Vertical Cylinder Gradient -->
                <linearGradient id="pfdSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#94a3b8"/>
                  <stop offset="12%" stop-color="#cbd5e1"/>
                  <stop offset="32%" stop-color="#f8fafc"/>
                  <stop offset="42%" stop-color="#ffffff"/>
                  <stop offset="68%" stop-color="#e2e8f0"/>
                  <stop offset="88%" stop-color="#cbd5e1"/>
                  <stop offset="100%" stop-color="#64748b"/>
                </linearGradient>

                <!-- 3D Realistic Metallic Horizontal Cylinder Gradient -->
                <linearGradient id="pfdSteelHorizGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#94a3b8"/>
                  <stop offset="15%" stop-color="#cbd5e1"/>
                  <stop offset="32%" stop-color="#f8fafc"/>
                  <stop offset="40%" stop-color="#ffffff"/>
                  <stop offset="70%" stop-color="#e2e8f0"/>
                  <stop offset="90%" stop-color="#cbd5e1"/>
                  <stop offset="100%" stop-color="#64748b"/>
                </linearGradient>

                <!-- Dished Head Radial Metallic Top -->
                <linearGradient id="pfdDishTopGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stop-color="#cbd5e1"/>
                  <stop offset="50%" stop-color="#ffffff"/>
                  <stop offset="100%" stop-color="#94a3b8"/>
                </linearGradient>

                <!-- Dished Head Radial Metallic Bottom -->
                <linearGradient id="pfdDishBotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#cbd5e1"/>
                  <stop offset="50%" stop-color="#94a3b8"/>
                  <stop offset="100%" stop-color="#64748b"/>
                </linearGradient>

                <!-- Heavy Base Skirt / Saddle Gradient -->
                <linearGradient id="pfdSkirtGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#475569"/>
                  <stop offset="25%" stop-color="#64748b"/>
                  <stop offset="50%" stop-color="#94a3b8"/>
                  <stop offset="75%" stop-color="#64748b"/>
                  <stop offset="100%" stop-color="#334155"/>
                </linearGradient>

                <!-- 3D Turbomachinery Conical / Compressor Housing Gradient -->
                <linearGradient id="pfdTurbineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#64748b"/>
                  <stop offset="20%" stop-color="#94a3b8"/>
                  <stop offset="45%" stop-color="#ffffff"/>
                  <stop offset="75%" stop-color="#cbd5e1"/>
                  <stop offset="100%" stop-color="#475569"/>
                </linearGradient>

                <!-- Motor & Drive Casing Gradient -->
                <linearGradient id="pfdMotorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#334155"/>
                  <stop offset="30%" stop-color="#64748b"/>
                  <stop offset="50%" stop-color="#94a3b8"/>
                  <stop offset="70%" stop-color="#475569"/>
                  <stop offset="100%" stop-color="#1e293b"/>
                </linearGradient>

                <!-- Heat Exchanger Tube Bundle / Shell Gradient -->
                <linearGradient id="pfdExchangerShellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#94a3b8"/>
                  <stop offset="20%" stop-color="#f1f5f9"/>
                  <stop offset="40%" stop-color="#ffffff"/>
                  <stop offset="75%" stop-color="#cbd5e1"/>
                  <stop offset="100%" stop-color="#64748b"/>
                </linearGradient>

                <!-- Radiant Furnace Fire Gradient -->
                <linearGradient id="pfdFireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stop-color="#7f1d1d"/>
                  <stop offset="20%" stop-color="#dc2626"/>
                  <stop offset="50%" stop-color="#ea580c"/>
                  <stop offset="80%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#fef08a"/>
                </linearGradient>

                <!-- Furnace Body Cutaway Inner Warm Glow -->
                <linearGradient id="pfdFurnaceInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#1e1b4b"/>
                  <stop offset="40%" stop-color="#312e81"/>
                  <stop offset="70%" stop-color="#431407"/>
                  <stop offset="100%" stop-color="#7c2d12"/>
                </linearGradient>

                <!-- Heating Coils Metallic Gradient -->
                <linearGradient id="pfdCoilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#cbd5e1"/>
                  <stop offset="50%" stop-color="#ffffff"/>
                  <stop offset="100%" stop-color="#94a3b8"/>
                </linearGradient>

                <!-- Hyperbolic Cooling Tower Gradient -->
                <linearGradient id="pfdTowerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#64748b"/>
                  <stop offset="20%" stop-color="#cbd5e1"/>
                  <stop offset="45%" stop-color="#f8fafc"/>
                  <stop offset="70%" stop-color="#cbd5e1"/>
                  <stop offset="100%" stop-color="#475569"/>
                </linearGradient>

                <linearGradient id="pfdWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#e0f2fe"/>
                  <stop offset="50%" stop-color="#bae6fd"/>
                  <stop offset="100%" stop-color="#38bdf8"/>
                </linearGradient>

                <linearGradient id="pfdCatacarbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#d1fae5"/>
                  <stop offset="50%" stop-color="#a7f3d0"/>
                  <stop offset="100%" stop-color="#6ee7b7"/>
                </linearGradient>

                <!-- Technical Cross-Hatch Wire Mesh Catalyst Packing Pattern -->
                <pattern id="pfdPackingPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 10 10 M 10 0 L 0 10" fill="none" stroke="#475569" stroke-width="0.75" opacity="0.6"/>
                  <line x1="0" y1="5" x2="10" y2="5" stroke="#94a3b8" stroke-width="0.5" opacity="0.4"/>
                </pattern>

                <!-- Exchanger Tube Lines Pattern -->
                <pattern id="pfdTubePattern" width="12" height="6" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="3" x2="12" y2="3" stroke="#0284c7" stroke-width="1.2"/>
                  <line x1="6" y1="0" x2="6" y2="6" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="2,2"/>
                </pattern>

                <pattern id="pfdGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="#ffffff"/>
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="0.8"/>
                  <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#e2e8f0" stroke-width="1.2"/>
                </pattern>

                <!-- Process Piping Arrow Markers (Ultra-High-Definition Pure Vector Precision) -->
                <marker id="pfdArrow" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#0284c7" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
                <marker id="pfdArrowBlue" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#0284c7" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
                <marker id="pfdArrowCyan" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#00c8ef" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
                <marker id="pfdArrowYellow" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#f59e0b" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
                <marker id="pfdArrowGreen" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#10b981" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
                <marker id="pfdArrowRed" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#ef4444" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
                <marker id="pfdArrowOrange" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#f97316" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
                <marker id="pfdArrowPurple" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#8b5cf6" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
                <marker id="pfdArrowSlate" viewBox="0 0 16 12" refX="14" refY="6" markerWidth="14" markerHeight="11" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 1.5 L 14 6 L 1 10.5 L 4 6 Z" fill="#475569" stroke="#0a192f" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>
                </marker>
              </defs>

              <!-- Seamless Infinite Grid Background -->
              <rect x="-6000" y="-6000" width="16000" height="14000" fill="url(#pfdGridPattern)"/>

              <!-- Blueprint Drawing Outer & Inner Border -->
              <rect x="0" y="0" width="${this.baseW}" height="${this.baseH}" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
              <rect x="8" y="8" width="${this.baseW - 16}" height="${this.baseH - 16}" fill="none" stroke="#0284c7" stroke-width="1" stroke-dasharray="8,4" opacity="0.4"/>

              <g id="pfdZoomGroup">
                ${this.currentSheet === 'steam_header'
                  ? renderSteamHeaderSVG(this.showParticles)
                  : (this.currentSheet === 'steam_bfw'
                      ? renderSteamBFWSVG(this.showParticles)
                      : (this.currentSheet === 'urea_500'
                          ? renderUrea500SVG(this.showParticles)
                          : (this.currentSheet === 'synth_400'
                              ? renderSynthesis400SVG(this.showParticles)
                              : (this.currentSheet === 'comp_300'
                                  ? renderCompression300SVG(this.showParticles)
                                  : (this.currentSheet === 'co2_200'
                                      ? renderCO2Removal200SVG(this.showParticles)
                                      : renderReform100SVG(this.showParticles))))))}
              </g>
            </svg>
          </div>

          <!-- Inspector Sidebar -->
          <div id="pfdInspectorSidebar" class="pfd-inspector-sidebar">
            <div class="pfd-insp-header">
              <span id="pfdInspTag" class="pfd-insp-tag">TAG</span>
              <button id="pfdInspClose" class="pfd-insp-close">✕</button>
            </div>
            <div id="pfdInspTitle" class="pfd-insp-title">Equipment Name</div>
            <div id="pfdInspNameAr" class="pfd-insp-name-ar">الاسم العربي</div>

            <div class="pfd-insp-section">
              <div class="pfd-insp-sec-title">المواصفات الهندسية (Operating Conditions)</div>
              <div id="pfdInspSpecs" class="pfd-spec-grid"></div>
            </div>

            <div class="pfd-insp-section">
              <div class="pfd-insp-sec-title">الوصف والوظيفة التشغيلية</div>
              <p id="pfdInspDesc" class="pfd-insp-desc"></p>
            </div>

            <div class="pfd-insp-section" id="pfdInspConnectedSec">
              <div class="pfd-insp-sec-title">المسارات المرتبطة (Connected Streams)</div>
              <ul id="pfdInspStreams" class="pfd-insp-list"></ul>
            </div>
          </div>
        </div>

        <!-- Bottom Stream Balance Modal / Drawer -->
        <div id="pfdStreamDrawer" class="pfd-stream-table-drawer" style="display:none;">
          <div class="pfd-std-header">
            <div class="pfd-std-title">📋 جدول موازنة المواد وتراكيب الغازات الكامل (${sheet.dwgNo})</div>
            <button id="pfdStdClose" class="pfd-std-close">إغلاق ✕</button>
          </div>
          <div class="pfd-std-content">
            ${this.renderStreamBalanceTable()}
          </div>
        </div>

        <!-- DCS CONTROLLER FACEPLATE MODAL (Yokogawa CENTUM / DeltaV Style) -->
        <div id="dcsFaceplateModal" class="dcs-faceplate-modal" style="display:none;">
          <div class="dcs-fp-container">
            <div class="dcs-fp-header">
              <div class="dcs-fp-tag-box">
                <span id="dcsFpTag" class="dcs-fp-tag">PIC-001</span>
                <span id="dcsFpMode" class="dcs-fp-mode-badge">AUTO</span>
              </div>
              <div class="dcs-fp-status">NORMAL</div>
              <button id="dcsFpClose" class="dcs-fp-close-btn">✕</button>
            </div>

            <div class="dcs-fp-body">
              <div id="dcsFpDesc" class="dcs-fp-desc">Natural Gas Pressure Controller</div>
              <div id="dcsFpDescAr" class="dcs-fp-desc-ar">متحكم ضغط مجمع استلام الغاز الطبيعي</div>

              <!-- Bar Graph Section -->
              <div class="dcs-fp-bargraphs">
                <!-- PV Bar -->
                <div class="dcs-fp-bar-col">
                  <div class="dcs-fp-bar-track">
                    <div id="dcsFpBarHH" class="dcs-fp-limit hh" style="bottom:90%;"></div>
                    <div id="dcsFpBarH" class="dcs-fp-limit h" style="bottom:80%;"></div>
                    <div id="dcsFpBarL" class="dcs-fp-limit l" style="bottom:20%;"></div>
                    <div id="dcsFpBarLL" class="dcs-fp-limit ll" style="bottom:10%;"></div>
                    <div id="dcsFpBarFillPV" class="dcs-fp-bar-fill pv" style="height:75%;"></div>
                    <div id="dcsFpSpMarker" class="dcs-fp-sp-marker" style="bottom:75%;"></div>
                  </div>
                  <div class="dcs-fp-bar-title">PV</div>
                </div>

                <!-- Digital Values -->
                <div class="dcs-fp-readouts">
                  <div class="dcs-fp-val-row">
                    <span class="dcs-fp-k">PV (متغير العملية):</span>
                    <span id="dcsFpValPV" class="dcs-fp-v pv-text">45.00</span>
                    <span id="dcsFpUnit" class="dcs-fp-unit">kg/cm²G</span>
                  </div>
                  <div class="dcs-fp-val-row">
                    <span class="dcs-fp-k">SP (القيمة المحددة):</span>
                    <div class="dcs-fp-sp-ctrl">
                      <button id="dcsFpSpDec" class="dcs-fp-btn-step">-</button>
                      <input id="dcsFpValSP" class="dcs-fp-input-sp" type="number" step="0.5" value="45.00"/>
                      <button id="dcsFpSpInc" class="dcs-fp-btn-step">+</button>
                    </div>
                  </div>
                  <div class="dcs-fp-val-row">
                    <span class="dcs-fp-k">MV (فتحة الصمام):</span>
                    <span id="dcsFpValMV" class="dcs-fp-v mv-text">62.4 %</span>
                  </div>
                  <div class="dcs-fp-val-row">
                    <span class="dcs-fp-k">الانحراف (DEV):</span>
                    <span id="dcsFpValDev" class="dcs-fp-v" style="color:#00e5aa;">0.00 %</span>
                  </div>
                </div>
              </div>

              <!-- Mode Selector -->
              <div class="dcs-fp-mode-selector">
                <button class="dcs-fp-mbtn active" data-mode="AUTO">AUTO</button>
                <button class="dcs-fp-mbtn" data-mode="MAN">MAN</button>
                <button class="dcs-fp-mbtn" data-mode="CAS">CAS</button>
              </div>

              <!-- Slider for Output % (MAN mode) -->
              <div class="dcs-fp-slider-sec">
                <div style="display:flex;justify-content:space-between;font-size:10.5px;color:#94a3b8;">
                  <span>موضع الصمام اليدوي (Manual Valve Output):</span>
                  <span id="dcsFpSliderVal">62.4%</span>
                </div>
                <input id="dcsFpMvSlider" type="range" min="0" max="100" value="62" class="dcs-fp-range"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.resetZoom();
  }

  // ==========================================
  // STREAM BALANCE TABLE MODAL
  // ==========================================
  private renderStreamBalanceTable(): string {
    const streams = this.getStreams();
    const streamKeys = Object.keys(streams).map(Number);
    const sheet = this.getSheetInfo();

    // Check what components have values
    const hasNH3 = streamKeys.some(k => streams[k].comp.nh3 && streams[k].comp.nh3 !== '-' && streams[k].comp.nh3 !== '0');
    const hasUrea = streamKeys.some(k => streams[k].comp.urea && streams[k].comp.urea !== '-' && streams[k].comp.urea !== '0');
    const hasBiuret = streamKeys.some(k => streams[k].comp.biuret && streams[k].comp.biuret !== '-' && streams[k].comp.biuret !== '0');
    const hasInerts = streamKeys.some(k => streams[k].comp.inerts && streams[k].comp.inerts !== '-' && streams[k].comp.inerts !== '0');
    const hasAir = streamKeys.some(k => streams[k].comp.air && streams[k].comp.air !== '-' && streams[k].comp.air !== '0');
    const hasO2 = streamKeys.some(k => streams[k].comp.o2 && streams[k].comp.o2 !== '-' && streams[k].comp.o2 !== '0');
    const hasC2H6 = streamKeys.some(k => streams[k].comp.c2h6 && streams[k].comp.c2h6 !== '-' && streams[k].comp.c2h6 !== '0');
    const hasC3H8 = streamKeys.some(k => streams[k].comp.c3h8 && streams[k].comp.c3h8 !== '-' && streams[k].comp.c3h8 !== '0');
    const hasC4H10 = streamKeys.some(k => streams[k].comp.c4h10 && streams[k].comp.c4h10 !== '-' && streams[k].comp.c4h10 !== '0');
    const hasC5H12 = streamKeys.some(k => streams[k].comp.c5h12 && streams[k].comp.c5h12 !== '-' && streams[k].comp.c5h12 !== '0');
    const hasC6Plus = streamKeys.some(k => streams[k].comp.c6plus && streams[k].comp.c6plus !== '-' && streams[k].comp.c6plus !== '0');

    return `
      <table class="pfd-table">
        <thead>
          <tr>
            <th style="text-align:right;width:220px;">Stream Parameter / المكونات</th>
            ${streamKeys.map(k => `<th>[${k}]<br><span style="font-size:9px;font-weight:normal;color:#94a3b8;">${streams[k].name}</span></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr class="pfd-trow-highlight">
            <td style="text-align:right;font-weight:bold;">الاسم العربي للمسار</td>
            ${streamKeys.map(k => `<td style="font-size:9.5px;font-family:'Cairo',sans-serif;">${streams[k].nameAr}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Pressure (kg/cm²A)</td>
            ${streamKeys.map(k => `<td style="color:#00c8ef;font-weight:bold;">${streams[k].pressure}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Temperature (°C)</td>
            ${streamKeys.map(k => `<td style="color:#fbbf24;font-weight:bold;">${streams[k].temperature}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Flow (kg/h)</td>
            ${streamKeys.map(k => `<td style="color:#10b981;font-weight:bold;">${streams[k].flowKgH || '-'}</td>`).join('')}
          </tr>
          <tr class="pfd-trow-sec">
            <td colspan="${streamKeys.length + 1}" style="text-align:right;">تراكيب الغاز والمواد (Composition Wt% / Mol%)</td>
          </tr>
          ${hasUrea ? `
          <tr>
            <td style="text-align:right;color:#10b981;font-weight:bold;">Urea (NH2-CO-NH2)</td>
            ${streamKeys.map(k => `<td style="color:#10b981;font-weight:bold;">${streams[k].comp.urea || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasBiuret ? `
          <tr>
            <td style="text-align:right;color:#ec4899;">Biuret</td>
            ${streamKeys.map(k => `<td style="color:#ec4899;">${streams[k].comp.biuret || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasInerts ? `
          <tr>
            <td style="text-align:right;color:#94a3b8;">Inerts / Passivation</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.inerts || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasAir ? `
          <tr>
            <td style="text-align:right;color:#a78bfa;">Passivation Air</td>
            ${streamKeys.map(k => `<td style="color:#a78bfa;">${streams[k].comp.air || '-'}</td>`).join('')}
          </tr>` : ''}
          <tr>
            <td style="text-align:right;">CO (Carbon Monoxide)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.co || '-'}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">CO2 (Carbon Dioxide)</td>
            ${streamKeys.map(k => `<td style="font-weight:bold;color:${parseFloat(streams[k].comp.co2 || '0') > 50 ? '#ef4444' : '#38bdf8'};">${streams[k].comp.co2 || '-'}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">H2 (Hydrogen)</td>
            ${streamKeys.map(k => `<td style="color:#38bdf8;">${streams[k].comp.h2 || '-'}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">N2 (Nitrogen)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.n2 || '-'}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Ar (Argon)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.ar || '-'}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">CH4 (Methane)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.ch4 || '-'}</td>`).join('')}
          </tr>
          ${hasNH3 ? `
          <tr>
            <td style="text-align:right;">NH3 (Ammonia)</td>
            ${streamKeys.map(k => `<td style="color:#a855f7;font-weight:bold;">${streams[k].comp.nh3 || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasO2 ? `
          <tr>
            <td style="text-align:right;">O2 (Oxygen)</td>
            ${streamKeys.map(k => `<td style="color:#ef4444;">${streams[k].comp.o2 || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasC2H6 ? `
          <tr>
            <td style="text-align:right;">C2H6 (Ethane)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.c2h6 || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasC3H8 ? `
          <tr>
            <td style="text-align:right;">C3H8 (Propane)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.c3h8 || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasC4H10 ? `
          <tr>
            <td style="text-align:right;">C4H10 (Butanes)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.c4h10 || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasC5H12 ? `
          <tr>
            <td style="text-align:right;">C5H12 (Pentanes)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.c5h12 || '-'}</td>`).join('')}
          </tr>` : ''}
          ${hasC6Plus ? `
          <tr>
            <td style="text-align:right;">C6+ (Hexane Plus)</td>
            ${streamKeys.map(k => `<td>${streams[k].comp.c6plus || '-'}</td>`).join('')}
          </tr>` : ''}
          <tr class="pfd-trow-sec">
            <td colspan="${streamKeys.length + 1}" style="text-align:right;">الموازنة الكلية والوزن الجزيئي (Total Balance & M.W.)</td>
          </tr>
          <tr>
            <td style="text-align:right;">Total Dry Gas (kg-mol/h)</td>
            ${streamKeys.map(k => `<td>${streams[k].dryGasMolH}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">H2O Steam (kg-mol/h)</td>
            ${streamKeys.map(k => `<td style="color:#38bdf8;">${streams[k].h2oMolH}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Total Wet Gas (kg-mol/h)</td>
            ${streamKeys.map(k => `<td style="font-weight:bold;">${streams[k].wetGasMolH}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Dry Gas Flow (t/h)</td>
            ${streamKeys.map(k => `<td>${streams[k].dryGasTh || '-'}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Wet Gas Flow (t/h)</td>
            ${streamKeys.map(k => `<td style="color:#10b981;">${streams[k].wetGasTh || '-'}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Dry Molecular Weight (M.W.)</td>
            ${streamKeys.map(k => `<td>${streams[k].dryMw}</td>`).join('')}
          </tr>
          <tr>
            <td style="text-align:right;">Wet Molecular Weight (M.W.)</td>
            ${streamKeys.map(k => `<td>${streams[k].wetMw}</td>`).join('')}
          </tr>
        </tbody>
      </table>
    `;
  }

  // ==========================================
  // EVENT BINDINGS & INTERACTIONS
  // ==========================================
  private bindEvents() {
    this.svgElem = document.getElementById('pfdSvg') as unknown as SVGSVGElement;
    this.zoomGroup = document.getElementById('pfdZoomGroup') as unknown as SVGGElement;
    const canvasWrapper = document.getElementById('pfdCanvasWrapper');
    if (!canvasWrapper || !this.svgElem) return;

    // Initialize ViewBox Camera Frame
    this.applyViewBox();

    // Toggle DCS Sidebar Button
    const btnToggleSb = document.getElementById('pfd-btn-toggle-dcs-sidebar');
    const dcsSidebar = document.getElementById('dcsSectionSidebar');
    if (btnToggleSb && dcsSidebar) {
      btnToggleSb.addEventListener('click', () => {
        this.isDcsSidebarOpen = !this.isDcsSidebarOpen;
        dcsSidebar.classList.toggle('open', this.isDcsSidebarOpen);
      });
    }

    const btnCloseSb = document.getElementById('dcs-sb-close-btn');
    if (btnCloseSb && dcsSidebar) {
      btnCloseSb.addEventListener('click', () => {
        this.isDcsSidebarOpen = false;
        dcsSidebar.classList.remove('open');
      });
    }

    // DCS Sheet Switchers (in Sidebar)
    document.querySelectorAll('.dcs-sheet-item[data-sheet]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sheetId = (e.currentTarget as HTMLElement).getAttribute('data-sheet') as any;
        if (sheetId) {
          this.switchSheet(sheetId);
        }
      });
    });

    // Quick Equipment Pills in Sidebar
    document.querySelectorAll('.dcs-eq-pill[data-eq]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const tag = (e.currentTarget as HTMLElement).getAttribute('data-eq');
        if (tag) this.selectEquipment(tag);
      });
    });

    // DCS PID Loop Pills in Sidebar
    document.querySelectorAll('.dcs-loop-pill[data-loop]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const tag = (e.currentTarget as HTMLElement).getAttribute('data-loop');
        if (tag) this.openFaceplate(tag);
      });
    });

    // Lock / Unlock Viewport Button
    document.getElementById('pfd-btn-lock')?.addEventListener('click', () => {
      this.toggleLock();
    });

    // Exit Button
    const btnExit = document.getElementById('pfd-btn-exit');
    if (btnExit) {
      btnExit.addEventListener('click', () => {
        if ((window as any).closeAllOverlaysAndGoHome) {
          (window as any).closeAllOverlaysAndGoHome();
        }
      });
    }

    // High-Definition Zoom & Centering Buttons
    document.getElementById('pfd-btn-zoom-in')?.addEventListener('click', () => this.zoom(1.25));
    document.getElementById('pfd-btn-zoom-out')?.addEventListener('click', () => this.zoom(0.8));
    document.getElementById('pfd-btn-zoom-100')?.addEventListener('click', () => this.resetZoom());
    document.getElementById('pfd-btn-zoom-reset')?.addEventListener('click', () => this.resetZoom());

    // Stream Table Drawer Toggle
    const drawer = document.getElementById('pfdStreamDrawer');
    document.getElementById('pfd-btn-stream-table')?.addEventListener('click', () => {
      if (drawer) {
        drawer.style.display = drawer.style.display === 'none' ? 'flex' : 'none';
      }
    });
    document.getElementById('pfdStdClose')?.addEventListener('click', () => {
      if (drawer) drawer.style.display = 'none';
    });

    // Animation Toggle
    document.getElementById('pfd-btn-anim')?.addEventListener('click', (e) => {
      this.showParticles = !this.showParticles;
      (e.currentTarget as HTMLElement).innerHTML = `<span>⚡</span> ${this.showParticles ? 'إيقاف الحركة' : 'تشغيل الحركة'}`;
      document.querySelectorAll('.pfd-pipe-anim').forEach(el => {
        el.classList.toggle('paused', !this.showParticles);
      });
    });

    // Inspector Close
    document.getElementById('pfdInspClose')?.addEventListener('click', () => {
      const sidebar = document.getElementById('pfdInspectorSidebar');
      if (sidebar) sidebar.classList.remove('active');
      document.querySelectorAll('.pfd-eq-item').forEach(el => el.classList.remove('selected'));
    });

    // Smooth Double-Click Zoom Centered on Point
    canvasWrapper.addEventListener('dblclick', (e: MouseEvent) => {
      if (this.isLocked || !this.svgElem) return;
      if ((e.target as HTMLElement).closest('.pfd-eq-item') || 
          (e.target as HTMLElement).closest('.pfd-stream-flag') ||
          (e.target as HTMLElement).closest('.pfd-ctrl-badge') ||
          (e.target as HTMLElement).closest('button')) {
        return;
      }
      const rect = this.svgElem.getBoundingClientRect();
      const clientXRatio = (e.clientX - rect.left) / (rect.width || 1);
      const clientYRatio = (e.clientY - rect.top) / (rect.height || 1);
      const cursorSvgX = this.vbX + clientXRatio * this.vbW;
      const cursorSvgY = this.vbY + clientYRatio * this.vbH;
      const factor = e.shiftKey ? 0.67 : 1.45;
      const targetZoom = Math.min(Math.max(this.currentZoom * factor, 0.4), 4.5);
      const newW = this.baseW / targetZoom;
      const newH = this.baseH / targetZoom;
      this.vbX = cursorSvgX - clientXRatio * newW;
      this.vbY = cursorSvgY - clientYRatio * newH;
      this.vbW = newW;
      this.vbH = newH;
      this.currentZoom = targetZoom;
      this.clampViewBox();
      this.applyViewBox();
    });

    // Mouse Pan & Drag via Native SVG ViewBox Tracking (Zero Blurriness)
    canvasWrapper.addEventListener('mousedown', (e: MouseEvent) => {
      if (this.isLocked) return;
      if ((e.target as HTMLElement).closest('.pfd-eq-item') || 
          (e.target as HTMLElement).closest('.pfd-stream-flag') ||
          (e.target as HTMLElement).closest('.pfd-ctrl-badge') ||
          (e.target as HTMLElement).closest('button')) {
        return;
      }
      this.isDragging = true;
      this.dragMoved = false;
      this.startMouseX = e.clientX;
      this.startMouseY = e.clientY;
      canvasWrapper.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDragging || this.isLocked || !this.svgElem) return;
      const dxScreen = e.clientX - this.startMouseX;
      const dyScreen = e.clientY - this.startMouseY;
      if (Math.hypot(dxScreen, dyScreen) > 3) {
        this.dragMoved = true;
        const rect = this.svgElem.getBoundingClientRect();
        const scaleX = this.vbW / (rect.width || 1);
        const scaleY = this.vbH / (rect.height || 1);
        this.vbX -= dxScreen * scaleX;
        this.vbY -= dyScreen * scaleY;
        this.startMouseX = e.clientX;
        this.startMouseY = e.clientY;
        this.clampViewBox();
        this.applyViewBox();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (canvasWrapper) canvasWrapper.style.cursor = 'grab';
      }
    });

    // Ultra-High-Definition Wheel Zoom with Exact Cursor Anchoring
    canvasWrapper.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      if (!this.svgElem) return;
      const rect = this.svgElem.getBoundingClientRect();
      const clientXRatio = (e.clientX - rect.left) / (rect.width || 1);
      const clientYRatio = (e.clientY - rect.top) / (rect.height || 1);

      const cursorSvgX = this.vbX + clientXRatio * this.vbW;
      const cursorSvgY = this.vbY + clientYRatio * this.vbH;

      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      const targetZoom = Math.min(Math.max(this.currentZoom * factor, 0.4), 4.5);
      const newW = this.baseW / targetZoom;
      const newH = this.baseH / targetZoom;

      this.vbX = cursorSvgX - clientXRatio * newW;
      this.vbY = cursorSvgY - clientYRatio * newH;
      this.vbW = newW;
      this.vbH = newH;
      this.currentZoom = targetZoom;

      this.clampViewBox();
      this.applyViewBox();
    }, { passive: false });

    // Filter Buttons
    document.querySelectorAll('.pfd-ftab[data-sec]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.pfd-ftab[data-sec]').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        const sec = (e.currentTarget as HTMLElement).getAttribute('data-sec') || 'all';
        this.filterSection(sec);
      });
    });

    // Delegate Click on Equipment & Controllers in SVG
    this.svgElem.addEventListener('click', (e: MouseEvent) => {
      if (this.dragMoved) return; // Ignore drag clicks
      const target = e.target as HTMLElement;

      // DCS Controller Tag Click
      const ctrlBadge = target.closest('.pfd-ctrl-badge') || target.closest('[data-ctrl]') || target.closest('.pfd-ctrl-item') || target.closest('[data-loop]');
      if (ctrlBadge) {
        const ctag = ctrlBadge.getAttribute('data-ctrl') || ctrlBadge.getAttribute('data-loop') || ctrlBadge.textContent?.trim();
        if (ctag && DCS_LOOPS[ctag]) {
          this.openFaceplate(ctag);
          return;
        }
      }

      // Equipment Click
      const eqGroup = target.closest('.pfd-eq-item') || target.closest('.pfd-sub-eq') || target.closest('.pfd-eq-group');
      if (eqGroup) {
        let tag = eqGroup.getAttribute('data-tag');
        if (!tag && eqGroup.id && eqGroup.id.startsWith('eq-')) {
          tag = eqGroup.id.replace('eq-', '');
        }
        if (tag) this.selectEquipment(tag);
        return;
      }

      // Stream Flag Click
      const streamFlag = target.closest('.pfd-stream-flag') || target.closest('.pfd-stream-badge');
      if (streamFlag) {
        let sid = Number(streamFlag.getAttribute('data-stream')) || Number(streamFlag.getAttribute('data-st'));
        if (!sid && streamFlag.id && streamFlag.id.startsWith('st-flag-')) {
          sid = Number(streamFlag.id.replace('st-flag-', ''));
        }
        if (sid) this.showStreamModal(sid);
      }
    });

    // Faceplate Modal Events
    document.getElementById('dcsFpClose')?.addEventListener('click', () => {
      this.closeFaceplate();
    });

    // Faceplate SP +/- Step
    document.getElementById('dcsFpSpInc')?.addEventListener('click', () => {
      if (this.activeFaceplateTag && DCS_LOOPS[this.activeFaceplateTag]) {
        const l = DCS_LOOPS[this.activeFaceplateTag];
        l.sp = Number((l.sp + 1.0).toFixed(1));
        (document.getElementById('dcsFpValSP') as HTMLInputElement).value = l.sp.toString();
        this.updateFaceplateDisplay(l);
      }
    });

    document.getElementById('dcsFpSpDec')?.addEventListener('click', () => {
      if (this.activeFaceplateTag && DCS_LOOPS[this.activeFaceplateTag]) {
        const l = DCS_LOOPS[this.activeFaceplateTag];
        l.sp = Math.max(l.min, Number((l.sp - 1.0).toFixed(1)));
        (document.getElementById('dcsFpValSP') as HTMLInputElement).value = l.sp.toString();
        this.updateFaceplateDisplay(l);
      }
    });

    // Faceplate Mode Buttons
    document.querySelectorAll('.dcs-fp-mbtn[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.dcs-fp-mbtn[data-mode]').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        const mode = (e.currentTarget as HTMLElement).getAttribute('data-mode') as any;
        if (this.activeFaceplateTag && DCS_LOOPS[this.activeFaceplateTag]) {
          DCS_LOOPS[this.activeFaceplateTag].mode = mode;
          const badge = document.getElementById('dcsFpMode');
          if (badge) badge.textContent = mode;
        }
      });
    });

    // Faceplate MV Slider
    const mvSlider = document.getElementById('dcsFpMvSlider') as HTMLInputElement;
    if (mvSlider) {
      mvSlider.addEventListener('input', (e) => {
        const val = Number((e.target as HTMLInputElement).value);
        document.getElementById('dcsFpSliderVal')!.textContent = `${val}%`;
        if (this.activeFaceplateTag && DCS_LOOPS[this.activeFaceplateTag]) {
          DCS_LOOPS[this.activeFaceplateTag].mv = val;
          document.getElementById('dcsFpValMV')!.textContent = `${val.toFixed(1)} %`;
        }
      });
    }
  }

  public toggleLock() {
    this.isLocked = !this.isLocked;
    const btn = document.getElementById('pfd-btn-lock');
    const canvas = document.getElementById('pfdCanvasWrapper');
    if (btn) {
      btn.classList.toggle('dcs-btn-locked', this.isLocked);
      btn.innerHTML = `<span>${this.isLocked ? '🔒' : '🔓'}</span><span>${this.isLocked ? 'اللوحة مقفلة (ثابتة)' : 'قفل اللوحة'}</span>`;
    }
    if (canvas) {
      canvas.classList.toggle('locked-canvas', this.isLocked);
      let badge = canvas.querySelector('.dcs-canvas-lock-badge');
      if (this.isLocked && !badge) {
        const b = document.createElement('div');
        b.className = 'dcs-canvas-lock-badge';
        b.innerHTML = '<span>🔒</span> اللوحة مثبتة بالكامل ومقفلة (Canvas Locked)';
        canvas.prepend(b);
      } else if (!this.isLocked && badge) {
        badge.remove();
      }
    }
  }

  public openFaceplate(tag: string) {
    const loop = DCS_LOOPS[tag];
    if (!loop) return;
    this.activeFaceplateTag = tag;
    const modal = document.getElementById('dcsFaceplateModal');
    if (!modal) return;
    modal.style.display = 'flex';

    document.getElementById('dcsFpTag')!.textContent = loop.tag;
    document.getElementById('dcsFpMode')!.textContent = loop.mode;
    document.getElementById('dcsFpDesc')!.textContent = loop.name;
    document.getElementById('dcsFpDescAr')!.textContent = loop.nameAr;
    document.getElementById('dcsFpUnit')!.textContent = loop.unit;
    (document.getElementById('dcsFpValSP') as HTMLInputElement).value = loop.sp.toString();

    this.updateFaceplateDisplay(loop);

    if (this.faceplateInterval) clearInterval(this.faceplateInterval);
    this.faceplateInterval = setInterval(() => {
      if (!this.activeFaceplateTag) return;
      const l = DCS_LOOPS[this.activeFaceplateTag];
      if (l) {
        const noise = (Math.random() - 0.5) * (l.max - l.min) * 0.006;
        l.pv = Number((l.sp + noise).toFixed(2));
        const dev = (((l.pv - l.sp) / (l.max - l.min)) * 100).toFixed(2);
        const devElem = document.getElementById('dcsFpValDev');
        if (devElem) devElem.textContent = `${Number(dev) >= 0 ? '+' : ''}${dev} %`;
        this.updateFaceplateDisplay(l);
      }
    }, 1000);
  }

  public closeFaceplate() {
    this.activeFaceplateTag = null;
    if (this.faceplateInterval) clearInterval(this.faceplateInterval);
    const modal = document.getElementById('dcsFaceplateModal');
    if (modal) modal.style.display = 'none';
  }

  private updateFaceplateDisplay(loop: DCSControllerLoop) {
    const pvElem = document.getElementById('dcsFpValPV');
    if (pvElem) pvElem.textContent = loop.pv.toFixed(1);
    const mvElem = document.getElementById('dcsFpValMV');
    if (mvElem) mvElem.textContent = `${loop.mv.toFixed(1)} %`;

    const range = Math.max(1, loop.max - loop.min);
    const pvPct = Math.min(100, Math.max(0, ((loop.pv - loop.min) / range) * 100));
    const spPct = Math.min(100, Math.max(0, ((loop.sp - loop.min) / range) * 100));
    
    const pvBar = document.getElementById('dcsFpBarFillPV');
    if (pvBar) pvBar.style.height = `${pvPct}%`;
    const spMarker = document.getElementById('dcsFpSpMarker');
    if (spMarker) spMarker.style.bottom = `${spPct}%`;
  }

  private applyViewBox() {
    if (!this.svgElem) return;
    this.svgElem.setAttribute('viewBox', `${this.vbX.toFixed(1)} ${this.vbY.toFixed(1)} ${this.vbW.toFixed(1)} ${this.vbH.toFixed(1)}`);
    const zoomPct = Math.round((this.baseW / this.vbW) * 100);
    const label = document.getElementById('pfd-zoom-label');
    if (label) {
      label.textContent = `${zoomPct}%`;
    }
  }

  private clampViewBox() {
    const marginX = this.vbW * 0.7;
    const marginY = this.vbH * 0.7;
    const minX = -marginX;
    const maxX = this.baseW + marginX - this.vbW;
    const minY = -marginY;
    const maxY = this.baseH + marginY - this.vbH;
    this.vbX = Math.max(minX, Math.min(maxX, this.vbX));
    this.vbY = Math.max(minY, Math.min(maxY, this.vbY));
  }

  public focusArea(cx: number, cy: number, spanW = 1200, spanH = 650) {
    this.vbW = Math.min(this.baseW, Math.max(400, spanW));
    this.vbH = Math.min(this.baseH, Math.max(250, spanH));
    this.vbX = cx - this.vbW / 2;
    this.vbY = cy - this.vbH / 2;
    this.currentZoom = this.baseW / this.vbW;
    this.clampViewBox();
    this.applyViewBox();
  }

  private filterSection(sec: string) {
    if (sec === 'all') {
      this.resetZoom();
      return;
    }

    if (this.currentSheet === 'steam_header') {
      if (sec === 's65') {
        this.focusArea(950, 230, 1500, 480);
        this.selectEquipment('S-65');
      } else if (sec === 's39') {
        this.focusArea(950, 450, 1500, 480);
        this.selectEquipment('S-39');
      } else if (sec === 's12') {
        this.focusArea(950, 670, 1500, 480);
        this.selectEquipment('S-12');
      } else if (sec === 's3') {
        this.focusArea(950, 890, 1500, 480);
        this.selectEquipment('S-3');
      }
    } else if (this.currentSheet === 'steam_bfw') {
      if (sec === 'deaeration') {
        this.focusArea(480, 320, 950, 550);
        this.selectEquipment('V-103');
      } else if (sec === 'preheating') {
        this.focusArea(950, 360, 1000, 550);
        this.selectEquipment('E-105A');
      } else if (sec === 'steam_drums') {
        this.focusArea(1500, 300, 1100, 600);
        this.selectEquipment('V-102');
      } else if (sec === 'lp_distribution') {
        this.focusArea(2150, 480, 1100, 550);
        this.selectEquipment('P-104');
      }
    } else if (this.currentSheet === 'urea_500') {
      if (sec === 'co2_comp') {
        this.focusArea(260, 320, 950, 550);
        this.selectEquipment('K-501');
      } else if (sec === 'synthesis_loop') {
        this.focusArea(780, 320, 1050, 600);
        this.selectEquipment('R-501');
      } else if (sec === 'mp_section') {
        this.focusArea(1250, 350, 1000, 550);
        this.selectEquipment('V-502');
      } else if (sec === 'lp_section') {
        this.focusArea(1650, 350, 1000, 550);
        this.selectEquipment('V-504');
      } else if (sec === 'waste_water') {
        this.focusArea(2000, 350, 1000, 550);
        this.selectEquipment('T-502');
      } else if (sec === 'vacuum_evap') {
        this.focusArea(2380, 350, 1000, 550);
        this.selectEquipment('E-561');
      } else if (sec === 'prilling_finishing') {
        this.focusArea(2800, 450, 1000, 650);
        this.selectEquipment('T-571');
      }
    } else if (this.currentSheet === 'synth_400') {
      if (sec === 'synth_loop') {
        this.focusArea(1400, 300, 1300, 700);
        this.selectEquipment('R-401');
      } else if (sec === 'chilling_sep') {
        this.focusArea(480, 380, 1100, 600);
        this.selectEquipment('E-406');
      } else if (sec === 'letdown') {
        this.focusArea(550, 520, 1100, 600);
        this.selectEquipment('V-409');
      } else if (sec === 'refrig_comp') {
        this.focusArea(250, 650, 950, 550);
        this.selectEquipment('K-401');
      } else if (sec === 'refrig_sep') {
        this.focusArea(680, 620, 1000, 550);
        this.selectEquipment('V-405');
      } else if (sec === 'purge_rec') {
        this.focusArea(1500, 600, 1100, 600);
        this.selectEquipment('E-408');
      } else if (sec === 'startup_h401') {
        this.focusArea(220, 460, 600, 450);
        this.selectEquipment('H-401');
      }
    } else if (this.currentSheet === 'comp_300') {
      if (sec === 'k301') {
        this.focusArea(300, 320, 950, 600);
        this.selectEquipment('K-301');
      } else if (sec === 'k302') {
        this.focusArea(800, 360, 1000, 600);
        this.selectEquipment('K-302');
      } else if (sec === 'k303') {
        this.focusArea(1350, 360, 1000, 600);
        this.selectEquipment('K-303');
      } else if (sec === 'coolers_sep') {
        this.focusArea(550, 220, 1200, 600);
        this.selectEquipment('E-301');
      }
    } else if (this.currentSheet === 'co2_200') {
      if (sec === 'absorber') {
        this.focusArea(480, 350, 1000, 600);
        this.selectEquipment('T-201');
      } else if (sec === 'regenerator') {
        this.focusArea(1000, 350, 1000, 600);
        this.selectEquipment('T-202');
      } else if (sec === 'reboilers') {
        this.focusArea(1400, 450, 1000, 550);
        this.selectEquipment('E-201');
      } else if (sec === 'degasser') {
        this.focusArea(1850, 400, 1000, 550);
        this.selectEquipment('V-209');
      }
    } else {
      if (sec === 'reformer') {
        this.focusArea(340, 320, 1050, 550);
        this.selectEquipment('R-101');
      } else if (sec === 'shift') {
        this.focusArea(900, 320, 1100, 550);
        this.selectEquipment('R-104');
      } else if (sec === 'methanation') {
        this.focusArea(1400, 320, 1100, 550);
        this.selectEquipment('R-105');
      }
    }
  }

  public selectEquipment(tag: string) {
    this.selectedItem = tag;
    const eqList = this.getEquipment();
    const eq = eqList[tag];
    if (!eq) return;

    // Highlight in SVG
    document.querySelectorAll('.pfd-eq-item').forEach(el => {
      if (el.getAttribute('data-tag') === tag) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });

    const sidebar = document.getElementById('pfdInspectorSidebar');
    if (!sidebar) return;
    sidebar.classList.add('active');

    document.getElementById('pfdInspTag')!.textContent = eq.tag;
    document.getElementById('pfdInspTitle')!.textContent = eq.name;
    document.getElementById('pfdInspNameAr')!.textContent = eq.nameAr;
    document.getElementById('pfdInspDesc')!.textContent = eq.descAr;

    const specsContainer = document.getElementById('pfdInspSpecs')!;
    let specsHtml = '';
    if (eq.duty) specsHtml += `<div class="pfd-spec-row"><span class="pfd-spec-k">الحمل الحراري (Duty Q):</span><span class="pfd-spec-v highlight">${eq.duty}</span></div>`;
    if (eq.deltaP) specsHtml += `<div class="pfd-spec-row"><span class="pfd-spec-k">هبوط الضغط (ΔP):</span><span class="pfd-spec-v">${eq.deltaP}</span></div>`;
    if (eq.tempIn) specsHtml += `<div class="pfd-spec-row"><span class="pfd-spec-k">حرارة الدخول (Temp In):</span><span class="pfd-spec-v">${eq.tempIn}</span></div>`;
    if (eq.tempOut) specsHtml += `<div class="pfd-spec-row"><span class="pfd-spec-k">حرارة الخروج (Temp Out):</span><span class="pfd-spec-v">${eq.tempOut}</span></div>`;
    if (eq.pressIn) specsHtml += `<div class="pfd-spec-row"><span class="pfd-spec-k">ضغط الدخول (Press In):</span><span class="pfd-spec-v">${eq.pressIn}</span></div>`;
    if (eq.pressOut) specsHtml += `<div class="pfd-spec-row"><span class="pfd-spec-k">ضغط الخروج (Press Out):</span><span class="pfd-spec-v">${eq.pressOut}</span></div>`;
    if (eq.catalyst) specsHtml += `<div class="pfd-spec-row"><span class="pfd-spec-k">العامل الحفاز / الحشوة:</span><span class="pfd-spec-v cat">${eq.catalyst}</span></div>`;
    specsContainer.innerHTML = specsHtml;
  }

  public showStreamModal(streamId: number) {
    const streams = this.getStreams();
    const st = streams[streamId];
    if (!st) return;

    const drawer = document.getElementById('pfdStreamDrawer');
    if (drawer) {
      drawer.style.display = 'flex';
    }
  }

  private zoom(factor: number) {
    const targetZoom = Math.min(Math.max(this.currentZoom * factor, 0.4), 4.5);
    const newW = this.baseW / targetZoom;
    const newH = this.baseH / targetZoom;
    this.vbX += (this.vbW - newW) / 2;
    this.vbY += (this.vbH - newH) / 2;
    this.vbW = newW;
    this.vbH = newH;
    this.currentZoom = targetZoom;
    this.clampViewBox();
    this.applyViewBox();
  }

  private resetZoom() {
    this.currentZoom = 1.0;
    this.vbX = 0;
    this.vbY = 0;
    this.vbW = this.baseW;
    this.vbH = this.baseH;
    this.applyViewBox();
  }
}

export const plantDiagram2D = new PlantDiagram2D();
