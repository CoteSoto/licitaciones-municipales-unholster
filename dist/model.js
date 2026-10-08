import { REFERENCE_DATE, REGIONS, STATUSES } from './data.js';
export const PAGE_SIZE = 10;
export const SORT_KEYS = ['pub','name','municipality','status','amount','close','offers'];
export const DEMO_STATES = ['carga','vacio','error'];
export const normalize = s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();
export const days = (date,ref=REFERENCE_DATE)=>(Date.parse(date+'T00:00:00Z')-Date.parse(ref+'T00:00:00Z'))/86400000;
export function isDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s; }
export function readQuery(search) {
  const p=new URLSearchParams(search);
  return { q:(p.get('q')??'').slice(0,250),region:REGIONS.includes(p.get('region'))?p.get('region'):'',status:STATUSES.includes(p.get('situacion'))?p.get('situacion'):'',from:isDate(p.get('desde')??'')?p.get('desde'):'',to:isDate(p.get('hasta')??'')?p.get('hasta'):'',sort:SORT_KEYS.includes(p.get('orden'))?p.get('orden'):'pub',direction:p.get('direccion')==='asc'?'asc':'desc',page:Math.max(1,Math.min(100000,Number.parseInt(p.get('pagina'),10)||1)),demo:DEMO_STATES.includes(normalize(p.get('estado')))?normalize(p.get('estado')):''};
}
export function writeQuery(s) {
  const p=new URLSearchParams();
  for(const [key,value] of [['q',s.q],['region',s.region],['situacion',s.status],['desde',s.from],['hasta',s.to],['estado',s.demo]])if(value)p.set(key,value);
  if(s.sort!=='pub'||s.direction!=='desc'){p.set('orden',s.sort);p.set('direccion',s.direction);}
  if(s.page>1)p.set('pagina',s.page);
  return p.toString();
}
export const invalidRange=s=>Boolean(s.from&&s.to&&s.from>s.to);
export function filterRecords(records,s){
  if(invalidRange(s))return [];
  const q=normalize(s.q);
  return records.filter(t=>(!q||normalize([t.name,t.code,t.municipality].join(' ')).includes(q))&&(!s.region||t.region===s.region)&&(!s.status||t.status===s.status)&&(!s.from||t.pub>=s.from)&&(!s.to||t.pub<=s.to));
}
export function sortRecords(records,key='pub',direction='desc'){
  const collator=new Intl.Collator('es',{numeric:true,sensitivity:'base'}),sign=direction==='asc'?1:-1;
  return [...records].sort((a,b)=>{
    const x=a[key],y=b[key];if(x==null&&y==null)return collator.compare(a.code,b.code);if(x==null)return 1;if(y==null)return -1;
    const cmp=typeof x==='number'?x-y:collator.compare(String(x),String(y));return sign*cmp||collator.compare(a.code,b.code);
  });
}
export function summary(records,ref=REFERENCE_DATE){return {count:records.length,municipalities:new Set(records.map(t=>t.municipality)).size,recent:records.filter(t=>days(t.pub,ref)>=-6&&days(t.pub,ref)<=0).length,closing:records.filter(t=>t.status==='Publicada'&&days(t.close,ref)>=0&&days(t.close,ref)<=7).length,urgent:records.filter(t=>t.status==='Publicada'&&days(t.close,ref)>=0&&days(t.close,ref)<=1).length};}
export function paginate(records,page=1){const pages=Math.max(1,Math.ceil(records.length/PAGE_SIZE)),current=Math.max(1,Math.min(pages,page));return {page:current,pages,total:records.length,records:records.slice((current-1)*PAGE_SIZE,current*PAGE_SIZE),first:records.length?(current-1)*PAGE_SIZE+1:0,last:Math.min(current*PAGE_SIZE,records.length)};}
export const dateFormat=s=>s?.split('-').reverse().join('-')??'—';
export const currency=n=>n==null?'—':new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n);
export function closeHint(t){if(t.status!=='Publicada')return 'Cierre realizado';const d=days(t.close);return d<0?'Plazo vencido':d===0?'Hoy':d===1?'Mañana':`En ${d} días`;}
export const isUrgent=t=>t.status==='Publicada'&&days(t.close)>=0&&days(t.close)<=1;
