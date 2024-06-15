import React, { useState, useEffect } from 'react';
import './TodoApp.css';
import { getAll, updateTodo, deleteTodo, createTodo } from './api';

function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [error, setError] = useState(null);
    const [draggedTodo, setDraggedTodo] = useState(null);
    const [showInput, setShowInput] = useState({ Todo: false, InProgress: false, Done: false });
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [editingDescription, setEditingDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await getAll();
            //setTodos(response.data);
            setTodos(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching todos:', err);
            setError('Failed to fetch todos.');
        }
    };

    const addTodo = async (newState) => {
        if (newTodo.trim()) {
            try {
                const todoItem = { text: newTodo, description: '', state: newState };
                await createTodo(todoItem);
                setNewTodo('');
                setShowInput({ Todo: false, InProgress: false, Done: false });
                fetchTodos();
            } catch (err) {
                console.error('Error creating todo:', err);
                setError('Failed to create todo.');
            }
        } else {
            setError('Todo text cannot be empty.');
        }
    };

    const updateTodoText = async (id, newText, newDescription, newState) => {
        if (newText.trim()) {
            try {
                await updateTodo(id, { text: newText, description: newDescription, state: newState });
                setEditingTodo(null);
                fetchTodos();
            } catch (err) {
                console.error('Error updating todo:', err);
                setError('Failed to update todo.');
            }
        } else {
            setError('Todo text cannot be empty.');
        }
    };

    const removeById = async (id) => {
        try {
            await deleteTodo(id);
            fetchTodos();
        } catch (err) {
            console.error('Error deleting todo:', err);
            setError('Failed to delete todo.');
        }
    };

    const handleDragStart = (todo) => {
        setDraggedTodo(todo);
    };

    const handleDrop = async (destinationState) => {
        if (draggedTodo && destinationState !== draggedTodo.state) {
            try {
                await updateTodo(draggedTodo.id, { ...draggedTodo, state: destinationState });
                fetchTodos();
            } catch (err) {
                console.error('Error updating todo:', err);
                setError('Failed to update todo.');
            }
        }
        setDraggedTodo(null);
    };

    const allowDrop = (e) => {
        e.preventDefault();
    };

    const getCount = (state) => todos.filter(todo => todo.state === state).length;

    const toggleInput = (state) => {
        setNewTodo('');
        setShowInput({ Todo: false, InProgress: false, Done: false, [state]: !showInput[state] });
    };

    const handleTodoClick = (todo) => {
        setEditingTodo(todo.id);
        setEditingText(todo.text);
        setEditingDescription(todo.description);
        setIsModalOpen(true);
    };

    const handleEditChangeText = (e) => {
        setEditingText(e.target.value);
    };

    const handleEditChangeDescription = (e) => {
        setEditingDescription(e.target.value);
    }

    const handleEditSubmit = (e, id, state) => {
        e.preventDefault();
        console.log(editingDescription);
        updateTodoText(id, editingText, editingDescription, state);
        setIsModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleModalClick = (e) => {
        if (e.target.className === 'modal') {
            closeModal();
        }
    };

    return (
        <div className='container'>
            <h1 className='title'>Mega To-Do List</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='todos-container'>
                <div className='column'>
                    <h2>Todo {getCount('Todo')}</h2>
                    <ul className='todos do' onDragOver={allowDrop} onDrop={() => handleDrop("Todo")}>
                        {todos.filter(todo => todo.state === "Todo").map(todo => (
                            <li className="todo"
                                key={todo.id}
                                draggable
                                onDragStart={() => handleDragStart(todo)}>
                                <span onClick={() => handleTodoClick(todo)}>{todo.text}</span>
                                <span className='desc'>{todo.description}</span>
                                <img src='./delete.svg' alt='delete' className='delete' onClick={e => {
                                    e.stopPropagation();
                                    removeById(todo.id);
                                }}/>
                            </li>
                        ))}
                    </ul>
                    {showInput.Todo ? (
                        <div className='input-container'>
                            <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)}/>
                            <button onClick={() => addTodo('Todo')}>Add Todo</button>
                        </div>
                    ) : (
                        <button className='btn-add' onClick={() => toggleInput('Todo')}>Add item</button>
                    )}
                </div>
                <div className='column'>
                    <h2>In Progress {getCount('InProgress')}</h2>
                    <ul className='todos inprogress' onDragOver={allowDrop} onDrop={() => handleDrop("InProgress")}>
                        {todos.filter(todo => todo.state === "InProgress").map(todo => (
                            <li className="todo"
                                key={todo.id}
                                draggable
                                onDragStart={() => handleDragStart(todo)}>
                                <span onClick={() => handleTodoClick(todo)}>{todo.text}</span>
                                <span>{todo.description}</span>
                                <img src='./delete.svg' alt='delete' className='delete' onClick={e => {
                                    e.stopPropagation();
                                    removeById(todo.id);
                                }}/>
                            </li>
                        ))}
                    </ul>
                    {showInput.InProgress ? (
                        <div className='input-container'>
                            <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)}/>
                            <button onClick={() => addTodo('InProgress')}>Add Todo</button>
                        </div>
                    ) : (
                        <button className='btn-add' onClick={() => toggleInput('InProgress')}>Add item</button>
                    )}
                </div>
                <div className='column'>
                    <h2>Done {getCount('Done')}</h2>
                    <ul className='todos done' onDragOver={allowDrop} onDrop={() => handleDrop("Done")}>
                        {todos.filter(todo => todo.state === "Done").map(todo => (
                            <li className="todo"
                                key={todo.id}
                                draggable
                                onDragStart={() => handleDragStart(todo)}>
                                <span onClick={() => handleTodoClick(todo)}>{todo.text}</span>
                                <span>{todo.description}</span>
                                <img src='./delete.svg' alt='delete' className='delete' onClick={e => {
                                    e.stopPropagation();
                                    removeById(todo.id);
                                }}/>
                            </li>
                        ))}
                    </ul>
                    {showInput.Done ? (
                        <div className='input-container'>
                            <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)}/>
                            <button onClick={() => addTodo('Done')}>Add Todo</button>
                        </div>
                    ) : (
                        <button className='btn-add' onClick={() => toggleInput('Done')}>Add item</button>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className='modal' onClick={handleModalClick}>
                    <div className='modal-content'>
                        <span className='close' onClick={closeModal}>&times;</span>
                        <h2>Edit Todo</h2>
                        <form onSubmit={(e) => handleEditSubmit(e, editingTodo, todos.find(todo => todo.id === editingTodo).state)}>
                            <input type='text' className='input-edit' value={editingText} onChange={handleEditChangeText}/>
                            <input type='text' className='input-edit' value={editingDescription} onChange={handleEditChangeDescription} />
                            <button className='btn-edit' type='submit'>Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodoApp;
