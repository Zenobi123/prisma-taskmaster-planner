
import React, { useState } from "react";
import { Button } from "./button";
import { Upload } from "lucide-react";

interface FileInputProps {
  id: string;
  accept?: string;
  onUpload: (file: File | null) => void;
  uploading?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  id,
  accept = "*",
  onUpload,
  uploading = false
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => document.getElementById(id)?.click()}
        disabled={uploading}
        className="flex items-center"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Envoi en cours..." : "Choisir un fichier"}
      </Button>
      {fileName && !uploading && (
        <span className="text-sm text-muted-foreground truncate max-w-[150px]">
          {fileName}
        </span>
      )}
    </div>
  );
};
