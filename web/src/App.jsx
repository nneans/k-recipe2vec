import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { searchRecipes, listRecipes, recommendDbSingle, recommendDbMulti } from './services/api'
import { Search, Github, ArrowLeft, Utensils, Sparkles, SlidersHorizontal, HelpCircle, Zap, BookOpen, ChevronDown, ChevronUp, Check, X, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// =========================
// 🎨 스타일 정의
// =========================

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Header = styled.header`
  margin-bottom: 2rem;
  cursor: pointer;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-top: 0.5rem;
`

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    border-radius: 16px;
  }
`

const SectionTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 1rem 0;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
`

const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 3rem 0.9rem 1rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`

const SearchBtn = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: #3b82f6;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #2563eb;
  }
`

const RecipeList = styled.div`
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
`

const RecipeItem = styled(motion.div)`
  background: ${props => props.selected ? '#eff6ff' : '#f8fafc'};
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 2px solid ${props => props.selected ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`

const RecipeId = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
`

const IngredientGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`

const IngredientChip = styled.button`
  background: ${props => props.selected ? '#3b82f6' : '#f1f5f9'};
  color: ${props => props.selected ? 'white' : '#475569'};
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${props => props.selected ? '#2563eb' : '#e2e8f0'};
  }
`

const ActionButton = styled.button`
  width: 100%;
  margin-top: 1.2rem;
  padding: 0.9rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`

const SliderContainer = styled.div`
  margin-top: 1.2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
`

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const SliderLabel = styled.div`
  min-width: 100px;
  font-size: 0.85rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 4px;
`

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 5px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
  }
`

const SliderValue = styled.span`
  min-width: 35px;
  text-align: right;
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.9rem;
`

const ResultCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.2rem;
  margin-bottom: 0.8rem;
`

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`

const ResultName = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
`

const ScoreBadge = styled.span`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
`

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.8rem;
  margin-top: 0.8rem;
`

const CompactResultCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }
`

const CompactHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MedalIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 4px;
`

const ScoreBarMini = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 0.5rem;
`

const ScoreSegment = styled.div`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: ${props => props.color};
  opacity: ${props => props.value > 0.3 ? 1 : 0.3};
`

const TabPills = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`

const TabPill = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 2px solid ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  background: ${props => props.active ? '#eff6ff' : 'white'};
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
  }
`

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
`

const ScoreLabel = styled.span`
  min-width: 90px;
  font-size: 0.8rem;
  color: #64748b;
`

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color || '#3b82f6'};
  width: ${props => props.value}%;
  transition: width 0.5s ease;
`

const Tooltip = styled.div`
  position: relative;
  display: inline-flex;
  cursor: help;
  
  &:hover > div {
    display: block;
  }
`

const TooltipContent = styled.div`
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 100;
  margin-bottom: 4px;
`

const InfoBox = styled.div`
  background: ${props => props.variant === 'purple' ? '#f5f3ff' : '#eff6ff'};
  border-left: 4px solid ${props => props.variant === 'purple' ? '#8b5cf6' : '#3b82f6'};
  padding: 1rem;
  border-radius: 0 10px 10px 0;
  margin: 0.8rem 0;
  font-size: 0.85rem;
  color: ${props => props.variant === 'purple' ? '#5b21b6' : '#1e40af'};
  line-height: 1.6;
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

const LoadingText = styled.span`
  animation: ${pulse} 1.5s ease-in-out infinite;
`

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: #3b82f6;
  }
`

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`

const HomeButton = styled.button`
  background: #f1f5f9;
  border: none;
  padding: 0.5rem 0.8rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 8px;
  
  &:hover {
    background: #e2e8f0;
    color: #3b82f6;
  }
`

const ToggleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem 0;
`

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const Tab = styled.button`
  flex: 1;
  padding: 0.7rem;
  border-radius: 10px;
  border: 2px solid ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  background: ${props => props.active ? '#eff6ff' : 'white'};
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
  }
`

const MultiResultSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`

const TargetLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
`

// =========================
// 🧠 메인 앱 컴포넌트
// =========================

function App() {
  const [step, setStep] = useState('main') // main, detail, result
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [allRecipes, setAllRecipes] = useState([])
  const [totalRecipes, setTotalRecipes] = useState(0)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [selectedIngs, setSelectedIngs] = useState([]) // 다중 선택
  const [recommendations, setRecommendations] = useState([])
  const [multiRecommendations, setMultiRecommendations] = useState([]) // 다중 대체 조합 결과
  const [loading, setLoading] = useState(false)
  const [showWeights, setShowWeights] = useState(false)
  const [showAlgorithm, setShowAlgorithm] = useState(false)
  const [activeTab, setActiveTab] = useState('search') // search, browse
  const [activeResultTab, setActiveResultTab] = useState(0) // 다중 재료 결과 탭
  const [expandedCard, setExpandedCard] = useState(null) // 점수 상세 보기

  // 가중치 상태
  const [weights, setWeights] = useState({
    w2v: 0.5,
    d2v: 0.5,
    method: 0.0,
    cat: 0.0
  })

  useEffect(() => {
    // 초기 레시피 목록 로드
    listRecipes(30, 0).then(res => {
      setAllRecipes(res.recipes || [])
      setTotalRecipes(res.total || 0)
    })
  }, [])

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    const res = await searchRecipes(query)
    setSearchResults(res)
    setLoading(false)
  }

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe)
    setStep('detail')
    setSelectedIngs([])
    setRecommendations([])
    setMultiRecommendations([])
  }

  const toggleIngredient = (ing) => {
    if (selectedIngs.includes(ing)) {
      setSelectedIngs(selectedIngs.filter(i => i !== ing))
    } else {
      setSelectedIngs([...selectedIngs, ing])
    }
  }

  const handleRecommend = async () => {
    if (!selectedRecipe || selectedIngs.length === 0) return
    setLoading(true)

    if (selectedIngs.length === 1) {
      // 단일 추천
      const res = await recommendDbSingle(
        selectedRecipe.id,
        selectedIngs[0],
        weights.w2v,
        weights.d2v,
        weights.method,
        weights.cat
      )
      setRecommendations(res)
      setMultiRecommendations([])
    } else {
      // 다중 추천 - Beam Search 기반 Multi API 사용
      const res = await recommendDbMulti(
        selectedRecipe.id,
        selectedIngs,
        weights.w2v,
        weights.d2v,
        weights.method,
        weights.cat
      )
      setMultiRecommendations(res)
      setRecommendations([])
    }

    setLoading(false)
    setStep('result')
  }

  const goBack = () => {
    if (step === 'result') setStep('detail')
    else if (step === 'detail') setStep('main')
  }

  const resetAll = () => {
    setStep('main')
    setSearchResults([])
    setQuery('')
    setSelectedRecipe(null)
    setSelectedIngs([])
    setRecommendations([])
    setMultiRecommendations([])
  }

  const loadMoreRecipes = async () => {
    const res = await listRecipes(30, allRecipes.length)
    setAllRecipes([...allRecipes, ...(res.recipes || [])])
  }

  return (
    <Container>
      <Header onClick={resetAll}>
        <Title>
          <span style={{ color: '#24292e', fontWeight: '800' }}>
            K-Recipe2Vec
          </span>
        </Title>
        <Subtitle>Data-Driven Ingredient Substitution for Korean Cuisine</Subtitle>
      </Header>

      <AnimatePresence mode="wait">
        {/* ========== 메인 화면 ========== */}
        {step === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* 알고리즘 설명 섹션 */}
            <Card>
              <ToggleHeader onClick={() => setShowAlgorithm(!showAlgorithm)}>
                <SectionTitle style={{ margin: 0 }}>
                  <BookOpen size={16} /> 이 서비스는 어떻게 작동하나요?
                </SectionTitle>
                {showAlgorithm ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </ToggleHeader>

              {showAlgorithm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <InfoBox variant="purple" style={{ marginTop: '1rem' }}>
                    <strong>🧠 K-Recipe2Vec이란?</strong><br />
                    약 8만개의 한식 레시피 데이터를 기반으로 학습된 AI 모델입니다.
                    Word2Vec과 Doc2Vec을 활용하여 재료 간의 의미적 유사도와
                    레시피 문맥에서의 상호 대체 가능성을 분석합니다.
                  </InfoBox>

                  <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.8 }}>
                    <p><strong>📊 점수 구성 요소:</strong></p>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
                      <li><strong>재료 유사도 (W2V)</strong>: Word2Vec으로 학습한 재료 간 의미적 거리. 예) 돼지고기 ↔ 소고기</li>
                      <li><strong>문맥 유사도 (D2V)</strong>: Doc2Vec으로 학습한 레시피 문맥. 같은 요리에서 함께 쓰이는 빈도 반영</li>
                      <li><strong>조리법 적합 (Method)</strong>: 찜, 볶음, 구이 등 같은 조리법에서 자주 사용되는 정도</li>
                      <li><strong>카테고리 적합 (Category)</strong>: 찌개, 반찬 등 같은 요리 종류에서의 사용 빈도</li>
                    </ul>
                    <p style={{ marginTop: '0.8rem' }}>
                      ⚙️ <strong>고급 설정</strong>에서 각 점수의 가중치를 조절하여 원하는 방향으로 추천 결과를 커스터마이즈할 수 있습니다.
                    </p>
                  </div>
                </motion.div>
              )}
            </Card>

            {/* 레시피 선택 */}
            <Card>
              <TabContainer>
                <Tab active={activeTab === 'search'} onClick={() => setActiveTab('search')}>
                  <Search size={14} style={{ marginRight: 4 }} /> 요리명 검색
                </Tab>
                <Tab active={activeTab === 'browse'} onClick={() => setActiveTab('browse')}>
                  <Utensils size={14} style={{ marginRight: 4 }} /> 전체 레시피
                </Tab>
              </TabContainer>

              {activeTab === 'search' && (
                <>
                  <form onSubmit={handleSearch}>
                    <SearchBar>
                      <Input
                        placeholder="요리 이름 검색 (예: 김치찌개, 된장찌개)"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                      />
                      <SearchBtn type="submit">
                        <Search size={16} />
                      </SearchBtn>
                    </SearchBar>
                  </form>

                  <RecipeList>
                    {loading && <LoadingText style={{ textAlign: 'center', padding: '1rem' }}>🔍 검색 중...</LoadingText>}
                    {searchResults.map(recipe => (
                      <RecipeItem
                        key={recipe.id}
                        onClick={() => handleSelectRecipe(recipe)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Utensils size={16} color="#64748b" />
                          <span style={{ fontWeight: '600' }}>{recipe.name}</span>
                          <RecipeId>#{recipe.id}</RecipeId>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                          재료 {recipe.ingredients.length}개
                        </span>
                      </RecipeItem>
                    ))}
                    {searchResults.length === 0 && !loading && query && (
                      <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                        검색 결과가 없습니다
                      </div>
                    )}
                  </RecipeList>
                </>
              )}

              {activeTab === 'browse' && (
                <>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.8rem' }}>
                    전체 {totalRecipes.toLocaleString()}개 레시피 중 {allRecipes.length}개 표시
                  </div>
                  <RecipeList>
                    {allRecipes.map(recipe => (
                      <RecipeItem
                        key={recipe.id}
                        onClick={() => handleSelectRecipe(recipe)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <Utensils size={16} color="#64748b" />
                          <span style={{ fontWeight: '600' }}>{recipe.name}</span>
                          <RecipeId>#{recipe.id}</RecipeId>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                          재료 {recipe.ingredients.length}개
                        </span>
                      </RecipeItem>
                    ))}
                  </RecipeList>
                  {allRecipes.length < totalRecipes && (
                    <ActionButton
                      onClick={loadMoreRecipes}
                      style={{ marginTop: '1rem', background: '#64748b' }}
                    >
                      더 불러오기
                    </ActionButton>
                  )}
                </>
              )}
            </Card>
          </motion.div>
        )}

        {/* ========== 재료 선택 단계 ========== */}
        {step === 'detail' && selectedRecipe && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <NavButtons>
                <BackButton onClick={goBack}>
                  <ArrowLeft size={16} /> 뒤로
                </BackButton>
                <HomeButton onClick={resetAll}>
                  <Home size={16} /> 홈으로
                </HomeButton>
              </NavButtons>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.3rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
                  {selectedRecipe.name}
                </h2>
                <RecipeId>#{selectedRecipe.id}</RecipeId>
              </div>
              <p style={{ color: '#64748b', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                대체할 재료를 선택하세요 (여러 개 선택 가능)
              </p>

              <IngredientGrid>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <IngredientChip
                    key={idx}
                    selected={selectedIngs.includes(ing)}
                    onClick={() => toggleIngredient(ing)}
                  >
                    {selectedIngs.includes(ing) && <Check size={14} />}
                    {ing}
                  </IngredientChip>
                ))}
              </IngredientGrid>

              {selectedIngs.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    선택된 재료 ({selectedIngs.length}개):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedIngs.map((ing, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleIngredient(ing)}
                      >
                        {ing} <X size={12} />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 가중치 설정 */}
              <SliderContainer>
                <ToggleHeader onClick={() => setShowWeights(!showWeights)}>
                  <SectionTitle style={{ margin: 0 }}>
                    <SlidersHorizontal size={14} /> 고급 설정 (가중치 조절)
                  </SectionTitle>
                  {showWeights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </ToggleHeader>

                {showWeights && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: '0.8rem' }}
                  >
                    <SliderRow>
                      <SliderLabel>
                        <Tooltip>
                          <HelpCircle size={12} />
                          <TooltipContent>재료 간 의미적 유사도</TooltipContent>
                        </Tooltip>
                        재료 유사도
                      </SliderLabel>
                      <Slider
                        type="range" min="0" max="1" step="0.1"
                        value={weights.w2v}
                        onChange={e => setWeights({ ...weights, w2v: parseFloat(e.target.value) })}
                      />
                      <SliderValue>{weights.w2v.toFixed(1)}</SliderValue>
                    </SliderRow>
                    <SliderRow>
                      <SliderLabel>
                        <Tooltip>
                          <HelpCircle size={12} />
                          <TooltipContent>레시피 문맥 유사도</TooltipContent>
                        </Tooltip>
                        문맥 유사도
                      </SliderLabel>
                      <Slider
                        type="range" min="0" max="1" step="0.1"
                        value={weights.d2v}
                        onChange={e => setWeights({ ...weights, d2v: parseFloat(e.target.value) })}
                      />
                      <SliderValue>{weights.d2v.toFixed(1)}</SliderValue>
                    </SliderRow>
                    <SliderRow>
                      <SliderLabel>
                        <Tooltip>
                          <HelpCircle size={12} />
                          <TooltipContent>조리 방법 적합도</TooltipContent>
                        </Tooltip>
                        조리법 적합
                      </SliderLabel>
                      <Slider
                        type="range" min="0" max="1" step="0.1"
                        value={weights.method}
                        onChange={e => setWeights({ ...weights, method: parseFloat(e.target.value) })}
                      />
                      <SliderValue>{weights.method.toFixed(1)}</SliderValue>
                    </SliderRow>
                    <SliderRow>
                      <SliderLabel>
                        <Tooltip>
                          <HelpCircle size={12} />
                          <TooltipContent>요리 카테고리 적합도</TooltipContent>
                        </Tooltip>
                        카테고리 적합
                      </SliderLabel>
                      <Slider
                        type="range" min="0" max="1" step="0.1"
                        value={weights.cat}
                        onChange={e => setWeights({ ...weights, cat: parseFloat(e.target.value) })}
                      />
                      <SliderValue>{weights.cat.toFixed(1)}</SliderValue>
                    </SliderRow>
                  </motion.div>
                )}
              </SliderContainer>

              <ActionButton onClick={handleRecommend} disabled={selectedIngs.length === 0 || loading}>
                {loading ? (
                  <LoadingText>분석 중...</LoadingText>
                ) : (
                  <>
                    <Zap size={16} />
                    {selectedIngs.length > 0
                      ? `${selectedIngs.length}개 재료 대체 추천받기`
                      : '재료를 선택해주세요'}
                  </>
                )}
              </ActionButton>
            </Card>
          </motion.div>
        )}

        {/* ========== 결과 단계 ========== */}
        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <NavButtons>
                <BackButton onClick={goBack}>
                  <ArrowLeft size={16} /> 뒤로
                </BackButton>
                <HomeButton onClick={resetAll}>
                  <Home size={16} /> 홈으로
                </HomeButton>
              </NavButtons>

              <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.3rem 0' }}>
                <Sparkles color="#eab308" fill="#eab308" size={20} /> 이런 재료로 대체해보세요
              </h2>
              <p style={{ color: '#64748b', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
                <strong>{selectedRecipe.name}</strong> (#{selectedRecipe.id})
              </p>

              {/* 단일 재료 결과 - 그리드 레이아웃 */}
              {recommendations.length > 0 && (
                <>
                  <TargetLabel>
                    "{selectedIngs[0]}" → {expandedCard !== null && recommendations[expandedCard]
                      ? <span style={{ color: '#3b82f6', fontWeight: '600' }}>{recommendations[expandedCard]['대체재료']}</span>
                      : '대체 추천'}
                  </TargetLabel>
                  <ResultGrid>
                    {recommendations.map((rec, idx) => (
                      <CompactResultCard
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                      >
                        <CompactHeader>
                          <ResultName>
                            <MedalIcon>
                              {idx === 0 && '🥇'}
                              {idx === 1 && '🥈'}
                              {idx === 2 && '🥉'}
                              {idx > 2 && `${idx + 1}.`}
                            </MedalIcon>
                            {rec['대체재료']}
                          </ResultName>
                          <ScoreBadge>{(rec['최종점수'] * 100).toFixed(0)}점</ScoreBadge>
                        </CompactHeader>

                        <ScoreBarMini>
                          <ScoreSegment color="#3b82f6" value={rec['W2V'] || 0} title="W2V" />
                          <ScoreSegment color="#8b5cf6" value={rec['D2V'] || 0} title="D2V" />
                          <ScoreSegment color="#10b981" value={rec['Method'] || 0} title="Method" />
                          <ScoreSegment color="#f59e0b" value={rec['Category'] || 0} title="Category" />
                        </ScoreBarMini>

                        {expandedCard === idx && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #e2e8f0' }}
                          >
                            <ScoreRow>
                              <ScoreLabel>재료 유사도</ScoreLabel>
                              <ProgressBar><ProgressFill value={(rec['W2V'] || 0) * 100} color="#3b82f6" /></ProgressBar>
                              <span style={{ minWidth: '30px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
                                {((rec['W2V'] || 0) * 100).toFixed(0)}%
                              </span>
                            </ScoreRow>
                            <ScoreRow>
                              <ScoreLabel>문맥 유사도</ScoreLabel>
                              <ProgressBar><ProgressFill value={(rec['D2V'] || 0) * 100} color="#8b5cf6" /></ProgressBar>
                              <span style={{ minWidth: '30px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
                                {((rec['D2V'] || 0) * 100).toFixed(0)}%
                              </span>
                            </ScoreRow>
                            <ScoreRow>
                              <ScoreLabel>조리법 적합</ScoreLabel>
                              <ProgressBar><ProgressFill value={(rec['Method'] || 0) * 100} color="#10b981" /></ProgressBar>
                              <span style={{ minWidth: '30px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
                                {((rec['Method'] || 0) * 100).toFixed(0)}%
                              </span>
                            </ScoreRow>
                            <ScoreRow>
                              <ScoreLabel>카테고리 적합</ScoreLabel>
                              <ProgressBar><ProgressFill value={(rec['Category'] || 0) * 100} color="#f59e0b" /></ProgressBar>
                              <span style={{ minWidth: '30px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
                                {((rec['Category'] || 0) * 100).toFixed(0)}%
                              </span>
                            </ScoreRow>
                          </motion.div>
                        )}
                      </CompactResultCard>
                    ))}
                  </ResultGrid>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.8rem', textAlign: 'center' }}>
                    카드를 클릭하면 상세 점수를 확인할 수 있어요
                  </p>
                </>
              )}

              {/* 다중 재료 결과 - Beam Search 조합 표시 */}
              {multiRecommendations.length > 0 && (
                <>
                  <TargetLabel>
                    {selectedIngs.join(' + ')} → {expandedCard !== null && multiRecommendations[expandedCard]
                      ? <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                        {multiRecommendations[expandedCard].substitutes.join(' + ')}
                      </span>
                      : '최적 대체 조합'}
                  </TargetLabel>

                  <div style={{ marginBottom: '1rem' }}>
                    {multiRecommendations.map((combo, idx) => (
                      <CompactResultCard
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                          marginBottom: '0.8rem',
                          border: expandedCard === idx ? '2px solid #3b82f6' : '1px solid #e2e8f0'
                        }}
                        onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                      >
                        <CompactHeader>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MedalIcon>
                              {idx === 0 && '🥇'}
                              {idx === 1 && '🥈'}
                              {idx === 2 && '🥉'}
                            </MedalIcon>
                            <span style={{ fontWeight: '600', color: '#1e293b' }}>
                              조합 {idx + 1}
                            </span>
                          </div>
                          <ScoreBadge>{(combo.score * 100).toFixed(0)}점</ScoreBadge>
                        </CompactHeader>

                        <div style={{
                          marginTop: '0.8rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          {selectedIngs.map((origIng, i) => (
                            <div
                              key={i}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '0.4rem 0.8rem',
                                background: expandedCard === idx ? '#dbeafe' : '#f1f5f9',
                                borderRadius: '8px',
                                fontSize: '0.9rem'
                              }}
                            >
                              <span style={{ color: '#64748b', textDecoration: 'line-through' }}>
                                {origIng}
                              </span>
                              <span style={{ color: '#94a3b8' }}>→</span>
                              <span style={{ fontWeight: '600', color: '#3b82f6' }}>
                                {combo.substitutes[i]}
                              </span>
                            </div>
                          ))}
                        </div>

                        {expandedCard === idx && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                              marginTop: '1rem',
                              paddingTop: '1rem',
                              borderTop: '1px solid #e2e8f0',
                              fontSize: '0.85rem',
                              color: '#475569'
                            }}
                          >
                            <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                              추천 기준
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>평균 유사도 점수</span>
                                <span style={{ fontWeight: '600', color: '#3b82f6' }}>{(combo.score * 100).toFixed(1)}%</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>조합 순위</span>
                                <span style={{ fontWeight: '600' }}>{idx + 1}위 / {multiRecommendations.length}개</span>
                              </div>
                              <div style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                background: '#f8fafc',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                color: '#64748b'
                              }}>
                                Beam Search가 각 재료의 W2V, D2V, Method, Category 점수를 종합하여 최적의 조합을 선택했습니다.
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </CompactResultCard>
                    ))}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                    카드를 클릭하면 상세 정보를 확인할 수 있어요
                  </p>
                </>
              )}

              {recommendations.length === 0 && multiRecommendations.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  추천 결과가 없습니다. 다른 재료를 선택해 주세요.
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  )
}

export default App
