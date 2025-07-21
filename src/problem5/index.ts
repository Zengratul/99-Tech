import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// CRUD routes will be added here

// Create a resource
app.post('/resources', async (req, res) => {
  const { name, description } = req.body;
  try {
    const resource = await prisma.resource.create({
      data: { name, description },
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create resource' });
  }
});

// List resources with basic filters (by name)
app.get('/resources', async (req, res) => {
  const { name } = req.query;
  try {
    const resources = await prisma.resource.findMany({
      where: name ? { name: { contains: String(name) } } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get details of a resource
app.get('/resources/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: Number(id) },
    });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// Update resource details
app.put('/resources/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: { name, description },
    });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update resource' });
  }
});

// Delete a resource
app.delete('/resources/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.resource.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete resource' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});