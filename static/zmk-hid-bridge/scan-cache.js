/* Refresh while scanning and once after it stops. Commit only complete reads. */
export class ScanCache {
  constructor(){this.rows=[];this.epoch=null;this.count=-1;this.scanning=false;}
  async get(info,read){
    const needs=this.epoch!==info.epoch||this.count!==info.count||info.scanning||this.scanning;
    if(!needs)return this.rows;
    const rows=[];
    for(let i=0;i<info.count;i++)rows.push({p:await read(i,info.epoch),index:i,epoch:info.epoch});
    this.rows=rows;this.epoch=info.epoch;this.count=info.count;this.scanning=info.scanning;
    return rows;
  }
}
