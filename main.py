from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
import os

app = FastAPI(title="🏛️ ORBIX Validación Financiera", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos desde public
app.mount("/static", StaticFiles(directory="public"), name="static")
app.mount("/js", StaticFiles(directory="public/js"), name="js")
app.mount("/css", StaticFiles(directory="public/css"), name="css")
app.mount("/avatar", StaticFiles(directory="public/avatar"), name="avatar")

@app.get("/")
async def root():
    return FileResponse('public/index.html')

@app.get("/index.html")
async def index():
    return FileResponse('public/index.html')

@app.get("/health")
async def health():
    return {"status": "ok", "service": "validacion-financiera"}

@app.get("/validaciones") 
async def validaciones():
    return FileResponse('public/validaciones.html')

@app.get("/validaciones.html")
async def validaciones_html():
    return FileResponse('public/validaciones.html')

@app.get("/calculadora")
async def calculadora():
    return FileResponse('public/calculadora.html')

@app.get("/calculadora.html") 
async def calculadora_html():
    return FileResponse('public/calculadora.html')

@app.get("/sentinel")
async def sentinel():
    return FileResponse('public/sentinel.html')

@app.get("/sentinel.html")
async def sentinel_html():
    return FileResponse('public/sentinel.html')

@app.post("/validate")
async def validate_credit(data: dict):
    return {"result": "approved", "score": 85, "data": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
