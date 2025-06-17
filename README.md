# T4 Chat - T3 Chat Clone

developed using i3 12 gen acer laptop
twitter - https://x.com/abhay_honparkhe

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

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Authentication (GitHub)
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OpenRouter API (for AI models)
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Visit [http://localhost:3000](http://localhost:3000)

## 🔒 Environment Variables

### Required Variables:

1. **Firebase Configuration**
   - Get these from your Firebase Console under Project Settings
   - All `NEXT_PUBLIC_FIREBASE_*` variables are required for Firestore functionality

2. **GitHub Authentication**
   - Create a new OAuth App in GitHub Developer Settings
   - Set Homepage URL to `http://localhost:3000` (development)
   - Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
   - Use the provided Client ID and Secret

3. **NextAuth Configuration**
   - `NEXTAUTH_URL`: Your app's base URL (e.g., http://localhost:3000)
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

4. **OpenRouter API**
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Get your API key from the dashboard
   - Required for accessing all AI models

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. Fork this repository
2. Create a new project on Vercel
3. Connect your forked repository
4. Configure environment variables in Vercel's dashboard
5. Deploy!

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details
