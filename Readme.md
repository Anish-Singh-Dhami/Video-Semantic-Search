# 🎥 Intent-Based Video Navigator (Semantic Search for Video)

> A backend-first system that lets users *query inside videos* using natural language — like  
> “Show me where the speaker explains gradient descent.”  
> or “Jump to the part where the demo starts.”

This project aims to make long-form videos instantly searchable and interactive using **semantic understanding**, **vector search**, and **AI embeddings** — all built using **free cloud-first tools** (no credit card required).



## 🚀 Current Goal (Milestone 1)

We’re building the backend that supports **semantic search inside videos**:
- Upload a video or provide a URL.
- Extract and segment its transcript.
- Generate embeddings via **Hugging Face Inference API**.
- Store vectors + metadata in a **cloud vector database** (like Qdrant Cloud).
- Query text like _“where does the speaker talk about backpropagation?”_ to get relevant video timestamps.

## 🧠 System Overview

**User Flow:**
1. User uploads or links a video.  
2. Server extracts audio and sends it to Whisper for transcription.  
3. Transcript text is chunked into smaller segments.  
4. Each segment is embedded using Hugging Face Inference API.  
5. Embeddings and metadata (timestamps, videoId) are stored in Qdrant.  
6. User sends a query like *"where is gradient descent explained?"*.  
7. Query is embedded and matched against stored segments.  
8. Server returns timestamps and snippet text to frontend.

## 📁 Folder Structure

```
backend/
├── src/
│ ├── index.ts # Express server entry
│ ├── routes/
│ │ ├── video.routes.ts # Upload & status APIs
│ │ └── search.routes.ts # Query API
│ ├── controllers/
│ │ └── video.controller.ts
│ ├── services/
│ │ ├── whisper.service.ts # Whisper ASR logic
│ │ ├── embed.service.ts # Hugging Face embedding service
│ │ ├── vector.service.ts # Qdrant client logic
│ │ └── storage.service.ts # Cloudflare R2 integration
│ ├── utils/
│ │ ├── extractAudio.ts
│ │ └── chunkText.ts
│ ├── config/
│ │ ├── qdrant.ts
├── .env
├── package.json
└── README.md
```

<!-- TODO -->
<!-- ## 🧠 System Architecture 
![System Architecture](https://img-service-provider/architecture.png) -->

## ⚙️ API Endpoints

### 1️⃣ Health Check

**GET** `/api/health`  
- Response:

```json
{ "status": "ok", "message": "Server running" }
```

### 2️⃣ Upload Video

**POST** /api/upload-video
multipart/form-data with a file field.
- Flow:
    - Save file locally.
    - Extract audio via ffmpeg.
    - Transcribe with Whisper.
    - Embed transcript chunks and store in Qdrant.

- Response:

```json
{
  "videoId": "abc123",
  "message": "Video uploaded and indexed",
  "summary": "First few words of transcript..."
}
``` 

### 3️⃣ Semantic Search

**GET** /api/search?videoId=<id>&q=<query>
- Returns timestamped transcript segments matching the query.
- Response:

```json
{
  "videoId": "abc123",
  "query": "explain gradient descent",
  "results": [
    { "startTime": 123.4, "endTime": 150.0, "text": "...", "score": 0.92 },
    { "startTime": 210.0, "endTime": 240.0, "text": "...", "score": 0.89 }
  ]
}
```

## 🧩 Setup Instructions

### 1. Clone & Install

[repo_url](https://github.com/Anish-Singh-Dhami/Video-Semantic-Search.git)
```bash
git clone <repo_url>
cd backend
npm install
```

### 2. Configure Environment Variables

Create .env file at the root level and fill with your api keys:

```bash
PORT=5000

HF_API_KEY=hf_xxx
QDRANT_API_KEY=your_api_key
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
MONGO_URI=mongodb+srv://...

HF_AUTOMATIC_SPEECH_RECOGNITION_API_URL=https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3
HF_FEATURE_EXTRACTION_API_URL=https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction
QDRANT_URL=https://your-instance.qdrant.tech
R2_BUCKET_NAME=video-storage
```

### 3. Start Server
```bash
npm run dev
```

### 4. Test in Postman
**GET** /api/health  
**POST** /api/upload-video  
**GET** /api/search?videoId=abc123&q=your+query  
