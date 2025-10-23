# Monopoly McTrade

> **The Ultimate Platform for McDonald's Monopoly Piece Trading**

Connect with other players to trade, sell, or split McDonald's Monopoly pieces and complete your collections to win amazing prizes together!

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.0-0081CB?style=flat-square&logo=mui)](https://mui.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.75.1-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6.12.5-000000?style=flat-square)](https://clerk.com/)

---

## 🌟 Features

### 🔍 **Smart Piece Discovery**

- **Advanced Search**: Find specific Monopoly pieces by name, section, or rarity
- **Property Set Browsing**: Organize pieces by color-coded property sets
- **Real-time Availability**: See which players have the pieces you need
- **Piece Verification**: Secure system to verify piece authenticity

### 💬 **Seamless Communication**

- **Real-time Chat**: Instant messaging with other players
- **Secure Negotiations**: Private chat rooms for trade discussions
- **Trading History**: Track all your past trades and negotiations
- **User Profiles**: Connect with verified traders

### 📊 **Collection Management**

- **Personal Inventory**: Track all your Monopoly pieces
- **Location Tracking**: Record where you acquired each piece
- **Year-based Organization**: Organize pieces by game year
- **Progress Tracking**: Monitor your collection completion status

### 🛡️ **Safe Trading Environment**

- **User Authentication**: Secure login with Clerk
- **Verified Users**: Only authenticated users can trade
- **Safe Trading Guidelines**: Built-in safety recommendations
- **Report System**: Flag suspicious activity

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **npm** or **yarn**
- **Clerk Account** (for authentication)
- **Supabase Account** (for database)
- **PostHog Account** (for analytics)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/monopoly-mctrade.git
   cd monopoly-mctrade
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create `.env.local` and add your API keys:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here

   # Supabase Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # PostHog Analytics
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

### **Frontend**

- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript 5.0
- **UI Library**: Material-UI (MUI) v5.15.0
- **Styling**: Tailwind CSS 3.3.0
- **State Management**: React Hooks + Custom Caching

### **Backend**

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **API**: Next.js API Routes
- **Caching**: Custom in-memory cache system

### **Analytics & Monitoring**

- **Analytics & Error Tracking**: PostHog

### **Deployment**

- **Platform**: AWS Amplify
- **Database**: Supabase Cloud
- **Authentication & Authorization**: Clerk

---

---

## 🎮 How It Works

### **1. Add Your Pieces**

Start by adding all the Monopoly pieces you have to your collection. Include the year, piece name, and where you acquired it.

### **2. Search for Missing Pieces**

Browse through property sets to find the pieces you need to complete your collections. Each piece shows who has it available.

### **3. Connect with Other Players**

Click on any piece to see all players who have it, then start a chat to negotiate trades, splits, or sales.

### **4. Complete Your Collections**

Trade pieces with other players to complete your property sets and win prizes together!

---

## 🔧 API Endpoints

### **Pieces**

- `GET /api/pieces` - Get all available pieces
- `GET /api/pieces/[id]` - Get specific piece details
- `GET /api/pieces/[id]/users` - Get users who have this piece

### **User Pieces**

- `GET /api/user-pieces` - Get user's collection
- `POST /api/user-pieces` - Add piece to collection
- `DELETE /api/user-pieces` - Remove piece from collection

### **Boards**

- `GET /api/boards` - Get available game years/boards

### **Chats**

- `GET /api/chats` - Get user's chat list
- `POST /api/chats` - Create new chat
- `GET /api/chats/[chatId]` - Get chat messages
- `POST /api/messages` - Send message

---

## 🎨 Customization

### **Theme Customization**

The app uses a custom Material-UI theme. Edit the theme in `components/ThemeRegistry.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // Change primary color
    },
    secondary: {
      main: "#10b981", // Change secondary color
    },
  },
});
```

### **Content Customization**

- Update homepage content in `app/page.tsx`
- Modify educational content in `app/how-it-works/page.tsx`
- Edit piece data in your Supabase database

---

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Add environment variables in Vercel dashboard**
4. **Deploy automatically**

### **Other Platforms**

The app can be deployed to any platform that supports Next.js:

- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

---

## 🛡️ Safety Guidelines

### **Safe Trading Practices**

- ✅ Always verify pieces before trading
- ✅ Use our secure chat system for negotiations
- ✅ Never share personal information
- ✅ Report suspicious activity immediately
- ✅ Meet in public places for physical trades

### **Game Rules & Tips**

- 🎯 Game runs for limited time each year
- 🎯 Some pieces are extremely rare
- 🎯 Complete sets to win prizes
- 🎯 Check official McDonald's terms
- 🎯 Keep your pieces safe and dry

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Use Material-UI components consistently
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📈 Roadmap

### **Phase 1: Core Features** ✅

- [x] User authentication
- [x] Piece collection management
- [x] Basic search functionality
- [x] Real-time chat system

### **Phase 2: Enhanced Trading** 🚧

- [ ] Advanced search filters
- [ ] Piece verification system
- [ ] Trading history tracking
- [ ] Notification system

### **Phase 3: Social Features** 📋

- [ ] User profiles and ratings
- [ ] Trading groups and communities
- [ ] Achievement system
- [ ] Leaderboards

### **Phase 4: Mobile & Performance** 📋

- [ ] Progressive Web App (PWA)
- [ ] Mobile app (React Native)
- [ ] Performance optimizations
- [ ] Offline support

---

## 🐛 Troubleshooting

### **Common Issues**

**Database Connection Issues**

```bash
# Check your Supabase environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Authentication Problems**

```bash
# Verify Clerk configuration
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY
```

**Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **McDonald's** for the Monopoly game concept
- **Next.js** team for the amazing framework
- **Material-UI** for the beautiful components
- **Supabase** for the database infrastructure
- **Clerk** for authentication services

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/monopoly-mctrade/issues)
- **Discord**: [Join our community](https://discord.gg/monopoly-mctrade)
- **Email**: support@monopoly-mctrade.com

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/monopoly-mctrade&type=Date)](https://star-history.com/#yourusername/monopoly-mctrade&Date)

---

<div align="center">

**Made with ❤️ for Monopoly enthusiasts**

[⭐ Star this repo](https://github.com/yourusername/monopoly-mctrade) • [🐛 Report Bug](https://github.com/yourusername/monopoly-mctrade/issues) • [💡 Request Feature](https://github.com/yourusername/monopoly-mctrade/issues)

</div>
