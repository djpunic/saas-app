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
import '../../styles/themes/real-estate-theme.css'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
}

interface Property {
  id: string
  name: string
  price: string
  location: string
  image: string
  rating: number
  description: string
}

const RealEstateAgent = () => {
  // State to manage messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi! I\'m Omar, your Real Estate Specialist. Looking for your dream home? Apartment? Investment property? I can help you find the perfect place! 🏠',
      sender: 'agent',
      timestamp: new Date()
    }
  ])

  // Ref for auto-scrolling chat
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Property listings data
  const properties: Property[] = [
    {
      id: '1',
      name: 'Modern Downtown Loft',
      price: '€450,000',
      location: 'City Center – Berlin',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      description: '🏢 2 Bed • 2 Bath'
    },
    {
      id: '2',
      name: 'Luxury Penthouse',
      price: '€850,000',
      location: 'Marina District – Barcelona',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      description: '🌟 3 Bed • 3 Bath'
    },
    {
      id: '3',
      name: 'Cozy Garden Apartment',
      price: '€320,000',
      location: 'Green District – Amsterdam',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.7,
      description: '🌿 1 Bed • 1 Bath'
    }
  ]

  // State for current property card
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Auto-cycle through cards every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % properties.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [properties.length])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (message: string) => {
    // Webhook configuration
    const webhookUrl = 'https://aiagnet.punicai.website/webhook/b5282737-12f0-4be9-b22d-69cb47b638b6'

    const payload = {
      sessionId: '', // You can generate or manage session IDs
      agentType: 'real-estate',
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
            content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment! 🏡',
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
          content: 'I\'m experiencing some technical difficulties. Please try again! 🏡',
          sender: 'agent',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorResponse])
      }
    }
  }

  return (
    <PageLoader theme="real-estate">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Transparent Navbar */}
      <Navbar />

      {/* Background */}
      <div className="demo-background"></div>
      <div className="demo-background-overlay"></div>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Premium Real Estate</h1>
        <p className="hero-subtitle">Find Your Dream Home Today</p>
      </div>

      {/* Product Card Container */}
      <div className="product-card-container">
        <Card className="product-card">
          <div className="p-4">
            <div
              className="product-image"
              style={{ backgroundImage: `url(${properties[currentCardIndex].image})` }}
            ></div>

            <div className="product-info p-4">
              <div className="product-header">
                <span className="product-price">{properties[currentCardIndex].price}</span>
                <div className="product-rating">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{properties[currentCardIndex].rating}</span>
                </div>
              </div>

              <h3 className="product-title">{properties[currentCardIndex].name}</h3>

              <div className="product-location">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{properties[currentCardIndex].location}</span>
              </div>

              <span className="product-badge">{properties[currentCardIndex].description}</span>
            </div>
          </div>
        </Card>

        {/* Carousel Dots */}
        <div className="carousel-dots">
          {properties.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentCardIndex ? 'active' : 'inactive'}`}
              onClick={() => setCurrentCardIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Chat Box Container */}
      <div className="chat-box-container">
        <div className="chat-box">
          {/* Chat Header */}
          <div className="chat-header">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-600 text-white font-bold">
                O
              </AvatarFallback>
            </Avatar>
            <div className="chat-agent-info">
              <div className="chat-agent-name">Omar - Real Estate Specialist</div>
              <div className="chat-status">
                <div className="status-indicator"></div>
                <span className="status-text">Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.sender === 'agent' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">
                      O
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
              <Button type="submit" className="chat-send-button">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Call Button */}
      <div className="call-button">
        <div className="call-button-text">
          <div className="call-button-label">How can I help you?</div>
          <div className="call-button-action">
            <span className="call-button-action-text">Start a call</span>
          </div>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-600 text-white font-bold">
            O
          </AvatarFallback>
        </Avatar>
      </div>
    </PageLoader>
  )
}

export default RealEstateAgent
