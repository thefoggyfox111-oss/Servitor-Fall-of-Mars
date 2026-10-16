'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const sprites=fs.readFileSync('app/src/main/assets/sprites.js','utf8');
const architecture=fs.readFileSync('app/src/main/assets/architecture.js','utf8');
const code=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(code,'inline game code is present');
assert.ok(html.includes('<script src="architecture.js"></script>'),'building script loaded');
assert.ok(html.includes('data-key="shoot"'),'shoot button present');
const noop=()=>{};
function context2d(){return {
 imageSmoothingEnabled:false,fillStyle:'',strokeStyle:'',font:'',
 lineWidth:1,globalAlpha:1,save:noop,restore:noop,translate:noop,
 rotate:noop,scale:noop,beginPath:noop,closePath:noop,fill:noop,stroke:noop,
 fillRect:noop,drawImage:noop,moveTo:noop,lineTo:noop,quadraticCurveTo:noop,
 arc:noop,fillText:noop,
 createLinearGradient(){return {addColorStop:noop}},
 createRadialGradient(){return {addColorStop:noop}}
};}
const gameCanvas={getContext:context2d};
const retry={style:{display:'none'},addEventListener:noop};
const document={
 createElement(kind){assert.equal(kind,'canvas');return {width:0,height:0,getContext:context2d}},
 querySelector(selector){return selector==='#game'?gameCanvas:retry},
 querySelectorAll(){return []}
};
const scope={document,Math,requestAnimationFrame:noop,addEventListener:noop};
scope.window=scope;vm.createContext(scope);
for(const [name,source] of [['sprites.js',sprites],['architecture.js',architecture],['index.html',code]]){
 new vm.Script(source,{filename:name}).runInContext(scope);
}
function exec(expr){return vm.runInContext(expr,scope)}
assert.equal(exec('buildings.length'),3,'three industrial buildings');
assert.equal(exec('MarsArchitecture.solids.length'),9,'three rooftops and six steps');
assert.ok(exec('landings.length')>=15,'collidable rooftops and stairs');

// Falling onto the roof must land the player feet at roof height.
exec('reset();enemies.forEach(e=>e.dead=true);player.x=buildings[0].x+120;player.y=buildings[0].y-player.h-42;player.vy=0;player.ground=false;');
for(let i=0;i<30;i++)exec('update()');
assert.equal(exec('Math.round(player.y+player.h)'),exec('buildings[0].y'),'boots touch roof');
assert.equal(exec('player.ground'),true,'rooftop can be stood on');

// Simply walking into an enemy cannot deal damage without weapon animation.
exec('reset();enemies.forEach((e,i)=>{if(i>0)e.dead=true});player.x=289;player.y=FLOOR-player.h;player.vy=0;player.ground=true;enemies[0].x=327;enemies[0].y=FLOOR-enemies[0].h;enemies[0].patrolMin=327;enemies[0].patrolMax=327;enemies[0].cd=999;');
for(let i=0;i<18;i++)exec('update()');
assert.equal(exec('player.hp'),100,'no damage on collision alone');
assert.equal(exec('enemies[0].attackTimer'),0,'attack remains on cooldown');

// Weapon attack must telegraph before its active hit.
exec('enemies[0].cd=0;update()');
assert.ok(exec('enemies[0].attackTimer')>0,'weapon windup begins');
const windup=exec('enemies[0].windup');
for(let i=0;i<windup-2;i++)exec('update()');
assert.equal(exec('player.hp'),100,'damage prohibited during windup');
for(let i=0;i<8;i++)exec('update()');
assert.ok(exec('player.hp')<100,'active weapon strike inflicts damage');

// Player gun bullets must collide with enemies via swept (segment) hits.
exec('reset();enemies.forEach((e,i)=>{if(i!==0)e.dead=true});player.x=90;player.y=FLOOR-player.h;player.vy=0;player.ground=true;player.facing=1;enemies[0].x=264;enemies[0].y=FLOOR-enemies[0].h;enemies[0].patrolMin=264;enemies[0].patrolMax=264;enemies[0].cd=900;keys.shoot=true;');
exec('update()');
assert.ok(exec('bolts.length')>0,'gun emits projectile');
assert.ok(exec('player.shotFlash')>0,'gun shot has muzzle flash');
for(let i=0;i<20;i++)exec('update()');
assert.ok(exec('enemies[0].hp')<2,'bullet deals damage to enemy');
assert.equal(exec('player.hp'),100,'shooting never harms player');

// Enemy gait should preserve a pose for multiple ticks rather than flicker.
exec('reset();enemies[0].moving=true;enemies[0].walk=.1;');
const e=exec('enemies[0]'),hero=exec('player');
const a=scope.MarsSprites.draw(context2d(),e,'heretic',0,hero,50);
e.walk+=.043;
const b=scope.MarsSprites.draw(context2d(),e,'heretic',0,hero,51);
assert.equal(a.state,'run');
assert.equal(a.index,b.index,'walking sprite does not switch every tick');
console.log('PASS: walkable buildings, weapon-only damage, enemy windup, gun projectiles and slower gait');
