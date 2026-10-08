// Ficción para revisión. Fecha fija: mantiene las cifras del diseño reproducibles.
export const REFERENCE_DATE = '2026-10-08';
export const TENDERS = [
  ['1025-14-LE26','Reposición de luminarias LED en espacios públicos','Rancagua','O’Higgins',32000000,'2026-10-08',2,'2026-10-07','Publicada'],
  ['2447-19-LE26','Conservación de infraestructura comunitaria','La Serena','Coquimbo',36000000,'2026-10-21',0,'2026-10-06','Publicada'],
  ['2324-61-LP26','Rehabilitación de veredas y accesos peatonales','Puerto Montt','Los Lagos',95000000,'2026-10-16',6,'2026-10-05','Publicada'],
  ['2408-32-LE26','Servicios de aseo para edificios municipales','Los Ángeles','Biobío',27200000,'2026-10-13',2,'2026-10-03','Publicada'],
  ['2770-21-LE26','Adquisición de equipamiento deportivo comunitario','Maipú','Metropolitana',18900000,'2026-10-10',1,'2026-10-02','Publicada'],
  ['2410-38-LE26','Mantención de áreas verdes sector norte','Temuco','La Araucanía',48500000,'2026-10-14',3,'2026-10-01','Publicada'],
  ['2421-52-LP26','Reparación de pavimentos en el centro urbano','Valparaíso','Valparaíso',76000000,'2026-10-09',5,'2026-10-01','Publicada'],
  ['2295-45-LE26','Mejoramiento de plazas y mobiliario urbano','Talca','Maule',54000000,'2026-10-12',4,'2026-09-29','Publicada'],
  ['2671-18-LE26','Servicio de mantenimiento de cámaras municipales','Concepción','Biobío',22000000,'2026-10-05',2,'2026-09-27','Cerrada'],
  ['2410-22-LE26','Conservación de caminos vecinales','Temuco','La Araucanía',35000000,'2026-10-01',0,'2026-09-24','Desierta'],
  ['2770-12-LE26','Suministro de mobiliario para sedes comunitarias','Maipú','Metropolitana',12800000,'2026-09-29',1,'2026-09-20','Adjudicada']
].map(([code,name,municipality,region,amount,close,offers,pub,status]) => ({code,name,municipality:`Municipalidad de ${municipality}`,region,amount,close,offers,pub,status}));
export const REGIONS = [...new Set(TENDERS.map(t=>t.region))].sort((a,b)=>a.localeCompare(b,'es'));
export const STATUSES = ['Publicada','Cerrada','Adjudicada','Desierta'];
