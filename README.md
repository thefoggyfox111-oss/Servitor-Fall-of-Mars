# Servitor: Fall of Mars

An original 2D pixel-art action platformer prototype for Android, set during an attack on an Adeptus Mechanicus temple on Mars.

## Version 1.1 — Visual overhaul

- Three-layer industrial Mars skyline with parallax.
- Pixel-art-inspired servitor, heretics and armored Chaos enemies.
- Animated movement, red glowing optics, sparks, sword trails and damage particles.
- Camera easing, subtle screen shake, enemy health bars and a temple entrance.
- One playable level with touch and keyboard controls.

## Controls

Android touch screen: left/right arrows to move, ▲ to jump, ⚔ to attack.

Keyboard: A/D or arrow keys to move, W/Space/Up to jump, Z/J to attack. R to restart after completing or losing the level.

## APK

Go to [GitHub Actions](../../actions), open the newest successful **Build Android APK** run, and download **Servitor-APK** from Artifacts. Unzip it and install the debug APK on your Android device.

The game uses procedural Canvas 2D graphics. No assets or code from Dead Cells are included.

## Version 1.3 — character art and animation

- Complete original full-body Servitor, Heretic and Chaos Marine sprites (120 cached pixel-art frames).
- Unified foot pivots: boots rest on platforms, no waist clipping.
- Detailed servo cables, glowing optics, hooded robes, heavy armor and animated weapons.
- 6-frame idle, 10-frame run, 4-frame jump, 8-frame attack, 4-frame hurt and 8-frame death for each character type.
- Stronger regression tests assert that every painted pixel lies inside its source frame.


## Version 1.4 — weapons, shooting, traversable buildings

- Enemies no longer damage the player by contact: heretics and Chaos Marines perform telegraphed melee attacks with an active weapon hit window and recovery cooldown.
- Servitor receives a hand-mounted blaster, a dedicated touch button (✦) and projectile impact effects. Hold ✦ to shoot; keyboard X or K also fires.
- Three Martian manufactorum buildings have traversable rooftops and exterior climbing platforms; some heretics patrol the roofs.
- Enemy gait animation is slower with less bobbing and pauses when enemies attack.
- Regression tests verify roofs, attack windup, absence of collision damage, projectile hits and enemy animation pacing.

