"use client";

import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ListMusic, PlusCircle, Settings, Menu, X } from 'lucide-react'
import Logo from './components/Logo'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'My Rankings', href: '/rankings', icon: ListMusic },
  ]

  const renderSidebar = () => (
    <div className={`${isMobile ? 'fixed inset-0 z-50 transform transition-transform duration-300 bg-background-primary overflow-y-auto pb-safe' : 'w-64 bg-background-secondary p-4 border-r border-border min-h-screen'} ${isMobileMenuOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''}`}>
      {isMobile && (
        <button 
          className="absolute top-4 right-4 text-text-primary hover:text-accent transition-colors p-2"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      <div className="mb-8 px-4 pt-4">
        <Link href="/" className="block hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
      </div>
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <Icon className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-8">
        <Link 
          href="/rankings/new" 
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <PlusCircle className="w-5 h-5" />
          New Ranking
        </Link>
      </div>
      <div className={`${isMobile ? 'mt-8 mb-8' : 'absolute bottom-8 left-4 right-4'}`}>
        <Link 
          href="/settings" 
          className="sidebar-item"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Settings className="w-6 h-6" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )

  return (
    <html lang="en">
      <head>
        <title>Rank it! - Album Ranking Made Fun</title>
        <meta name="description" content="Create, share, and discover album rankings. Your music taste, organized." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#1DB954" />
        <meta property="og:title" content="Rank it! - Album Ranking Made Fun" />
        <meta property="og:description" content="Create, share, and discover album rankings. Your music taste, organized." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Mobile menu button */}
          {isMobile && (
            <div className="fixed top-4 left-4 z-40">
              <button 
                className="bg-background-secondary rounded-full p-2 shadow-md"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-text-primary" />
              </button>
            </div>
          )}

          {/* Sidebar - hidden on mobile unless menu is open */}
          {(!isMobile || isMobileMenuOpen) && renderSidebar()}

          {/* Overlay to close mobile menu when clicking outside */}
          {isMobile && isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Main content */}
          <div className="flex-1 overflow-auto pb-safe">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-accent to-blue-500"></div>
            {/* Mobile header padding to prevent content being hidden by the menu button */}
            {isMobile && <div className="h-16"></div>}
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
