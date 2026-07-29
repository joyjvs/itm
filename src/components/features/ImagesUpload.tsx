import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ImageUploadProps {
  value?: string | null; // URL existente
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string>;
  className?: string;
  label?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  onUpload,
  className = "",
  label = "Subir imagen",
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-xs"
          >
            {isUploading ? "Subiendo..." : label}
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
