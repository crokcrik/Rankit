import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  id: String,
  name: String,
  artists: [{ name: String }],
  images: [{ url: String }],
  external_urls: {
    spotify: String
  }
});

const rankingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  albums: [albumSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Ranking || mongoose.model('Ranking', rankingSchema); 