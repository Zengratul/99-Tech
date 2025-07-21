"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// CRUD routes will be added here
// Create a resource
app.post('/resources', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    try {
        const resource = yield prisma.resource.create({
            data: { name, description },
        });
        res.status(201).json(resource);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create resource' });
    }
}));
// List resources with basic filters (by name)
app.get('/resources', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    try {
        const resources = yield prisma.resource.findMany({
            where: name ? { name: { contains: String(name) } } : undefined,
            orderBy: { createdAt: 'desc' },
        });
        res.json(resources);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
}));
// Get details of a resource
app.get('/resources/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const resource = yield prisma.resource.findUnique({
            where: { id: Number(id) },
        });
        if (!resource)
            return res.status(404).json({ error: 'Resource not found' });
        res.json(resource);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch resource' });
    }
}));
// Update resource details
app.put('/resources/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const resource = yield prisma.resource.update({
            where: { id: Number(id) },
            data: { name, description },
        });
        res.json(resource);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update resource' });
    }
}));
// Delete a resource
app.delete('/resources/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.resource.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete resource' });
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
