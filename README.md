# T4 Chat - T3 Chat Clone

developed using i3 12 gen acer laptop
twiter - https://x.com/abhay_honparkhe

A modern AI chat application inspired by T3 Chat, featuring an elegant Apple-style design, multiple AI models, and real-time chat synchronization. Built for the T3 Chat Cloneathon with a focus on user experience and aesthetic appeal.

Repository: [https://github.com/abhayhonparkhe/t4-chat.git](https://github.com/abhayhonparkhe/t4-chat.git)

## 🌟 Features

- **Multiple AI Models**
  - GPT-3.5 Turbo
  - GPT-4
  - Claude 3 Sonnet
  - Claude 3 Haiku
  - Mistral 7B Instruct

- **Beautiful UI**
  - Apple-inspired glassmorphic design
  - Frosted glass effects
  - Smooth animations
  - Responsive layout
  - Dark mode optimized

- **Core Functionality**
  - GitHub authentication
  - Real-time chat synchronization
  - Chat history with search
  - Guest mode support
  - Message persistence

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/abhayhonparkhe/t4-chat.git
cd t4-chat
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env.local with:
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

## 🛠️ Tech Stack

```json
{
  "frontend": {
    "framework": "Next.js 15.3.3",
    "ui": [
      "React 19",
      "TailwindCSS 4",
      "Lucide Icons"
    ]
  },
  "backend": {
    "database": "Firebase/Firestore",
    "auth": "NextAuth.js",
    "ai": "Various AI Model APIs"
  },
  "deployment": {
    "hosting": "Vercel",
    "database": "Firebase"
  }
}
```

## 📦 Dependencies

```json
{
  "core": {
    "next": "15.3.3",
    "react": "^19.0.0",
    "firebase": "^11.9.1",
    "next-auth": "^4.24.11"
  },
  "ui": {
    "lucide-react": "^0.513.0",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.4"
  },
  "utilities": {
    "date-fns": "^4.1.0",
    "lodash": "^4.17.21"
  }
}
```

## 🗄️ Project Structure

```
src/
├── app/                # Next.js app router
│   ├── api/           # API routes
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main chat interface
├── components/        # React components
│   ├── Sidebar.tsx    # Chat sidebar
│   └── ...           # Other components
├── lib/              # Firebase setup
└── types/            # TypeScript types
```

## 🎨 UI Features

- Frosted glass sidebar
- Apple-style message bubbles
- Smooth transitions
- Responsive design
- Dark mode optimized
- Loading animations

## 🔐 Authentication

- GitHub OAuth integration
- Persistent sessions
- Secure user data handling
- Guest mode support

## 💾 Data Persistence

- Firebase Firestore for data storage
- Real-time updates
- Message history
- User preferences
- Chat synchronization

## 🚀 Deployment

The app is configured for deployment on Vercel with Firebase backend.

## 📝 License

MIT License

## 🙋‍♂️ Author

Abhay Honparkhe
- GitHub: [@abhayhonparkhe](https://github.com/abhayhonparkhe)

## 🙏 Acknowledgments

- T3 Chat team for the inspiration
- NextAuth.js for authentication
- Firebase for backend services
- Vercel for hosting
