import {TENDERS,REGIONS,STATUSES} from './data.js';
import {readQuery,writeQuery,filterRecords,sortRecords,summary,paginate,dateFormat,currency,closeHint,isUrgent,invalidRange} from './model.js';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img=(name,w=16,h=w)=>`<img class="icon" src="./assets/${name}.svg" width="${w}" height="${h}" alt="">`;
const orders=[['pub:desc','Publicación reciente'],['pub:asc','Publicación antigua'],['close:asc','Cierre más próximo'],['close:desc','Cierre más lejano'],['amount:desc','Mayor monto'],['amount:asc','Menor monto'],['offers:desc','Más ofertas'],['offers:asc','Menos ofertas'],['name:asc','Licitación A–Z'],['name:desc','Licitación Z–A'],['municipality:asc','Municipalidad A–Z'],['municipality:desc','Municipalidad Z–A'],['status:asc','Estado A–Z'],['status:desc','Estado Z–A']];
const columns=[['name','Licitación'],['municipality','Municipalidad'],['status','Estado'],['amount','Monto estimado'],['close','Fecha de cierre'],['offers','Ofertas']];
let state=readQuery(location.search),busy=false,retryTimer,announceTimer;
const expanded=new Set();
function options(values,empty){return `<option value="">${empty}</option>`+values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');}
for(const id of ['region','sheet-region'])$(id).innerHTML=options(REGIONS,'Todas las regiones');
for(const id of ['status','sheet-status'])$(id).innerHTML=options(STATUSES,'Todos los estados');
for(const id of ['mobile-order','desktop-order'])$(id).innerHTML=orders.map(([v,label])=>`<option value="${v}">${label}</option>`).join('');
function syncInputs(){for(const [id,key]of [['search','q'],['region','region'],['status','status'],['from','from'],['to','to']])$(id).value=state[key];for(const id of ['mobile-order','desktop-order'])$(id).value=state.sort+':'+state.direction;}
function syncUrl(push=false){const query=writeQuery(state);history[push?'pushState':'replaceState'](null,'',location.pathname+(query?'?'+query:'')+location.hash);}
function update(patch,{resetPage=true,push=false}={}){state={...state,...patch,...(resetPage?{page:1}:{})};busy=false;clearTimeout(retryTimer);expanded.clear();syncInputs();render();syncUrl(push);}
function badge(s){return `<span class="badge ${s.toLowerCase()}">${esc(s)}</span>`;}
function announce(text){clearTimeout(announceTimer);announceTimer=setTimeout(()=>{$('announcement').textContent=text;},200);}
function metrics(rows,mode){const unavailable=mode==='error'||mode==='carga';const s=summary(rows);const vals=unavailable?['—','—','—','—']:[s.count,s.municipalities,s.recent,s.closing];
 const titles=['Licitaciones encontradas','Municipalidades representadas','Publicadas últimos 7 días','Cierran próximos 7 días'];
 const hints=unavailable?Array(4).fill('Indicador no disponible'):['Según los filtros activos','Compradores municipales distintos','Publicación: 2–8 de octubre',s.urgent?`${s.urgent} cierran hoy o mañana`:'Hasta el 15 de octubre'];
 $('metrics').innerHTML=titles.map((t,i)=>`<dl class="metric ${i===3?'closing':''}"><dt>${i===3?'<span class="mobile-clock">'+img('iconclock')+'</span>':''}${esc(t)}</dt><dd>${vals[i]}</dd><small>${i===3?img('iconclock'):''}${esc(hints[i])}</small></dl>`).join('')+`<p class="mobile-urgent">${unavailable?'Indicadores no disponibles':s.urgent?`${s.urgent} cierran hoy o mañana`:'Cierres próximos: hasta el 15 de octubre'}</p>`;
}
function chips(){const items=[['q',state.q&&`Búsqueda: ${state.q}`],['region',state.region],['status',state.status],['from',state.from&&`Desde: ${dateFormat(state.from)}`],['to',state.to&&`Hasta: ${dateFormat(state.to)}`]].filter(([,v])=>v);
 $('chips').innerHTML=items.length?items.map(([key,label])=>`<button class="chip" data-remove="${key}" aria-label="Quitar filtro ${esc(label)}"><span>${esc(label)}</span>${img('iconclosechip',16)}</button>`).join(''):'<span class="muted">Sin filtros activos</span>';
 $('clear').disabled=!items.length&&!state.demo;
 const count=[state.region,state.status,state.from,state.to].filter(Boolean).length;$('open-filters').textContent=count?`Filtros (${count})`:'Filtros';
}
function table(rows){return `<div class="table-container"><table><caption class="sr-only">Licitaciones municipales. Activa un encabezado para cambiar el orden.</caption><colgroup><col style="width:31%"><col style="width:20%"><col style="width:11%"><col style="width:14%"><col style="width:15%"><col style="width:9%"></colgroup><thead><tr>${columns.map(([key,label])=>`<th scope="col" class="${['amount','offers'].includes(key)?'numeric':''}" aria-sort="${state.sort===key?(state.direction==='asc'?'ascending':'descending'):'none'}"><button class="sort-button" data-sort="${key}" aria-label="Ordenar por ${label}, ${state.sort===key&&state.direction==='asc'?'descendente':'ascendente'}">${label}<span class="sort-arrow" aria-hidden="true">${state.sort===key?(state.direction==='asc'?'↑':'↓'):''}</span></button></th>`).join('')}</tr></thead><tbody>${rows.map(t=>`<tr><td><p class="cell-title">${esc(t.name)}</p><p class="cell-subtitle">${esc(t.code)}</p></td><td><p>${esc(t.municipality)}</p><p class="cell-subtitle">${esc(t.region)}</p></td><td>${badge(t.status)}</td><td class="numeric">${currency(t.amount)}</td><td class="date-cell"><p class="cell-title ${isUrgent(t)?'date-urgent':''}"><time datetime="${t.close}">${dateFormat(t.close)}</time></p><p class="cell-subtitle">${closeHint(t)}</p></td><td class="numeric">${t.offers}</td></tr>`).join('')}</tbody></table></div>`;}
function cards(rows){return `<div class="cards" role="list" aria-label="Licitaciones municipales">${rows.map(t=>`<article class="tender-card" role="listitem" aria-labelledby="title-${t.code}"><h3 id="title-${t.code}">${esc(t.name)}</h3><p class="muted">${esc(t.code)}</p><p class="muted">${esc(t.municipality)}</p>${badge(t.status)}<div class="card-financial"><dl><dt>Monto estimado</dt><dd>${currency(t.amount)}</dd></dl><dl><dt>Fecha de cierre</dt><dd class="${isUrgent(t)?'date-urgent':''}"><time datetime="${t.close}">${dateFormat(t.close)}</time></dd><p class="muted">${closeHint(t)}</p></dl></div><div class="card-extra" id="extra-${t.code}" ${expanded.has(t.code)?'':'hidden'}><p>Región: ${esc(t.region)}</p><p>Ofertas recibidas: ${t.offers}</p><p>Publicación: <time datetime="${t.pub}">${dateFormat(t.pub)}</time></p></div><button class="btn ghost" data-expand="${t.code}" aria-expanded="${expanded.has(t.code)}" aria-controls="extra-${t.code}" aria-label="${expanded.has(t.code)?'Ocultar':'Ver'} datos de ${esc(t.code)}">${expanded.has(t.code)?'Ver menos datos':'Ver más datos'}</button></article>`).join('')}</div>`;}
function pagination(p){$('pagination').hidden=!p.total;if(!p.total){$('pagination').innerHTML='';return;}
 $('pagination').innerHTML=`<span class="range">${p.first}–${p.last} de ${p.total} licitaciones<span class="mobile-urgent">10 por página</span></span><span class="page-size">10 por página</span><div class="page-buttons"><button class="btn" data-page="${p.page-1}" ${p.page===1?'disabled':''}>Anterior</button>${Array.from({length:p.pages},(_,i)=>`<button class="btn number ${i+1===p.page?'current':''}" data-page="${i+1}" ${i+1===p.page?'aria-current="page"':''} aria-label="Página ${i+1}">${i+1}</button>`).join('')}<button class="btn" data-page="${p.page+1}" ${p.page===p.pages?'disabled':''}>Siguiente</button></div>`;
}
function statePanel(mode){if(mode==='error')return `<div class="message error" role="alert">${img('iconalert',24)}<h3>No pudimos cargar las licitaciones</h3><p class="muted">Inténtalo nuevamente. Conservaremos tus filtros y el orden del listado.</p><button class="btn primary" data-retry>Reintentar</button></div>`;
 if(mode==='carga')return `<div class="message"><h3>Cargando licitaciones</h3><div class="skeletons" aria-hidden="true"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>${state.demo==='carga'?'<button class="btn" data-finish>Ver resultados</button>':''}</div>`;
 return `<div class="message"><h3>No hay licitaciones con estos filtros</h3><p class="muted">Prueba otra búsqueda o limpia los filtros para ampliar los resultados.</p><button class="btn primary" data-clear>Limpiar filtros</button></div>`;
}
function render(){const focus=document.activeElement;const focusSort=focus?.dataset?.sort,focusPage=focus?.dataset?.page;
 const mode=busy?'carga':state.demo;const rows=mode==='vacio'?[]:filterRecords(TENDERS,state);const sorted=sortRecords(rows,state.sort,state.direction),p=paginate(sorted,state.page);if(!['carga','error'].includes(mode))state.page=p.page;
 metrics(rows,mode);chips();$('results').setAttribute('aria-busy',String(mode==='carga'));$('result-count').textContent=['carga','error'].includes(mode)?'Resultados':`${rows.length} ${rows.length===1?'licitación':'licitaciones'}`;
 if(['carga','error'].includes(mode)||!rows.length){$('result-body').innerHTML=statePanel(mode||'vacio');$('pagination').hidden=true;$('pagination').innerHTML='';}else{$('result-body').innerHTML=table(p.records)+cards(p.records);pagination(p);}
 const labels={carga:'Cargando licitaciones',error:'No se pudieron cargar las licitaciones'};announce(labels[mode]??`${rows.length} licitaciones encontradas. Página ${p.page} de ${p.pages}.`);
 $('review-links').innerHTML=[['','Vista normal'],['carga','Carga'],['vacio','Vacío'],['error','Error']].map(([demo,label])=>`<a href="?${esc(writeQuery({...state,demo}))}">${label}</a>`).join('');
 if(focusSort)$('result-body').querySelector(`[data-sort="${focusSort}"]`)?.focus({preventScroll:true});
 if(focusPage&&document.contains(focus)===false)$('pagination').querySelector(`[data-page="${state.page}"]`)?.focus({preventScroll:true});
}
function clearFilters(){update({q:'',region:'',status:'',from:'',to:'',demo:''});$('range-error').hidden=true;$('from').removeAttribute('aria-invalid');$('to').removeAttribute('aria-invalid');}
function validateRange(s,prefix=''){const bad=invalidRange(s),error=$(prefix?'sheet-error':'range-error');error.hidden=!bad;for(const id of [prefix+'from',prefix+'to'])$(id).setAttribute('aria-invalid',String(bad));return !bad;}
function desktopFilters(){const next={...state,region:$('region').value,status:$('status').value,from:$('from').value,to:$('to').value};if(validateRange(next))update(next);}
$('filters').addEventListener('submit',e=>e.preventDefault());$('search').addEventListener('input',()=>update({q:$('search').value}));for(const id of ['region','status','from','to'])$(id).addEventListener('change',desktopFilters);
for(const id of ['mobile-order','desktop-order'])$(id).addEventListener('change',()=>{const [sort,direction]=$(id).value.split(':');update({sort,direction});});
$('clear').addEventListener('click',()=>{clearFilters();$('search').focus();});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.remove){update({[b.dataset.remove]:''});$('clear').disabled?$('search').focus():$('clear').focus();}
 if(b.dataset.sort){const sort=b.dataset.sort;update({sort,direction:state.sort===sort&&state.direction==='asc'?'desc':'asc'});}
 if(b.dataset.page){update({page:Number(b.dataset.page)},{resetPage:false,push:true});}
 if(b.dataset.expand){const code=b.dataset.expand;expanded.has(code)?expanded.delete(code):expanded.add(code);const extra=$('extra-'+code);extra.hidden=!expanded.has(code);b.setAttribute('aria-expanded',String(expanded.has(code)));b.textContent=expanded.has(code)?'Ver menos datos':'Ver más datos';b.setAttribute('aria-label',`${expanded.has(code)?'Ocultar':'Ver'} datos de ${code}`);}
 if(b.hasAttribute('data-clear')){clearFilters();$('search').focus();}
 if(b.hasAttribute('data-finish')){update({demo:''});$('result-count').tabIndex=-1;$('result-count').focus();}
 if(b.hasAttribute('data-retry')){state.demo='';busy=true;syncUrl();render();retryTimer=setTimeout(()=>{busy=false;render();$('result-count').tabIndex=-1;$('result-count').focus();},600);}
 if(b.dataset.close)$(b.dataset.close).close();
});
$('collapse').addEventListener('click',()=>{const compact=$('app').classList.toggle('compact');$('collapse').setAttribute('aria-expanded',String(!compact));$('collapse').setAttribute('aria-label',compact?'Expandir menú':'Compactar menú');$('collapse-label').textContent=compact?'Expandir menú':'Compactar menú';});
const dialogOrigins=new Map();
function openDialog(id){const d=$(id);dialogOrigins.set(d,document.activeElement);d.showModal();document.body.classList.add('modal-open');}
for(const id of ['filter-dialog','menu-dialog']){const d=$(id);d.addEventListener('close',()=>{document.body.classList.remove('modal-open');dialogOrigins.get(d)?.focus({preventScroll:true});});d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});}
function draft(){return {...state,region:$('sheet-region').value,status:$('sheet-status').value,from:$('sheet-from').value,to:$('sheet-to').value};}
function draftCount(){const s=draft();if(validateRange(s,'sheet-')){const count=filterRecords(TENDERS,s).length;$('apply-filters').textContent=`Ver ${count} ${count===1?'licitación':'licitaciones'}`;$('apply-filters').disabled=false;}else{$('apply-filters').textContent='Revisa las fechas';$('apply-filters').disabled=true;}}
$('open-filters').addEventListener('click',()=>{for(const key of ['region','status','from','to'])$('sheet-'+key).value=state[key];draftCount();openDialog('filter-dialog');});
$('open-menu').addEventListener('click',()=>openDialog('menu-dialog'));
for(const key of ['region','status','from','to'])$('sheet-'+key).addEventListener('change',draftCount);
$('clear-draft').addEventListener('click',()=>{for(const key of ['region','status','from','to'])$('sheet-'+key).value='';draftCount();});
$('sheet-form').addEventListener('submit',e=>{e.preventDefault();const next=draft();if(validateRange(next,'sheet-')){update(next);$('filter-dialog').close();}});
window.addEventListener('popstate',()=>{state=readQuery(location.search);busy=false;clearTimeout(retryTimer);syncInputs();render();});
const mobile=window.matchMedia('(max-width:767px)');mobile.addEventListener('change',e=>{if(!e.matches)for(const id of ['filter-dialog','menu-dialog'])if($(id).open)$(id).close();});
syncInputs();render();syncUrl();
