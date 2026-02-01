from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os
import pandas as pd
import numpy as np
import threading

# 같은 폴더의 logic.py 임포트를 위해 경로 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import logic

app = FastAPI(title="K-Recipe2Vec API")

# CORS 설정
# CORS 설정 (보안 강화: 배포된 도메인만 허용, localhost 차단)
origins = [
    "https://nneans.github.io",
    "https://k-recipe2vec.vercel.app",
    "https://huggingface.co",
    "https://nneans-k-recipe2vec.hf.space"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request Models ---
class IngredientRequest(BaseModel):
    recipe_id: int
    target: List[str]
    stopwords: List[str] = []
    w_w2v: float = 0.5
    w_d2v: float = 0.5
    w_method: float = 0.0
    w_cat: float = 0.0

class CustomContextRequest(BaseModel):
    context_ings: List[str]
    target: List[str]
    stopwords: List[str] = []
    w_w2v: float = 0.5
    w_d2v: float = 0.5
    excluded: List[str] = []

# --- Startup ---
@app.on_event("startup")
def startup_event():
    # 백그라운드 스레드에서 모델 로딩 시작 (앱 시작을 막지 않음)
    threading.Thread(target=logic.load_resources).start()

# --- 불용어 캐시 및 필터링 ---
_stopwords_cache = None

def get_stopwords():
    """불용어 목록을 캐시하여 반환"""
    global _stopwords_cache
    if _stopwords_cache is None:
        try:
            _stopwords_cache = set(logic.load_global_stopwords())
        except:
            _stopwords_cache = set()
    return _stopwords_cache

# 긴급 필터링을 위한 수동 불용어 목록
MANUAL_STOPWORDS = {
    "썰은", "쪽파나", "등", "약간", "적당량", "반개", "한개", "두개", 
    "개", "마리", "장", "모두", "다진", "채썬", "갈은", "물", "소금", 
    "참기름", "식용유", "후추"
}

def filter_ingredients(ingredients_list):
    """재료 목록에서 불용어(DB + 수동) 제거"""
    stopwords = get_stopwords()
    
    # 1. DB 불용어 필터링
    filtered = ingredients_list
    if stopwords:
        filtered = [ing for ing in filtered if ing not in stopwords]
    
    # 2. 수동 불용어 필터링 (긴급 조치)
    final_list = []
    for ing in filtered:
        # 정확히 일치하거나, 수동 불용어가 포함된 경우(선택적) 제외
        # 여기서는 정확히 일치하는 경우만 제거 (혹은 '쪽파나' 처럼 끝에 조사가 붙은 경우도 고려 가능하지만 보수적으로 접근)
        if ing not in MANUAL_STOPWORDS:
            final_list.append(ing)
            
    return final_list

# --- Endpoints ---

@app.get("/")
def health_check():
    # 모델 로딩 상태 확인
    status = "loading" if logic.df is None else "ok"
    return {"status": status, "service": "K-Recipe2Vec API"}

@app.get("/recipes")
def list_recipes(limit: int = 50, offset: int = 0):
    """전체 레시피 목록 조회 (페이지네이션)"""
    logic.ensure_initialized()
    
    try:
        total = len(logic.df)
        subset = logic.df.iloc[offset:offset+limit][['레시피일련번호', '요리명', '재료토큰', '요리방법별명', '요리종류별명_세분화']]
        
        output = []
        for _, row in subset.iterrows():
            output.append({
                "id": int(row['레시피일련번호']),
                "name": row['요리명'],
                "ingredients": filter_ingredients(row['재료토큰']),
                "method": row['요리방법별명'],
                "category": row['요리종류별명_세분화']
            })
        return {"total": total, "recipes": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recipes/search")
def search_recipes(q: str):
    """요리명으로 레시피 검색"""
    logic.ensure_initialized() # 로딩 대기
    
    if not q: return []
    try:
        mask = logic.df['요리명'].str.contains(q, case=False, na=False)
        results = logic.df.loc[mask, ['레시피일련번호', '요리명', '재료토큰']].head(20)
        
        output = []
        for _, row in results.iterrows():
            output.append({
                "id": int(row['레시피일련번호']),
                "name": row['요리명'],
                "ingredients": filter_ingredients(row['재료토큰'])
            })
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recipes/{recipe_id}")
def get_recipe_detail(recipe_id: int):
    """레시피 상세 정보 조회"""
    logic.ensure_initialized() # 로딩 대기
    
    try:
        row = logic.df[logic.df['레시피일련번호'] == recipe_id]
        if row.empty:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        row = row.iloc[0]
        return {
            "id": int(row['레시피일련번호']),
            "name": row['요리명'],
            "method": row['요리방법별명'],
            "category": row['요리종류별명_세분화'],
            "ingredients": filter_ingredients(row['재료토큰'])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/db/single")
def recommend_db_single(req: IngredientRequest):
    """DB 레시피 기반 단일 재료 대체"""
    logic.ensure_initialized() # 로딩 대기
    
    if not req.target:
        raise HTTPException(status_code=400, detail="Target ingredient required")
    try:
        df = logic.substitute_single(
            req.recipe_id, req.target[0], req.stopwords,
            req.w_w2v, req.w_d2v, req.w_method, req.w_cat
        )
        if df.empty: return []
        df = df.replace([np.inf, -np.inf], 0).fillna(0)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/db/multi")
def recommend_db_multi(req: IngredientRequest):
    """DB 레시피 기반 다중 재료 대체"""
    logic.ensure_initialized() # 로딩 대기
    
    try:
        results = logic.substitute_multi(
            req.recipe_id, req.target, req.stopwords,
            req.w_w2v, req.w_d2v, req.w_method, req.w_cat
        )
        formatted = []
        for subs, score, saving in results:
            formatted.append({
                "substitutes": subs,
                "score": float(score),
                "saving_score": int(saving)
            })
        return formatted
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/custom/single")
def recommend_custom_single(req: CustomContextRequest):
    """사용자 정의 재료 기반 단일 대체"""
    logic.ensure_initialized() # 로딩 대기

    if not req.target:
        raise HTTPException(status_code=400, detail="Target ingredient required")
    try:
        df = logic.substitute_single_custom(
            req.target[0], req.context_ings, req.stopwords,
            req.w_w2v, req.w_d2v, excluded_ings=req.excluded
        )
        if df.empty: return []
        df = df.replace([np.inf, -np.inf], 0).fillna(0)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
