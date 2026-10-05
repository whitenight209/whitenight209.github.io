export const COMMAND={STATUS:1,SCAN:2,PEER:3,CONNECT:4,DISCONNECT:5,FORGET:6,STOP:7,RECONNECT:8,LOG:9,METRICS:10};
export const REPORT=7;
export function packet(command,sequence,data=[]){const p=new Uint8Array(64);p[0]=1;p[1]=command;new DataView(p.buffer).setUint16(2,sequence,true);p.set(data,8);return p;}
export function response(value,command,sequence){
  let b=new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
  if(b.length===65&&b[0]===REPORT)b=b.subarray(1);
  if(b.length!==64||b[0]!==1)throw Error('지원하지 않는 관리 프로토콜입니다. 펌웨어 버전을 확인하세요.');
  const v=new DataView(b.buffer,b.byteOffset,b.byteLength);
  if(v.getUint16(2,true)!==sequence||b[1]!==command)return null;
  const err=v.getInt16(4,true);if(err)throw Error(`동글 요청 실패 (${err}). 장치 상태를 확인하고 다시 시도하세요.`);
  return b;
}
export function text(b){const end=b.indexOf(0);return new TextDecoder().decode(end<0?b:b.subarray(0,end));}
export function status(b){const v=new DataView(b.buffer,b.byteOffset,b.byteLength);return {errorSource:b[6],securityError:b[62],securityLevel:b[63],link:b[8],usb:b[9],count:b[10],scanning:!!(b[11]&1),bonded:!!(b[11]&2),wake:!!(b[11]&4),configured:!!(b[11]&8),ready:!!(b[11]&16),epoch:v.getUint16(12,true),error:v.getInt16(14,true),wakes:v.getUint32(16,true),name:text(b.subarray(20,49)),version:text(b.subarray(49,55)),address:Array.from(b.subarray(56,62)).reverse().map(v=>v.toString(16).padStart(2,'0')).join(':').toUpperCase()};}
export function peer(b){return {type:b[8],address:Array.from(b.subarray(9,15)).reverse().map(v=>v.toString(16).padStart(2,'0')).join(':').toUpperCase(),rssi:new DataView(b.buffer,b.byteOffset).getInt8(15),hid:!!b[16],name:text(b.subarray(17,46))};}
export class Bridge {
  constructor(device){this.device=device;this.sequence=Math.floor(Math.random()*65000);this.queue=Promise.resolve();}
  request(command,data=[]){const run=async()=>{if(this.closed)throw Error('관리 연결이 닫혔습니다.');const seq=this.sequence=(this.sequence+1)&65535;await this.device.sendFeatureReport(REPORT,packet(command,seq,data));const until=Date.now()+3000;while(Date.now()<until){if(this.closed)throw Error('관리 연결이 닫혔습니다.');const r=response(await this.device.receiveFeatureReport(REPORT),command,seq);if(r)return r;await new Promise(r=>setTimeout(r,25));}throw Error('동글 응답 시간이 초과되었습니다. USB 연결을 확인하세요.');};const promise=this.queue.then(run);this.queue=promise.catch(()=>{});return promise;}
}

export function errorMessage(info){
 if(!info.error)return '';
 if(info.error===-11)return '일시적 전송 대기 (-11). 페어링 오류가 아닙니다. 입력이 정상이라면 0.1.3 업데이트로 이전 오류 표시를 정리할 수 있습니다.';
 if(info.errorSource===2)return `USB 입력 전송 오류 (${info.error}). USB/KVM 연결을 확인하세요. 페어링 초기화는 필요하지 않습니다.`;
 if(info.errorSource===3)return `동글 입력·깨우기 처리 오류 (${info.error}). 진단 로그와 USB 상태를 확인하세요.`;
 if(info.errorSource===1&&info.error===-104)return 'BLE 링크 연결이 끊겼습니다. 저장된 본딩을 유지하고 자동 재연결을 시도합니다. 반복되면 키보드 전원·거리·선택된 Bluetooth 프로필을 확인하세요.';
 if(info.error!==-13)return `최근 오류: ${info.error} · 다시 연결하거나 페어링 정보를 확인하세요.`;
 if(info.securityError===9)return 'BLE 보안 연결 실패 (-13): 스택이 상세 원인을 제공하지 않았습니다. 프로필 문제로 단정할 수 없습니다. 펌웨어 0.1.2에서 연결을 다시 시도한 후 아래 진단 로그 읽기를 눌러 내용을 확인하세요.';
 const reasons={1:'인증 실패',2:'저장된 PIN/암호화 키 불일치 또는 없음',3:'OOB 인증 정보 없음',4:'요구된 보안 수준 충족 실패',5:'키보드가 페어링을 지원하지 않음',6:'키보드가 페어링을 허용하지 않음',7:'잘못된 보안 매개변수',8:'교환한 키가 거부됨',9:'상세 원인을 알 수 없는 보안 실패'};
 const detail=reasons[info.securityError]||'상세 원인 없음 · 진단 펌웨어 0.1.1로 업데이트하면 원인 확인 가능';
 return `BLE 보안 연결 실패 (-13): ${detail}. 키보드에서 빈 Bluetooth 프로필을 선택하거나 동글용 프로필만 BT_CLR로 초기화하세요. 저장된 동글 본딩이 있으면 페어링 정보 삭제 후 다시 검색하세요.`;
}

export function metrics(b){
 const v=new DataView(b.buffer,b.byteOffset,b.byteLength);
 const u32=o=>v.getUint32(o,true),u16=o=>v.getUint16(o,true);
 return {received:u32(8),submitted:u32(12),completed:u32(16),retries:u32(20),overflows:u32(24),
 depth:u16(28),high:u16(30),lastUs:u32(32),maxUs:u32(36),meanUs:u32(40),samples:u32(44),
 events:u32(48),inFlight:!!u32(52),intervalMs:u16(56)*1.25,latency:u16(58),timeoutMs:u16(60)*10};
}
