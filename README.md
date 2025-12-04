# 🎬 SHOWFLIX - Netflix Clone for TV Shows

A sleek, modern TV show discovery platform that mirrors Netflix's iconic interface and user experience. Search, explore, and discover thousands of TV shows with real-time data from the TVMaze API.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.2-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Functionality
- **Real-time TV Show Search** - Search through thousands of TV shows instantly
- **Netflix-Inspired UI** - Clean, modern interface that mimics Netflix's design language
- **Detailed Show Information** - View ratings, premiere dates, genres, networks, and full synopses
- **Recent Search History** - Quick access to your last 5 searches (stored locally)
- **Responsive Grid Layout** - Optimized viewing experience across all devices
- **Interactive Modals** - Full-screen show details with smooth animations

### 🎨 Design Highlights
- **Dark Theme** - Easy on the eyes with a sleek black and red color scheme
- **Hover Effects** - Smooth transitions and scaling animations on show cards
- **Rating Badges** - Quick glance at show ratings with star icons
- **Status Indicators** - See if shows are running, ended, or in development
- **Genre Tags** - Visual categorization of show genres

### 🚀 Performance
- **Fast Search** - Lightning-quick API responses
- **Optimized Images** - Efficient loading with medium/original image sizes
- **Lazy Loading Ready** - Structure supports future lazy loading implementation
- **Error Handling** - Graceful fallbacks for missing images and data

## 🛠️ Tech Stack

- **React 19.2.0** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Lucide React** - Beautiful, consistent icons
- **Chakra UI** - Component library (available)
- **Axios** - HTTP client for API requests
- **Framer Motion** - Smooth animations (available)

## 📦 Installation

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd game-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
showflix/
├── src/
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md            # You are here!
```

## 🎮 Usage

1. **Search for Shows**
   - Type a show name in the search bar
   - Press Enter or click the Search button

2. **View Show Details**
   - Click on any show card to open the detailed modal
   - View synopsis, ratings, genres, and more

3. **Quick Access**
   - Use recent searches to quickly re-search previous queries

## 🔌 API Integration

### Current API: TVMaze
- **Endpoint**: `https://api.tvmaze.com/search/shows?q={query}`
- **Features**: Show information, ratings, images, genres, networks
- **Limits**: No authentication required, free to use

### Can You Watch Movies/Shows on This Platform?

**Currently: No** - SHOWFLIX is a discovery and information platform only. The TVMaze API provides metadata but not streaming content.

**Future Possibilities:**

To enable actual video streaming, you would need to integrate one of these APIs:

#### 🎥 Streaming API Options

1. **The Movie Database (TMDB)**
   - Provides streaming availability information
   - Shows where content can be watched (Netflix, Amazon, etc.)
   - Free API with rate limits
   - Website: https://www.themoviedb.org/documentation/api

2. **JustWatch API**
   - Aggregates streaming availability across platforms
   - Shows pricing and platform information
   - API access requires partnership

3. **YouTube API**
   - Can embed official trailers and clips
   - Free tier available
   - Website: https://developers.google.com/youtube/v3

4. **Vimeo API**
   - Host and stream your own content
   - Paid plans required for hosting

5. **Custom Video Hosting**
   - Use services like Cloudflare Stream or AWS Media Services
   - Full control but requires content licensing

⚠️ **Important Legal Note**: Streaming copyrighted content requires proper licensing agreements. Most legitimate streaming requires partnerships with content providers or platforms like Netflix, Hulu, Amazon Prime, etc.

**Recommended Approach for a Portfolio Project:**
- Add trailer playback using YouTube API
- Show "Watch on Netflix/Hulu/etc." links using TMDB
- Display streaming availability by region

## 🚀 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🎨 Customization

### Change Theme Colors
Edit the color classes in `App.tsx`:
- Primary: `bg-red-600`, `text-red-600`
- Background: `bg-black`, `bg-neutral-900`
- Accents: `border-neutral-800`, `text-gray-400`

### Add More Features
The codebase is structured to easily add:
- User authentication
- Favorites/watchlist
- Show recommendations
- Social features (share, comments)
- Multi-language support

## 🐛 Known Limitations

- No video streaming capabilities
- Some shows may have missing images or data
- Search is limited to exact matches (API limitation)
- No pagination for 100+ results

## 🔮 Future Enhancements

- [ ] Add trailer integration via YouTube API
- [ ] Implement user authentication
- [ ] Create watchlist feature with persistence
- [ ] Add show recommendations algorithm
- [ ] Implement infinite scroll/pagination
- [ ] Add dark/light theme toggle
- [ ] Include actor/cast information
- [ ] Add season and episode details
- [ ] Implement advanced filters (genre, year, rating)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **TVMaze API** - For providing comprehensive TV show data
- **Netflix** - For design inspiration
- **Lucide Icons** - For beautiful, consistent iconography
- **Vite** - For blazing fast development experience

## 👨‍💻 Developer

Created as a showcase of modern React development practices and UI/UX design skills.

---

⭐ **If you like this project, please give it a star!**

For questions or suggestions, feel free to open an issue or reach out!
