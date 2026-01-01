# Product Requirements Document (PRD)
## Kaitorat - Personal Productivity App

**Version:** 1.0  
**Date:** December 2024  
**Status:** In Development  
**Author:** Development Team

---

## 1. Executive Summary

Kaitorat is a personal productivity application designed for local deployment, focusing on helping users improve their productivity through gamified task management. The application features a distinctive Persona 5 Royal-inspired theme and aesthetic, combining functionality with an engaging visual experience.

**Key Highlights:**
- Personal/local deployment application
- Productivity-focused with gamification elements
- Persona 5 Royal-inspired design and theme
- Initial features: Pomodoro Timer and Habit Tracker
- Frontend: React Native (Expo) with NativeWind
- Backend: PocketBase instance

---

## 2. Problem Statement

### 2.1 Problem
Users struggle with maintaining consistent productivity habits and managing their time effectively. Existing productivity apps often lack visual appeal, personalization, or require cloud services that may not be desired for privacy-conscious users.

### 2.2 Solution
A locally-deployed productivity application that combines effective productivity techniques (Pomodoro, habit tracking) with an engaging, game-inspired interface that motivates users through visual feedback and progress tracking.

---

## 3. Goals and Objectives

### 3.1 Primary Goals
1. **Productivity Enhancement**: Help users improve focus and build consistent habits
2. **Local-First**: Provide a self-hosted solution that respects user privacy
3. **Engaging Experience**: Create a visually appealing interface inspired by Persona 5 Royal
4. **Extensibility**: Build a foundation that allows for future feature additions

### 3.2 Success Metrics
- User completes at least 3 Pomodoro sessions per day
- User maintains a 7-day streak in habit tracking
- Application loads in under 2 seconds
- Zero data loss incidents
- User satisfaction score > 4.0/5.0

---

## 4. Target Users

### 4.1 Primary Persona
**The Productivity Seeker**
- Age: 20-35
- Tech-savvy, privacy-conscious
- Interested in self-improvement and productivity
- Enjoys gaming aesthetics
- Prefers local/self-hosted solutions
- Uses multiple devices (desktop, mobile)

### 4.2 Use Cases
1. **Focus Sessions**: User needs to concentrate on work/study tasks
2. **Habit Building**: User wants to track and maintain daily habits
3. **Progress Visualization**: User wants to see their productivity trends
4. **Offline Access**: User needs to access the app without internet connectivity

---

## 5. Features and Requirements

### 5.1 Phase 1: Core Features (MVP)

#### 5.1.1 Pomodoro Timer
**Description**: A timer based on the Pomodoro Technique (25-minute work sessions with breaks)

**Functional Requirements:**
- Start/pause/reset timer functionality
- 25-minute default work session
- 5-minute short break
- 15-minute long break (after 4 sessions)
- Visual countdown display
- Sound notifications for session start/end
- Session history tracking
- Daily session statistics

**User Stories:**
- As a user, I want to start a 25-minute focus session so I can concentrate on my work
- As a user, I want to see how many sessions I've completed today
- As a user, I want to be notified when a session ends
- As a user, I want to customize session durations

**Acceptance Criteria:**
- Timer accurately counts down from set duration
- Notifications work on all platforms (web, mobile)
- Session data persists across app restarts
- Timer can be paused and resumed

#### 5.1.2 Habit Tracker
**Description**: A system to track daily habits and visualize progress

**Functional Requirements:**
- Create/edit/delete habits
- Mark habits as complete for the day
- Visual calendar/grid view of habit completion
- Streak tracking (consecutive days)
- Habit statistics (completion rate, longest streak)
- Categories/tags for habits
- Color coding for different habit types

**User Stories:**
- As a user, I want to create a new habit to track
- As a user, I want to mark my habits as complete each day
- As a user, I want to see my current streak for each habit
- As a user, I want to see my habit completion history in a calendar view
- As a user, I want to categorize my habits (health, work, personal, etc.)

**Acceptance Criteria:**
- Habits persist across app restarts
- Streak calculation is accurate
- Calendar view displays at least 30 days of history
- Users can mark habits complete for previous days
- Statistics update in real-time

