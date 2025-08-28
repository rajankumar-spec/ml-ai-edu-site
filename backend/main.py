from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "topics.json"


app = FastAPI(title="ML & AI Edu Site")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


templates = Jinja2Templates(directory=BASE_DIR / "templates")


with open(DATA_PATH, "r", encoding="utf-8") as f:
    TOPICS = json.load(f)


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "topics": TOPICS})


@app.get("/topic/{slug}", response_class=HTMLResponse)
async def topic_page(request: Request, slug: str):
    topic = next((t for t in TOPICS if t["slug"] == slug), None)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic["sample_data_json"] = json.dumps(topic.get("sample_data", {}))
    return templates.TemplateResponse("topic.html", {"request": request, "topic": topic})


# API endpoint that returns data for interactive visuals
@app.get("/api/topic/{slug}/data")
async def topic_data(slug: str):
    topic = next((t for t in TOPICS if t["slug"] == slug), None)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    # Topic may include a 'sample_data' field that we can return
    return JSONResponse(content=topic.get("sample_data", {}))