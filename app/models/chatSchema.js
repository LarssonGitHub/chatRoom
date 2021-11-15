import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    user: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true
    },
    data: {
        type: String,
    },
    imgData: {
        type: String,
    },
    time: {
        type: String,
        required: true
    },
    postDate: {
        type: String,
        required: true
    },
});

const Chat = mongoose.model('chat', chatSchema);

export {
    Chat
}