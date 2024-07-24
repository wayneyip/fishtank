# Fish Simulation
![screenshot](https://i.imgur.com/6dNS4d5.png)

A web-based interactive fish simulation built with Three.js and custom GLSL shaders. 

Supports desktop, mobile and tablet for mouse and touch input.

## Features
- **Boids simulation**: Based on the flocking principles by Craig Reynolds, along with velocity limiting and bounds avoidance. 
- **Ray avoidance**: I derived my own technique for boids to avoid the mouse/touch position's raycast, since ray avoidance is not a common feature for boids.
- **Fast procedural god rays**: God rays are emulated with a single cone mesh, sampling a caustics texture in polar coordinates that shift over time.
- **Custom caustics shaders**: The fish, ground, and water surface all use different custom GLSL shaders, each of which performs texture sampling in different ways (e.g. the fish samples the caustics texture in world space).

## Details
- **Languages**: JavaScript (Three.js), GLSL, HTML, CSS
- **Dev Server**: Vite
- **Hosting Platform**: Vercel
- **Author**: Wayne Yip
