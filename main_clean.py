from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json
import datetime
import os

app = FastAPI(title=" Sistema de Validación Financiera\, version=\1.0.0\)

# Configurar templates y archivos estáticos
templates = Jinja2Templates(directory=\templates\)

@app.get(\/\, response_class=HTMLResponse)
async def home(request: Request):
 html_content = '''
 <!DOCTYPE html>
 <html lang=\es\>
 <head>
 <meta charset=\UTF-8\>
 <meta name=\viewport\ content=\width=device-width initial-scale=1.0\>
 <title>🇨🇷 Sistema de Validación Financiera</title>
 <style>
 body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
 .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
 h1 { color: #333; text-align: center; margin-bottom: 30px; }
 .status { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }
 .api-info { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
 .btn { background: #28a745; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; margin: 10px; text-decoration: none; display: inline-block; }
 .btn:hover { background: #218838; }
 </style>
 </head>
 <body>
 <div class=\container\>
 <h1>🇨🇷 Sistema de Validación Financiera</h1>
 <div class=\status\>
 <h3>✅ Sistema Operativo</h3>
 <p>📅 Fecha: ''' + str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')) + '''</p>
 <p>🌐 Servidor: Activo y funcionando</p>
 <p>🔐 Estado: Listo para validaciones</p>
 </div>
 
 <div class=\api-info\>
 <h3>🔧 Endpoints Disponibles</h3>
 <ul>
 <li><strong>GET /</strong> - Página principal</li>
 <li><strong>POST /chat</strong> - API de chat interactivo</li>
 <li><strong>GET /diagnostico</strong> - Diagnóstico del sistema</li>
 <li><strong>GET /health</strong> - Health check</li>
 <li><strong>GET /metrics</strong> - Métricas de rendimiento</li>
 </ul>
 </div>
 
 <div style=\text-align: center
