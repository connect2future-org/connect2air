import mongoose from 'mongoose';

const accessorySchema = new mongoose.Schema(
  {
    icon: { type: String, default: '⚡' },
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    desc: { type: String, default: '' },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    cloudinaryId: { type: String, default: '' },
  },
  { timestamps: true }
);

const Accessory = mongoose.models.Accessory || mongoose.model('Accessory', accessorySchema);
export default Accessory;
