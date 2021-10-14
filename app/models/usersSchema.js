import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
        userName: {
            type: String, 
            minlength: 2,
            maxlength: 20,
            required: true
        },
        userPassword: {
            type: String,
            required: true
        },
    });
  
const Users = mongoose.model('user', userSchema);

export default {
    Users
   }