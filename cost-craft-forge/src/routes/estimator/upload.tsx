import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadService } from "@/services";
import { PageHeader } from "@/components/shared/PortalLayout";
import { Button } from "@/components/shared/Forms";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export const Route = createFileRoute("/estimator/upload")({ component: Page });

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"], "image/png": [".png"], "image/jpeg": [".jpg",".jpeg"] },
    maxSize: 50 * 1024 * 1024, multiple: false,
    onDrop: (accepted, rejected) => {
      if (rejected.length) toast.error("Invalid file type or size (max 50MB)");
      if (accepted[0]) setFile(accepted[0]);
    },
  });
  const upload = () => {
    if (!file) return;
    setUploading(true); setProgress(0);
    uploadService.upload("p4", file.name, setProgress).then(() => {
      toast.success("Drawing uploaded successfully");
      setUploading(false);
    });
  };
  return (
    <>
      <PageHeader title="Upload Drawing" subtitle="PDF, PNG, JPG · Max 50MB" />
      <div {...getRootProps()} className={`glass rounded-2xl p-12 text-center cursor-pointer border-2 border-dashed transition ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`}>
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <div className="font-medium">{file ? file.name : isDragActive ? "Drop file here…" : "Drag & drop a drawing, or click to select"}</div>
        {file && <div className="text-xs text-muted-foreground mt-1">{(file.size/1024/1024).toFixed(2)} MB</div>}
      </div>
      {file && (
        <div className="mt-4 glass rounded-2xl p-5">
          {uploading && (
            <div className="mb-4">
              <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }}/></div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">{Math.round(progress)}%</div>
            </div>
          )}
          <Button onClick={upload} disabled={uploading}>{uploading ? "Uploading…" : "Upload Drawing"}</Button>
        </div>
      )}
    </>
  );
}
