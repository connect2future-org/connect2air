import express from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Accessory from '../models/Accessory.js';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBase64ToCloudinary(base64Str) {
  if (!base64Str || !base64Str.startsWith('data:image/')) return base64Str;
  try {
    const res = await cloudinary.uploader.upload(base64Str, {
      folder: 'connect2air/accessories',
      transformation: [
        { width: 800, height: 800, crop: 'fill', aspect_ratio: '1:1', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });
    return res.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return base64Str;
  }
}

const DEFAULT_ACCESSORIES = [
  {
    icon: '🔋',
    title: 'Intelligent Flight Batteries',
    price: '₹35,000',
    desc: 'High-density smart battery packs with self-heating and battery management system.',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    icon: '⚡',
    title: 'Fast Chargers & Charging Hubs',
    price: '₹45,000',
    desc: 'Multi-battery fast-charging stations capable of concurrent multi-dock refueling.',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    icon: '🎮',
    title: 'GCS & Remote Controllers',
    price: '₹85,000',
    desc: 'Integrated flight control console loaded with Connect2Air 3D choreography & live telemetry.',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    icon: '🛰️',
    title: 'RTK / PPK Base Stations',
    price: '₹95,000',
    desc: 'Centimeter-level precision RTK positioning towers for mapping, inspection, and light shows.',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    icon: '🪂',
    title: 'Autonomous Parachute & Safety Gear',
    price: '₹45,000',
    desc: 'DGCA compliant dual-deployment automatic parachute systems and landing safety gear.',
    imageUrl: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    icon: '📷',
    title: 'Gimbals, Thermal & RGB Payloads',
    price: '₹1,15,000',
    desc: 'Radiometric thermal cameras, optical zoom gimbals, and high-lumen LED payloads.',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&h=800&q=80',
  },
];

// GET /api/accessories
router.get('/', async (_req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const items = await Accessory.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('GET /api/accessories error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/accessories
router.post('/', async (req, res) => {
  try {
    let { icon, title, price, desc, description, imageUrl } = req.body;
    if (!title || !price) {
      return res.status(400).json({ success: false, message: 'Title and price are required.' });
    }

    if (imageUrl && imageUrl.startsWith('data:image/')) {
      imageUrl = await uploadBase64ToCloudinary(imageUrl);
    }
    const accessory = new Accessory({
      icon: icon || '⚡',
      title: String(title).trim(),
      price: String(price).trim(),
      desc: desc || description || '',
      description: desc || description || '',
      imageUrl: imageUrl || '',
    });
    await accessory.save();
    res.status(201).json({ success: true, data: accessory });
  } catch (err) {
    console.error('POST /api/accessories error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/accessories/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    if (updates.imageUrl && updates.imageUrl.startsWith('data:image/')) {
      updates.imageUrl = await uploadBase64ToCloudinary(updates.imageUrl);
    }
    if (updates.desc && !updates.description) updates.description = updates.desc;
    if (updates.description && !updates.desc) updates.desc = updates.description;

    const accessory = await Accessory.findByIdAndUpdate(id, updates, { new: true });
    if (!accessory) {
      return res.status(404).json({ success: false, message: 'Accessory not found.' });
    }
    res.json({ success: true, data: accessory });
  } catch (err) {
    console.error('PATCH /api/accessories/:id error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/accessories/:id
router.delete('/:id', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const { id } = req.params;
    const { title } = req.query;

    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Accessory.findByIdAndDelete(id);
    }

    if (!deleted && title) {
      const escapeRegExp = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      deleted = await Accessory.findOneAndDelete({
        title: { $regex: new RegExp(`^${escapeRegExp(title)}$`, 'i') },
      });
    }

    if (!deleted && !mongoose.Types.ObjectId.isValid(id)) {
      const escapeRegExp = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      deleted = await Accessory.findOneAndDelete({
        $or: [
          { title: { $regex: new RegExp(`^${escapeRegExp(id)}$`, 'i') } },
          { id: id },
        ],
      });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Accessory not found.' });
    }

    res.json({ success: true, message: 'Accessory deleted successfully.' });
  } catch (err) {
    console.error('DELETE /api/accessories/:id error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
