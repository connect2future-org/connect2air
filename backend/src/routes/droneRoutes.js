import express from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Drone from '../models/Drone.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Upload base64 image string to Cloudinary
async function uploadBase64ToCloudinary(base64Str) {
  if (!base64Str || !base64Str.startsWith('data:image/')) return base64Str;
  try {
    const res = await cloudinary.uploader.upload(base64Str, {
      folder: 'connect2air/drones',
      transformation: [
        { width: 800, height: 800, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });
    return res.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return base64Str; // fallback to original base64 if Cloudinary upload fails
  }
}

const DEFAULT_DRONES = [
  {
    name: 'C2A Swarm-Master 2.0',
    tagline: 'Industry Standard Light-Show & Ad Drone',
    badge: 'Popular Swarm',
    price: '₹2.8 Lakhs',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    description: 'Precision quadcopter engineered for synchronized swarms, high-density LED integration, and wind resistance up to 38 km/h.',
    specs: [
      { label: 'Flight Time', value: '28 Mins' },
      { label: 'Payload Capacity', value: '2.5 kg' },
      { label: 'Positioning', value: 'Dual RTK GPS' },
      { label: 'Wind Resistance', value: '38 km/h' },
    ],
    featured: false,
  },
  {
    name: 'C2A Mega-Screen 4K',
    tagline: 'High-Lumen Floating LED Matrix Screen Drone',
    badge: 'Bestseller',
    price: '₹4.5 Lakhs',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    description: 'High-resolution aerial video screen display drone with 10,000 Nits brightness and daylight-visible outdoor playback.',
    specs: [
      { label: 'Flight Time', value: '25 Mins' },
      { label: 'Brightness', value: '10,000 Nits' },
      { label: 'Screen Tech', value: 'Full Color LED Matrix' },
      { label: 'Weather Rating', value: 'IP65 Waterproof' },
    ],
    featured: true,
  },
  {
    name: 'C2A Heavy-Lift Pro',
    tagline: 'Industrial Payload & Extended Endurance Drone',
    badge: 'Heavy Duty',
    price: '₹3.8 Lakhs',
    imageUrl: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=800&q=80',
    description: 'Rugged heavy-lift hexacopter built for high-wind stability, extended battery life, and heavy physical advertising banners or LED rigs.',
    specs: [
      { label: 'Flight Time', value: '35 Mins' },
      { label: 'Payload Capacity', value: '6.0 kg' },
      { label: 'Positioning', value: 'Triple Redundant RTK' },
      { label: 'Wind Resistance', value: '45 km/h' },
    ],
    featured: false,
  },
  {
    name: 'C2A Bespoke Swarm Pro',
    tagline: 'Customizable Swarm Drone & Payload Setup',
    badge: 'Customizable',
    price: 'Custom Quote',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    description: 'Bespoke engineered quadcopter/hexacopter platform tailored to your exact payload specs, screen size, flight endurance, and swarm choreography.',
    specs: [
      { label: 'Flight Time', value: '25-40 Mins (Custom)' },
      { label: 'Payload Capacity', value: '1.0 - 10.0 kg' },
      { label: 'Choreography', value: 'Tailored 3D Suite' },
      { label: 'Screen Config', value: 'Bespoke LED Rig' },
    ],
    featured: true,
  },
];

// GET /api/drones — List all drones
router.get('/', async (_req, res) => {
  try {
    let items = await Drone.find().sort({ createdAt: -1 });
    if (items.length === 0) {
      items = await Drone.insertMany(DEFAULT_DRONES);
    }
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('Failed to fetch drones:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch drones.' });
  }
});

// POST /api/drones — Create new drone product card
router.post('/', async (req, res) => {
  try {
    const { name, tagline, badge, price, imageUrl, description, specs, featured } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required.' });
    }

    // Upload base64 image to Cloudinary if provided
    const finalImageUrl = await uploadBase64ToCloudinary(imageUrl);

    const item = await Drone.create({
      name,
      tagline: tagline || '',
      badge: badge || '',
      price,
      imageUrl: finalImageUrl || '',
      description: description || '',
      specs: Array.isArray(specs) ? specs : [],
      featured: Boolean(featured),
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error('Failed to create drone product:', err);
    res.status(500).json({ success: false, message: 'Failed to create drone product.' });
  }
});

// PATCH /api/drones/:id — Update drone product card
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // If client sent non-Mongo id (e.g. d_12345), create as new document in Mongo
      const { name, price, imageUrl } = req.body;
      if (!name || !price) {
        return res.status(400).json({ success: false, message: 'Invalid ID and missing required fields.' });
      }
      const finalImageUrl = await uploadBase64ToCloudinary(imageUrl);
      const newItem = await Drone.create({
        ...req.body,
        imageUrl: finalImageUrl || '',
      });
      return res.json({ success: true, data: newItem });
    }

    if (req.body.imageUrl && req.body.imageUrl.startsWith('data:image/')) {
      req.body.imageUrl = await uploadBase64ToCloudinary(req.body.imageUrl);
    }

    const updated = await Drone.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Drone product not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Failed to update drone product:', err);
    res.status(500).json({ success: false, message: 'Failed to update drone product.' });
  }
});

// DELETE /api/drones/:id — Delete drone product card
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ success: true, message: 'Non-Mongo product card cleared.' });
    }
    const deleted = await Drone.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Drone product not found.' });
    res.json({ success: true, message: 'Drone product deleted.' });
  } catch (err) {
    console.error('Failed to delete drone product:', err);
    res.status(500).json({ success: false, message: 'Failed to delete drone product.' });
  }
});

export default router;
