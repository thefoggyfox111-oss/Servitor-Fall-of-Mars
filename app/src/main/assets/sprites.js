/* Servitor: Fall of Mars — original procedural pixel art, v1.3.
   The feet are at local Y=0, and all frames share the same pivot.
   Atlas coordinates include explicit top/bottom and weapon-swing margins. */
(function(root){
'use strict';
const K={
 black:'#10121b',outline:'#1b1b26',deep:'#292631',coal:'#383842',
 iron:'#4e5c66',armor:'#76848d',light:'#aebdc0',white:'#dce0d0',
 copper:'#996746',brass:'#bb8a53',gold:'#edc17c',skin:'#b9a093',
 pale:'#e0c4af',red:'#c44137',glare:'#ff7349',hot:'#ffe4a4',
 cloth:'#642b3b',wine:'#3d2534',clothHi:'#9b4650',
 purple:'#44324e',plum:'#655073',violet:'#897194',
 bone:'#d0b999',plasma:'#ff557d',rust:'#814b48'
};
const FRAMES={idle:6,run:10,jump:4,attack:8,hurt:4,death:8};
const DIMENSIONS={servitor:[208,192],heretic:[208,182],marine:[272,238]};
const FOOT_MARGIN=56;
const frames={};
const TWO_PI=Math.PI*2;
const q=(ctx,x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
function polygon(ctx,pts,color){
 ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(Math.round(pts[0][0]),Math.round(pts[0][1]));
 for(let i=1;i<pts.length;i++)ctx.lineTo(Math.round(pts[i][0]),Math.round(pts[i][1]));ctx.closePath();ctx.fill();
}
function wire(ctx,pts,thickness,color){
 ctx.save();ctx.strokeStyle=color;ctx.lineWidth=thickness;ctx.lineJoin='bevel';ctx.lineCap='square';
 ctx.beginPath();ctx.moveTo(Math.round(pts[0][0]),Math.round(pts[0][1]));
 for(let i=1;i<pts.length;i++)ctx.lineTo(Math.round(pts[i][0]),Math.round(pts[i][1]));
 ctx.stroke();ctx.restore();
}
function rivet(ctx,x,y){q(ctx,x,y,2,2,K.gold);q(ctx,x+1,y,1,1,K.white);}
function pose(state,n,count){
 const t=n/count,cyc=Math.sin(t*TWO_PI),co=Math.cos(t*TWO_PI);
 const running=state==='run',jumping=state==='jump',attacking=state==='attack';
 const dying=state==='death',wounded=state==='hurt';
 return {
  t,cyc,co,running,jumping,attacking,dying,wounded,
  bob:running?Math.round(3*Math.abs(cyc)):state==='idle'?Math.round(n%3===0?1:0):0,
  stride:running?Math.round(cyc*13):jumping?([-8,5,7,2][n]||0):0,
  lean:running?Math.round(co*3):attacking?[-4,-6,2,6,9,6,2,0][n]:0,
  swing:attacking?n/count:0,
  collapse:dying?Math.min(1,n/(count-1)):0
 };
}
function foot(ctx,x,y,machine=false){
 q(ctx,x-7,y-6,15,8,K.black);q(ctx,x-5,y-5,12,4,machine?K.iron:K.coal);
 q(ctx,x+3,y-5,4,3,machine?K.light:K.rust);
 q(ctx,x-7,y-1,17,3,K.outline);q(ctx,x+8,y,3,1,K.brass);
}
function servitor(ctx,state,n){
 const z=pose(state,n,FRAMES[state]);
 ctx.save();
 if(z.dying){ctx.translate(4*z.collapse,25*z.collapse);ctx.rotate(-1.12*z.collapse);ctx.globalAlpha=1-.12*z.collapse;}
 else if(z.wounded){ctx.translate(-3+(n%2)*4,0);ctx.rotate(-.09);}
 else ctx.translate(z.lean,-z.bob);
 const walk=z.stride,lLeg=walk,rLeg=-walk;
 // Exposed, jointed lower limbs with real knee displacement.
 wire(ctx,[[-10,-42],[-14+walk*.33,-25],[-14+walk*.7,-13]],8,K.outline);
 wire(ctx,[[9,-42],[12+rLeg*.33,-25],[13+rLeg*.7,-13]],8,K.outline);
 q(ctx,-18+walk*.33,-31,10,13,K.iron);q(ctx,8+rLeg*.33,-31,10,13,K.iron);
 q(ctx,-17+walk*.33,-25,5,8,K.light);q(ctx,10+rLeg*.33,-25,5,8,K.light);
 q(ctx,-17+walk*.65,-15,12,10,K.armor);q(ctx,7+rLeg*.65,-15,12,10,K.armor);
 foot(ctx,-14+walk*.7,-1-Math.max(0,walk*.25),true);
 foot(ctx,13+rLeg*.7,-1-Math.max(0,rLeg*.25),true);
 rivet(ctx,-11+walk*.3,-27);rivet(ctx,12+rLeg*.3,-27);
 // Robe / purity-tag panels in front of armor, displaced by wind and run.
 polygon(ctx,[[-10,-44],[10,-44],[10+z.cyc*3,-15],[2,-19],[-6+z.cyc*2,-16]],K.wine);
 q(ctx,-6,-37,7,17,K.red);q(ctx,-5,-36,3,15,K.clothHi);q(ctx,-3,-29,3,3,K.gold);
 // Backpack with antennae, brass reactor and hanging cables.
 q(ctx,-27,-92,17,42,K.black);q(ctx,-25,-90,13,39,K.iron);q(ctx,-23,-83,9,16,K.coal);
 q(ctx,-24,-75,8,5,K.gold);q(ctx,-22,-62,7,5,K.red);
 q(ctx,-20,-101,4,17,K.brass);q(ctx,-24,-103,12,4,K.outline);q(ctx,-21,-104,4,3,K.glare);
 wire(ctx,[[-19,-59],[-29,-43],[-25+z.cyc*3,-27],[-16,-17]],3,K.copper);
 wire(ctx,[[-19,-64],[-36,-58],[-34+z.cyc*2,-44],[-27,-35]],3,K.outline);
 wire(ctx,[[-29,-77],[-39,-63],[-37,-51]],2,K.gold);
 // Torso armor is read clearly in side view.
 polygon(ctx,[[-21,-82],[7,-86],[23,-76],[20,-47],[12,-39],[-19,-42]],K.black);
 polygon(ctx,[[-17,-80],[8,-82],[20,-74],[16,-49],[8,-44],[-16,-48]],K.iron);
 polygon(ctx,[[-12,-77],[8,-78],[15,-69],[10,-56],[-12,-58]],K.armor);
 q(ctx,-9,-75,16,3,K.light);q(ctx,-11,-53,22,5,K.coal);
 q(ctx,-7,-70,8,9,K.black);q(ctx,-5,-69,5,6,K.glare);q(ctx,0,-67,2,2,K.hot);
 q(ctx,11,-61,6,9,K.brass);q(ctx,12,-58,3,3,K.white);
 for(let x=-13;x<15;x+=8)rivet(ctx,x,-49);
 // Cog-shoulder with curved plate, small electro-etched segments.
 polygon(ctx,[[-23,-83],[-9,-89],[-3,-80],[-7,-65],[-22,-65],[-28,-72]],K.black);
 polygon(ctx,[[-23,-80],[-11,-85],[-7,-78],[-11,-68],[-21,-68],[-25,-73]],K.armor);
 q(ctx,-21,-79,11,3,K.light);q(ctx,-23,-72,13,3,K.copper);rivet(ctx,-15,-73);
 // Non-sword arm: elbow joint and dangling servo claw.
 wire(ctx,[[-20,-65],[-30+z.cyc*2,-52],[-32+z.cyc*3,-40]],7,K.black);
 wire(ctx,[[-20,-65],[-29+z.cyc*2,-52],[-32+z.cyc*3,-40]],4,K.iron);
 q(ctx,-34+z.cyc*3,-42,9,8,K.armor);
 wire(ctx,[[-31+z.cyc*3,-36],[-35+z.cyc*4,-30]],3,K.brass);
 wire(ctx,[[-29+z.cyc*3,-36],[-27+z.cyc*4,-30]],2,K.light);
 // Human face with enclosed optics and a heavy steel mandibular respirator.
 q(ctx,-11,-105,23,23,K.black);q(ctx,-8,-102,19,19,K.skin);
 q(ctx,-11,-107,25,8,K.iron);q(ctx,-7,-105,18,4,K.light);
 q(ctx,4,-100,8,9,K.black);q(ctx,6,-99,6,5,K.glare);q(ctx,10,-98,2,2,K.hot);
 q(ctx,-9,-88,22,8,K.steel);q(ctx,-5,-86,11,4,K.coal);q(ctx,3,-83,7,3,K.copper);
 q(ctx,-13,-99,5,18,K.coal);q(ctx,-13,-93,4,8,K.gold);
 wire(ctx,[[0,-105],[3,-113],[9,-115]],2,K.copper);q(ctx,8,-118,4,6,K.iron);
 wire(ctx,[[-12,-83],[-24,-89],[-32,-84],[-32,-70]],3,K.copper);
 // Sword arm is independent; every attack frame has a distinct blade position.
 const poses=[
  {el:[29,-66],hand:[26,-82],tip:[38,-119]},
  {el:[31,-76],hand:[37,-88],tip:[66,-110]},
  {el:[33,-60],hand:[49,-65],tip:[82,-75]},
  {el:[31,-47],hand:[46,-36],tip:[75,-18]},
  {el:[26,-47],hand:[35,-32],tip:[42,2]},
  {el:[20,-51],hand:[32,-42],tip:[49,-10]},
  {el:[24,-56],hand:[37,-54],tip:[60,-44]},
  {el:[23,-63],hand:[34,-63],tip:[52,-73]}
 ];
 const blade=z.attacking?poses[n]:{el:[27+z.cyc*2,-61],hand:[27+z.cyc*3,-44],tip:[28+z.cyc*3,-1]};
 wire(ctx,[[17,-72],blade.el,blade.hand],10,K.black);
 wire(ctx,[[17,-72],blade.el,blade.hand],6,K.steel);
 q(ctx,blade.el[0]-3,blade.el[1]-3,7,6,K.gold);
 q(ctx,blade.hand[0]-5,blade.hand[1]-4,10,8,K.copper);
 const dx=blade.tip[0]-blade.hand[0],dy=blade.tip[1]-blade.hand[1],len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;
 const start=[blade.hand[0]+ux*3,blade.hand[1]+uy*3];
 wire(ctx,[start,blade.tip],7,K.black);wire(ctx,[[start[0]+1,start[1]],blade.tip],4,K.light);
 wire(ctx,[[start[0]+1,start[1]],[blade.tip[0]-ux*5,blade.tip[1]-uy*5]],2,K.white);
 q(ctx,blade.hand[0]-7,blade.hand[1]-2,14,4,K.gold);
 if(z.attacking&&n>=2&&n<=5)q(ctx,blade.tip[0]-2,blade.tip[1]-2,4,4,K.hot);
 if(z.wounded)q(ctx,2,-98,10,4,K.hot);
 // Articulated belt, buckle, hazard stripes.
 q(ctx,-17,-44,34,8,K.black);q(ctx,-13,-43,26,6,K.copper);q(ctx,-3,-43,7,6,K.gold);
 q(ctx,-1,-41,3,2,K.white);
 ctx.restore();
}
function heretic(ctx,state,n){
 const z=pose(state,n,FRAMES[state]);ctx.save();
 if(z.dying){ctx.translate(2*z.collapse,27*z.collapse);ctx.rotate(.98*z.collapse);ctx.globalAlpha=1-z.collapse*.16;}
 else ctx.translate(z.lean,-z.bob);
 const st=z.stride,cloak=z.running?z.cyc*7:Math.sin(n*1.1)*2;
 wire(ctx,[[-9,-37],[-12+st*.3,-20],[-11+st*.6,-8]],7,K.black);
 wire(ctx,[[9,-37],[10-st*.4,-20],[10-st*.65,-8]],7,K.black);
 q(ctx,-12+st*.55,-13,10,11,K.coal);q(ctx,4-st*.55,-13,10,11,K.coal);
 foot(ctx,-10+st*.6,0-Math.max(0,st*.2));foot(ctx,11-st*.6,0-Math.max(0,-st*.2));
 // Ragged coat and rear cape layers, each frame has cloth inertia.
 polygon(ctx,[[-17,-73],[11,-72],[16+cloak,-29],[19+cloak,-8],[9+cloak,-15],[2+cloak,-4],[-10+cloak,-12],[-24+cloak,-7],[-22,-31]],K.black);
 polygon(ctx,[[-17,-70],[10,-69],[14+cloak,-25],[15+cloak,-12],[6+cloak,-18],[0+cloak,-9],[-10+cloak,-17],[-20+cloak,-12]],K.wine);
 polygon(ctx,[[6,-67],[17,-57],[12+cloak,-29],[22+cloak,-15],[13+cloak,-12]],K.cloth);
 q(ctx,-16,-66,5,35,K.clothHi);q(ctx,-13,-45,6,21,K.rust);q(ctx,-5,-37,18,6,K.black);
 // Torso plates, leather chest belts, occult rivets.
 polygon(ctx,[[-17,-75],[-3,-82],[16,-72],[12,-45],[-17,-47]],K.black);
 polygon(ctx,[[-13,-71],[0,-77],[12,-69],[9,-50],[-15,-52]],K.cloth);
 q(ctx,-10,-70,4,22,K.clothHi);
 wire(ctx,[[-12,-64],[10,-49]],5,K.black);wire(ctx,[[-12,-65],[10,-50]],3,K.copper);
 q(ctx,0,-58,5,5,K.gold);q(ctx,-4,-51,5,5,K.bone);rivet(ctx,8,-54);
 // Hood (side-facing) with face shadow and ritual mask.
 polygon(ctx,[[-14,-105],[-4,-113],[12,-106],[19,-89],[15,-77],[-11,-77],[-19,-91]],K.black);
 polygon(ctx,[[-12,-104],[-3,-108],[10,-102],[15,-91],[11,-82],[-9,-83],[-15,-92]],K.cloth);
 q(ctx,-5,-99,18,18,K.skin);q(ctx,1,-94,13,7,K.black);q(ctx,5,-92,6,3,K.plasma);
 q(ctx,-3,-84,16,7,K.bone);q(ctx,0,-83,9,3,K.coal);
 q(ctx,-17,-90,5,15,K.clothHi);q(ctx,-3,-109,9,4,K.clothHi);
 wire(ctx,[[-12,-85],[-22,-72],[-22,-61]],2,K.rust);
 // Scarred left arm and leather wrappings.
 wire(ctx,[[-16,-69],[-25+z.cyc*3,-54],[-25+z.cyc*2,-40]],8,K.black);
 wire(ctx,[[-17,-67],[-24+z.cyc*3,-53],[-25+z.cyc*2,-42]],5,K.skin);
 q(ctx,-27+z.cyc*2,-43,8,9,K.coal);q(ctx,-26,-52,7,3,K.brass);
 // Weapon arm, held forward; true attack arc and moving wrist.
 const attackHand=[[19,-45],[29,-66],[43,-78],[52,-55],[51,-33],[34,-30],[28,-42],[23,-48]];
 const hand=z.attacking?attackHand[n]:[25+z.cyc*2,-45];
 const elbow=z.attacking?[23+Math.sin(n)*5,-61]:[18,-57];
 wire(ctx,[[13,-66],elbow,hand],9,K.black);wire(ctx,[[13,-66],elbow,hand],6,K.clothHi);
 q(ctx,elbow[0]-3,elbow[1]-2,6,7,K.gold);
 q(ctx,hand[0]-4,hand[1]-3,9,7,K.skin);
 const tip=z.attacking?[[31,-98],[55,-111],[76,-92],[85,-55],[71,-17],[51,-11],[46,-40],[42,-65]][n]:[35+z.cyc*3,-12];
 wire(ctx,[hand,tip],8,K.black);wire(ctx,[[hand[0]+2,hand[1]],tip],5,K.iron);
 wire(ctx,[[hand[0]+2,hand[1]],[tip[0]-2,tip[1]+2]],2,K.light);
 q(ctx,hand[0]-8,hand[1]-2,16,4,K.brass);
 q(ctx,tip[0]-3,tip[1]-3,5,6,K.bone);
 // Small talismans in silhouette.
 wire(ctx,[[-11,-45],[-7,-35],[-7,-30]],2,K.gold);q(ctx,-9,-31,6,6,K.bone);
 if(z.wounded)q(ctx,3,-92,9,4,K.hot);
 ctx.restore();
}
function marine(ctx,state,n){
 const z=pose(state,n,FRAMES[state]);ctx.save();
 if(z.dying){ctx.translate(8*z.collapse,22*z.collapse);ctx.rotate(-.96*z.collapse);ctx.globalAlpha=1-.13*z.collapse;}
 else ctx.translate(z.lean*.65,-z.bob);
 const st=z.running?Math.round(z.cyc*9):z.jumping?z.stride:0;
 // Heavy motorized boots, articulated knee and overlapping greaves.
 wire(ctx,[[-19,-48],[-24+st*.35,-27],[-24+st*.7,-10]],17,K.black);
 wire(ctx,[[19,-48],[23-st*.35,-27],[24-st*.7,-10]],17,K.black);
 q(ctx,-33+st*.7,-24,21,21,K.purple);q(ctx,14-st*.7,-24,21,21,K.purple);
 q(ctx,-31+st*.7,-18,8,10,K.violet);q(ctx,22-st*.7,-18,8,10,K.violet);
 q(ctx,-33+st*.7,-7,28,7,K.black);q(ctx,12-st*.7,-7,29,7,K.black);
 q(ctx,-30+st*.7,-9,23,6,K.iron);q(ctx,15-st*.7,-9,25,6,K.iron);
 rivet(ctx,-24+st*.7,-12);rivet(ctx,28-st*.7,-12);
 // Backpack reactors with ribbed vents.
 q(ctx,-33,-119,21,55,K.black);q(ctx,-30,-116,16,48,K.purple);
 q(ctx,-28,-111,12,5,K.violet);q(ctx,-27,-100,10,4,K.coal);q(ctx,-27,-88,10,4,K.coal);
 q(ctx,-25,-80,5,12,K.plasma);
 q(ctx,14,-119,21,55,K.black);q(ctx,17,-116,15,48,K.purple);
 q(ctx,19,-111,12,5,K.violet);q(ctx,20,-100,10,4,K.coal);q(ctx,20,-88,10,4,K.coal);q(ctx,22,-80,5,12,K.plasma);
 wire(ctx,[[-24,-110],[-30,-129]],3,K.iron);wire(ctx,[[26,-110],[32,-129]],3,K.iron);
 q(ctx,-33,-134,9,7,K.bone);q(ctx,24,-134,9,7,K.bone);
 // Ribbed segmented torso.
 polygon(ctx,[[-34,-88],[-23,-103],[18,-104],[37,-86],[32,-45],[17,-35],[-21,-36],[-35,-51]],K.black);
 polygon(ctx,[[-32,-86],[-20,-100],[17,-100],[34,-83],[28,-46],[15,-40],[-18,-41],[-31,-54]],K.purple);
 polygon(ctx,[[-20,-91],[9,-96],[25,-82],[19,-63],[-20,-64]],K.violet);
 q(ctx,-19,-86,30,4,K.armor);q(ctx,-18,-70,31,4,K.coal);
 q(ctx,-4,-84,10,10,K.black);q(ctx,-2,-82,6,6,K.gold);q(ctx,0,-80,3,3,K.hot);
 for(let y=-60;y<-43;y+=7){q(ctx,-22,y,47,3,K.coal);q(ctx,-15,y+1,27,2,K.violet);}
 polygon(ctx,[[-28,-43],[30,-43],[25,-32],[-26,-32]],K.black);
 q(ctx,-25,-41,52,8,K.brass);q(ctx,-8,-40,16,6,K.gold);
 // Oversized pauldrons are chunky outlines, not thin flat rectangles.
 polygon(ctx,[[-51,-98],[-38,-112],[-19,-113],[-10,-102],[-15,-79],[-39,-78],[-50,-86]],K.black);
 polygon(ctx,[[-48,-97],[-37,-109],[-20,-109],[-14,-101],[-19,-82],[-40,-82]],K.purple);
 polygon(ctx,[[-45,-94],[-34,-104],[-22,-104],[-18,-98],[-22,-91],[-43,-90]],K.violet);
 q(ctx,-46,-88,17,4,K.gold);rivet(ctx,-29,-89);
 polygon(ctx,[[12,-102],[20,-113],[39,-111],[52,-99],[49,-85],[40,-79],[16,-79]],K.black);
 polygon(ctx,[[16,-101],[22,-109],[38,-107],[48,-98],[45,-85],[40,-83],[20,-83]],K.purple);
 q(ctx,20,-101,21,5,K.violet);q(ctx,29,-88,14,4,K.gold);rivet(ctx,38,-91);
 // Spiked halo and horns with shadow, bone highlights.
 polygon(ctx,[[-18,-117],[-33,-147],[-19,-141],[-8,-119]],K.black);
 polygon(ctx,[[-18,-122],[-28,-143],[-19,-137],[-10,-121]],K.bone);
 polygon(ctx,[[16,-117],[32,-147],[19,-141],[6,-119]],K.black);
 polygon(ctx,[[16,-122],[28,-143],[19,-137],[8,-121]],K.bone);
 q(ctx,-23,-146,6,5,K.gold);q(ctx,23,-146,6,5,K.gold);
 // Helmet with grated respirator and bright eye lenses.
 polygon(ctx,[[-21,-124],[-12,-132],[13,-132],[23,-124],[18,-102],[-16,-101]],K.black);
 polygon(ctx,[[-18,-124],[-10,-129],[11,-129],[19,-122],[15,-106],[-14,-105]],K.violet);
 q(ctx,-16,-120,32,7,K.black);q(ctx,-11,-118,13,4,K.plasma);q(ctx,5,-118,11,4,K.plasma);
 q(ctx,-7,-116,6,2,K.hot);q(ctx,7,-116,6,2,K.hot);
 polygon(ctx,[[-9,-108],[9,-108],[5,-97],[-5,-97]],K.black);
 for(let x=-6;x<8;x+=4)q(ctx,x,-106,2,7,K.armor);
 q(ctx,-17,-128,12,4,K.iron);q(ctx,4,-128,12,4,K.iron);
 // Left arm: vambrace, knuckles and trailing supply cable.
 wire(ctx,[[-34,-83],[-43+z.cyc*2,-64],[-41+z.cyc*3,-46]],17,K.black);
 wire(ctx,[[-34,-83],[-43+z.cyc*2,-64],[-41+z.cyc*3,-46]],12,K.purple);
 q(ctx,-51+z.cyc*3,-53,19,14,K.black);q(ctx,-48+z.cyc*3,-51,12,7,K.violet);
 q(ctx,-50+z.cyc*3,-44,14,7,K.iron);
 wire(ctx,[[-36,-76],[-57,-68],[-59+z.cyc*2,-49]],4,K.brass);
 // Right-hand energized glaive with a separate 8-frame swing.
 const hands=[[51,-64],[58,-85],[72,-92],[76,-77],[70,-54],[56,-44],[55,-55],[49,-62]];
 const tips=[[70,-157],[95,-150],[101,-105],[108,-62],[94,-8],[70,-12],[75,-52],[67,-116]];
 const hand=z.attacking?hands[n]:[53+z.cyc*2,-60],tip=z.attacking?tips[n]:[67,-142];
 wire(ctx,[[36,-81],[47,-72],hand],17,K.black);wire(ctx,[[36,-81],[47,-72],hand],12,K.purple);
 q(ctx,42,-77,13,7,K.violet);q(ctx,hand[0]-8,hand[1]-5,19,13,K.black);
 q(ctx,hand[0]-5,hand[1]-3,13,8,K.iron);
 wire(ctx,[hand,tip],10,K.black);wire(ctx,[[hand[0]+2,hand[1]],tip],6,K.iron);
 wire(ctx,[[hand[0]+3,hand[1]],[tip[0]-2,tip[1]+5]],2,K.light);
 q(ctx,hand[0]-11,hand[1]-5,23,5,K.gold);
 polygon(ctx,[[tip[0]-10,tip[1]+6],[tip[0]+1,tip[1]-13],[tip[0]+10,tip[1]+6]],K.plasma);
 polygon(ctx,[[tip[0]-4,tip[1]+2],[tip[0]+1,tip[1]-8],[tip[0]+5,tip[1]+2]],K.hot);
 // Reinforcement studs and etched heresy marks.
 rivet(ctx,-37,-96);rivet(ctx,40,-98);rivet(ctx,-15,-74);rivet(ctx,17,-72);
 wire(ctx,[[-15,-51],[-8,-55],[-1,-51],[6,-55]],2,K.gold);
 if(z.wounded)q(ctx,1,-116,14,7,K.hot);
 ctx.restore();
}
const PAINTERS={servitor,heretic,marine};
function build(){
 for(const kind of Object.keys(PAINTERS)){
  const [width,height]=DIMENSIONS[kind];frames[kind]={};
  for(const [state,count] of Object.entries(FRAMES)){
   const list=[];
   for(let i=0;i<count;i++){
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    ctx.save();ctx.translate(Math.floor(width/2),height-FOOT_MARGIN);
    PAINTERS[kind](ctx,state,i);ctx.restore();
    list.push(canvas);
   }
   frames[kind][state]=list;
  }
 }
}
build();
function select(kind,entity,hero,clock){
 if(kind==='servitor'){
  if(hero.hp<=0)return ['death',Math.max(0,Math.min(FRAMES.death-1,Math.floor((clock-hero.deathClock)/5)))];
  if(hero.attack>0)return ['attack',Math.min(FRAMES.attack-1,Math.floor((17-hero.attack)*FRAMES.attack/17))];
  if(hero.inv>37)return ['hurt',Math.floor((45-hero.inv)/2)%FRAMES.hurt];
  if(!hero.ground){const x=hero.vy<-4?0:hero.vy<0?1:hero.vy<6?2:3;return ['jump',x];}
  if(Math.abs(hero.vx)>.52)return ['run',Math.floor(hero.step*1.8)%FRAMES.run];
  return ['idle',Math.floor(clock/12)%FRAMES.idle];
 }
 if(entity.dead)return ['death',Math.max(0,Math.min(FRAMES.death-1,Math.floor((clock-entity.deathClock)/5)))];
 if(entity.hit>0)return ['hurt',Math.floor((12-entity.hit)/3)%FRAMES.hurt];
 if(Math.abs(entity.walk)>0)return ['run',Math.floor(entity.walk*8)%FRAMES.run];
 return ['idle',Math.floor(clock/12)%FRAMES.idle];
}
function draw(g,entity,kind,camera,hero,clock){
 const [state,index]=select(kind,entity,hero,clock);
 const frame=frames[kind][state][index];
 const x=Math.round(entity.x+entity.w/2-camera);
 const feet=Math.round(entity.y+entity.h);
 const direction=kind==='servitor'?hero.facing:entity.face;
 g.save();g.translate(x,feet);g.scale(direction,1);
 // IMPORTANT: sprite was authored relative to feet, not the bottom of its bitmap.
 g.imageSmoothingEnabled=false;
 g.drawImage(frame,-frame.width/2,-(frame.height-FOOT_MARGIN));
 g.restore();
 return {x,feet,state,index,width:frame.width,height:frame.height};
}
root.MarsSprites={draw,frames,states:FRAMES,dimensions:DIMENSIONS,footMargin:FOOT_MARGIN};
})(window);