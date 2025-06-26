FROM python:3.10

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY backend/ ./backend/

CMD ["python", "backend/app.py"]