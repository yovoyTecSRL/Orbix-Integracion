from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(title=" ORBIX Validación Financiera\, version=\1.0.0\)

app.add_middleware(
 CORSMiddleware,
 allow_origins=[\*\],
 allow_credentials=True,
 allow_methods=[\*\],
 allow_headers=[\*\],
)

@app.get(\/\)
async def root():
 return {\message\: \ORBIX Validación Financiera API\, \status\: \active\}

@app.get(\/health\)
async def health():
 return {\status\: \ok\, \service\: \validacion-financiera\}

@app.post(\/validate\)
async def validate_credit(data: dict):
 return {\result\: \approved\, \score\: 85, \data\: data}

if __name__ == \__main__\:
 import uvicorn
 uvicorn.run(app, host=\0.0.0.0\, port=8001)
