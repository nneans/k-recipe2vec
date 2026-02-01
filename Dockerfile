FROM python:3.9-slim

# 보안 및 권한 설정을 위한 유저 생성 (Hugging Face 권장 사항)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# 의존성 설치
COPY --chown=user requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 코드 복사 (모델 파일 포함)
COPY --chown=user . .

# 포트 설정 (Hugging Face는 7860 포트를 사용합니다)
EXPOSE 7860

# 실행 명령어
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "7860"]
