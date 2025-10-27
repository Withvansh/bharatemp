import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImageUpload = ({ onUploadSuccess, uploadType = 'product', multiple = false, maxFiles = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const backend = import.meta.env.VITE_BACKEND;

  const createPreviewUrls = (files) => {
    const urls = [];
    const fileArray = Array.from(files).slice(0, multiple ? maxFiles : 1);
    
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        urls.push(URL.createObjectURL(file));
      }
    });
    
    return { urls, files: fileArray };
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    // Create preview URLs first
    const { urls, files: validFiles } = createPreviewUrls(files);
    setSelectedFiles(validFiles);
    setPreviewUrls(urls);

    setUploading(true);
    const formData = new FormData();

    try {
      let endpoint = '';
      const token = JSON.parse(localStorage.getItem('token'));
      const headers = {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      if (uploadType === 'blog') {
        formData.append('image', validFiles[0]);
        endpoint = `${backend}/blog/upload-image`;
      } else if (uploadType === 'product') {
        // Use same endpoint for both single and multiple
        validFiles.forEach(file => {
          formData.append('img', file);
        });
        endpoint = `${backend}/product/upload-image`;
      }
        
      console.log('Sending request to:', endpoint);
      console.log('FormData files:', formData.getAll('img'));
      
      const response = await axios.post(endpoint, formData, { headers });
      
      console.log('Response:', response.data);

      if (response.data.status === 'Success' || response.data.status === 'SUCCESS') {
        toast.success(response.data.message || 'Upload successful!');
        
        // Handle different response formats
        let uploadData = response.data.data;
        console.log('Upload data:', uploadData);
        
        // If single image, wrap in array for consistency
        if (uploadData && !Array.isArray(uploadData) && uploadData.url) {
          uploadData = [uploadData];
        }
        
        onUploadSuccess && onUploadSuccess(uploadData);
        // Clear previews after successful upload
        clearPreviews();
      } else {
        console.error('Upload failed:', response.data);
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific S3 errors
      if (errorMessage.includes('ACL')) {
        errorMessage = 'Image upload failed due to server configuration. Please contact support.';
      } else if (errorMessage.includes('bucket')) {
        errorMessage = 'Storage service temporarily unavailable. Please try again later.';
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const clearPreviews = () => {
    // Clean up object URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const removePreview = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the removed URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? openFileSelector : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 10MB {multiple ? `(max ${maxFiles} files)` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {previewUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Images ({previewUrls.length})
          </h4>
          <div className={`grid gap-3 ${multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 max-w-xs'}`}>
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                  {selectedFiles[index]?.name?.substring(0, 10)}...
                </div>
              </div>
            ))}
          </div>
          
          {/* Upload Button */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => handleFiles(selectedFiles)}
              disabled={uploading || selectedFiles.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`}
            </button>
            <button
              type="button"
              onClick={clearPreviews}
              disabled={uploading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;