# Fish Simulation
![screenshot](https://raw.githubusercontent.com/wayneyip/fishtank/dev/docs/wayne_ocean_v1.png)

A web-based interactive fish simulation built with Three.js and custom HLSL shaders. 

Supports desktop, mobile and tablet for mouse and touch input.

## Features
- **Boids simulation**: Based on the flocking principles by Craig Reynolds, along with velocity limiting and bounds avoidance. 
- **Ray avoidance**: I derived my own technique for boids to avoid the mouse/touch position's raycast, since ray avoidance is not a common feature for boids.
- **Fast procedural god rays**: God rays are emulated with a single cone mesh, sampling a caustics texture in polar coordinates that shift over time.
- **Custom caustics shaders**: The fish, ground, and water surface all use different custom HLSL shaders, each of which performs texture sampling in different ways (e.g. the fish samples the caustics texture in world space).

## Details
**Languages**: JavaScript (Three.js), HLSL, HTML, CSS
**Dev Server**: Vite
**Hosting Platform**: Vercel
**Author**: Wayne Yip
