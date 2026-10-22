# 🚀 Terra Connect - Complete Setup & Run Guide

This project has three independent services that communicate with each other:
- **Backend** (Node/Express) on `http://localhost:4000`
- **Frontend** (React) on `http://localhost:3000`
- **ML Models** (Flask/TensorFlow) on `http://localhost:5001`

---

## 📋 Prerequisites

You need the following installed on your system:

1. **Node.js** (v16+) - [Download](https://nodejs.org)
2. **Python** (3.8+) - [Download](https://www.python.org)
3. **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
4. **Git** (optional)

### Verify installations:
```powershell
node --version
npm --version
python --version
```

---

## 🔧 Step 1: Set Up Backend

### 1.1 Navigate to backend folder
```powershell
cd C:\Users\hrith\Desktop\Smart-AgroConnect\Smart-AgroConnect\backend
```

### 1.2 Install dependencies
```powershell
npm install
```

### 1.3 Create `.env` file
Copy `.env.example` from the root directory and paste it in the `backend/` folder as `.env`:

```powershell
# Create .env in backend folder
cp ..\.env.example .env
```

Then edit `backend/.env` with your actual values:
- `MONGODB_URI` - Your MongoDB connection string (local or Atlas)
- `GROQ_API_KEY` - Get from https://console.groq.com
- (Optional) `CLOUDINARY_*`, `EMAIL_*`, `OPENAI_API_KEY`

**Minimum required for local dev:**
```
MONGODB_URI=mongodb://localhost:27017/smart-agroconnect
JWT_SECRET=dev_secret_key_12345
GROQ_API_KEY=your_groq_key_here
```

### 1.4 Start the backend server
```powershell
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:4000
```

**Test backend:**
```powershell
curl http://localhost:4000/api/health
# Should respond: {"status":"Server is running"}
```

---

## 🎨 Step 2: Set Up Frontend

### 2.1 Open a **new terminal** and navigate to frontend folder
```powershell
cd C:\Users\hrith\Desktop\Smart-AgroConnect\Smart-AgroConnect\frontend
```

### 2.2 Install dependencies
```powershell
npm install
```

### 2.3 Start the development server
```powershell
npm start
```

You should see:
```
Compiled successfully!

You can now view smart-agroconnect-client in the browser.
Local:            http://localhost:3000
```

The browser should automatically open at `http://localhost:3000`.

**Note:** The frontend is configured to proxy API requests to the backend at `http://localhost:4000` (see `package.json` → `"proxy"` field).

---

## 🧠 Step 3: Set Up ML Models (Pest Detection)

### 3.1 Open a **third terminal** and navigate to ml-models folder
```powershell
cd C:\Users\hrith\Desktop\Smart-AgroConnect\Smart-AgroConnect\ml-models
```

### 3.2 Create a Python virtual environment
```powershell
python -m venv .venv
```

### 3.3 Activate the virtual environment
```powershell
.\.venv\Scripts\Activate.ps1
```

You should see `(.venv)` at the start of your terminal prompt.

### 3.4 Install Python dependencies
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

This installs:
- `Flask` - Web framework
- `tensorflow` - ML framework
- `numpy` - Numerical computing
- `pillow` - Image processing

### 3.5 Verify model files exist
Check that these files are present:
- `ml-models/static/model/plant_disease_model.keras`
- `ml-models/static/model/classes.json`

If missing, you need to train the model using `ml-models/train.py`:
```powershell
python train.py
```

### 3.6 Start the Flask service
```powershell
python app.py
```

You should see:
```
✅ Model & classes loaded
 * Running on http://0.0.0.0:5001
```

---

## ✅ Verify Everything is Running

Once all three services are started, you should have:

| Service | URL | Command |
|---------|-----|---------|
| Backend | http://localhost:4000/api/health | `npm start` |
| Frontend | http://localhost:3000 | `npm start` |
| ML Models | http://localhost:5001/api/predict | `python app.py` |

**Quick test commands:**
```powershell
# Backend health check
curl http://localhost:4000/api/health

# Frontend (open browser)
start http://localhost:3000

# ML service (test with image upload)
# Use the frontend UI or:
# curl -X POST http://localhost:5001/api/predict -F "image=@path/to/image.jpg"
```

---

## 🔗 How Services Communicate

```
Browser → Frontend (React @ :3000)
  ↓ (API calls proxied to :4000)
Backend (Express @ :4000)
  ↓ (Pest detection requests @ :5001)
ML Models (Flask @ :5001)
  ↓ (Prediction response)
Backend → Frontend
```

---

## 🛑 Stopping the Services

To stop any service, press `Ctrl+C` in the terminal where it's running.

To stop the MongoDB server (if local):
- **Windows**: Stop the MongoDB service via Services app, or kill via Task Manager
- **macOS/Linux**: `brew services stop mongodb-community` or kill the process

---

## 🚨 Troubleshooting

### Backend Issues

**Error: `MONGODB_URI not set`**
- Create/check `backend/.env` file has `MONGODB_URI=...`

**Error: `Connection refused` on MongoDB**
- Make sure MongoDB is running: `mongod` (or start MongoDB service)
- Or use MongoDB Atlas cloud: Update `MONGODB_URI` to your Atlas connection string

**Error: `Cannot find module 'groq-sdk'`**
- Run `npm install` in backend folder

---

### Frontend Issues

**Error: `Port 3000 already in use`**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or start on different port
PORT=3001 npm start
```

**API calls failing**
- Ensure backend is running on `:4000`
- Check `frontend/package.json` → `proxy` field is correct

---

### ML Models Issues

**Error: `Module 'tensorflow' not found`**
- Activate venv: `.\.venv\Scripts\Activate.ps1`
- Reinstall: `pip install -r requirements.txt`

**Error: `plant_disease_model.keras not found`**
- Model must be trained first: `python train.py`
- Or download pre-trained model from cloud storage

**Port 5001 already in use**
```powershell
# Kill process on port 5001
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

---

## 📚 Project Structure

```
Smart-AgroConnect/
├── backend/              (Node/Express server)
│   ├── server.js        (Main entry point)
│   ├── controllers/      (API logic)
│   ├── routes/          (API endpoints)
│   ├── models/          (MongoDB schemas)
│   └── package.json
├── frontend/            (React app)
│   ├── src/
│   ├── public/
│   └── package.json
├── ml-models/           (Flask/TensorFlow service)
│   ├── app.py          (Main Flask app)
│   ├── train.py        (Model training script)
│   ├── static/model/   (Model files)
│   └── requirements.txt
└── .env.example         (Copy to backend/.env)
```

---

## 🔑 Environment Variables Reference

See `.env.example` for all available environment variables:

**Critical for development:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GROQ_API_KEY` - Groq AI API key (for chatbot)

**Optional:**
- `PORT` - Backend port (default: 4000)
- `CLIENT_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `CLOUDINARY_*` - For image uploads
- `EMAIL_*` - For email notifications
- `OPENAI_API_KEY` - Alternative AI provider

---

## 🎯 Next Steps

1. ✅ All services running? Open http://localhost:3000 in your browser
2. Create an account or login
3. Test features:
   - **Pest Detection**: Upload a crop image
   - **Weather**: Check weather data
   - **Market Prices**: View commodity prices
   - **Chatbot**: Ask agricultural questions
   - **Forum**: Create posts and discussions

---

## 📞 Support

For issues or questions:
- Check [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for recent changes
- Review error messages in terminal output
- Check MongoDB connection string
- Ensure all ports (3000, 4000, 5001) are available

Happy farming! 🌾

