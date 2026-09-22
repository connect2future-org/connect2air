import mongoose from 'mongoose';

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const droneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    badge: { type: String, default: '' },
    price: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    specs: { type: [specSchema], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Drone = mongoose.models.Drone || mongoose.model('Drone', droneSchema);
export default Drone;
