# Collaborative Code Editor with Real-time Sync

This project is a collaborative code editor that allows multiple users to write and edit code in real-time. It also includes features like chat, code synchronization, and real-time updates.

## Technologies Used

- **Frontend:**
  - React.js for building the user interface.
  - Socket.io-client for handling real-time communication.
  - react-hot-toast for displaying toast notifications.
  - react-router-dom for client-side routing.

- **Backend:**
  - Node.js with Express for the server.
  - Socket.io for real-time communication between clients.
  - axios for making HTTP requests to an external API.

## How it Works

1. **Real-time Collaboration:**
   - Users can join a shared coding room using a unique Room ID.
   - Each user has their own code editor, and changes are synchronized in real-time with other users in the same room.

2. **User Interaction:**
   - Users can see a list of connected clients (users) in the sidebar.
   - Real-time updates for user join/leave events and chat messages are displayed using toast notifications.

3. **Code Execution:**
   - The code entered by users can be executed using an external API (Glot.io).
   - The API is called when users run the code, and the output is synchronized with other users in the same room.

4. **Dynamic Room Creation:**
   - Users can create or join different rooms using unique Room IDs.
   - Room IDs can be copied to the clipboard for easy sharing.

## How to Run

1. **Install Dependencies:**
   ```bash
   # Install dependencies for both frontend and backend
   npm install
