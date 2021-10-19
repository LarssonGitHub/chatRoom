import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const gallerySchema = new Schema({
        base64: {
            type: String, 
            required: true
        },
        user: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: true
        },
    });
  
const Gallery = mongoose.model('Gallery', gallerySchema);

export {
    Gallery
   }