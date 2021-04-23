import mongoose from 'mongoose';

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        require: [true, 'Title is Required'],
        maxlength: 50
    },
    body: {
        type: String,
        maxlength: 140
    },
    userID: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const todoModel = mongoose.model('Todo', todoSchema);
export default todoModel;