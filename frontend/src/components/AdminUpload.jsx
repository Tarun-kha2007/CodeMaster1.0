import { useParams, NavLink } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import ThemeToggle from '../components/ThemeToggle';
import { Upload, Video, FileVideo, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

function AdminUpload() {
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Fetch signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Build FormData for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Direct upload to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please check network/Cloudinary settings.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <NavLink to="/admin" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </NavLink>
          <ThemeToggle />
        </div>

        <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-base-300">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary mr-4">
                <Video className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-base-content">Upload Solution Video</h2>
                <p className="text-sm text-base-content/60">Problem ID: <span className="font-mono text-primary font-bold">{problemId}</span></p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-base-content/80 mb-2">Select Video File</label>
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${errors.videoFile ? 'border-error bg-error/10' : 'border-base-300 hover:border-primary'}`}>
                  <FileVideo className="w-12 h-12 text-base-content/40 mx-auto mb-3" />
                  <p className="text-sm font-medium text-base-content/70">
                    <span className="font-bold text-primary">Click to choose</span> or drag video file
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">MP4, MOV or AVI (MAX. 100MB)</p>

                  <input
                    type="file"
                    accept="video/*"
                    {...register('videoFile', {
                      required: 'Please select a video file',
                      validate: {
                        isVideo: (files) => {
                          if (!files || !files[0]) return 'Please select a video file';
                          return files[0].type.startsWith('video/') || 'Invalid file format';
                        },
                        fileSize: (files) => {
                          if (!files || !files[0]) return true;
                          return files[0].size <= 100 * 1024 * 1024 || 'File size exceeds 100MB limit';
                        }
                      }
                    })}
                    className="file-input file-input-bordered file-input-sm w-full mt-4"
                    disabled={uploading}
                  />
                </div>
                {errors.videoFile && (
                  <p className="mt-2 text-xs text-error font-medium">{errors.videoFile.message}</p>
                )}
              </div>

              {selectedFile && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                  <Video className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-base-content">{selectedFile.name}</div>
                    <div className="text-primary">{formatFileSize(selectedFile.size)}</div>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-base-content/80">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <progress className="progress progress-primary w-full" value={uploadProgress} max="100"></progress>
                </div>
              )}

              {errors.root && (
                <div className="alert alert-error text-xs rounded-xl p-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {errors.root.message}
                </div>
              )}

              {uploadedVideo && (
                <div className="alert alert-success text-xs rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Video Solution Uploaded Successfully!</h4>
                    <p className="mt-1">Duration: {formatDuration(uploadedVideo.duration)}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="btn btn-primary font-bold gap-2 px-8 shadow-lg"
                >
                  {uploading ? <span className="loading loading-spinner loading-sm"></span> : <Upload className="w-5 h-5" />}
                  Upload Solution Video
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;