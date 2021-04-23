import Todo from '../model/todo.js';
import sanitiseStr from '../utilis/sanitise.js';

export const add = async(req, res) => {
    try {
        let { title, body, userID } = req.body;

        if(!title || !userID) {
            return res.status(405).json({message: "Title or Description Missing!"});
        }

        // Alphanumeric
        if(/[^0-9a-zA-Z ]/.test(title)) {
            return res.status(422).json({message: "Title should be alphanumeric only!"});                
        }
        if(/[^0-9a-zA-Z ]/.test(body)) {
            return res.status(422).json({message: "Description should be alphanumeric only!"});                
        }

        title = sanitiseStr(title);
        body = sanitiseStr(body);

        const todo = await Todo.create({
            title,
            body,
            userID
        });

        return res.status(200).json({message: "Todo Added", data: todo});
    } catch(error) {
        if(error.name === 'ValidationError') {
            if(error.errors.body) {
                return res.status(404).json({message: "Description length should be less than or equal to 140"});                
            } else if(error.errors.title) {
                return res.status(404).json({message: "Title length should be less than or equal to 50"});                
            }
        }
        return res.status(404).json({message: error.message});
    }
}

export const get = async(req, res) => {
    try {
        const { userID } = req.params;

        if(!userID) {
            return res.status(405).json({message: "UserID is Missing!"});
        }

        const todos = await Todo.find({ userID });

        return res.status(200).json({message: `${todos.length} Todo(s) Delivered`, data: todos});
    } catch(error) {
        return res.status(404).json({message: error.message});
    }
}

export const update = async(req, res) => {
    try {
        const { todoID, newTodo } = req.body;

        if( !todoID || !newTodo) {
            return res.status(405).json({message: "UserID or newTodo is Missing!"});
        }

        // Alphanumeric
        if(newTodo.title && /[^0-9a-zA-Z ]/.test(newTodo.title)) {
            return res.status(422).json({message: "Title should be alphanumeric only!"});                
        }
        if(newTodo.body && /[^0-9a-zA-Z ]/.test(newTodo.body)) {
            return res.status(422).json({message: "Description should be alphanumeric only!"});                
        }

        if (newTodo.title){
            newTodo.title = sanitiseStr(newTodo.title);
        }
        if (newTodo.body){
            newTodo.body = sanitiseStr(newTodo.body);
        }

        const todo = await Todo.findByIdAndUpdate(todoID, newTodo, {new: true});

        return res.status(200).json({message: 'Todo Updated', data: todo});
    } catch(error) {
        return res.status(404).json({message: error.message});
    }
}

export const deleteTodo = async(req, res) => {
    try {
        const { todoID } = req.params;

        if(!todoID) {
            return res.status(405).json({message: "TodoID is Missing!"});
        }

        const todo = await Todo.findByIdAndDelete(todoID);

        return res.status(200).json({message: 'Todo Deleted', data: todo});
    } catch(error) {
        return res.status(404).json({message: error.message});
    }
}

export const deleteAll = async(req, res) => {
    try {
        const { userID } = req.params;

        if(!userID) {
            return res.status(405).json({message: "UserID is Missing!"});
        }

        const todo = await Todo.deleteMany({userID, status:true});

        return res.status(200).json({message: 'All Completed Todo(s) Deleted', data: todo});
    } catch(error) {
        return res.status(404).json({message: error.message});
    }
}

export const markAll = async(req, res) => {
    try {
        const { userID } = req.params;

        if(!userID) {
            return res.status(405).json({message: "UserID is Missing!"});
        }

        const todo = await Todo.updateMany({userID, status:false}, {status:true});

        return res.status(200).json({message: 'All Todo(s) are marked as Completed', data: todo});
    } catch(error) {
        return res.status(404).json({message: error.message});
    }
}

export const unMarkAll = async(req, res) => {
    try {
        const { userID } = req.params;

        if(!userID) {
            return res.status(405).json({message: "UserID is Missing!"});
        }

        const todo = await Todo.updateMany({userID, status:true}, {status:false});

        return res.status(200).json({message: 'All Todo(s) are marked as Incompleted', data: todo});
    } catch(error) {
        return res.status(404).json({message: error.message});
    }
}