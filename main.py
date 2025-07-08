from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
import os
from pathlib import Path

app = FastAPI(title="🧠 ORBIX AI Systems", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos - MEJORADO
app.mount("/static", StaticFiles(directory="public"), name="static")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/avatars", StaticFiles(directory="public/avatars"), name="avatars")

@app.get("/")
async def root():
    try:
        if Path("public/index.html").exists():
            return FileResponse("public/index.html")
        elif Path("index.html").exists():
            return FileResponse("index.html")
        else:
            raise HTTPException(status_code=404, detail="index.html no encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/styles.css")
async def serve_styles():
    """Servir el archivo CSS principal"""
    try:
        if Path("styles.css").exists():
            return FileResponse("styles.css", media_type="text/css")
        elif Path("public/styles.css").exists():
            return FileResponse("public/styles.css", media_type="text/css")
        else:
            raise HTTPException(status_code=404, detail="styles.css no encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/css/talkinghead-avatar.css")
async def serve_avatar_css():
    """Servir CSS del avatar"""
    try:
        if Path("public/css/talkinghead-avatar.css").exists():
            return FileResponse("public/css/talkinghead-avatar.css", media_type="text/css")
        else:
            raise HTTPException(status_code=404, detail="talkinghead-avatar.css no encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/css/avatar-settings.css")
async def serve_avatar_settings_css():
    """Servir CSS de configuración del avatar"""
    try:
        if Path("public/css/avatar-settings.css").exists():
            return FileResponse("public/css/avatar-settings.css", media_type="text/css")
        else:
            raise HTTPException(status_code=404, detail="avatar-settings.css no encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/avatar-config.json")
async def serve_avatar_config():
    """Servir configuración del avatar"""
    try:
        if Path("public/avatar-config.json").exists():
            return FileResponse("public/avatar-config.json", media_type="application/json")
        else:
            return {
                "name": "Zoile",
                "model": "/avatars/brunette.glb",
                "enableMovement": True,
                "enableBlinking": True,
                "enableBreathing": True,
                "enableLipSync": True,
                "animationSpeed": 1.0,
                "version": "1.0.0"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/avatar-config")
async def update_avatar_config(config: dict):
    """Actualizar configuración del avatar"""
    try:
        config_path = Path("public/avatar-config.json")
        config_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        return {"status": "success", "message": "Configuración actualizada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/avatar-models")
async def get_avatar_models():
    """Obtener lista de modelos disponibles"""
    try:
        avatars_path = Path("public/avatars")
        if not avatars_path.exists():
            return {"models": []}
        
        models = []
        for file in avatars_path.glob("*.glb"):
            models.append({
                "name": file.stem.replace("_", " ").title(),
                "file": f"/avatars/{file.name}",
                "preview": f"/avatars/previews/{file.stem}.jpg"
            })
        
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

@app.post("/validate")
async def validate_credit(data: dict):
    return {"result": "approved", "score": 85, "data": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
