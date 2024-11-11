/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons from react-icons

const Notepad = () => {
  const [notes, setNotes] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false); // State to manage deleting status

  // Fetch notes from the backend
  const fetchNotes = async () => {
    try {
      const response = await axios.get('https://cloud-file-storage-backend.vercel.app/api/notes');
      setNotes(response.data || []); // Set empty array as fallback
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]); // Set to empty array if there is an error
    }
  };

  useEffect(() => {
    fetchNotes(); // Initial fetch
  }, []);

  // Handle input change
  const handleChange = (e, setFieldValue) => {
    setFieldValue(e.target.value);
  };

  // Save new note or update existing note
  const saveNote = async () => {
    // Validation to prevent blank notes
    if (!currentTitle.trim() || !currentNote.trim()) {
      alert('Both title and note text are required.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await axios.put(`https://cloud-file-storage-backend.vercel.app/api/notes/${editId}`, {
          title: currentTitle,
          text: currentNote,
        });
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post('https://cloud-file-storage-backend.vercel.app/api/notes', {
          title: currentTitle,
          text: currentNote,
        });
      }
      setCurrentTitle('');
      setCurrentNote('');
      fetchNotes(); // Fetch the latest notes after save
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit a note
  const editNote = (id, title, text) => {
    setCurrentTitle(title);
    setCurrentNote(text);
    setIsEditing(true);
    setEditId(id);
  };

  // Trigger modal for deleting a note
  const triggerDeleteModal = (note) => {
    setNoteToDelete(note);
    setShowModal(true);
  };

  // Confirm deletion of a note
  const deleteNote = async () => {
    setDeleting(true); // Set deleting to true when starting deletion
    try {
      await axios.delete(`https://cloud-file-storage-backend.vercel.app/api/notes/${noteToDelete._id}`);
      setShowModal(false);
      setNoteToDelete(null);
      fetchNotes(); // Fetch the latest notes after delete
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setDeleting(false); // Reset deleting state
    }
  };

  // Helper function to truncate note text
  const truncateText = (text, maxLength) => {
    if (text) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
    } return text;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-6xl w-full relative">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Notepad</h1>

        <input
          type="text"
          className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 mb-4 focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-200"
          value={currentTitle}
          onChange={(e) => handleChange(e, setCurrentTitle)}
          placeholder="Title"
        />

        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-200"
          value={currentNote}
          onChange={(e) => handleChange(e, setCurrentNote)}
          placeholder="Write your note here..."
        />

        <button
          onClick={saveNote}
          className={`mt-4 w-full py-3 rounded-lg text-lg font-semibold text-white ${isEditing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-500 hover:bg-blue-600'
            } transition duration-200`}
          disabled={loading}
        >
          {loading ? (
            <span className="loader inline-block w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : isEditing ? (
            'Update Note'
          ) : (
            'Save Note'
          )}
        </button>

        <div className="mt-10">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes available.</p>
          ) : (
            <ul>
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="bg-gray-100 p-4 rounded-lg mb-4 shadow flex flex-col"
                >
                  <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
                  <p className="text-gray-700 mt-2">
                    {truncateText(note.text, 100)} {/* Adjust maxLength as needed */}
                  </p>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => editNote(note._id, note.title, note.text)}
                      className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center space-x-2"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => triggerDeleteModal(note)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 flex items-center space-x-2"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal for deleting a note */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this note?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={deleteNote}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                disabled={deleting} // Disable button while deleting
              >
                {deleting ? (
                  <span className="loader inline-block w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></span>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notepad;
