import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  DragEvent,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  uploadPipeFile,
  setPipeFile,
  resetPipeUpload,
} from '@/components/store/slices/uploadPipeSlice';
import { RootState, AppDispatch } from '@/components/store/store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: () => void;
  onBack?: () => void;
  onNext?: () => void;
  maxFileSize?: number;
  fileTypes?: string[];
}

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const UploadFile: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUploadComplete,
  onBack,
  onNext,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  fileTypes = ['.csv', '.xlsx'],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTemplate, setShowTemplate] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { fileName, fileSize, fileType, status, progress, error } = useSelector(
    (state: RootState) => state.uploadPipeFile,
  );
  // dispatch(setPipeFile(...));
  // dispatch(uploadPipeFile(...));

  useEffect(() => {
    if (fileName && uploadContainerRef.current) {
      uploadContainerRef.current.style.border = '';
    }
  }, [fileName]);
  const validateFile = (file: File): string | null => {
    const fileExtension = file.name
      .slice(file.name.lastIndexOf('.'))
      .toLowerCase();
    if (!fileTypes.includes(fileExtension)) {
      return `Only the following file types are allowed: ${fileTypes.join(
        ', ',
      )}`;
    }
    if (file.size > maxFileSize) {
      return `File size should not exceed ${formatFileSize(maxFileSize)}`;
    }
    return null;
  };

  const handleFileSelection = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    if (uploadContainerRef.current) {
      uploadContainerRef.current.classList.add('error-border-dashed');

      setTimeout(() => {
        uploadContainerRef.current?.classList.remove('error-border-dashed');
      }, 1000);
    }
    dispatch(
      setPipeFile({
        name: selectedFile.name,
        size: selectedFile.size,
        type: mapFileType(selectedFile.type),
      }),
    );
    setShowTemplate(false);
  };

  const mapFileType = (type: string): string => {
    switch (type) {
      case 'text/csv':
        return 'CSV';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'XLSX';
      default:
        return 'Unknown';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validationError = validateFile(droppedFile);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      handleFileSelection(droppedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleDelete = (): void => {
    dispatch(resetPipeUpload());
    setShowTemplate(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (uploadContainerRef.current) {
      uploadContainerRef.current.style.border = '';
    }
  };

  const renderProgressText = (): string => {
    switch (status) {
      case 'uploading':
        return `${progress}%`;
      case 'completed':
        return 'Upload complete';
      case 'error':
        return error || 'Upload failed';
      default:
        return '';
    }
  };

  const handleNext = () => {
    if (!fileName) {
      if (uploadContainerRef.current) {
        uploadContainerRef.current.classList.add('error-border-dashed');

        setTimeout(() => {
          uploadContainerRef.current?.classList.remove('error-border-dashed');
        }, 1000);
      }

      return;
    }

    if (status !== 'uploading' && status !== 'completed') {
      dispatch(uploadPipeFile(fileName));
    }

    if (status === 'completed') {
      onNext?.();
    }
  };

  return (
    <div className="upload-file">
      <ToastContainer position="top-right" autoClose={5000} />
      {/* Upload Container */}
      <div
        ref={uploadContainerRef}
        className={`upload-container ${isDragging ? 'dragging' : ''} ${
          fileName ? 'hidden' : ''
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".csv, .xlsx"
          placeholder="f"
        />
        <img src="../../images/icons/document-upload.svg" alt="Upload" />
        <div className="title">
          Underground 3D Coordinate System for Pipe Design
        </div>
        <p>Click to upload or drag and drop file</p>
      </div>

      <div className="file-requirement">
        <p>Supported Format: CSV | XLSX</p>
        <p className="text-sm">Maximum size: {formatFileSize(maxFileSize)}</p>
      </div>

      {/* Download Template (Conditional) */}
      {showTemplate && !fileName && (
        <div className="download-template">
          <img
            className="file-icon"
            src="../../images/icons/file.svg"
            alt="Template"
          />
          <div className="text">
            <div className="title">
              Underground 3D Coordinate System for Pipe Design Template
            </div>
            <div className="desc">
              Download and use it as a starting point for your site information.
            </div>
          </div>
          <button title="download template">
            <a
              href="../assets/slope_stability_data.csv"
              download="site-surface-template.csv"
            >
              Download template
            </a>
          </button>
        </div>
      )}

      {/* Uploaded File Information (Conditional) */}
      {fileName && (
        <div className="uploaded-file">
          <img
            className="file-icon"
            src="../../images/icons/file.svg"
            alt="File"
          />
          <div className="file-details">
            <div className="text">
              <div className="title">{fileName}</div>
              <div className="metadata">
                {formatFileSize(fileSize || 0)} • {fileType}
              </div>
            </div>
          </div>
          <button
            className="delete-file"
            onClick={handleDelete}
            title="Delete File"
          >
            <img src="../../images/icons/close.svg" alt="Delete" />
          </button>
          {/* {renderProgressText()} */}
        </div>
      )}

      {/* Action Buttons */}
      <div className="cta">
        <button id="prev" className="disabled" onClick={onBack}>
          Back
        </button>
        <button id="next" onClick={handleNext}>
          {status === 'uploading' && (
            <img src="../../images/icons/loading.svg" alt="Loading..." />
          )}
          {status !== 'uploading' && 'Proceed'}
        </button>
      </div>
    </div>
  );
};

export default UploadFile;
