import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Transmission {
  id: string;
  fileName: string;
  status: 'Delivered' | 'Failed';
  timestamp: string;
}

// Default webhook URL - can be updated here or moved to .env
const DEFAULT_WEBHOOK_URL = 'https://webhook.site/placeholder';

export default function WebhookUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Transmission[]>([
    { id: '1', fileName: 'invoice_jan_2024.pdf', status: 'Delivered', timestamp: new Date().toISOString() },
    { id: '2', fileName: 'signed_contract_v2.docx', status: 'Delivered', timestamp: new Date().toISOString() },
    { id: '3', fileName: 'system_log_dump.txt', status: 'Delivered', timestamp: new Date().toISOString() },
  ]);

  const uploadFile = async (selectedFile: File) => {
    setStatus('uploading');
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileName', selectedFile.name);
    formData.append('fileType', selectedFile.type);
    formData.append('timestamp', new Date().toISOString());

    try {
      const response = await fetch(DEFAULT_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        toast.success('File sent successfully!');
        setHistory(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          fileName: selectedFile.name,
          status: 'Delivered',
          timestamp: new Date().toISOString()
        }, ...prev].slice(0, 5));
      } else {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Failed to send file';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  } as any);

  const handleRemoveFile = () => {
    setFile(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 font-sans text-[#111827]">
      <div className="absolute top-10 left-10 font-extrabold text-lg tracking-[-0.5px]">
        Dispatch.
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[560px]"
      >
        <Card className="border-[#E5E7EB] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] bg-white rounded-xl p-10">
          <CardHeader className="p-0 text-center mb-8">
            <CardTitle className="text-2xl font-bold tracking-tight mb-2">Transmit Document</CardTitle>
            <CardDescription className="text-[#6B7280] text-sm">
              Drop a file to instantly transmit it to the secure endpoint.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-6">
            {/* File Upload Area */}
            <AnimatePresence mode="wait">
              {!file || status === 'idle' ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg py-12 px-6 flex flex-col items-center justify-center cursor-pointer transition-all
                    ${isDragActive ? 'border-[#3B82F6] bg-[#F0F7FF]' : 'border-[#E5E7EB] bg-[#FCFCFD] hover:border-[#3B82F6] hover:bg-[#F0F7FF]'}
                  `}
                >
                  <input {...getInputProps()} />
                  <span className="text-3xl mb-3">📤</span>
                  <p className="text-sm font-medium text-[#111827]">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    PDF, DOCX, or PNG (up to 10MB)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="file-preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="border border-[#E5E7EB] rounded-lg p-4 bg-[#FCFCFD] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-[#111827] truncate max-w-[200px] md:max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-[#3B82F6]" />}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="text-[#6B7280] hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center text-[#10B981] text-xs font-semibold bg-[#ECFDF5] w-full py-2 rounded-lg"
                >
                  <CheckCircle2 className="w-3 h-3 mr-2" />
                  Delivered successfully
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center text-destructive text-xs font-semibold bg-destructive/5 w-full py-2 rounded-lg"
                >
                  <AlertCircle className="w-3 h-3 mr-2" />
                  {error || 'Transmission failed'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Section */}
            <div className="pt-6 border-t border-[#E5E7EB]">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#6B7280] mb-3">
                Recent Transmissions
              </h3>
              <div className="space-y-1">
                {history.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 text-[13px]">
                    <div className="flex items-center font-medium text-[#111827]">
                      <span className="mr-2 text-[12px]">📄</span>
                      {item.fileName}
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      item.status === 'Delivered' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
