# 🎭 Avatar Models Directory

Este directorio contiene los modelos 3D para el TalkingHead Avatar de Orbix.

## Estructura recomendada:

```
/avatar/models/
├── orbix-avatar.gltf          # Modelo principal del avatar
├── orbix-avatar.bin           # Datos binarios del modelo
├── textures/                  # Texturas del avatar
│   ├── face.jpg
│   ├── body.jpg
│   └── normal.jpg
├── animations/                # Animaciones adicionales
│   ├── idle.gltf
│   ├── speaking.gltf
│   └── gestures.gltf
└── fallback/                  # Modelos de respaldo
    └── simple-avatar.gltf
```

## Formatos soportados:

- **GLTF/GLB**: Formato principal recomendado
- **FBX**: Para modelos más complejos con animaciones
- **OBJ**: Modelos simples sin animaciones

## Especificaciones del avatar:

- **Vista**: Desde el pecho hacia arriba
- **Resolución**: Optimizada para Web (< 2MB)
- **Texturas**: 512x512 o 1024x1024 máximo
- **Polígonos**: < 10,000 para rendimiento óptimo
- **Animaciones**: 
  - `idle`: Animación en reposo
  - `speaking`: Animación al hablar
  - `gestures`: Gestos opcionales

## Cómo agregar un modelo personalizado:

1. Coloca tu archivo `orbix-avatar.gltf` en este directorio
2. Asegúrate de que incluya las animaciones `idle` y `speaking`
3. El avatar se cargará automáticamente al inicializar

## Fallback:

Si no se encuentra un modelo personalizado, se utilizará un avatar generado proceduralmente con Three.js.

---
*Orbix Systems - Avatar Integration Module*
