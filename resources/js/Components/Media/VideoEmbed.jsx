import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

/**
 * Reusable Video Embed Component
 * 
 * Supports:
 * - YouTube videos
 * - Facebook videos
 * - Vimeo videos
 * - Direct video URLs (.mp4, .webm, .ogg)
 * 
 * Features:
 * - Automatic platform detection
 * - Responsive 16:9 aspect ratio
 * - Thumbnail/preview for lazy loading
 * - Custom width/height options
 * 
 * Usage:
 * <VideoEmbed 
 *   url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
 *   title="Video Title"
 * />
 */
export default function VideoEmbed({
    url,
    title = "Video",
    className = "",
    autoplay = false,
    showThumbnail = true,
    aspectRatio = null
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [embedUrl, setEmbedUrl] = useState('');
    const [platform, setPlatform] = useState('');
    const [detectedAspectRatio, setDetectedAspectRatio] = useState('16 / 9');

    useEffect(() => {
        if (!url) return;

        const { embedUrl: parsedUrl, platform: detectedPlatform } = parseVideoUrl(url);
        setEmbedUrl(parsedUrl);
        setPlatform(detectedPlatform);
        setDetectedAspectRatio(inferAspectRatioFromUrl(url));
    }, [url]);

    useEffect(() => {
        if (!embedUrl || platform !== 'direct') return;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = embedUrl;

        const onLoadedMetadata = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                setDetectedAspectRatio(`${video.videoWidth} / ${video.videoHeight}`);
            }
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata);

        return () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
    }, [embedUrl, platform]);

    const effectiveAspectRatio = aspectRatio || detectedAspectRatio;

    if (!url) {
        return (
            <div className="w-full max-w-full bg-gray-200 rounded-lg flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="text-center text-gray-500">
                    <Play size={48} className="mx-auto mb-2" />
                    <p>No video available</p>
                </div>
            </div>
        );
    }

    const handlePlay = () => {
        setIsPlaying(true);
    };

    // If thumbnail is shown and not playing yet, show play button
    if (showThumbnail && !isPlaying && platform !== 'direct') {
        return (
            <div className={`flex justify-center w-full ${className}`}>
                <div className="w-full max-w-4xl">
                    <VideoThumbnail
                        url={url}
                        platform={platform}
                        title={title}
                        aspectRatio={effectiveAspectRatio}
                        onClick={handlePlay}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-center w-full ${className}`}>
            <div className="w-full max-w-4xl">
                <div className="relative w-full" style={{ aspectRatio: effectiveAspectRatio }}>
                    <iframe
                        src={embedUrl + (autoplay || isPlaying ? '&autoplay=1' : '')}
                        title={title}
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}

function inferAspectRatioFromUrl(url) {
    const lowerUrl = (url || '').toLowerCase();

    if (
        lowerUrl.includes('/shorts/') ||
        lowerUrl.includes('/reel/') ||
        lowerUrl.includes('tiktok.com')
    ) {
        return '9 / 16';
    }

    return '16 / 9';
}

/**
 * Parse video URL and return embed URL and platform
 */
function parseVideoUrl(url) {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractYouTubeId(url);
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
            platform: 'youtube'
        };
    }

    // Facebook
    if (url.includes('facebook.com') || url.includes('fb.watch')) {
        const encodedUrl = encodeURIComponent(url);
        return {
            embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=`,
            platform: 'facebook'
        };
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop().split('?')[0];
        return {
            embedUrl: `https://player.vimeo.com/video/${videoId}`,
            platform: 'vimeo'
        };
    }

    // Direct video file
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
        return {
            embedUrl: url,
            platform: 'direct'
        };
    }

    // Default fallback
    return {
        embedUrl: url,
        platform: 'unknown'
    };
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return '';
}

/**
 * Video Thumbnail Component with Play Button
 */
function VideoThumbnail({ url, platform, title, aspectRatio, onClick }) {
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    useEffect(() => {
        if (platform === 'youtube') {
            const videoId = extractYouTubeId(url);
            // Try high quality first, fallback to medium
            setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
        }
    }, [url, platform]);

    return (
        <div className="relative w-full" style={{ aspectRatio }}>
            <div
                className="absolute top-0 left-0 w-full h-full bg-black rounded-lg cursor-pointer group overflow-hidden"
                onClick={onClick}
            >
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-contain bg-black"
                        onError={(e) => {
                            // Fallback to medium quality thumbnail
                            if (platform === 'youtube') {
                                const videoId = extractYouTubeId(url);
                                e.target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                            }
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700" />
                )}

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-20 h-20 bg-red-600 group-hover:bg-red-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-xl">
                        <Play size={32} className="text-white ml-1" fill="white" />
                    </div>
                </div>

                {/* Platform badge */}
                {platform !== 'unknown' && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-xs font-semibold rounded-full uppercase">
                        {platform}
                    </div>
                )}
            </div>
        </div>
    );
}
