# ⚡ Kaitorat

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**A personal productivity application with a Persona 5 Royal-inspired aesthetic**

*Built with React, TypeScript, and PocketBase*

[Features](#-features) • [Getting Started](#-getting-started) • [Roadmap](#-roadmap)

</div>

---

## ✨ Features

### 🍅 Pomodoro Timer
- ✅ **Full-featured Pomodoro timer** with work, short break, and long break sessions
- 🔄 **Real-time synchronization** across multiple tabs/devices using PocketBase
- ⚙️ **Customizable durations** with intuitive settings modal
- 💾 **Persistent state** - timer continues even after closing the app
- 🔊 **Audio notifications** on timer completion
- 📊 **Session tracking** and statistics

### 🎨 Design
- **Persona 5 Royal-inspired** theme with bold colors and sleek animations
- **Smooth transitions** powered by Framer Motion
- **Responsive design** for all screen sizes
- **Modern UI** built with Shadcn UI components

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="120">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
  <br />React
</td>
<td align="center" width="120">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
  <br />TypeScript
</td>
<td align="center" width="120">
  <img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
  <br />Vite
</td>
<td align="center" width="120">
  <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind CSS" />
  <br />Tailwind CSS
</td>
</tr>
</table>

- **State Management**: Zustand
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Backend**: PocketBase
- **Authentication**: PocketBase Auth

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PocketBase instance running

### Installation

```bash
# Clone the repository
git clone https://github.com/Kaitorat/frontend-web.git
cd frontend-web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
VITE_POCKETBASE_EMAIL=your-email@example.com
VITE_POCKETBASE_PASSWORD=your-password
```

---

## 📁 Project Structure

```
src/
├── components/     # React components
│   ├── dashboard/  # Dashboard and main views
│   ├── features/   # Feature components (Timer, etc.)
│   ├── layout/     # Layout components (Sidebar, etc.)
│   └── ui/         # Reusable UI components
├── stores/         # Zustand state management
├── hooks/          # Custom React hooks
├── lib/            # Utilities and configurations
└── types/          # TypeScript type definitions
```

---

## 🗺️ Roadmap

### 🔜 Upcoming Features

- [ ] **Habit Tracker** - Calendar-style habit tracking with streak calculation and statistics
- [ ] Enhanced statistics dashboard
- [ ] Mission/task management integration

### 💡 Future Considerations

- Mobile app version
- Advanced analytics
- Export data functionality

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">

**Built with ❤️ by IamKaleb21*

</div>