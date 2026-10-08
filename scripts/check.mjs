import {readFile,stat,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const f of ['app.js','data.js','model.js'])execFileSync(process.execPath,['--check',root+'dist/'+f]);
const files=await readdir(root+'dist/assets');
for(const f of files){const p=root+'dist/assets/'+f;if(!(await stat(p)).size)throw Error(`Asset vacío: ${f}`);if(f.endsWith('.svg')){const txt=await readFile(p,'utf8');if(!/<svg\b/.test(txt)||/<html\b/i.test(txt))throw Error(`SVG inválido: ${f}`);}}
for(const file of ['index.html','app.js','styles.css','tokens.css']){
 const source=await readFile(root+'dist/'+file,'utf8');if(/figma\.com\/api\/mcp\/asset/.test(source))throw Error('URL de asset temporal');
 for(const match of source.matchAll(/(?:src|href)="\.\/([^"?]+)"/g))if(!match[1].includes('${'))await stat(root+'dist/'+match[1]);
}
console.log('Sintaxis, assets y referencias locales: OK. Sitio estático listo en dist/.');
