
# Sentimental Diary Web App

This is a personal diary platform that leverages a React-based interface and a Flask-powered backend, with MongoDB Atlas as the database solution.

---

## Overview

The application allows users to write daily notes and receive instant feedback on the emotional tone and sentiment of their entries, thanks to integrated machine learning models. A calendar feature helps users browse past entries with ease.

---

## Requirements

- Python 3.x
- Node.js (with npm)
- A MongoDB Atlas account

---

## MongoDB Atlas Configuration

1. **Register for MongoDB Atlas:**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account.

2. **Set Up a Cluster:**
   - Click "Build a Cluster", select the free tier, and choose your preferred settings.

3. **Add a Database User:**
   - Under "Database Access", add a new user with a username and password (save these for later). Assign the "Atlas Admin" role.

4. **Obtain the Connection URI:**
   - In "Clusters", click "Connect" > "Connect your application" and copy the provided URI, e.g.:
     ```
     mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/test?retryWrites=true&w=majority
     ```

5. **Create Your Database and Collection:**
   - Go to "Collections", click "Add My Own Data", and use `Diary` for the database and `Daily Notes` for the collection.

---

## Backend Setup

1. **Get the Code:**
   ```sh
   git clone https://github.com/Vedesh25/Sentimental-Diary
   cd Sentimental Diary
   ```

2. **Set Up a Python Virtual Environment:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Go to the Backend Folder:**
   ```sh
   cd mini-proj-2-backend
   ```

4. **Install Python Packages:**
   ```sh
   pip install -r requirements.txt
   ```

5. **Add Configuration:**
   - Make a file named `local_config.py` in the backend directory with:
     ```python
     MONGODB_CLUSTER = "<cluster-url>"
     MONGODB_USER = "<username>"
     MONGODB_PASSWORD = "<password>"
     APP_NAME = "DiaryApp"
     ```

6. **Start the Backend Server:**
   ```sh
   python server.py
   ```

---

## Frontend Setup

1. **Switch to the Frontend Directory:**
   ```sh
   cd mini-proj-2-frontend
   ```

2. **Install Node Modules:**
   ```sh
   npm install
   ```

3. **Launch the Frontend:**
   ```sh
   npm run dev
   ```

4. **Access the App:**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)

---

## Notes

- Make sure to keep your MongoDB credentials secure.
- For any issues, check the logs in both backend and frontend terminals.

---

## License

This project is for educational and personal use.


