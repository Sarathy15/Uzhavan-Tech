import React from 'react';

const DiseaseResultSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
                <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="mt-4 text-center w-full">
                    <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto animate-pulse"></div>
                </div>
            </div>
            <div className="space-y-6">
                 <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                 <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <div className="h-6 w-1/3 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
                    </div>
                </div>
                 <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <div className="h-6 w-1/3 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-8 text-center">
            <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
    </div>
  );
};

export default DiseaseResultSkeleton;