### 5.2 Phase 2: Future Features (Out of Scope for MVP)
- Task management system
- Goal setting and tracking
- Productivity analytics dashboard
- Social features (optional)
- Mobile app (iOS/Android)
- Desktop app (Electron)
- Integration with calendar apps
- Export data functionality

---

## 6. Technical Requirements

### 6.1 Frontend Stack
- **Framework**: React Native (Expo)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router
- **State Management**: Zustand (or Context API)
- **UI Components**: Custom components with shadcn/ui inspiration
- **Fonts**: Anton (Google Fonts)
- **Platforms**: Web (primary), Mobile (future)

### 6.2 Backend Stack
- **Database**: PocketBase
- **API**: PocketBase REST API
- **Authentication**: PocketBase authentication system
- **Data Storage**: Local PocketBase instance

### 6.3 Design System
- **Theme**: Persona 5 Royal-inspired
- **Color Palette**: 
  - Primary: Red (`hsl(357.6355 80.2372% 50.3922%)`)
  - Accent: Yellow (`hsl(47.9476 95.8159% 53.1373%)`)
  - Background: White (light) / Dark gray (dark mode)
- **Typography**: Anton font family (primary)
- **Border Radius**: Rounded pill-style buttons (`rounded-[28px]`)
- **Shadows**: Subtle shadows for depth

### 6.4 Performance Requirements
- Initial load time: < 2 seconds
- Timer accuracy: ±1 second
- Data sync: Real-time updates
- Offline capability: Full functionality without internet

### 6.5 Security Requirements
- Local data storage (user controls data)
- Secure authentication via PocketBase
- No external data transmission (unless user configures)
- Data encryption at rest (PocketBase default)

### 6.6 Browser/Platform Support
- **Web**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS 13+, Android 8+ (future)
- **Responsive**: Mobile-first design approach

---

## 7. Design Requirements

### 7.1 Visual Design
- **Aesthetic**: Persona 5 Royal-inspired
  - Bold, vibrant colors
  - High contrast text
  - Card-based layouts
  - Animated transitions
  - Game-like UI elements

### 7.2 UI Components
- **Buttons**: Pill-shaped with rounded corners
- **Cards**: Elevated cards with shadows
- **Timers**: Large, prominent display
- **Habit Grid**: Calendar-style grid view
- **Navigation**: Bottom navigation or sidebar

### 7.3 User Experience
- **Accessibility**: 
  - WCAG 2.1 AA compliance
  - Keyboard navigation support
  - Screen reader compatibility
- **Responsiveness**: 
  - Mobile-first design
  - Touch-friendly targets (min 44x44px)
  - Responsive layouts for different screen sizes

### 7.4 Animations
- Smooth transitions between screens
- Timer countdown animations
- Habit completion animations
- Progress bar animations
- Micro-interactions for user feedback

---

## 8. Data Model

### 8.1 Pomodoro Sessions
```typescript
interface PomodoroSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  type: 'work' | 'shortBreak' | 'longBreak';
  completed: boolean;
  createdAt: Date;
}
```

### 8.2 Habits
```typescript
interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HabitEntry {
  id: string;
  habitId: string;
  userId: string;
  date: Date; // YYYY-MM-DD format
  completed: boolean;
  notes?: string;
  createdAt: Date;
}
```

