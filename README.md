# 🍳 K-Recipe2Vec

AI 기반 한식 식재료 대체 추천 서비스

## 📖 Overview

한국 요리에서 식재료를 대체할 수 있는 재료를 AI가 추천해주는 웹 서비스입니다.  
Doc2Vec과 Word2Vec 모델을 활용하여 식재료 간의 의미적 유사도를 분석합니다.

## 🔗 Demo

🚀 **[Live Demo](https://korea-recipe-ai.streamlit.app/)** - Streamlit Cloud 배포

## ✨ Features

- **🥬 식재료 대체 추천**: 없는 재료에 대한 유사 재료 추천
- **📊 3D 시각화**: PCA 기반 재료 벡터 공간 시각화
- **💰 가격 정보**: 재료별 가격 정보 제공
- **☁️ 워드클라우드**: 추천 재료 시각화

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Streamlit |
| **ML Models** | Gensim (Doc2Vec, Word2Vec) |
| **Data Processing** | Pandas, NumPy |
| **Visualization** | Plotly, Matplotlib, WordCloud |
| **Database** | Supabase |
| **Deployment** | Streamlit Cloud |

## 📁 Project Structure

```
k-recipe2vec/
├── app.py              # Main Streamlit application
├── logic.py            # Core recommendation logic (if exists)
├── requirements.txt    # Python dependencies
├── d2v.model          # Doc2Vec trained model
├── w2v.model          # Word2Vec trained model
├── price_rank.csv     # Price data
└── stats.pkl          # Preprocessed statistics
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/nneans/k-recipe2vec.git
cd k-recipe2vec

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run src/app.py
```

## 📊 Model Information

### Doc2Vec Model
- 한국 레시피 데이터 기반 학습
- 레시피 단위 문서 임베딩

### Word2Vec Model
- 식재료 간 의미적 유사도 학습
- 대체 가능한 재료 추천에 활용

## 🤝 Contributing

버그 리포트, 기능 제안, PR 환영합니다!

## 📝 License

MIT License

## 👤 Author

**Mingyun Kang**
- GitHub: [@nneans](https://github.com/nneans)
