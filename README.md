# T3 Chat Clone

A modern AI chat application with a beautiful Apple-inspired design, built for the T3 Chat Cloneathon. Features multiple AI models, real-time chat synchronization, and a stunning glassmorphic UI.



## 🌟 Features

- **Multiple AI Models Support**
  - GPT-3.5 Turbo
  - GPT-4
  - Claude 3 Sonnet
  - Claude 3 Haiku
  - Mistral 7B Instruct

- **Authentication & Sync**
  - GitHub authentication
  - Real-time chat synchronization
  - Persistent chat history
  - Guest mode support

- **Beautiful UI/UX**
  - Apple-inspired design
  - Glassmorphism effects
  - Responsive layout
  - Smooth animations
  - Dark mode

- **Smart Features**
  - Chat history search
  - Model switching
  - Real-time updates
  - Message persistence
  - Loading states

## 🚀 Tech Stack

- **Frontend**
  - Next.js 14
  - React
  - TailwindCSS
  - Lucide Icons

- **Backend**
  - Firebase (Firestore)
  - NextAuth.js
  - Various AI APIs

- **Authentication**
  - GitHub OAuth
  - NextAuth.js

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/t3-chat-clone.git
cd t3-chat-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env.local file with:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

## 📱 Usage

1. Visit `http://localhost:3000`
2. Sign in with GitHub or continue as guest
3. Start a new chat
4. Select your preferred AI model
5. Start chatting!

## 🏗️ Project Structure

```
src/
├── app/                  # Next.js app directory
├── components/          # React components
├── lib/                # Firebase and utility functions
├── types/              # TypeScript types
└── utils/              # Helper functions
```

## 🎨 UI Components

- **Sidebar**
  - User profile
  - Chat history
  - Search functionality
  - New chat button

- **Chat Area**
  - Message bubbles
  - Model selector
  - Input area
  - Send button

## 🔒 Authentication Flow

1. User clicks "Sign in with GitHub"
2. GitHub OAuth flow processes
3. User data stored in Firebase
4. Chat history synced automatically

## 💾 Data Structure

```
users/
  ├── {userId}/
  │   ├── chats/
  │   │   ├── {chatId}/
  │   │   │   ├── messages/
  │   │   │   │   ├── {messageId}
  │   │   │   │   └── ...
  │   │   │   └── metadata
  │   │   └── ...
  │   └── settings
  └── ...
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)

## 🙏 Acknowledgments

- T3 Chat team for the inspiration
- NextAuth.js for authentication
- Firebase for backend services
- Various AI providers for their APIs
