import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, author } = req.body

    if (content.length > 20) {
      return res.status(400).json({ error: 'Message content must be 20 characters or less' })
    }

    try {
      await prisma.message.create({
        data: { content, author },
      })

      const messages = await prisma.message.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      })

      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json({ error: 'Error creating message' })
    }
  } else if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      })

      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching messages' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}