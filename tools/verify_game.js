'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const src=fs.readFileSync('app/src/main/assets/sprites.js','utf8');
assert.ok(html.includes('<script src="sprites.js"></script>'),'sprite code must be loaded before game');
const inline=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline,'game script must exist');
new vm.Script(inline[1],{filename:'index.html'});
new vm.Script(src,{filename:'sprites.js'});

// Instrument an offscreen Canvas2D enough to detect clipped source-frame artwork.
const stats=[];
const multiply=(a,b)=>[
 a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],
 a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],
 a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]
];
function fakeCanvas(){
 const art={width:0,height:0};
 const tracks=[];
 let tr=[1,0,0,1,0,0], stack=[],path=[],thick=1;
 function point(x,y){return [tr[0]*x+tr[2]*y+tr[4],tr[1]*x+tr[3]*y+tr[5]];}
 function mark(points,pad=0){
  if(!points.length)return;
  const xx=points.map(p=>p[0]),yy=points.map(p=>p[1]);
  tracks.push([Math.min(...xx)-pad,Math.min(...yy)-pad,Math.max(...xx)+pad,Math.max(...yy)+pad]);
 }
 const ctx={
  imageSmoothingEnabled:false,fillStyle:'',strokeStyle:'',lineWidth:1,
  save(){stack.push({tr:tr.slice(),thick});},
  restore(){const s=stack.pop();assert.ok(s,'unmatched canvas restore');tr=s.tr;thick=s.thick;},
  translate(x,y){tr=multiply(tr,[1,0,0,1,x,y]);},
  rotate(a){tr=multiply(tr,[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]);},
  scale(x,y){tr=multiply(tr,[x,0,0,y,0,0]);},
  fillRect(x,y,w,h){mark([point(x,y),point(x+w,y),point(x,y+h),point(x+w,y+h)]);},
  beginPath(){path=[];},
  moveTo(x,y){path.push(point(x,y));},
  lineTo(x,y){path.push(point(x,y));},
  closePath(){},
  fill(){mark(path);},
  stroke(){mark(path,(this.lineWidth||1)/2+1);},
  drawImage(){}
 };
 art.getContext=()=>ctx;
 stats.push({art,tracks});
 return art;
}
const document={createElement(type){assert.equal(type,'canvas');return fakeCanvas()}};
const win={};
vm.runInNewContext(src,{document,window:win,Math});
const sprites=win.MarsSprites;
assert.ok(sprites,'MarsSprites must register');
const expected={idle:6,run:10,jump:4,attack:8,hurt:4,death:8};
let count=0;
const violations=[];
for(const kind of ['servitor','heretic','marine']){
 const [width,height]=sprites.dimensions[kind];
 const bottom=height-sprites.footMargin;
 assert.ok(width>=128&&height>=140,kind+' needs high-res source bounds');
 for(const [state,n] of Object.entries(expected)){
  const atlas=sprites.frames[kind][state];
  assert.equal(atlas.length,n,kind+' '+state+' frame count');
  const signatures=[];
  for(const frame of atlas){
   const capture=stats.find(p=>p.art===frame);
   assert.ok(capture&&capture.tracks.length>35,kind+' '+state+' needs detailed artwork');
   assert.equal(frame.width,width);assert.equal(frame.height,height);
   const minX=Math.min(...capture.tracks.map(t=>t[0]));
   const minY=Math.min(...capture.tracks.map(t=>t[1]));
   const maxX=Math.max(...capture.tracks.map(t=>t[2]));
   const maxY=Math.max(...capture.tracks.map(t=>t[3]));
   if(minX<-.5||maxX>width+.5)violations.push(kind+' '+state+' horizontal '+minX.toFixed(1)+'..'+maxX.toFixed(1)+' / '+width);
   if(minY<-.5||maxY>height+.5)violations.push(kind+' '+state+' vertical '+minY.toFixed(1)+'..'+maxY.toFixed(1)+' / '+height);
   if(state==='idle'&&(maxY<=bottom-12||maxY>=bottom+12))violations.push(kind+' idle foot anchor '+maxY.toFixed(1)+' vs '+bottom);
   signatures.push(capture.tracks.slice(0,100).map(t=>t.map(x=>Math.round(x)).join(',')).join(';'));
   count++;
  }
  assert.ok(new Set(signatures).size>1,kind+' '+state+' should animate, not repeat one image');
 }
}
assert.ok(!violations.length,'Sprite bounds issues: '+[...new Set(violations)].join(' | '));
const spriteCtx={save(){},restore(){},translate(){},scale(){},drawImage(){this.drawn=true;},imageSmoothingEnabled:false};
const hero={x:40,y:250,w:30,h:80,facing:1,attack:0,ground:true,vx:0,step:0,inv:0};
sprites.draw(spriteCtx,hero,'servitor',0,hero,15);
assert.ok(spriteCtx.drawn,'sprite draw must be usable in game');
console.log('PASS: game syntax, correct shared feet pivot, no clipped geometry, '+count+' animated frames');
