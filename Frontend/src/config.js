// const base = "http://localhost:5000";
const base = "https://todo-by-jatin.herokuapp.com";

const urls = {
    verifyToken: `${base}/api/v1/auth/verify-token`,
    getTodos: `${base}/api/v1/todo/get`,
    addTodo: `${base}/api/v1/todo/add`,
    updateTodo: `${base}/api/v1/todo/update`,
    deleteTodo: `${base}/api/v1/todo/delete`,
    signin: `${base}/api/v1/auth/sign-in`,
    signup: `${base}/api/v1/auth/sign-up`,
    markAll: `${base}/api/v1/todo/mark-all`,
    unmarkAll: `${base}/api/v1/todo/unmark-all`,
    deleteAll: `${base}/api/v1/todo/delete-all`
};

export default urls;