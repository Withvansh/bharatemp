import React from 'react';
import { IoClose, IoWarning } from 'react-icons/io5';

const DuplicateFieldPopup = ({ isOpen, onClose, field, value, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <IoWarning className="text-yellow-500 text-2xl mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">
              Duplicate Field Detected
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              {message}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Field:</span> {field?.toUpperCase()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Value:</span> "{value}"
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK, I'll Change It
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateFieldPopup;