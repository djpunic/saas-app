'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Phone, MapPin, Star } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/navbar'
import PageLoader from '@/components/PageLoader'
import '../../styles/demo-layout.css'
import '../../styles/themes/booking-theme.css'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
}

interface HotelPackage {
  id: string
  name: string
  price: string
  location: string
  image: string
  rating: number
  description: string
}

const BookingAgent = () => {
  // State to manage messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi! Looking for the perfect getaway? Beach resort? City hotel? Mountain retreat? I can help you find amazing deals! 🏨',
      sender: 'agent',
      timestamp: new Date()
    }
  ])

  // Ref for auto-scrolling chat
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Hotel packages data
  const hotelPackages: HotelPackage[] = [
    {
      id: '1',
      name: 'Oceanview Beach Resort',
      price: '€299/night',
      location: 'Maldives Paradise',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      description: '🏖️ All Inclusive'
    },
    {
      id: '2',
      name: 'Luxury City Hotel',
      price: '€189/night',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      description: '🏙️ City Center'
    },
    {
      id: '3',
      name: 'Mountain Lodge Retreat',
      price: '€159/night',
      location: 'Swiss Alps',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.7,
      description: '⛰️ Ski Resort'
    }
  ]

  // State for current hotel card
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Auto-cycle through cards every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % hotelPackages.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [hotelPackages.length])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (message: string) => {
    // Webhook configuration
    const webhookUrl = 'https://aiagnet.punicai.website/webhook/b5282737-12f0-4be9-b22d-69cb47b638b6'

    const payload = {
      sessionId: '3154', // You can generate or manage session IDs
      agentType: 'booking',
      message: message,
      timestamp: new Date().toISOString()
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        return data.output // Return the AI response
      } else {
        console.error('Webhook response error:', response.status)
        return null
      }
    } catch (error) {
      console.error('Error sending to webhook:', error)
      return null
    }
  }

  const handleCall = async () => {
    // Call webhook configuration
    const callWebhookUrl = '' // Empty for now, you'll add your call webhook URL here

    const payload = {
      sessionId: '',
      agentType: 'booking',
      action: 'call_initiated',
      timestamp: new Date().toISOString()
    }

    try {
      if (callWebhookUrl) {
        await fetch(callWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
      }
      console.log('Call initiated:', payload)
    } catch (error) {
      console.error('Error initiating call:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.querySelector('input') as HTMLInputElement
    const message = input.value.trim()

    if (message) {
      // Add user message to chat
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])

      // Clear input immediately
      input.value = ''

      // Send to webhook and get AI response
      try {
        const aiResponse = await sendMessage(message)

        if (aiResponse) {
          // Add AI response to chat
          const agentResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            sender: 'agent',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, agentResponse])
        } else {
          // Fallback response if webhook fails
          const fallbackResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment! 🏨',
            sender: 'agent',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, fallbackResponse])
        }
      } catch (error) {
        console.error('Error handling message:', error)
        // Fallback response on error
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: 'I\'m experiencing some technical difficulties. Please try again! 🏨',
          sender: 'agent',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorResponse])
      }
    }
  }

  return (
    <PageLoader theme="booking">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="h-screen relative overflow-hidden flex flex-col">
        {/* Navigation Bar */}
        <Navbar />

        {/* Beach Background */}
        <div className="demo-background" />

        {/* Gradient overlay for better text readability */}
        <div className="demo-background-overlay" />

        {/* Hero Section - Compact at Top */}
        <div className="hero-section">
          <h1 className="hero-title">
            Premium Hotel Booking
          </h1>
          <p className="hero-subtitle">
            Discover Your Perfect Getaway
          </p>
        </div>

        {/* Independent Product Card Section - Fixed Bottom Left */}
        <div className="product-card-container">
          {/* Single Product Card */}
          <div className="product-card">
            <Card className="border-none shadow-none">
              <div className="space-y-3 p-4">
                {/* Product Image */}
                <div
                  className="product-image"
                  style={{
                    backgroundImage: `url('${hotelPackages[currentCardIndex].image}')`
                  }}
                />

                {/* Product Info */}
                <div className="product-info">
                  <div className="product-header">
                    <span className="product-price">
                      {hotelPackages[currentCardIndex].price}
                    </span>
                    <div className="product-rating">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{hotelPackages[currentCardIndex].rating}</span>
                    </div>
                  </div>

                  <h3 className="product-title">
                    {hotelPackages[currentCardIndex].name}
                  </h3>

                  <div className="product-location">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {hotelPackages[currentCardIndex].location}
                    </span>
                  </div>

                  <div className="product-badge">
                    {hotelPackages[currentCardIndex].description}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Carousel Dots */}
          <div className="carousel-dots">
            {hotelPackages.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentCardIndex ? 'active' : 'inactive'}`}
                onClick={() => setCurrentCardIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Independent Chat Box Section - Floating Center */}
        <div className="chat-box-container">
          <div className="chat-box">
            {/* Chat Header */}
            <div className="chat-header">
              <Avatar className="h-10 w-10 border-2 border-green-400">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold">
                  S
                </AvatarFallback>
              </Avatar>
              <div className="chat-agent-info">
                <h2 className="chat-agent-name">
                  Sarah - Travel Specialist
                </h2>
                <div className="chat-status">
                  <div className="status-indicator"></div>
                  <span className="status-text">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {/* Initial message */}
              <div className="message">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm">
                    S
                  </AvatarFallback>
                </Avatar>
                <div className="message-bubble agent">
                  <p className="message-text">
                    Hi! Looking for the perfect getaway? Beach resort? City hotel? Mountain retreat? I can help you find amazing deals! 🏨
                  </p>
                </div>
              </div>

              {/* Dynamic messages */}
              {messages.slice(1).map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'user' ? 'user' : ''}`}
                >
                  {message.sender === 'agent' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm">
                        S
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`message-bubble ${message.sender}`}>
                    <p className="message-text">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Auto-scroll target */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input">
              <form onSubmit={handleSendMessage} className="chat-form">
                <Input
                  placeholder="Type your message..."
                  className="chat-input-field"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="chat-send-button"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Floating Call Button - Repositioned */}
        <div className="call-button" onClick={handleCall}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold text-xs">
              S
            </AvatarFallback>
          </Avatar>
          <div className="call-button-text">
            <p className="call-button-label">
              Need help booking?
            </p>
            <div className="call-button-action">
              <Phone className="h-3 w-3 text-green-600" />
              <span className="call-button-action-text">
                Start a call
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageLoader>
  )
}

export default BookingAgent
