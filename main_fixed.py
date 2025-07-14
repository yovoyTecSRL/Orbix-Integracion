from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json

app = FastAPI(title="🏛️ ORBIX Validación Financiera", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos
app.mount("/static", StaticFiles(directory="public"), name="static")

@app.get("/")
async def root():
    return FileResponse('index.html')

@app.get("/health")
async def health():
    return {"status": "ok", "service": "validacion-financiera"}

@app.get("/validaciones.html")
async def validaciones():
    return FileResponse('validaciones.html')

@app.get("/calculadora.html") 
async def calculadora():
    return FileResponse('calculadora.html')

@app.get("/sentinel.html")
async def sentinel():
    return FileResponse('sentinel.html')

@app.get("/welcome.html")
async def welcome():
    return FileResponse('welcome.html')

@app.post("/validate")
async def validate_credit(data: dict):
    return {"result": "approved", "score": 85, "data": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
