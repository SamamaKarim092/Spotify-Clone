import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import multiparty from 'multiparty';
import fs from 'fs';

// Vercel-compatible file upload handler
const parseMultipartForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

// Updated helper function for Vercel serverless
const uploadToCloudinary = async (file) => {
  try {
    let uploadPath;
    
    if (Array.isArray(file)) {
      uploadPath = file[0].path;
    } else {
      uploadPath = file.path;
    }

    const result = await cloudinary.uploader.upload(uploadPath, {
      resource_type: "auto",
      folder: "spotify-clone",
    });
    
    // Clean up temporary file
    try {
      fs.unlinkSync(uploadPath);
    } catch (cleanupError) {
      console.log("Cleanup error (non-critical):", cleanupError.message);
    }
    
    console.log("Cloudinary upload successful:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error(`Error uploading to cloudinary: ${error.message}`);
  }
};

export const createSong = async (req, res) => {
  try {
    console.log("Processing song upload...");
    
    // Parse multipart form data
    const { fields, files } = await parseMultipartForm(req);
    
    console.log("Fields:", fields);
    console.log("Files:", Object.keys(files));

    if (!files.audioFile || !files.imageFile) {
      return res.status(400).json({ 
        message: "Please upload both audio and image files",
        receivedFiles: Object.keys(files)
      });
    }

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const artist = Array.isArray(fields.artist) ? fields.artist[0] : fields.artist;
    const albumId = Array.isArray(fields.albumId) ? fields.albumId[0] : fields.albumId;
    const duration = Array.isArray(fields.duration) ? fields.duration[0] : fields.duration;

    console.log("Uploading audio file...");
    const audioUrl = await uploadToCloudinary(files.audioFile);
    
    console.log("Uploading image file...");
    const imageUrl = await uploadToCloudinary(files.imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration: parseInt(duration) || 0,
      albumId: albumId || null,
    });

    await song.save();
    console.log("Song saved successfully:", song._id);

    // if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    
    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    res.status(500).json({ 
      message: "Error creating song", 
      error: error.message 
    });
  }
};

export const createAlbum = async (req, res) => {
  try {
    console.log("Processing album upload...");
    
    // Parse multipart form data
    const { fields, files } = await parseMultipartForm(req);
    
    console.log("Fields:", fields);
    console.log("Files:", Object.keys(files));

    if (!files.imageFile) {
      return res.status(400).json({ 
        message: "Please upload an image file",
        receivedFiles: Object.keys(files)
      });
    }

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const artist = Array.isArray(fields.artist) ? fields.artist[0] : fields.artist;
    const releaseYear = Array.isArray(fields.releaseYear) ? fields.releaseYear[0] : fields.releaseYear;

    console.log("Uploading album image...");
    const imageUrl = await uploadToCloudinary(files.imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear: parseInt(releaseYear) || new Date().getFullYear(),
    });

    await album.save();
    console.log("Album saved successfully:", album._id);

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    res.status(500).json({ 
      message: "Error creating album", 
      error: error.message 
    });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);
    
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // if song belongs to an album, update the album's songs array
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    res.status(500).json({ 
      message: "Error deleting song", 
      error: error.message 
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    res.status(500).json({ 
      message: "Error deleting album", 
      error: error.message 
    });
  }
};

export const checkAdmin = async (req, res) => {
  res.status(200).json({ admin: true });
};