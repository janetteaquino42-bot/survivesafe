import { useState } from 'react';
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

/**
 * Reusable Image Carousel Component
 * 
 * Features:
 * - Mobile responsive
 * - Touch/swipe support
 * - Click to zoom (modal)
 * - Navigation arrows
 * - Indicator dots
 * 
 * Usage:
 * <ImageCarousel images={['/img1.jpg', '/img2.jpg']} alt="Description" />
 */
export default function ImageCarousel({
    images = [],
    alt = "Image",
    className = "",
    showIndicators = true,
    showControls = true,
    autoPlay = false,
    interval = 3000
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    // Single image - no carousel needed
    if (images.length === 1) {
        return (
            <>
                <div className={`relative w-full ${className}`}>
                    <img
                        src={images[0]}
                        alt={alt}
                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setIsModalOpen(true)}
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        aria-label="Zoom image"
                    >
                        <ZoomIn size={20} />
                    </button>
                </div>

                <ImageModal
                    image={images[0]}
                    alt={alt}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </>
        );
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        }
        if (isRightSwipe) {
            goToPrevious();
        }
    };

    return (
        <>
            <div className={`relative w-full ${className}`}>
                {/* Images */}
                <div
                    className="relative overflow-hidden rounded-lg"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="min-w-full"
                            >
                                <img
                                    src={image}
                                    alt={`${alt} ${index + 1}`}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Zoom button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                        aria-label="Zoom image"
                    >
                        <ZoomIn size={20} />
                    </button>
                </div>

                {/* Navigation Controls */}
                {showControls && images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Indicators */}
                {showIndicators && images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Image counter */}
                <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Zoom Modal */}
            <ImageModal
                image={images[currentIndex]}
                alt={`${alt} ${currentIndex + 1}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                images={images}
                currentIndex={currentIndex}
                onNavigate={(newIndex) => setCurrentIndex(newIndex)}
            />
        </>
    );
}

/**
 * Image Zoom Modal Component
 */
function ImageModal({ image, alt, isOpen, onClose, images = null, currentIndex = 0, onNavigate = null }) {
    const hasMultipleImages = images && images.length > 1;

    const handlePrevious = () => {
        if (hasMultipleImages && onNavigate) {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            onNavigate(newIndex);
        }
    };

    const handleNext = () => {
        if (hasMultipleImages && onNavigate) {
            const newIndex = (currentIndex + 1) % images.length;
            onNavigate(newIndex);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="full"
            classNames={{
                base: "bg-black/95",
                closeButton: "text-white hover:bg-white/20 text-2xl top-4 right-4"
            }}
        >
            <ModalContent>
                <ModalBody className="flex items-center justify-center p-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={hasMultipleImages ? images[currentIndex] : image}
                            alt={alt}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Navigation in modal */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={32} />
                                </button>

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                                    {currentIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export { ImageModal };
