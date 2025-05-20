
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileInputProps {
  id?: string;
  accept?: string;
  onUpload: (file: File | null) => void;
  uploading?: boolean;
  className?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ 
  id, 
  accept = "*", 
  onUpload, 
  uploading = false,
  className
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      onUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="file"
        id={id}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={uploading}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Téléversement..." : "Téléverser"}
      </Button>
      
      {selectedFile && (
        <span className="text-sm text-muted-foreground truncate max-w-[150px]">
          {selectedFile.name}
        </span>
      )}
    </div>
  );
};
