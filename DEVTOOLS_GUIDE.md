# Guía de DevTools para Móvil

## Eruda - DevTools Completas

### Qué es Eruda
Eruda es una consola de DevTools completa que funciona directamente en el navegador móvil, similar a las DevTools de Chrome.

### Cómo usar

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Abrir en el navegador móvil:**
   - Abre la URL que muestra Vite (probablemente `http://localhost:5173`)
   - Verás un **ícono flotante** en la esquina inferior derecha (un pequeño círculo verde)

3. **Abrir las DevTools:**
   - Toca el ícono flotante
   - Se abrirá un panel con múltiples pestañas

### Pestañas disponibles en Eruda

- **Console**: Ver console.logs, errores, warnings
- **Elements**: Inspeccionar el DOM y componentes React
- **Network**: Ver requests HTTP/fetch
- **Resources**: Ver localStorage, sessionStorage, cookies
- **Sources**: Ver el código fuente
- **Info**: Información del dispositivo y navegador
- **Snippets**: Ejecutar código JavaScript en tiempo real

### Tips para Console

```javascript
// En tus componentes, puedes usar:
console.log('Mensaje normal')
console.warn('Advertencia')
console.error('Error')
console.table({ prop1: 'valor1', prop2: 'valor2' }) // Tabla
console.group('Grupo')
console.log('Dentro del grupo')
console.groupEnd()
```

## Utilidades de Debugging de React

Se creó un archivo `src/utils/reactDebug.ts` con funciones útiles para debugging:

### 1. logComponentState
Loguea el estado de un componente:

```tsx
import { logComponentState } from './utils/reactDebug'

function Timer() {
  const [time, setTime] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)

  // Loguear el estado cuando cambia
  useEffect(() => {
    logComponentState('Timer', { time, isRunning })
  }, [time, isRunning])

  return <div>...</div>
}
```

### 2. logRender
Loguea cada vez que un componente se renderiza:

```tsx
import { logRender } from './utils/reactDebug'

function Timer({ initialTime }) {
  logRender('Timer', { initialTime })

  return <div>...</div>
}
```

### 3. logEffect
Loguea efectos secundarios:

```tsx
import { logEffect } from './utils/reactDebug'

function Timer() {
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    logEffect('Timer', 'Iniciando intervalo', [isRunning])

    if (isRunning) {
      const interval = setInterval(() => {
        // ...
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRunning])

  return <div>...</div>
}
```

### 4. logEvent
Loguea eventos del usuario:

```tsx
import { logEvent } from './utils/reactDebug'

function Timer() {
  const handleStart = () => {
    logEvent('Timer', 'start', { time: Date.now() })
    // ...
  }

  return <button onClick={handleStart}>Start</button>
}
```

## Inspeccionando Componentes React

### En Eruda Elements:

1. Abre la pestaña **Elements**
2. Navega por el árbol del DOM
3. Los componentes React aparecen como elementos HTML normales
4. Toca cualquier elemento para ver sus propiedades y estilos

### Tips para inspeccionar componentes:

1. **Ver props en consola:**
   ```tsx
   function MyComponent(props) {
     console.log('Props:', props)
     return <div>...</div>
   }
   ```

2. **Ver contexto:**
   ```tsx
   function MyComponent() {
     const context = useContext(MyContext)
     console.log('Context:', context)
     return <div>...</div>
   }
   ```

3. **Hacer el estado global accesible:**
   ```tsx
   // En desarrollo, exponer el estado en window
   if (import.meta.env.DEV) {
     window.__APP_STATE__ = {
       // tu estado aquí
     }
   }

   // Luego en Eruda Console:
   window.__APP_STATE__
   ```

## Navegadores Recomendados para Móvil

### Kiwi Browser (Android)
- Soporta extensiones de Chrome
- Puedes instalar React DevTools de la Chrome Web Store
- Mejor opción si necesitas las DevTools oficiales de React

### Firefox Nightly (Android)
- Tiene DevTools incorporadas
- Acceso mediante `about:debugging`

### Chrome/Firefox normal
- Eruda funciona perfectamente en ambos

## Debugging Remoto (Opcional)

Si tienes acceso a una PC, puedes hacer debugging remoto:

### Chrome Remote Debugging:
1. En tu PC, abre Chrome y ve a `chrome://inspect`
2. Conecta tu teléfono por USB con debugging habilitado
3. Verás tu navegador móvil listado
4. Click en "Inspect" para usar las DevTools de escritorio

### Firefox Remote Debugging:
1. En tu PC, abre Firefox y ve a `about:debugging`
2. Habilita debugging remoto en Firefox móvil
3. Conecta y haz debugging

## Solución de Problemas

### Eruda no aparece:
1. Verifica que estés en modo desarrollo (`npm run dev`)
2. Refresca la página (F5 o pull-to-refresh)
3. Revisa la consola del navegador si hay errores

### El ícono está en el camino:
- Puedes arrastrar el ícono flotante a otra posición
- O minimizarlo cuando no lo uses

### Performance lenta:
- Cierra las DevTools cuando no las estés usando
- Eruda puede ralentizar un poco la app en desarrollo

## Recursos Adicionales

- [Documentación de Eruda](https://github.com/liriliri/eruda)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
