# Voyager3D

An interactive 3D globe travel planning application built with Next.js, React Three Fiber, and TypeScript. Plan your journeys by clicking on countries, save travel details, and visualize your adventures on a beautiful 3D globe.

## Features

- **Interactive 3D Globe**: Navigate and explore countries with smooth 3D interactions
- **Travel Planning**: Click on any country to plan your trip details
- **Travel Data Management**: Save flight information, accommodation, transportation, and custom details
- **Visual Progress Tracking**: See planned countries highlighted on the globe
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Your travel plans are saved locally and persist between sessions

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── Globe/          # 3D globe related components
│   ├── TravelPanel/    # Travel planning form components
│   └── UI/             # Reusable UI components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and data
```

## Usage

1. **Explore the Globe**: Use mouse/touch to rotate and zoom the 3D globe
2. **Select Countries**: Click on any country to open the travel planning panel
3. **Plan Your Trip**: Fill in travel details including flights, accommodation, and custom notes
4. **Save Your Plans**: Your travel data is automatically saved and countries are marked as planned
5. **Track Progress**: See your planned destinations highlighted on the globe

## Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```
