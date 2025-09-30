'use client';

const InstagramButton = ({ className = '' }: { className?: string }) => {
  const handleClick = () => {
    const url = 'https://www.instagram.com/mvs_aqua?utm_source=ig_web_button_share_sheet&igsh=aHd5cGF6d3J0Y3Rz';
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 group ${className}`}
      aria-label="Visit our Instagram"
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.427.403.61.212 1.046.466 1.505.925.459.459.713.896.925 1.505.163.457.349 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.427a3.906 3.906 0 0 1-.925 1.505 3.906 3.906 0 0 1-1.505.925c-.457.163-1.257.349-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.427-.403a3.906 3.906 0 0 1-1.505-.925 3.906 3.906 0 0 1-.925-1.505c-.163-.457-.349-1.257-.403-2.427C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.427.212-.61.466-1.046.925-1.505.459-.459.896-.713 1.505-.925.457-.163 1.257-.349 2.427-.403C8.416 2.175 8.796 2.163 12 2.163Zm0 1.62c-3.15 0-3.52.012-4.76.069-1.023.047-1.578.218-1.946.363-.49.19-.84.417-1.207.784-.367.367-.594.717-.784 1.207-.145.368-.316.923-.363 1.946-.057 1.24-.069 1.61-.069 4.76 0 3.15.012 3.52.069 4.76.047 1.023.218 1.578.363 1.946.19.49.417.84.784 1.207.367.367.717.594 1.207.784.368.145.923.316 1.946.363 1.24.057 1.61.069 4.76.069 3.15 0 3.52-.012 4.76-.069 1.023-.047 1.578-.218 1.946-.363.49-.19.84-.417 1.207-.784.367-.367.594-.717.784-1.207.145-.368.316-.923.363-1.946.057-1.24.069-1.61.069-4.76 0-3.15-.012-3.52-.069-4.76-.047-1.023-.218-1.578-.363-1.946a3.286 3.286 0 0 0-.784-1.207 3.286 3.286 0 0 0-1.207-.784c-.368-.145-.923-.316-1.946-.363-1.24-.057-1.61-.069-4.76-.069Zm0 3.513a4.724 4.724 0 1 1 0 9.448 4.724 4.724 0 0 1 0-9.448Zm0 1.62a3.104 3.104 0 1 0 0 6.208 3.104 3.104 0 0 0 0-6.208Zm5.999-.966a1.102 1.102 0 1 1 0 2.204 1.102 1.102 0 0 1 0-2.204Z"/>
      </svg>
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Follow on Instagram
        <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
      </div>
    </button>
  );
};

export default InstagramButton;


