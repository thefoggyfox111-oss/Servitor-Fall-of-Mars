const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const source=fs.readFileSync('app/src/main/assets/sprites.js','utf8');
assert.ok(html.includes('<script src="sprites.js"></script>'),'Sprite module must load first');
const embedded=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(embedded,'Inline game script not found');
new vm.Script(embedded[1],{filename:'index.html inline script'});
new vm.Script(source,{filename:'sprites.js'});
const fakeContext=()=>({
 fillRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},
 translate(){},save(){},restore(){},rotate(){},scale(){},drawImage(){},
 imageSmoothingEnabled:false,fillStyle:null,globalAlpha:1
});
const fakeDocument={createElement(type){
 assert.equal(type,'canvas');
 return {width:0,height:0,getContext(){return fakeContext()}};
}};
const fakeWindow={};
vm.runInNewContext(source,{window:fakeWindow,document:fakeDocument,Math});
const s=fakeWindow.MarsSprites;
assert.ok(s,'Sprite renderer should be registered');
const expected={idle:4,run:8,jump:2,attack:6,hurt:3,death:7};
for(const kind of ['servitor','heretic','marine']){
 for(const [state,count] of Object.entries(expected)){
  assert.equal(s.frames[kind][state].length,count,kind+' '+state);
  for(const canvas of s.frames[kind][state]){
   assert.ok(canvas.width>=50&&canvas.height>=70,'Sprite frame must have a canvas');
  }
 }
}
s.draw(fakeContext(),{x:20,y:100,w:30,h:54,face:-1,walk:0,home:20,hit:0},'servitor',0,
 {x:20,y:100,w:30,h:54,facing:-1,attack:0,ground:true,vx:0,step:0,inv:0},10);
console.log('Game script syntax and 90 sprite frames: OK');
