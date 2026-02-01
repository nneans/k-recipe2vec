import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const healthCheck = async () => {
    try {
        const res = await api.get('/');
        return res.data;
    } catch (error) {
        console.error("Health check failed:", error);
        return null;
    }
};

// 전체 레시피 목록 조회 (페이지네이션)
export const listRecipes = async (limit = 50, offset = 0) => {
    try {
        const res = await api.get('/recipes', { params: { limit, offset } });
        return res.data;
    } catch (error) {
        console.error("List recipes failed:", error);
        return { total: 0, recipes: [] };
    }
};

export const searchRecipes = async (query) => {
    try {
        const res = await api.get('/recipes/search', { params: { q: query } });
        return res.data;
    } catch (error) {
        console.error("Recipe search failed:", error);
        return [];
    }
};

export const getRecipeDetail = async (id) => {
    try {
        const res = await api.get(`/recipes/${id}`);
        return res.data;
    } catch (error) {
        console.error("Get recipe detail failed:", error);
        return null;
    }
};

// 단일 재료 대체 추천
export const recommendDbSingle = async (recipeId, target, w2v = 0.5, d2v = 0.5, method = 0.0, cat = 0.0) => {
    try {
        const res = await api.post('/recommend/db/single', {
            recipe_id: recipeId,
            target: [target],
            stopwords: [],
            w_w2v: w2v,
            w_d2v: d2v,
            w_method: method,
            w_cat: cat
        });
        return res.data;
    } catch (error) {
        console.error("DB Single Rec failed:", error);
        return [];
    }
};

// 다중 재료 대체 추천
export const recommendDbMulti = async (recipeId, targets, w2v = 0.5, d2v = 0.5, method = 0.0, cat = 0.0) => {
    try {
        const res = await api.post('/recommend/db/multi', {
            recipe_id: recipeId,
            target: targets,
            stopwords: [],
            w_w2v: w2v,
            w_d2v: d2v,
            w_method: method,
            w_cat: cat
        });
        return res.data;
    } catch (error) {
        console.error("DB Multi Rec failed:", error);
        return [];
    }
};

// Custom recommendation (사용자 정의 재료)
export const recommendCustomSingle = async (target, contextIngs) => {
    try {
        const res = await api.post('/recommend/custom/single', {
            context_ings: contextIngs,
            target: [target],
            stopwords: [],
            excluded: []
        });
        return res.data;
    } catch (error) {
        return [];
    }
};

export default api;
