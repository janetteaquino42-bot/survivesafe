import { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

/**
 * Reusable Document Viewer Component
 * 
 * Supports:
 * - PDF files (embedded viewer)
 * - Word documents (.doc, .docx) - via Microsoft Office Online Viewer
 * - PowerPoint (.ppt, .pptx) - via Microsoft Office Online Viewer
 * - Excel (.xls, .xlsx) - via Microsoft Office Online Viewer
 * 
 * Features:
 * - Responsive iframe
 * - Download button
 * - Open in new tab
 * - Loading state
 * - Error handling
 * 
 * Usage:
 * <DocumentViewer url="/documents/file.pdf" filename="Document.pdf" />
 */
export default function DocumentViewer({
    url,
    filename = "Document",
    className = "",
    showControls = true,
    height = "600px"
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (!url) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-2" />
                    <p>No document available</p>
                </div>
            </div>
        );
    }

    const getFileExtension = (url) => {
        const urlWithoutQuery = url.split('?')[0];
        const parts = urlWithoutQuery.split('.');
        return parts[parts.length - 1].toLowerCase();
    };

    const extension = getFileExtension(url);
    const isPDF = extension === 'pdf';
    const isOfficeDoc = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension);

    // Construct full URL for the document
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

    // Check if we're in local development (not accessible to external viewers)
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('local');

    // For PDFs, embed directly
    // For Office documents on localhost, show download message
    // For Office documents on production, use Microsoft Office Online Viewer
    const viewerUrl = isPDF
        ? url
        : isLocalhost
            ? null // Will show download-only message
            : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;

    const needsDownload = isOfficeDoc && isLocalhost;

    const getFileTypeLabel = (ext) => {
        const labels = {
            pdf: 'PDF',
            doc: 'Word Document',
            docx: 'Word Document',
            ppt: 'PowerPoint',
            pptx: 'PowerPoint',
            xls: 'Excel Spreadsheet',
            xlsx: 'Excel Spreadsheet',
        };
        return labels[ext] || 'File';
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenNew = () => {
        window.open(url, '_blank');
    };

    return (
        <div className={`relative w-full ${className}`}>
            {/* Controls */}
            {showControls && (
                <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                            {filename}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleOpenNew}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
                            title="Open in new tab"
                        >
                            <ExternalLink size={16} />
                            <span className="hidden sm:inline">Open</span>
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            title="Download file"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Download</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Viewer */}
            <div className="relative bg-gray-100 rounded-b-lg overflow-hidden" style={{ height }}>
                {needsDownload ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <div className="text-center p-6 max-w-md">
                            <FileText size={64} className="mx-auto mb-4 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Preview not available in local development
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm">
                                Office document previews require a publicly accessible URL.
                                Please download the file to view it.
                            </p>
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                <Download size={20} />
                                Download {getFileTypeLabel(extension)}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {isLoading && !hasError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading document...</p>
                                </div>
                            </div>
                        )}

                        {hasError ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <FileText size={48} className="mx-auto mb-2 text-red-500" />
                                    <p className="mb-2">Unable to load document</p>
                                    <button
                                        onClick={handleDownload}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Download instead
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <iframe
                                src={viewerUrl}
                                className="w-full h-full border-0"
                                title={filename}
                                onLoad={() => setIsLoading(false)}
                                onError={() => {
                                    setIsLoading(false);
                                    setHasError(true);
                                }}
                            />
                        )}
                    </>
                )}
            </div>

            {/* File info */}
            {!hasError && !needsDownload && (
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded uppercase font-medium">
                        {extension}
                    </span>
                    {isOfficeDoc && !isLocalhost && (
                        <span className="text-xs text-gray-400">
                            Powered by Microsoft Office Online
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
