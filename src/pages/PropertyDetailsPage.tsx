import React from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Details</h1>
        <p className="text-gray-600 mb-4">Property ID: {id}</p>
        
        {/* Placeholder content */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Overview</h2>
            <p className="text-gray-600">
              Detailed information about this property will be displayed here.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <span className="mr-2">•</span>
                <span>Feature 1</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">•</span>
                <span>Feature 2</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">•</span>
                <span>Feature 3</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">•</span>
                <span>Feature 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;