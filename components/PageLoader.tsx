'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageLoaderProps {
  children: React.ReactNode
  theme?: 'honey' | 'booking' | 'real-estate' | 'realestate'
}

const PageLoader = ({ children, theme }: PageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Set theme class on body for CSS cascade
    if (theme) {
      document.body.className = `theme-${theme}`
    }

    // Simple loading timer
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }, 500)

    return () => clearTimeout(timer)
  }, [theme, pathname])

  // Always render children immediately to ensure CSS loads
  return (
    <>
      {children}
      {isLoading && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div className="text-center">
            {/* Loading Spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white border-opacity-30 rounded-full animate-spin border-t-white mb-4 mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-ping mx-auto"></div>
            </div>

            {/* Loading Text */}
            <h2 className="text-2xl font-bold text-white mb-2 font-serif">
              Loading Experience
            </h2>
            <p className="text-white text-opacity-80 font-medium">
              Preparing your demo...
            </p>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PageLoader
