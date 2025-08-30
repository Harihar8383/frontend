import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '../lib/utils'; // Assuming you have this utility function

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0]);
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false,
    });

    return (
        <div className="w-full">
            {!selectedFile ? (
                <div {...getRootProps()} className={`relative p-8 text-center transition-all duration-300 cursor-pointer bg-white rounded-2xl min-h-[208px] border-2 border-dashed ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-4">
                        <img src="/icons/upload.svg" alt="upload" className="w-12 h-12" />
                        <p className="text-xl text-gray-600">
                            {isDragActive ? 'Drop the file here...' : "Drag and drop your resume, or click to select"}
                        </p>
                        <p className="text-sm text-gray-400">PDF only, up to 5MB</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-4">
                        <img src="/icons/pdf.svg" alt="pdf" className="w-10 h-10" />
                        <div>
                            <p className="font-medium text-gray-800">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">{formatSize(selectedFile.size)}</p>
                        </div>
                    </div>
                    <button onClick={() => onFileSelect(null)} className="p-2 text-gray-500 rounded-full hover:bg-gray-200">
                        <img src="/icons/close.svg" alt="remove file" className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUploader;