import {Bridge,COMMAND as C,status,peer,errorMessage,metrics} from './protocol.js';
import {ScanCache} from './scan-cache.js';
let scanCache=new ScanCache();
const $=id=>document.getElementById(id);
let bridge=null,timer=null,busy=false,refreshing=false,current=null,session=0;
const links=['대기','검색 중','연결 시도','보안 연결','HID 정보 확인','입력 준비 완료','재연결 대기','오류'];
// USB status values are supplied by the firmware in a stable bridge enum.
const usbNames=['분리됨','활성','절전','활성 (복귀 후)','초기화 중','오류','전원/설정 대기'];
function message(s){$('notice').textContent=s;}
function controls(){const connected=!!bridge;$('open').disabled=connected||busy;$('close').disabled=!connected||busy;for(const id of ['scan','stop','disconnect','forget','reconnect','logs','performance'])$(id).disabled=!connected||busy;
 if(connected&&current){$('scan').disabled=busy||current.bonded||[2,3,4,5].includes(current.link);$('stop').disabled=busy||!current.scanning;$('forget').disabled=busy;$('reconnect').disabled=busy||!current.bonded||current.link===5;}}
async function action(fn){if(busy)return;busy=true;controls();try{await fn();}catch(e){message(e.message);}finally{busy=false;controls();}}
async function refresh(){if(!bridge||refreshing)return;refreshing=true;const b=bridge,s=session,cache=scanCache;try{
 const info=status(await b.request(C.STATUS));if(session!==s)return;current=info;
 $('name').textContent=info.name||'선택된 키보드 없음';$('address').textContent=info.address==='00:00:00:00:00:00'?'—':info.address;$('link').textContent=links[info.link]||'알 수 없음';$('usb').textContent=usbNames[info.usb]||'알 수 없음';$('wake').textContent=info.wake?'허용됨':'현재 허용 안 됨';$('wakes').textContent=String(info.wakes);$('version').textContent=info.version||'—';$('error').textContent=errorMessage(info);
 const rows=await cache.get(info,async(i,epoch)=>peer(await b.request(C.PEER,[i,epoch&255,epoch>>8])));
 if(session!==s)return;const body=$('peers');body.replaceChildren();
 if(!rows.length){const tr=body.insertRow();const cell=tr.insertCell();cell.colSpan=4;cell.textContent=info.scanning?'검색 중입니다…':'검색 결과가 없습니다.';}
 for(const {p,index,epoch} of rows){const tr=body.insertRow();tr.insertCell().textContent=p.name||'(이름 없음)';tr.insertCell().textContent=`${p.address} / ${p.type===0?'public':'random/identity'}`;tr.insertCell().textContent=`${p.rssi} dBm`;const btn=document.createElement('button');btn.textContent=p.hid?'선택·페어링':'HID 확인 안 됨';btn.disabled=!p.hid||info.bonded||busy;btn.onclick=()=>action(async()=>{await bridge.request(C.CONNECT,[index,epoch&255,epoch>>8]);message(`${p.name||p.address} 연결을 요청했습니다. 상태가 입력 준비 완료로 바뀌는지 확인하세요.`);});tr.insertCell().append(btn);}
 controls();
}catch(e){if(session===s)message(e.message);}finally{refreshing=false;}}
$('open').onclick=()=>action(async()=>{
 if(!navigator.hid)throw Error('WebHID를 지원하는 데스크톱 Chrome 또는 Edge가 필요합니다.');
 const [device]=await navigator.hid.requestDevice({filters:[{usagePage:0xff00,usage:1}]});if(!device)return;
 if(device.productName!=='ZMK HID Bridge')throw Error('ZMK HID Bridge 펌웨어가 설치된 동글을 선택하세요.');
 await device.open();bridge=new Bridge(device);scanCache=new ScanCache();session++;message('USB 동글에 연결했습니다. 저장된 장치가 없으면 검색을 시작하세요.');await refresh();timer=setInterval(refresh,1500);
});
async function close(){clearInterval(timer);session++;const b=bridge;bridge=null;current=null;if(b)b.closed=true;if(b?.device.opened)await b.device.close();controls();message('관리 연결을 닫았습니다. 키보드 입력 기능은 계속 동작합니다.');}
$('close').onclick=()=>action(close);
for(const [id,cmd,label] of [['scan',C.SCAN,'주변 BLE 장치를 검색합니다.'],['stop',C.STOP,'검색을 중지했습니다.'],['disconnect',C.DISCONNECT,'키보드 연결을 해제했습니다.'],['reconnect',C.RECONNECT,'저장된 키보드와 재연결합니다.']])$(id).onclick=()=>action(async()=>{await bridge.request(cmd);message(label);await refresh();});
$('forget').onclick=()=>action(async()=>{if(!confirm('동글의 페어링 정보를 삭제할까요? 재페어링 시 키보드의 해당 Bluetooth 프로필도 초기화해야 할 수 있습니다.'))return;await bridge.request(C.FORGET);message('페어링 정보 삭제를 요청했습니다. 상태가 갱신되면 다시 검색하세요.');await refresh();});
if(navigator.hid)navigator.hid.addEventListener('disconnect',e=>{if(bridge?.device===e.device){clearInterval(timer);session++;bridge.closed=true;bridge=null;current=null;controls();message('USB 연결이 끊겼습니다. KVM 전환 또는 동글 연결을 확인하세요.');}});
else{message('WebHID를 사용할 수 없습니다. 이 페이지를 데스크톱 Chrome 또는 Edge에서 여세요.');$('open').disabled=true;}

$('logs').onclick=()=>action(async()=>{
 const b=bridge,token=session;let collected='';
 for(let i=0;i<80;i++){
  const p=await b.request(C.LOG);if(session!==token)return;
  const n=p[8];if(n>55)throw Error('잘못된 로그 응답입니다.');
  if(!n)break;collected+=new TextDecoder().decode(p.subarray(9,9+n));
 }
 if(collected)$('diagnostics').textContent=($('diagnostics').textContent+collected).slice(-16384);
 else message('추가 로그가 없습니다. 펌웨어 0.1.2에서 연결을 시도한 후 다시 읽으세요.');
});

$('performance').onclick=()=>action(async()=>{
 const b=bridge,token=session;const m=metrics(await b.request(C.METRICS));
 if(session!==token)return;
 $('performance-data').textContent=[
  `BLE 알림: ${m.received} · USB 제출/완료: ${m.submitted}/${m.completed}`,
  `USB 재시도: ${m.retries} · 큐 넘침: ${m.overflows}`,
  `전송 큐: ${m.depth}/32 · 최대: ${m.high} · 전송 중: ${m.inFlight?'예':'아니오'} · 입력 이벤트 대기: ${m.events}`,
  `지연 표본: ${m.samples} · 최근/평균/최대: ${(m.lastUs/1000).toFixed(2)} / ${(m.meanUs/1000).toFixed(2)} / ${(m.maxUs/1000).toFixed(2)} ms`,
  `BLE 연결 간격: ${m.intervalMs||'—'} ms · peripheral latency: ${m.latency} · 연결 감시 제한: ${m.timeoutMs} ms`
 ].join('\n');
});
