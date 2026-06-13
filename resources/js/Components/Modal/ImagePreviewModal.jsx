import { Modal as HeroModal, ModalContent, ModalBody } from "@heroui/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImagePreviewModal({ isOpen, onClose, images, currentIndex, onNavigate }) {
    if (!images || images.length === 0) return null;

    const currentImage = images[currentIndex];
    const hasMultiple = images.length > 1;

    const handlePrevious = () => {
        if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            handlePrevious();
        } else if (e.key === 'ArrowRight') {
            handleNext();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={onClose}
            size="5xl"
            backdrop="opaque"
            placement="center"
            classNames={{
                base: "bg-black/95",
                backdrop: "bg-black/80",
                wrapper: "overflow-hidden",
                body: "p-0",
            }}
            hideCloseButton={true}
            onKeyDown={handleKeyDown}
        >
            <ModalContent>
                {(onCloseModal) => (
                    <ModalBody className="relative">
                        {/* Close Button */}
                        <button
                            onClick={onCloseModal}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Counter */}
                        {hasMultiple && (
                            <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                                {currentIndex + 1} / {images.length}
                            </div>
                        )}

                        {/* Previous Button */}
                        {hasMultiple && currentIndex > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                                aria-label="Previous"
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        {/* Next Button */}
                        {hasMultiple && currentIndex < images.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                                aria-label="Next"
                            >
                                <ChevronRight size={32} />
                            </button>
                        )}

                        {/* Image */}
                        <div className="flex items-center justify-center w-full h-[85vh] p-4">
                            <img
                                src={currentImage.src}
                                alt={currentImage.alt || `Image ${currentIndex + 1}`}
                                className="w-auto h-auto max-w-full max-h-full object-contain"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        </div>

                        {/* Image Caption */}
                        {currentImage.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                <p className="text-lg font-medium">{currentImage.caption}</p>
                                {currentImage.description && (
                                    <p className="text-sm text-white/80 mt-1">{currentImage.description}</p>
                                )}
                            </div>
                        )}

                        {/* Thumbnail Navigation */}
                        {hasMultiple && images.length <= 10 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-white/10 rounded-full p-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => onNavigate(idx)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                                            ? 'border-white scale-110'
                                            : 'border-white/30 hover:border-white/60'
                                            }`}
                                    >
                                        <img
                                            src={img.src}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </ModalBody>
                )}
            </ModalContent>
        </HeroModal>
    );
}
