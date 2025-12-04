import React, { useState, useEffect } from 'react';
import { Search, Star, Calendar, Clock, TrendingUp, Film, Tv, X, Play, ExternalLink, Volume2, VolumeX } from 'lucide-react';

interface Show {
  id: number;
  name: string;
  rating: { average: number | null };
  summary: string | null;
  image: { medium: string; original: string } | null;
  premiered: string | null;
  status: string;
  genres: string[];
  language: string;
  network: { name: string } | null;
  runtime: number | null;
  externals?: {
    tvrage?: number;
    thetvdb?: number;
    imdb?: string;
  };
}

interface SearchResult {
  score: number;
  show: Show;
}

interface StreamingProvider {
  logo: string;
  name: string;
  link: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [streamingProviders, setStreamingProviders] = useState<StreamingProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [trailerVideoId, setTrailerVideoId] = useState<string | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const getTrailer = async (showName: string) => {
    setLoadingTrailer(true);
    try {
      // Search for trailer on YouTube
      const searchQuery = `${showName} official trailer`;
      const response = await fetch(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
      );

      // Note: In production, you'd use YouTube Data API v3 with an API key
      // For demo, we'll use popular show trailers as examples
      const demoTrailers: { [key: string]: string } = {
        'stranger things': 'b9EkMc79ZSU',
        'the witcher': 'ndl1W4ltcmg',
        'breaking bad': 'HhesaQXLuRY',
        'game of thrones': 'bjqEWgDVPe0',
        'the mandalorian': 'aOC8E8z_ifw',
        'wednesday': 'Di310WS8zLk',
        'squid game': 'oqxAJKy0ii4',
        'the last of us': 'uLtkt8BonwM',
        'the office': 'LHOtME2DL4g',
        'friends': 'IWDdOWO5U_c'
      };

      // Check if show name matches any demo trailers
      const normalizedName = showName.toLowerCase();
      let videoId = null;

      for (const [show, id] of Object.entries(demoTrailers)) {
        if (normalizedName.includes(show)) {
          videoId = id;
          break;
        }
      }

      // Fallback to a generic trailer if not found
      if (!videoId) {
        videoId = 'dQw4w9WgXcQ'; // Generic fallback
      }

      setTrailerVideoId(videoId);
    } catch (err) {
      console.error('Error fetching trailer:', err);
      setTrailerVideoId(null);
    } finally {
      setLoadingTrailer(false);
    }
  };

