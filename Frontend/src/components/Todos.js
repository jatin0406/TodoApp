import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import urls from '../config.js';
import moment from 'moment';

function Todos({ setIsAuthenticated }) {

    const history = useHistory()

    const [todos, setTodos] = useState([]);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState("");

    const [searchText, setSearchText] = useState("");
    const [userID, setUserID] = useState("");

    useEffect(() => {
        verifyToken();
    }, []);
    
    async function verifyToken() {
        const token = JSON.parse(window.localStorage.getItem('token'));
        try {
            const {data} = await axios.get(`${urls.verifyToken}/${token}`);
            setUserID(data.userID);
            setIsAuthenticated(true)
            fetchTodos(data.userID);
        } catch(error) {
            if(error.response) {
                toast.error("Login First");
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
            history.push('/signin');
        }
    }

    async function fetchTodos(id) {
        try {
            const {data} = await axios.get(`${urls.getTodos}/${id}`);
            setTodos(data.data);
        } catch (error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }

    async function addTodo() {
        try {
            const {data} = await axios.post(urls.addTodo, {
                title,
                body,
                userID
            });
            setTodos([...todos, data.data]);
            setTitle("");
            setBody("");
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }

    async function changeStatus(todoID, status) {
        try {
            await axios.patch(urls.updateTodo, {
                todoID,
                newTodo: {
                    status
                }
            });
            setTodos(todos.map(todo => {
                if(todo._id === todoID) {
                    return {...todo, status};
                } else {
                    return todo;
                }
            }));
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }

    async function updateTodo() {
        try {
            const {data} = await axios.patch(urls.updateTodo, {
                todoID: selectedTodo,
                newTodo: {
                    title,
                    body
                }
            });
            toast.success(data.message);
            setTodos(todos.map(todo => {
                if(todo._id === selectedTodo) {
                    return data.data;
                } else {
                    return todo;
                }
            }));
            setTitle("");
            setBody("");
            setIsEditMode(false);
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }

    async function deleteTodo(todoID, status) {
        try {
            if(!status) {
                return toast.error("Incomplete Todo cannot be deleted");
            }
            const {data} = await axios.delete(`${urls.deleteTodo}/${todoID}`);
            setTodos(todos.filter(todo => todo._id !== todoID));
            toast.success(data.message);
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }

    async function markAll() {
        try {
            await axios.patch(`${urls.markAll}/${userID}`);
            setTodos(todos.map(todo => {
                if(!todo.status) {
                    return {...todo, status: true};
                } else {
                    return todo;
                }
            }));
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }

    async function unmarkAll() {
        try {
            await axios.patch(`${urls.unmarkAll}/${userID}`);
            setTodos(todos.map(todo => {
                if(todo.status) {
                    return {...todo, status: false};
                } else {
                    return todo;
                }
            }));
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }

    async function deleteAll() {
        try {
            await axios.delete(`${urls.deleteAll}/${userID}`);
            setTodos(todos.filter(todo => !todo.status));
        } catch(error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else if(error.request) {
                toast.error("Server Error!");
            } else {
                toast.error(error.message);
            }
        }
    }

    return (
        <div className="todos">
            
            <div className="add">
            <div className="title">
                Todos
            </div>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder="Description" value={body} onChange={(e) => setBody(e.target.value)}/>
                {
                    isEditMode ?
                    <>
                        <button onClick={() => updateTodo()}>Update</button>
                        <button onClick={() => {
                            setIsEditMode(false);
                            setTitle("");
                            setBody("");
                        }}>Cancel</button>
                    </>
                    :
                    <button onClick={() => addTodo()}>Add</button>
                }
            </div>
            {/* <hr/> */}
            <input type="text" className="search" placeholder="Search Todo" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
            <div className="mark_remove_bts">
                <button
                    onClick={() => markAll()}
                >Mark All</button>
                <button
                    onClick={() => unmarkAll()}
                >Unmark All</button>
                <button
                    onClick={() => deleteAll()}
                >Remove All</button>
            </div>
            <div className="data">
                {
                    todos.slice(0).reverse().filter(todo => {
                        if(searchText.length > 2) {
                            if(todo.title.toLowerCase().includes(searchText.toLowerCase()) || todo.body.toLowerCase().includes(searchText.toLowerCase())) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return true;
                        }
                    }).map((todo, index) => (
                        <div className="todo" key={index}>
                            <div>
                                <label htmlFor={todo.todoID}
                                    style={{textDecoration: `${todo.status ? 'line-through' : 'none'}`}}
                                >
                                    <input type="checkbox" id={todo.todoID} checked={todo.status}
                                        onChange={() => changeStatus(todo._id, !todo.status)}
                                    />
                                    {todo.title}
                                </label>
                                <div className="body">{todo.body}</div>
                                <div className="time">Updated {moment(todo.updatedAt).fromNow()}</div>
                                <div className="time">Created {moment(todo.createdAt).fromNow()}</div>
                            </div>
                            <div className="edit" onClick={() => {
                                setIsEditMode(true);
                                setTitle(todo.title);
                                setBody(todo.body);
                                setSelectedTodo(todo._id);
                            }}>
                                <FaEdit/>
                            </div>
                            <div className="delete" onClick={() => deleteTodo(todo._id, todo.status)}>
                                <MdDelete/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Todos;
