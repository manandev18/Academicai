# Academic Integrity Agent - React Web Application

A comprehensive React-based web application for academic integrity management, featuring AI-powered content detection using Google Gemini, assignment breakdown, draft review, and session management.

## Features

### 🔐 Authentication & User Management
- Secure Firebase Authentication
- User registration and login
- Protected routes and session management

### 📝 Assignment Analysis
- **Assignment Breakdown**: AI-powered analysis that breaks down assignments into logical sections
- **Source Suggestions**: Intelligent recommendations for reliable academic sources
- **Draft Review**: Comprehensive feedback on essay drafts for originality, clarity, and academic tone

### 🤖 AI Content Detection
- **Gemini-Powered Analysis**: Advanced AI detection using Google's Gemini 2.0 Flash model
- **Risk Assessment**: Confidence levels (High/Medium/Low) with detailed explanations
- **Real-time Analysis**: Instant feedback on submitted content
- **Detection History**: Complete audit trail of all AI detection reports

### 📊 Session Management
- **Save Sessions**: Store assignment prompts, breakdowns, and feedback
- **History Tracking**: View past assignments and AI detection reports
- **PDF Export**: Generate professional reports for academic records
- **Data Persistence**: Secure cloud storage with Firebase Firestore

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Tailwind CSS**: Clean, modern interface with consistent design system
- **Interactive Components**: Smooth animations and micro-interactions
- **Accessibility**: WCAG compliant with proper contrast ratios and keyboard navigation

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini 2.0 Flash API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **PDF Generation**: jsPDF + html2canvas
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Google Gemini API key

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Firebase Setup**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Email/Password provider
   - Create a Firestore database
   - Add your domain to authorized domains in Authentication settings

4. **Gemini API Setup**:
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add the key to your environment variables

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Dashboard/       # Main dashboard components
│   └── Layout/          # Layout components
├── contexts/            # React contexts
├── services/            # API and business logic
├── config/              # Configuration files
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## Key Components

### Authentication System
- **AuthContext**: Manages user state and authentication methods
- **AuthForm**: Unified login/registration component with form validation
- **Protected Routes**: Automatic redirection based on authentication status

### AI Detection Engine
- **Real-time Analysis**: Instant AI content detection with confidence scoring
- **Pattern Recognition**: Analyzes writing patterns, style consistency, and critical thinking depth
- **Risk Indicators**: Visual feedback with color-coded risk levels
- **Detailed Explanations**: Comprehensive analysis with specific recommendations

### Academic Tools
- **Assignment Breakdown**: Structures assignments into logical sections with word counts
- **Draft Review**: Multi-criteria analysis including originality, clarity, and academic tone
- **Source Suggestions**: Curated recommendations for reliable academic resources

### Data Management
- **Session Persistence**: Automatic saving of user sessions and analysis results
- **History Tracking**: Complete audit trail with timestamps and metadata
- **Export Functionality**: PDF generation for academic records and reporting

## Security Features

- **Firebase Security Rules**: Proper data access controls
- **Environment Variables**: Secure API key management
- **Input Validation**: Client and server-side validation
- **Authentication Guards**: Protected routes and API endpoints

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Optimized Bundling**: Vite's fast build system
- **Efficient State Management**: Context-based state with minimal re-renders
- **Caching**: Strategic caching of API responses

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the Firebase and Gemini API documentation for integration issues