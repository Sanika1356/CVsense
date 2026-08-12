import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;

        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;

    return (
        <div className="w-full gradient-border">
            <div
                {...getRootProps()}
                className={`uplader-drag-area border border-dashed rounded-2xl ${
                    isDragActive
                        ? 'border-accent-violet/60 bg-accent-violet/5 scale-[1.01]'
                        : 'border-border-soft'
                }`}
            >
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" className="size-5" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 3.5H13.5L18 8V19.5C18 20.0523 17.5523 20.5 17 20.5H7C6.44772 20.5 6 20.0523 6 19.5V4.5C6 3.94772 6.44772 3.5 7 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M13 3.5V8H18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M9 13.5H15M9 16.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-200 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="icon-button"
                                onClick={(e) => {
                                    onFileSelect?.(null)
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    ): (
                        <div>
                            <div className="mx-auto w-14 h-14 flex items-center justify-center mb-3 rounded-2xl primary-gradient float-slow">
                                <svg viewBox="0 0 24 24" fill="none" className="size-7 text-white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 16V4M12 4L7 9M12 4L17 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 16V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-lg text-slate-300">
                                <span className="font-semibold text-slate-100">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-sm text-slate-500 mt-1">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
