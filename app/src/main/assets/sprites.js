/* Servitor: Fall of Mars — original procedural pixel-art sprite sheets, v1.2.
   Frames are cached in off-screen canvases; gameplay uses no external textures. */
(function(global){
'use strict';
const C={ink:'#181824',shadow:'#242532',iron:'#53616a',steel:'#8c9aa0',silver:'#ccd5c6',skin:'#baa08f',skinLit:'#ead1b0',brass:'#bb8b55',gold:'#f0c57e',red:'#f34e38',redLit:'#ffc37a',robe:'#7c2c37',robeLit:'#b24b4e',wine:'#482734',purple:'#493451',violet:'#79627e',plasma:'#fa527e',bone:'#d5c0a3',dark:'#12131d'};
const sheets={};
const poses={idle:4,run:8,jump:2,attack:6,hurt:3,death:7};
const frameSize={servitor:[120,90],heretic:[64,74],marine:[112,112]};
function r(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function poly(c,p,color){c.fillStyle=color;c.beginPath();c.moveTo(Math.round(p[0][0]),Math.round(p[0][1]));for(let i=1;i<p.length;i++)c.lineTo(Math.round(p[i][0]),Math.round(p[i][1]));c.closePath();c.fill();}
function chain(c,pts,w,col){for(let i=0;i<pts.length-1;i++){const [x,y]=pts[i], [xx,yy]=pts[i+1],n=Math.max(Math.abs(xx-x),Math.abs(yy-y));for(let j=0;j<=n;j++){const t=j/n;r(c,x+(xx-x)*t-w/2,y+(yy-y)*t-w/2,w,w,col);}}}
function servitor(c,state,n){
 const walking=state==='run',air=state==='jump',attack=state==='attack',dead=state==='death',hurt=state==='hurt';
 const phase=n/8*Math.PI*2,bob=walking?Math.round(Math.abs(Math.sin(phase))*2):state==='idle'&&n%2?1:0;
 const stride=walking?Math.round(Math.sin(phase)*7):air?5:0;
 c.save();if(dead){c.translate(0,32+n*1.6);c.rotate(n*.11);c.globalAlpha=1-n*.10;}else c.translate(0,bob);
 r(c,-11,14,9,19+stride,C.ink);r(c,-9,16,5,18+stride,C.iron);r(c,-11,31+stride,11,6,C.steel);r(c,-12,36+stride,15,5,C.ink);
 r(c,4,15,10,20-stride,C.ink);r(c,7,16,5,20-stride,C.steel);r(c,5,31-stride,10,6,C.brass);r(c,3,36-stride,15,5,C.ink);
 r(c,-12,-10,24,28,C.ink);r(c,-10,-10,20,26,C.iron);r(c,-6,-7,12,22,C.steel);r(c,-5,-5,10,6,C.silver);r(c,-5,9,9,5,C.brass);r(c,7,-8,4,22,C.shadow);
 poly(c,[[-18,-9],[-9,-13],[-6,-5],[-9,5],[-18,2]],C.ink);r(c,-17,-8,7,10,C.steel);r(c,-16,-6,5,3,C.silver);
 chain(c,[[-12,-4],[-19,3],[-19,16],[-13,21]],3,C.brass);chain(c,[[11,-4],[18,3],[16,15]],4,C.ink);
 const armY=attack?[-23,-26,-12,7,13,-4][n]:hurt?6:4;
 r(c,12,armY-4,9,8,C.ink);r(c,14,armY-2,5,7,C.steel);r(c,17,armY+4,5,12,C.iron);
 if(attack){
  const tips=[[38,-48],[49,-35],[54,-9],[47,19],[31,29],[32,13]];
  const tip=tips[n];chain(c,[[21,armY+7],[tip[0],tip[1]]],5,C.ink);chain(c,[[23,armY+5],[tip[0],tip[1]]],3,C.silver);
  r(c,tip[0]-2,tip[1]-2,5,5,C.gold);
 }else {r(c,19,armY+15,4,20,C.brass);r(c,22,armY+13,4,24,C.silver);r(c,20,armY+26,8,3,C.ink);}
 r(c,-11,-34,22,23,C.ink);r(c,-9,-33,19,19,C.skin);r(c,-11,-34,20,7,C.iron);r(c,-8,-27,5,11,C.steel);
 r(c,-1,-25,11,7,C.ink);r(c,1,-24,7,5,C.red);r(c,6,-23,3,2,C.redLit);
 r(c,-2,-17,12,7,C.steel);r(c,1,-16,6,4,C.shadow);r(c,3,-12,3,4,C.brass);
 r(c,-10,-38,17,4,C.ink);r(c,-7,-38,13,3,C.steel);r(c,4,-40,4,7,C.brass);
 r(c,-15,-14,5,14,C.shadow);r(c,-18,-7,4,19,C.brass);r(c,-5,-2,4,4,C.red);r(c,2,-4,4,6,C.gold);
 if(hurt){r(c,-8,-24,17,6,C.redLit);}
 c.restore();
}
function heretic(c,state,n){
 const walking=state==='run',dead=state==='death',hurt=state==='hurt',s=walking?Math.round(Math.sin(n*Math.PI/4)*5):0;
 c.save();if(dead){c.translate(0,24+n*1.7);c.rotate(-n*.13);c.globalAlpha=1-n*.11;}
 r(c,-10,18,7,15+s,C.dark);r(c,-9,30+s,10,6,C.ink);r(c,4,18,8,15-s,C.dark);r(c,4,30-s,12,6,C.ink);
 poly(c,[[-14,-2],[13,-3],[18,27],[9,24],[4,29],[-3,24],[-12,30],[-18,24]],C.ink);
 poly(c,[[-11,-3],[10,-2],[14,23],[4,20],[-1,26],[-11,21],[-16,25]],C.robe);
 r(c,-9,2,4,20,C.robeLit);r(c,2,6,5,16,C.wine);r(c,0,9,4,6,C.brass);r(c,-6,0,13,3,C.gold);
 r(c,-10,-28,19,21,C.ink);r(c,-7,-24,15,17,C.skin);r(c,-8,-31,18,8,C.wine);r(c,-12,-28,5,17,C.robe);r(c,7,-29,5,16,C.robe);
 r(c,-3,-20,11,4,C.dark);r(c,1,-20,5,3,C.plasma);r(c,-2,-11,7,3,C.shadow);
 r(c,-18,-2,7,18,C.robe);r(c,-18,11,6,8,C.skin);r(c,11,-4,7,19,C.robeLit);r(c,12,13,6,8,C.skin);
 chain(c,[[15,19],[22,4],[26,-17]],3,C.steel);r(c,22,2,8,3,C.ink);r(c,24,-19,3,4,C.bone);
 if(hurt)r(c,-6,-23,15,5,C.redLit);
 c.restore();
}
function marine(c,state,n){
 const walking=state==='run',dead=state==='death',hurt=state==='hurt',s=walking?Math.round(Math.sin(n*Math.PI/4)*6):0;
 c.save();if(dead){c.translate(0,33+n);c.rotate(n*.10);c.globalAlpha=1-n*.105;}
 r(c,-20,21,16,23+s,C.ink);r(c,-18,25,12,18+s,C.purple);r(c,-20,39+s,19,10,C.violet);r(c,-23,48+s,24,7,C.ink);
 r(c,6,21,17,23-s,C.ink);r(c,8,25,12,18-s,C.purple);r(c,7,39-s,20,10,C.violet);r(c,4,48-s,27,7,C.ink);
 r(c,-22,-36,45,42,C.dark);r(c,-20,-40,14,25,C.ink);r(c,9,-40,14,25,C.ink);
 r(c,-18,-37,10,9,C.violet);r(c,11,-37,10,9,C.violet);r(c,-16,-34,5,4,C.plasma);r(c,14,-34,5,4,C.plasma);
 r(c,-22,-30,44,53,C.ink);poly(c,[[-19,-27],[18,-27],[20,8],[14,20],[-15,20],[-20,7]],C.purple);
 poly(c,[[-15,-22],[14,-22],[10,0],[-10,0]],C.violet);r(c,-13,4,28,5,C.ink);r(c,-4,5,8,8,C.gold);r(c,-10,16,20,4,C.brass);
 poly(c,[[-34,-32],[-16,-39],[-10,-27],[-13,-9],[-34,-10]],C.ink);
 poly(c,[[-31,-31],[-17,-35],[-14,-26],[-17,-13],[-31,-14]],C.violet);r(c,-29,-25,4,10,C.gold);
 poly(c,[[14,-34],[30,-37],[36,-26],[32,-10],[12,-12]],C.ink);
 poly(c,[[16,-31],[29,-33],[33,-26],[28,-15],[16,-15]],C.purple);r(c,27,-28,4,9,C.brass);
 r(c,-14,-52,28,24,C.ink);r(c,-11,-50,22,18,C.violet);poly(c,[[-13,-47],[-20,-61],[-13,-58],[-5,-50]],C.bone);poly(c,[[11,-47],[20,-61],[13,-58],[5,-50]],C.bone);
 r(c,-12,-40,24,6,C.dark);r(c,-10,-39,20,3,C.plasma);r(c,-8,-30,16,9,C.ink);r(c,-4,-28,8,7,C.steel);
 r(c,-33,-13,13,29,C.ink);r(c,-31,-10,10,25,C.purple);r(c,-29,10,12,8,C.ink);
 r(c,23,-12,15,29,C.ink);r(c,25,-10,12,25,C.purple);r(c,26,11,12,9,C.ink);
 chain(c,[[34,17],[40,10],[44,-26]],6,C.ink);chain(c,[[36,16],[42,8],[44,-26]],3,C.silver);r(c,36,7,13,5,C.gold);r(c,43,-29,5,8,C.plasma);
 if(hurt)r(c,-10,-40,23,5,C.redLit);
 c.restore();
}
const artists={servitor,heretic,marine};
function generate(){
 for(const kind of Object.keys(artists)){
  const [w,h]=frameSize[kind];sheets[kind]={};
  for(const [state,count] of Object.entries(poses)){
   const frames=[];
   for(let f=0;f<count;f++){
    const cvs=document.createElement('canvas');cvs.width=w;cvs.height=h;
    const ctx=cvs.getContext('2d');ctx.imageSmoothingEnabled=false;
    ctx.translate(Math.floor(w/2),h-8);
    artists[kind](ctx,state,f);
    frames.push(cvs);
   }
   sheets[kind][state]=frames;
  }
 }
}
generate();
function pick(kind,e,hero,clock){
 if(kind==='servitor'){
  if(hero.attack>0)return ['attack',Math.min(5,Math.floor((17-hero.attack)/3))];
  if(hero.inv>0&&hero.inv>38)return ['hurt',Math.floor(clock/3)%3];
  if(!hero.ground)return ['jump',hero.vy<0?0:1];
  if(Math.abs(hero.vx)>.55)return ['run',Math.floor(hero.step*1.6)%8];
  return ['idle',Math.floor(clock/20)%4];
 }
 if(e.dead)return ['death',Math.min(6,Math.floor((clock-e.deathClock)/5))];
 if(e.hit>0)return ['hurt',Math.floor(clock/3)%3];
 if(Math.abs(e.x-e.home)>.1||Math.abs(e.walk)>0)return ['run',Math.floor(e.walk*8)%8];
 return ['idle',Math.floor(clock/24)%4];
}
function draw(g,e,kind,view,hero,clock){
 const [state,index]=pick(kind,e,hero,clock),frames=sheets[kind][state];
 const frame=frames[((index%frames.length)+frames.length)%frames.length];
 const sx=Math.round(e.x+e.w/2-view),sy=Math.round(e.y+e.h+6);
 const facing=kind==='servitor'?hero.facing:e.face;
 g.save();g.translate(sx,sy);g.scale(facing,1);g.drawImage(frame,-frame.width/2,-frame.height);g.restore();
 return {x:sx,y:sy,state,frame:index};
}
global.MarsSprites={draw,frames:sheets,states:poses};
})(window);