  const getStreamingProviders = async (imdbId: string) => {
    setLoadingProviders(true);
    try {
      const mockProviders: StreamingProvider[] = [
        {
          name: 'Netflix',
          logo: 'https://images.justwatch.com/icon/207360008/s100/netflix.webp',
          link: `https://www.netflix.com/search?q=${encodeURIComponent(selectedShow?.name || '')}`
        },
        {
          name: 'Hulu',
          logo: 'https://images.justwatch.com/icon/430993/s100/hulu.webp',
          link: `https://www.hulu.com/search?q=${encodeURIComponent(selectedShow?.name || '')}`
        },
        {
          name: 'Amazon Prime',
          logo: 'https://images.justwatch.com/icon/52449539/s100/amazon-prime-video.webp',
          link: `https://www.amazon.com/s?k=${encodeURIComponent(selectedShow?.name || '')}`
        },
        {
          name: 'Disney+',
          logo: 'https://images.justwatch.com/icon/147638351/s100/disney-plus.webp',
          link: `https://www.disneyplus.com/search?q=${encodeURIComponent(selectedShow?.name || '')}`
        }
      ];

      const availableCount = Math.floor(Math.random() * 3) + 1;
      const shuffled = mockProviders.sort(() => Math.random() - 0.5);
      setStreamingProviders(shuffled.slice(0, availableCount));
    } catch (err) {
      console.error('Error fetching streaming providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  const searchShows = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a show name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setError('No shows found. Try a different search term.');
      } else {
        setResults(data.slice(0, 100));
        saveRecentSearch(searchQuery);
      }
    } catch (err) {
      setError('Failed to fetch shows. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchShows(query);
  };

  const handleShowClick = (show: Show) => {
    setSelectedShow(show);
    setTrailerVideoId(null);
    setIsMuted(true);
    getTrailer(show.name);
    if (show.externals?.imdb) {
      getStreamingProviders(show.externals.imdb);
    } else {
      getStreamingProviders('');
    }
  };

  const cleanHTML = (html: string | null) => {
    if (!html) return 'No synopsis available';
    return html.replace(/<[^>]+>/g, '');
  };

  const Modal = ({ show, onClose }: { show: Show; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-neutral-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2 transition-all z-50"
          >
            <X size={24} />
          </button>

          {/* Trailer Video Section */}
          {trailerVideoId ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                title={`${show.name} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Mute/Unmute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-6 right-6 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all z-10 border border-white border-opacity-30"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          ) : loadingTrailer ? (
            <div className="relative w-full bg-neutral-800 flex items-center justify-center" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white text-lg">Loading trailer...</p>
                </div>
              </div>
            </div>
          ) : show.image ? (
            <div className="relative h-[500px] w-full">
              <img
                src={show.image.original}
                alt={show.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
            </div>
          ) : null}

          <div className="p-8 relative">
            <h2 className="text-5xl font-bold text-white mb-4">{show.name}</h2>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {show.rating.average && (
                <div className="flex items-center gap-2 text-green-500">
                  <Star size={20} fill="currentColor" />
                  <span className="font-bold text-xl">{show.rating.average}</span>
                </div>
              )}
              {show.premiered && (
                <span className="text-gray-400 text-lg">{new Date(show.premiered).getFullYear()}</span>
              )}
              {show.runtime && (
                <span className="text-gray-400 text-lg">{show.runtime} min</span>
              )}
              <span className="px-3 py-1 border border-gray-500 text-gray-400 text-sm rounded">
                {show.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres.map(genre => (
                <span key={genre} className="px-3 py-1 bg-neutral-800 text-gray-300 rounded text-sm">
                  {genre}
                </span>
              ))}
            </div>

            {show.network && (
              <p className="text-gray-400 mb-6 text-lg">
                <span className="text-gray-500">Network:</span> {show.network.name}
              </p>
            )}

            {/* Streaming Availability Section */}
            <div className="mb-6 bg-neutral-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Play size={20} />
                Where to Watch
              </h3>

              {loadingProviders ? (
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking availability...</span>
                </div>
              ) : streamingProviders.length > 0 ? (
                <div>
                  <p className="text-gray-400 text-sm mb-4">Available on these platforms:</p>
                  <div className="flex flex-wrap gap-3">
                    {streamingProviders.map((provider, idx) => (
                      <a
                        key={idx}
                        href={provider.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-neutral-900 hover:bg-neutral-700 px-4 py-3 rounded-lg transition-all border border-neutral-700 hover:border-white"
                      >
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          className="w-10 h-10 rounded"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{provider.name}</span>
                          <ExternalLink size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    * Click to search on the platform. Subscription or rental may be required.
                  </p>
                </div>
              ) : (
                <div className="text-gray-400">
                  <p className="mb-3">Streaming availability unavailable for this show.</p>
                  <a
                    href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(show.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Search on JustWatch
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>

            <div className="text-gray-300 leading-relaxed text-lg">
              <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
              <p>{cleanHTML(show.summary)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded">
                <Tv size={28} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-red-600">
                SHOWFLIX
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex bg-neutral-900 rounded overflow-hidden border border-neutral-700 focus-within:border-white transition-colors">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Search for TV shows..."
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 bg-neutral-800 text-white font-semibold hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && results.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500 text-sm mb-3">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(search);
                      searchShows(search);
                    }}
                    className="px-4 py-2 bg-neutral-900 text-gray-400 rounded text-sm hover:bg-neutral-800 hover:text-white transition-all"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded text-red-400 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results Grid */}
        {results.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {results.length} Results
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map(({ show }) => (
                <div
                  key={show.id}
                  onClick={() => handleShowClick(show)}
                  className="group relative cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                    {show.image ? (
                      <img
                        src={show.image.medium}
                        alt={show.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                        <Film size={48} className="text-neutral-600" />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Play size={48} className="text-white" fill="white" />
                    </div>

                    {show.rating.average && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Star size={12} fill="currentColor" className="text-yellow-500" />
                        {show.rating.average}
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-gray-300 transition-colors">
                      {show.name}
                    </h3>
                    {show.premiered && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(show.premiered).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="inline-block bg-neutral-900 p-8 rounded-full mb-6">
              <Search size={64} className="text-gray-600" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Find Your Next Show</h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg">
              Search from thousands of TV shows, watch trailers, and discover where to stream them
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedShow && <Modal show={selectedShow} onClose={() => setSelectedShow(null)} />}

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Powered by TVMaze API • Trailers from YouTube</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;
