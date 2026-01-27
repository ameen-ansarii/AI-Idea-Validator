import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        </div>
    );
};

export default Loader;
