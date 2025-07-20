import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  acceptedFileTypes?: Record<string, string[]>;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  required?: boolean;
  className?: string;
}

interface UploadedFile extends File {
  id: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

export default function FileUpload({
  onFilesChange,
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
  },
  maxFileSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  required = false,
  className = "",
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          console.warn(`File ${file.name} rejected: ${error.message}`);
        });
      });
    }

    // Handle accepted files
    const newFiles = acceptedFiles.map((file) => {
      const uploadFile: UploadedFile = Object.assign(file, {
        id: Math.random().toString(36).substring(7),
        progress: 0,
        status: "uploading" as const,
      });

      // Simulate upload progress
      simulateUpload(uploadFile);
      
      return uploadFile;
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    
    // Notify parent component
    if (onFilesChange) {
      onFilesChange([...uploadedFiles, ...newFiles]);
    }
  }, [uploadedFiles, onFilesChange]);

  const simulateUpload = (file: UploadedFile) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            const status = newProgress === 100 ? "success" : "uploading";
            
            if (newProgress === 100) {
              clearInterval(interval);
            }
            
            return { ...f, progress: newProgress, status };
          }
          return f;
        })
      );
    }, 200);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
    maxFiles: maxFiles - uploadedFiles.length,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) {
      return <File className="w-8 h-8 text-red-500" />;
    }
    if (file.type.includes('image')) {
      return <File className="w-8 h-8 text-blue-500" />;
    }
    if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      return <File className="w-8 h-8 text-blue-600" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "success":
        return <Check className="w-4 h-4 text-success" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-error" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card
        {...getRootProps()}
        className={`cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-dashed border-gray-300 hover:border-gray-400"
        }`}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <input {...getInputProps()} />
          <Upload
            className={`w-12 h-12 mb-4 ${
              isDragActive ? "text-primary" : "text-gray-400"
            }`}
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? "Drop files here" : "Upload Documents"}
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Drag and drop files here, or click to browse
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
            <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
            <p>Maximum files: {maxFiles}</p>
          </div>
          <Button variant="outline" className="mt-4">
            Browse Files
          </Button>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
          {uploadedFiles.map((file) => (
            <Card key={file.id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                  </div>
                  
                  {file.status === "uploading" && (
                    <div className="mt-2">
                      <Progress value={file.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        Uploading... {Math.round(file.progress)}%
                      </p>
                    </div>
                  )}
                  
                  {file.status === "error" && (
                    <p className="text-xs text-error mt-1">
                      Upload failed: {file.error || "Unknown error"}
                    </p>
                  )}
                  
                  {file.status === "success" && (
                    <p className="text-xs text-success mt-1">
                      Upload complete
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Required Field Indicator */}
      {required && uploadedFiles.length === 0 && (
        <p className="text-sm text-error">
          At least one file is required
        </p>
      )}
    </div>
  );
}
