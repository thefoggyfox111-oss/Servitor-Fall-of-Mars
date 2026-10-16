/* Mars forge district. Each building has a physically walkable roof and two approach steps. */
(function(root){
'use strict';
const buildings=[
 {x:470,y:344,w:276,kind:0,label:'FERRUM // 07'},
 {x:1400,y:337,w:290,kind:1,label:'DATA-SANCTUM'},
 {x:2360,y:338,w:320,kind:2,label:'REACTOR // 03'}
];
const solids=buildings.flatMap(b=>[
 {x:b.x-81,y:402,w:82,h:15,building:true},
 {x:b.x-33,y:373,w:70,h:15,building:true},
 {x:b.x,y:b.y,w:b.w,h:20,building:true,roof:true}
]);
const paint=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));};
function windowGlow(g,x,y,active){
 paint(g,x-3,y-3,31,47,'#14141f');
 paint(g,x,y,25,41,'#362532');
 paint(g,x+4,y+5,17,27,active?'#c3784e':'#5d423b');
 paint(g,x+9,y+9,6,16,active?'#f6b36a':'#80624f');
 paint(g,x+11,y+15,2,10,'#ffe4a9');
 paint(g,x+11,y+2,3,40,'#28202b');
 paint(g,x,y+19,25,4,'#2a232d');
}
function draw(g,camera,clock){
 for(const b of buildings){
  const x=b.x-camera,y=b.y,w=b.w;
  if(x+w<-140||x>1100)continue;
  const height=451-y,lit=Math.sin(clock*.035+b.kind*1.5)>.25;
  // Stone and plasteel facade behind the characters.
  paint(g,x-7,y-5,w+14,height+5,'#201d28');
  paint(g,x,y,w,height,'#4a3540');
  paint(g,x+7,y+14,w-14,height-20,'#392e39');
  for(let col=0;col<Math.floor(w/48);col++){
   const px=x+col*48+4;
   paint(g,px,y+10,5,height-12,'#5b4448');
   paint(g,px+7,y+32,30,3,'#211e2a');
   paint(g,px+7,y+70,30,3,'#211e2a');
   paint(g,px+3,y+9,2,height-18,'#826059');
  }
  // Buttresses and pipework: each building has different industrial equipment.
  paint(g,x+10,y-40,26,41,'#242330');
  paint(g,x+14,y-79,18,45,'#57414b');
  paint(g,x+13,y-87,21,9,'#b37a59');
  paint(g,x+16,y-89,15,4,'#e4a76d');
  paint(g,x+w-50,y-66,24,68,'#242630');
  paint(g,x+w-46,y-96,16,32,'#715152');
  paint(g,x+w-48,y-101,20,7,'#c28b62');
  for(let i=0;i<3;i++){
   let px=x+46+i*74;
   windowGlow(g,px,y+31,(i+b.kind)%3!==0&&lit);
  }
  // Grille / walk-in arched service bay.
  const cx=x+w*.5-28;
  paint(g,cx,y+50,56,height-52,'#1b1823');
  paint(g,cx+8,y+47,40,12,'#2c2530');
  paint(g,cx+15,y+40,26,9,'#987057');
  paint(g,cx+10,y+61,36,height-67,'#342a36');
  for(let k=0;k<4;k++)paint(g,cx+14+k*8,y+64,3,height-73,'#74605b');
  paint(g,cx+20,y+height-34,19,5,'#d4a771');
  // Metal roof with battlements and accessible broad walking surface.
  paint(g,x-9,y-14,w+18,14,'#201f2b');
  paint(g,x-8,y-15,w+16,6,'#9e6753');
  paint(g,x-7,y-17,w+14,3,'#efaf72');
  for(let i=0;i<Math.ceil(w/27);i++){
    paint(g,x+i*27,y-24,15,10,'#34303a');
    paint(g,x+i*27+2,y-25,11,3,'#8a665a');
    paint(g,x+i*27+11,y-9,8,2,'#d79a73');
  }
  // Crest and lift machinery.
  paint(g,x+w*.5-33,y-54,66,35,'#2a2530');
  paint(g,x+w*.5-29,y-50,58,25,'#74534f');
  paint(g,x+w*.5-17,y-45,34,15,'#30242d');
  paint(g,x+w*.5-2,y-51,5,27,'#d69b67');
  paint(g,x+w*.5-11,y-41,24,5,'#d69b67');
  paint(g,x+w*.5+35,y-49,7,36,'#272832');
  paint(g,x+w*.5+33,y-56,11,8,'#b18a69');
  // Two ascending exterior steps matching the collision platforms.
  for(const [sx,sy,sw] of [[b.x-81,402,82],[b.x-33,373,70]]){
   const px=sx-camera;
   paint(g,px,sy,sw,15,'#33303c');
   paint(g,px,sy,sw,6,'#9b765d');
   paint(g,px,sy+6,sw,3,'#51434c');
   for(let k=0;k<sw;k+=24){paint(g,px+k+6,sy+8,4,5,'#6a5557');}
  }
  // Cable bridge between roof reactors.
  g.strokeStyle='#28232d';g.lineWidth=5;g.beginPath();
  g.moveTo(x+26,y-51);g.quadraticCurveTo(x+w/2,y-18,x+w-35,y-73);g.stroke();
  g.strokeStyle='#ac7056';g.lineWidth=2;g.beginPath();
  g.moveTo(x+27,y-52);g.quadraticCurveTo(x+w/2,y-20,x+w-35,y-74);g.stroke();
 }
}
root.MarsArchitecture={buildings,solids,draw};
})(window);
