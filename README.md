# Animated Routines - Discipline Frame by Frame

A modern workout tracking application built with Next.js that features animated exercise guides and routine management.

![Animated Routines](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🎯 **Animated Exercise Guides**: Frame-by-frame exercise animations with customizable timing
- 📋 **Routine Management**: Create, edit, and organize workout routines
- 🏃‍♂️ **Workout Execution**: Guided workout sessions with audio cues and timers
- 📊 **Progress Tracking**: Log workouts and track your fitness journey
- 🎨 **Modern UI**: Beautiful dark theme with gold, blue, and green accents
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔊 **Audio Feedback**: Start, halfway, and completion sounds for exercises

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/animated-routines.git
cd animated-routines
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
animated-routines/
├── app/                    # Next.js App Router pages
│   ├── create-exercise/    # Exercise creation page
│   ├── create-routine/     # Routine creation page
│   ├── execute-routine/    # Workout execution page
│   ├── exercises/          # Exercise management
│   ├── log/               # Workout logs
│   ├── routines/          # Routine management
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── navigation.tsx    # Main navigation
├── lib/                  # Utility functions
│   ├── data.ts          # Data management & storage
│   ├── sounds.ts        # Audio utilities
│   └── utils.ts         # General utilities
├── public/              # Static assets
│   ├── audios/         # Audio files for workouts
│   └── exercises/      # Exercise images
└── styles/             # Global styles
```

## 🎮 Usage

### Creating Exercises
1. Navigate to "Create Exercise"
2. Add exercise details (name, duration, rest time)
3. Upload or select exercise images for animation frames
4. Save your exercise

### Building Routines
1. Go to "Create Routine"
2. Add exercises to your routine
3. Set the number of sets
4. Save your routine

### Executing Workouts
1. Select "Execute Routine" or start from the home page
2. Choose a routine to perform
3. Follow the animated guides with audio cues
4. Track your progress automatically

## 🎨 Design System

The app uses a carefully crafted dark theme with:
- **Primary**: Gold (#ffd700) for main actions
- **Secondary**: Dodger Blue (#1e90ff) for secondary actions  
- **Accent**: Lime Green (#32cd32) for positive feedback
- **Background**: Dark Gray (#121212) for the main background

## 🔧 Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono
- **State Management**: React hooks with localStorage persistence
- **Audio**: Web Audio API for workout sounds

## 📱 Features in Detail

### Animated Exercise Guides
- Frame-by-frame image cycling for proper exercise form
- Customizable animation speeds per exercise
- Smooth transitions between exercise positions

### Audio System
- Start sound when workouts begin
- Halfway notifications during exercises
- Completion sounds for finished exercises
- Custom audio context for generated sounds

### Data Persistence
- Local storage for routines, exercises, and workout logs
- Default exercises and routines included
- Automatic data migration and error handling

## 🚀 Deployment

The app is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/animated-routines)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Animated Routines** - Building discipline, frame by frame. 💪
