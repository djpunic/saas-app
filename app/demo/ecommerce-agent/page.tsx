
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
import '../../styles/themes/honey-theme.css'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
}

interface HoneyProduct {
  id: string
  name: string
  price: string
  location: string
  image: string
  rating: number
  description: string
}

const HoneyAgent = () => {
  // State to manage messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi! What kind of honey are you looking for? Floral? Mountain? 🍯',
      sender: 'agent',
      timestamp: new Date()
    }
  ])

  // Ref for auto-scrolling chat
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Honey products data
  const honeyProducts: HoneyProduct[] = [
    {
      id: '1',
      name: 'Golden Coast Honey',
      price: '€15.99',
      location: 'Coastal Hives – Tunisia',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      description: '🌊 Sea Breeze Infused'
    },
    {
      id: '2',
      name: 'Mountain Wildflower',
      price: '€18.50',
      location: 'Alpine Meadows – Switzerland',
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      description: '🌸 Pure Wildflower'
    },
    {
      id: '3',
      name: 'Lavender Dreams',
      price: '€22.00',
      location: 'Provence Fields – France',
      image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.7,
      description: '💜 Lavender Essence'
    }
  ]

  // State for current honey card
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Auto-cycle through cards every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % honeyProducts.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [honeyProducts.length])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (message: string) => {
    // Webhook configuration
    const webhookUrl = 'https://aiagnet.punicai.website/webhook/b5282737-12f0-4be9-b22d-69cb47b638b6'

    const payload = {
      sessionId: '', // You can generate or manage session IDs
      agentType: 'ecommerce',
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
            content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment! 🍯',
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
          content: 'I\'m experiencing some technical difficulties. Please try again! 🍯',
          sender: 'agent',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorResponse])
      }
    }
  }

  return (
    <PageLoader theme="honey">
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
        <h1 className="hero-title">Pure Organic Honey</h1>
        <p className="hero-subtitle">Harvested From Nature's Heart</p>
      </div>

      {/* Product Card Container */}
      <div className="product-card-container">
        <Card className="product-card">
          <div className="p-4">
            <div
              className="product-image"
              style={{ backgroundImage: `url(${honeyProducts[currentCardIndex].image})` }}
            ></div>

            <div className="product-info p-4">
              <div className="product-header">
                <span className="product-price">{honeyProducts[currentCardIndex].price}</span>
                <div className="product-rating">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{honeyProducts[currentCardIndex].rating}</span>
                </div>
              </div>

              <h3 className="product-title">{honeyProducts[currentCardIndex].name}</h3>

              <div className="product-location">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{honeyProducts[currentCardIndex].location}</span>
              </div>

              <span className="product-badge">{honeyProducts[currentCardIndex].description}</span>
            </div>
          </div>
        </Card>

        {/* Carousel Dots */}
        <div className="carousel-dots">
          {honeyProducts.map((_, index) => (
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
              <AvatarFallback className="bg-orange-500 text-white font-bold">
                J
              </AvatarFallback>
            </Avatar>
            <div className="chat-agent-info">
              <div className="chat-agent-name">Jessica - Honey Specialist</div>
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
                    <AvatarFallback className="bg-orange-500 text-white font-bold">
                      J
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
          <AvatarFallback className="bg-orange-500 text-white font-bold">
            J
          </AvatarFallback>
        </Avatar>
      </div>
    </PageLoader>
  )
}

export default HoneyAgent