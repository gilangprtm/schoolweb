const{readFileSync}=require('fs');
const url=process.env.DATABASE_URL;
if(!url){console.error('NO_DB_URL');process.exit(1)}
require('postgres')(url,{prepare:false}).then(async s=>{
const t=readFileSync('/app/src/lib/db/migrations/0000_hesitant_jack_power.sql','utf-8').split('--> statement-breakpoint').map(x=>x.trim()).filter(x=>x);
for(let i=0;i<t.length;i++){try{await s.unsafe(t[i]);console.log('OK',i)}catch(e){if(e.code==='42P07'){console.log('SKIP',i)}else throw e}}
console.log('MIGRATION_DONE');await s.end()
}).catch(e=>{console.error('FAIL:',e.message);process.exit(1)})
