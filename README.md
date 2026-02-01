---
title: K-Recipe2Vec API
emoji: 🍳
colorFrom: yellow
colorTo: red
sdk: docker
pinned: false
app_port: 7860
---

# 🍳 K-Recipe2Vec (Monorepo)

이 리포지토리는 백엔드 API와 프론트엔드 웹사이트를 포함하는 모노레포입니다.

- **Frontend**: [Github Pages](https://nneans.github.io/k-recipe2vec/)
- **Backend API**: [Hugging Face Space](https://huggingface.co/spaces/nneans/k-recipe2vec)

## 📁 Structure

- `backend/`: FastAPI 기반 AI 모델 API
- `web/`: React 기반 웹 프론트엔드

## 🚀 Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn src.api:app --reload
```

### Frontend

```bash
cd web
npm install
npm run dev
```
