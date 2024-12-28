import React from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

interface PDFViewerProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ isOpen, onClose, pdfUrl, title }) => {
    if (!isOpen) return null;

    return (
        <div>
            <div>
                <button onClick={onClose}>Close</button>
                <h2>{title}</h2>
            </div>
            <Document file={pdfUrl}>
                <Page pageNumber={1} />
            </Document>
        </div>
    );
};

export default PDFViewer;