### 8.3 User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  preferences: {
    pomodoroDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    theme: 'light' | 'dark';
  };
  createdAt: Date;
}
```

---

## 9. API Requirements

### 9.1 PocketBase Collections

#### 9.1.1 Users Collection
- Standard PocketBase user collection
- Custom fields: `username`, `preferences` (JSON)

#### 9.1.2 Pomodoro Sessions Collection
- Fields: `user`, `startTime`, `endTime`, `duration`, `type`, `completed`
- Relations: `user` → `users`

#### 9.1.3 Habits Collection
- Fields: `user`, `name`, `description`, `category`, `color`
- Relations: `user` → `users`

#### 9.1.4 Habit Entries Collection
- Fields: `user`, `habit`, `date`, `completed`, `notes`
- Relations: `user` → `users`, `habit` → `habits`

### 9.2 API Endpoints (PocketBase)
- Authentication: `/api/collections/users/auth-*`
- Pomodoro Sessions: `/api/collections/pomodoro_sessions/*`
- Habits: `/api/collections/habits/*`
- Habit Entries: `/api/collections/habit_entries/*`

---

## 10. Development Phases

### 10.1 Phase 1: Foundation (Weeks 1-2)
- [x] Project setup (React Native, Expo, NativeWind)
- [x] Design system implementation
- [x] Theme configuration (Persona 5 Royal colors)
- [x] Font setup (Anton)
- [ ] Basic navigation structure
- [ ] PocketBase integration setup

### 10.2 Phase 2: Pomodoro Timer (Weeks 3-4)
- [ ] Timer component
- [ ] Session management
- [ ] Notifications
- [ ] Statistics view
- [ ] Data persistence

### 10.3 Phase 3: Habit Tracker (Weeks 5-6)
- [ ] Habit CRUD operations
- [ ] Calendar/grid view
- [ ] Streak calculation
- [ ] Statistics dashboard
- [ ] Data persistence

### 10.4 Phase 4: Polish & Testing (Week 7)
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Testing (unit, integration, E2E)
- [ ] Documentation
- [ ] Deployment setup

---

## 11. Out of Scope (MVP)

The following features are explicitly out of scope for the initial release:

1. **Social Features**: Sharing, collaboration, leaderboards
2. **Third-party Integrations**: Calendar sync, task managers
3. **Mobile Native Apps**: iOS/Android native apps (web-first approach)
4. **Advanced Analytics**: Complex data visualization, reports
5. **Multi-language Support**: Only English for MVP
6. **Cloud Sync**: Cloud backup/sync features
7. **Offline-first PWA**: Basic offline support only

---

## 12. Risks and Mitigation

### 12.1 Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| PocketBase performance issues | High | Low | Use local instance, optimize queries |
| Timer accuracy on web | Medium | Medium | Use Web Workers, requestAnimationFrame |
| Data loss | High | Low | Regular backups, data validation |
| Browser compatibility | Medium | Low | Test on multiple browsers early |

### 12.2 Product Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| User adoption | High | Medium | Focus on core features, gather feedback |
| Feature creep | Medium | High | Strict scope management, prioritize MVP |
| Design complexity | Medium | Medium | Simplify where possible, iterate |

---

## 13. Success Criteria

### 13.1 MVP Success Criteria
- [ ] Both core features (Pomodoro, Habit Tracker) fully functional
- [ ] Data persists correctly across sessions
- [ ] Application loads in < 2 seconds
- [ ] Zero critical bugs
- [ ] Design matches Persona 5 Royal aesthetic
- [ ] Works on major browsers (Chrome, Firefox, Safari)

### 13.2 Post-MVP Success Criteria
- User retention rate > 60% after 30 days
- Average daily active users > 10 sessions
- Habit completion rate > 70%
- User satisfaction score > 4.0/5.0

---

## 14. Dependencies

### 14.1 External Dependencies
- PocketBase instance (user-provided or local)
- Expo SDK
- React Native libraries
- Google Fonts (Anton)

### 14.2 Internal Dependencies
- Design system completion
- Component library
- State management setup
- API integration layer

---

## 15. Open Questions

1. Should habits support recurring patterns (e.g., every other day)?
2. Should Pomodoro sessions support custom tags/categories?
3. What level of customization should users have for the theme?
4. Should there be a demo/guest mode for users to try before signing up?
5. How should data export be handled (CSV, JSON)?

---

## 16. Appendices

### 16.1 Glossary
- **Pomodoro Technique**: Time management method using 25-minute focused work sessions
- **Habit Streak**: Consecutive days a habit has been completed
- **PocketBase**: Open-source backend-as-a-service platform
- **NativeWind**: Tailwind CSS for React Native

### 16.2 References
- Persona 5 Royal (game design inspiration)
- Pomodoro Technique (productivity method)
- PocketBase Documentation
- Expo Documentation
- React Native Documentation

### 16.3 Change Log
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Dec 2024 | Initial PRD creation | Development Team |

---

**Document Status**: Active  
**Last Updated**: December 2024  
**Next Review**: January 2025
