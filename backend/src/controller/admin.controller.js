import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { cloudinary } from "../lib/cloudinary.js";  // This should now work

// helper function to upload files to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.upload.upload(file.tempFilePath, {
            resource_type: 'auto',
        }
    )  
    return result.secure_url;
    } catch (error) {
        console.log("Error uploading to Cloudinary:", error);
        throw new Error("Error uploading to Cloudinary");
    }
}

export const createSong = async (req, res ,next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: 'Audio file and image file are required.' });
        }

        const { title, artist, album: albumId, genre, duration } = req.body;
        const audioFile = req.files.audioFile.path;
        const imageFile = req.files.imageFile.path;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile); 

        const newSong = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
            genre
        });

        await newSong.save();

        // if songs belongs to an album, update the album's songs array
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            });
        }
    
        return res.status(201).json(song);
    } catch (error) {
        console.log("Error in createSong:", error);
        next(error);
    }
};

export const deleteSong = async (req, res, next) => {
    try {
        const {id} = req.params;
        const song = await Song.findById

        // if songs belongs to an album, update the album's songs array
        if(song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id }
            });
        }

        await song.findByIdAndDelete(id);
        res.status(200).json({ message: 'Song deleted successfully.' });
    } catch (error) {
        console.log("Error in deleteSong:", error);
        next(error);
    }
};

export const createAlbum = async (req, res, next) => {
    try {
        const { title , artist, releaseYear } = req.body;
        const { imageFile } = req.files;
        const imageUrl = await uploadToCloudinary(imageFile);
        const album = new Album({
            title,
            artist,
            releaseYear,
            imageUrl
        }); 

        await album.save()
        res.status(201).json(album);
    } catch (error) { 
        next(error);
    }
};

export const deleteAlbum = async (req, res, next) => {
    try {
        const {id} = req.params;
        await Song.deleteMany({albumId: id}); 
        await Album.findByIdAndDelete(id);
        res.status(200).json({message: 'Album deleted successfully.'});
    } catch (error) {
        next(error);
    }
};

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({admin: true});
}