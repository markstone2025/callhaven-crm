
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onUploadComplete: (phoneNumbers: string[]) => void;
  isLoading: boolean;
}

export function FileUploader({ onUploadComplete, isLoading }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };
  
  const handleUploadClick = () => {
    if (!file) {
      fileInputRef.current?.click();
      return;
    }
    
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Extract phone numbers from file content
        // This is a simple implementation that assumes one phone number per line
        // In a real app, you might want to handle CSV parsing more robustly
        const phoneNumbers = content
          .split(/[\n,]/) // Split by newline or comma
          .map(line => line.trim())
          .filter(line => line.length > 0 && /\d/.test(line)); // Only keep lines with digits
        
        if (phoneNumbers.length === 0) {
          toast({
            title: "No phone numbers found",
            description: "The uploaded file doesn't contain any valid phone numbers",
            variant: "destructive"
          });
          return;
        }
        
        // Pass the extracted phone numbers to the parent component
        onUploadComplete(phoneNumbers);
        
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          title: "Error processing file",
          description: "There was a problem reading the uploaded file",
          variant: "destructive"
        });
      }
    };
    
    fileReader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was a problem reading the uploaded file",
        variant: "destructive"
      });
    };
    
    fileReader.readAsText(file);
  };
  
  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".csv,.txt"
          className="hidden"
        />
        
        <Button
          onClick={handleUploadClick}
          disabled={isLoading}
          className="flex-1"
        >
          <Upload className="mr-2 h-4 w-4" />
          {file ? "Process File" : "Select File"}
        </Button>
        
        {file && (
          <Button
            variant="outline"
            onClick={clearFile}
            disabled={isLoading}
          >
            Clear
          </Button>
        )}
      </div>
      
      {file && (
        <div className="text-sm flex items-center justify-between">
          <span className="truncate max-w-[200px]">{file.name}</span>
          <span className="text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <p>Supported file formats: CSV, TXT</p>
        <p>Each phone number should be on a separate line or comma-separated</p>
      </div>
    </div>
  );
}
