# Tongji 120 Interactive Brand System

Interactive motion design tools for Tongji University's 120th anniversary celebration.

This repository contains browser-based installations for exhibition use, including a generative poster machine and a live camera photo booth with hand tracking.

## Overview

The project explores the concept **"three forces, one direction"** through a modular logo system:

- Red `1`
- Blue `2`
- Gold `0`

The same shapes are used across all tools in both:

- `Unified` mode (full logo composition)
- `Deconstructed` mode (separate moving glyphs)

## Project Structure

- `index.html` : Landing page with animated background and links to all installations
- `tongji_poster_machine.html` : Generative poster tool with depth/layer/color controls
- `tongji_fotobooth.html` : Camera-based interaction tool with hand tracking and capture workflow
- `test.html`, `track_test.html`, `track_test.js` : Experimentation/test files
- `check_syntax.js` : Utility script to syntax-check inline scripts in key HTML files

## Key Features

### 1. Poster Generator

- Layered/extruded rendering of logo glyphs
- Adjustable parameters:
  - Rotation speed
  - Layer count
  - Depth
  - Scale
  - Tilt
- Multiple color modes (`brand`, `rainbow`, `neon`, `mono`, `cmyk`)
- Background presets
- PNG export
- Random seed generation

### 2. Photo Booth

- Real-time webcam background rendering
- ML5 `handpose` tracking for interaction
- ML5 `poseNet` body anchor logic for person-centric modes
- Interaction modes:
  - `Follow`
  - `Trail`
  - `Orbit`
  - `Scatter`
  - `Assemble`
  - `That Person`
- `Unified` and `Deconstructed` logo modes
- Countdown capture flow
- PNG download of composited frame

### 3. Landing Experience

- Interactive index with custom visual identity
- Animated logo-shape background responding to tracked movement
- Direct links to both installations

## Tech Stack

- Plain HTML/CSS/JavaScript (no framework)
- Canvas 2D rendering
- [ml5.js](https://ml5js.org/) for browser-side tracking models
- Vercel Analytics/Speed Insights scripts in pages

## Installation

```bash
git clone https://github.com/charaschoe/tongji-120.git
cd tongji-120
npm install
```

## Local Development

Start a local static server on port `3000`:

```bash
npm run dev
```

Then open:

- `http://localhost:3000/index.html`

## Available Scripts

- `npm run dev` : Start local static server (`python3 -m http.server 3000`)
- `npm run start` : Same as `dev`
- `npm run syntax-check` : Run inline script syntax checks via `check_syntax.js`

## Exhibition Notes

Recommended setup for stable exhibition use:

- Large screen (55"+ recommended)
- Dedicated webcam with stable mounting
- Bright, even lighting for more reliable hand tracking
- Modern Chromium-based browser in fullscreen mode
- Machine with enough headroom for live camera + canvas rendering

## Design Direction

This project intentionally keeps a lightweight stack and direct canvas control to support rapid iteration, kiosk deployment, and visual fidelity for large-format display contexts.
