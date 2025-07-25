import { useState } from "react"
import { Search, Film, Tv, Clock, Download, ArrowLeft, Package, Copy, Check, Link, ExternalLink } from "lucide-react"

const BASE_URL = "https://hdhub4u.gifts/?s="

const fallbackImagePath = "https://cdn11.bigcommerce.com/s-dtwuls/images/stencil/1280x1280/products/22646/27854/productdefault__61734.1713366135.jpg?c=2"

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [moviesList, setMoviesList] = useState([])
    const [packsList, setPacksList] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [isLoadingPacks, setIsLoadingPacks] = useState(false)
    const [downloadLinks, setDownloadLinks] = useState([])
    const [selectedPack, setSelectedPack] = useState(null)
    const [isLoadingLinks, setIsLoadingLinks] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState(null)

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsSearching(true)
        setHasSearched(true)
        const movie_links = await window.api.getMoviesList(BASE_URL + searchQuery.replace(" ", "%20"))
        setMoviesList(movie_links)
        setIsSearching(false)
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !isSearching && searchQuery.trim()) {
            handleSearch()
        }
    }

    const handlePackClick = async (pack) => {
        setSelectedMovie(pack)
        setIsLoadingPacks(true)
        const packs_links = await window.api.getPacksList(pack.page_url)
        setPacksList(packs_links)
        setIsLoadingPacks(false)
    }

    const handlePackItemClick = async (packItem) => {
        setSelectedPack(packItem)
        setIsLoadingLinks(true)
        const hb_download_links = await window.api.getHubCloudDownloadLinks(packItem.page_url)
        setDownloadLinks(hb_download_links)
        setIsLoadingLinks(false)
    }

    const copyToClipboard = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedIndex(index)
            setTimeout(() => setCopiedIndex(null), 2000)
        } catch (err) {
            console.error("Failed to copy: ", err)
        }
    }

    const goBackToResults = () => {
        setSelectedMovie(null)
        setPacksList([])
        setDownloadLinks([])
        setSelectedPack(null)
    }

    const goBackToPacks = () => {
        setDownloadLinks([])
        setSelectedPack(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
            {/* Header */}
            <header className="border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg">
                                <Film className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Movie & Series Downloader
                                </h1>
                                <p className="text-sm text-gray-400 font-medium">Desktop Application</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-sm text-gray-300 font-medium backdrop-blur-sm">
                            v1.0.0
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Back Button - Show when viewing packs or download links */}
                {(selectedMovie || downloadLinks.length > 0) && (
                    <div className="mb-6 flex gap-3">
                        {downloadLinks.length > 0 && (
                            <button
                                onClick={goBackToPacks}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Packs
                            </button>
                        )}
                        <button
                            onClick={goBackToResults}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Results
                        </button>
                    </div>
                )}

                {/* Search Section - Hide when viewing packs or download links */}
                {!selectedMovie && (
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Search Movies & Web Series
                            </h2>
                            <p className="text-gray-400 text-lg">Find and download your favorite content in high quality</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute z-30 top-4 left-5"/>
                                <input
                                    type="text"
                                    placeholder="Enter movie or series name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full h-14 pl-14 pr-6 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-lg transition-all duration-300 backdrop-blur-sm shadow-lg"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching || !searchQuery.trim()}
                                className={`px-10 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center gap-3 transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl ${
                                    !isSearching && searchQuery.trim() ? "hover:-translate-y-1 hover:shadow-blue-500/25" : ""
                                }`}
                            >
                                {isSearching ? (
                                    <>
                                        <Clock className="w-5 h-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isSearching && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-6 shadow-lg">
                            <Clock className="w-10 h-10 text-blue-400 animate-spin" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-200">Searching...</h3>
                        <p className="text-gray-400 text-lg">Finding the best results for "{searchQuery}"</p>
                    </div>
                )}

                {/* Packs Loading State */}
                {isLoadingPacks && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full mb-6 shadow-lg">
                            <Clock className="w-10 h-10 text-green-400 animate-spin" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-200">Loading Download Packs...</h3>
                        <p className="text-gray-400 text-lg">Getting available download options for "{selectedMovie?.caption}"</p>
                    </div>
                )}

                {/* Links Loading State */}
                {isLoadingLinks && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full mb-6 shadow-lg">
                            <Clock className="w-10 h-10 text-orange-400 animate-spin" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-200">Getting Download Links...</h3>
                        <p className="text-gray-400 text-lg">Fetching download links for "{selectedPack?.caption}"</p>
                    </div>
                )}

                {/* Download Links */}
                {!isLoadingLinks && downloadLinks.length > 0 && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2 text-gray-200">{selectedMovie?.caption}</h2>
                            <h3 className="text-xl font-semibold mb-2 text-green-300">{selectedPack?.caption}</h3>
                            <p className="text-gray-400 text-lg">Copy any download link and paste it in your browser:</p>
                        </div>

                        <div className="grid gap-4 max-w-5xl">
                            {downloadLinks.map((link, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 hover:border-orange-500/50 rounded-xl transition-all duration-300 overflow-hidden backdrop-blur-sm p-6"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg">
                                                <Link className="w-6 h-6 text-orange-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-lg text-gray-200 mb-2">{link.text}</h3>
                                                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30">
                                                    <p className="text-sm text-gray-300 font-mono break-all">{link.href}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => copyToClipboard(link.href, index)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                                            >
                                                {copiedIndex === index ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        Copy Link
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Instructions */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
                            <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                How to Download:
                            </h4>
                            <ul className="text-gray-300 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 font-bold">1.</span>
                                    <span>Click "Copy Link" button next to your preferred download option</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 font-bold">2.</span>
                                    <span>Open your web browser and paste the link in the address bar</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 font-bold">3.</span>
                                    <span>Press Enter and your download will start automatically</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* No Download Links Found */}
                {!isLoadingLinks && selectedPack && downloadLinks.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-full mb-6 backdrop-blur-sm border border-gray-600/30">
                            <Link className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-300">No Download Links Found</h3>
                        <p className="text-gray-400 mb-6 text-lg">No download links available for this pack</p>
                        <button
                            onClick={goBackToPacks}
                            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 border border-gray-600/50 text-gray-200 hover:text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                        >
                            Back to Packs
                        </button>
                    </div>
                )}

                {/* Packs List */}
                {selectedMovie && !isLoadingPacks && !selectedPack && packsList.length > 0 && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2 text-gray-200">{selectedMovie.caption}</h2>
                            <p className="text-gray-400 text-lg">Select a download pack:</p>
                        </div>

                        <div className="grid gap-4 max-w-4xl">
                            {packsList.map((pack, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 hover:border-green-500/50 rounded-xl cursor-pointer group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 overflow-hidden backdrop-blur-sm p-6"
                                    onClick={() => handlePackItemClick(pack)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg group-hover:from-green-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                                                <Package className="w-6 h-6 text-green-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-200 group-hover:text-green-300 transition-colors">
                                                    {pack.caption}
                                                </h3>
                                                <p className="text-sm text-gray-400">Click to get download links</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-green-400 transition-colors">
                                            <Download className="w-5 h-5" />
                                            <span className="text-sm font-medium">Get Links</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Packs Found */}
                {selectedMovie && !isLoadingPacks && !selectedPack && packsList.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-full mb-6 backdrop-blur-sm border border-gray-600/30">
                            <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-300">No Download Packs Found</h3>
                        <p className="text-gray-400 mb-6 text-lg">No download options available for this content</p>
                        <button
                            onClick={goBackToResults}
                            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 border border-gray-600/50 text-gray-200 hover:text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                        >
                            Back to Results
                        </button>
                    </div>
                )}

                {/* Search Results */}
                {!selectedMovie && !isSearching && moviesList.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <Film className="w-6 h-6 text-blue-400" />
                                Search Results
                                <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-lg text-lg font-semibold backdrop-blur-sm border border-blue-500/20">
                  {moviesList.length} found
                </span>
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                            {moviesList.map((result, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-b from-gray-900/80 to-gray-800/80 border border-gray-700/50 hover:border-blue-500/50 rounded-xl cursor-pointer group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-2 backdrop-blur-sm"
                                    onClick={() => handlePackClick(result)}
                                >
                                    <div className="relative">
                                        <div className="aspect-[2/3] overflow-hidden rounded-t-xl">
                                            <img
                                                src={result.img_url || fallbackImagePath}
                                                alt={result.caption}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = fallbackImagePath
                                                }}
                                            />
                                        </div>

                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-t-xl">
                                            <div className="text-center text-white transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <div className="p-3 bg-white/20 rounded-full mb-3 backdrop-blur-sm">
                                                    <Download className="w-8 h-8 mx-auto" />
                                                </div>
                                                <p className="font-semibold text-sm">Click to Download</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors leading-tight text-gray-200">
                                            {result.caption}
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!selectedMovie && !isSearching && hasSearched && moviesList.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-full mb-6 backdrop-blur-sm border border-gray-600/30">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-300">No Results Found</h3>
                        <p className="text-gray-400 mb-6 text-lg">Try searching with different keywords</p>
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 border border-gray-600/50 text-gray-200 hover:text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                            onClick={() => {
                                setSearchQuery("")
                                setMoviesList([])
                                setHasSearched(false)
                            }}
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Welcome State */}
                {!selectedMovie && !hasSearched && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full mb-8 shadow-2xl backdrop-blur-sm border border-blue-500/20">
                            <Film className="w-12 h-12 text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Welcome to Movie Downloader
                        </h3>
                        <p className="text-gray-400 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
                            Search for your favorite movies and web series to start downloading in high quality
                        </p>
                        <div className="flex items-center justify-center gap-12 text-gray-500 flex-wrap">
                            <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/30">
                                <Film className="w-5 h-5 text-blue-400" />
                                <span className="font-medium">Movies</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/30">
                                <Tv className="w-5 h-5 text-purple-400" />
                                <span className="font-medium">Web Series</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/30">
                                <Download className="w-5 h-5 text-pink-400" />
                                <span className="font-medium">High Quality</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
