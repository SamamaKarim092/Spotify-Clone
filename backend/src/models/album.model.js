import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
    artist: {
    type: String,
    required: true,
  },
    ImageUrl: {
    type: String,
    required: true,
  },
    releaseYear: {
    type: Number,
    required: true,
  },
    songs : [
        {type: mongoose.Schema.Types.ObjectId, ref: "Song"}
    ],
},
    { timestamps: true }
);

export const Album = mongoose.model('Album', songSchema);