import { useEffect } from 'react';
import CustomFrame from '@/Components/CustomFrame';

export default function Guest({ children }) {
    // Set up slideshow effect using useEffect
    useEffect(() => {
        const images = document.querySelectorAll('.slideshow img');
        let currentIndex = 0;

        function showNextImage() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }

        const interval = setInterval(showNextImage, 8000); // Switch images every 8 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-screen flex flex-col md:flex-row">
            {/* Slideshow */}
            <div className="slideshow absolute inset-0 z-0 h-screen overflow-hidden">
                <img src="/img/image1.jpg" alt="Image 1" className="image" />
                <img src="/img/image2.jpg" alt="Image 2" className="image" />
                <img src="/img/image3.jpg" alt="Image 3" className="image" />
                <img src="/img/image4.jpg" alt="Image 4" className="image" />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-transparent opacity-75 z-1"></div>

            <div className="flex flex-col justify-center items-end w-full md:w-1/2 h-screen z-10 p-10 bg-transparent">
                <div className="w-full max-w-lg px-8 py-6 bg-transparent backdrop-blur-lg border border-gray-200 border-opacity-50 shadow-2xl rounded-lg text-white">
                    {children}
                </div>
            </div>

            <div className="hidden md:flex justify-start items-center w-1/2 h-screen z-10">
                <div className="grid grid-cols-2 gap-5 p-5">
                    <div className="hover:scale-110 transition duration-400">
                        <CustomFrame src="/img/image1.jpg" alt="Image 1" width="300px" height="300px" />
                    </div>
                    <div className="hover:scale-110 transition duration-400">
                        <CustomFrame src="/img/image2.jpg" alt="Image 2" width="300px" height="300px" />
                    </div>
                    <div className="hover:scale-110 transition duration-400">
                        <CustomFrame src="/img/image3.jpg" alt="Image 3" width="300px" height="300px" />
                    </div>
                    <div className="hover:scale-110 transition duration-400">
                        <CustomFrame src="/img/image4.jpg" alt="Image 4" width="300px" height="300px" />
                    </div>
                </div>
            </div>
        </div>
    );
}
