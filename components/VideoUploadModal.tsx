import React, { useState } from 'react';
import { Upload, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const VideoUploadModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('categories', JSON.stringify([])); // Add categories as needed

            const response = await fetch('/api/videos', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            toast({
                title: "Success!",
                description: "Your video has been uploaded.",
            });

            // Reset form and close modal
            setTitle('');
            setDescription('');
            setFile(null);
            setIsOpen(false);
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Upload failed",
                description: "There was a problem uploading your video.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Video</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            placeholder="Video title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Textarea
                            placeholder="Video description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="video-upload"
                            required
                        />
                        <label
                            htmlFor="video-upload"
                            className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                            <Upload className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-600">
                                Click to upload or drag and drop
                            </span>
                        </label>
                    </div>

                    {file && (
                        <p className="text-sm text-gray-600">
                            Selected: {file.name}
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!file || uploading}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default VideoUploadModal;