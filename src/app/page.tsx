"use client"; 

import { useState, useEffect } from 'react'
import Head from 'next/head'

interface Message {
  id: number
  content: string
  author: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const res = await fetch('/api/messages')
    const data = await res.json()
    setMessages(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.length > 20) {
      alert('Message content must be 20 characters or less')
      return
    }
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, author }),
    })
    const data = await res.json()
    setMessages(data)
    setContent('')
    setAuthor('')
  }

  return (
    <div className="container">
      <Head>
        <title>Muro das Lamentações</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Muro das Lamentações</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Seu nome"
            required
          />
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mensagem (máximo 20 caracteres)"
            maxLength={20}
            required
          />
          
          <button type="submit">Enviar</button>
        </form>
        <div className="messages">
          <h2>Últimas Mensagens</h2>
          {messages.map((message) => (
            <div key={message.id} className="message">
              <p>{message.content}</p>
              <small>- {message.author}</small>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        h1 {
          margin-bottom: 2rem;
          font-size: 2.5rem;
        }

        form {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        input {
          margin-bottom: 1rem;
          padding: 0.5rem;
          width: 300px;
          color: #000000;
        }

        button {
          padding: 0.5rem 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .messages {
          width: 100%;
          max-width: 600px;
        }

        .message {
          background-color: #000000;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }

        .message p {
          margin: 0;
          font-size: 1.1rem;
        }

        .message small {
          color: #666;
        }
      `}</style>
    </div>
  )
}
