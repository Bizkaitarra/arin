# Propuesta 2: Rediseño del Menú de Navegación (`Page.tsx`)

## Descripción del Problema
El menú general de navegación de la aplicación se abre utilizando un `IonModal` a pantalla completa. Esto corta de golpe la experiencia fluida de una aplicación móvil, sintiéndose más como un cambio de página completo y tosco que como una ayuda de navegación temporal.

## Solución Propuesta
Reemplazar el modal a pantalla completa por una de las dos siguientes alternativas nativas:
1. **Menú Lateral Deslizante (`IonMenu` + `IonSplitPane`):**
   * El clásico menú tipo "cajón" que se desliza desde el lateral izquierdo al pulsar el icono del menú o arrastrar el dedo desde el borde.
2. **Menú en Hoja Inferior (*Bottom Sheet*):**
   * Configurar el `IonModal` para que funcione como un panel inferior que se levanta solo a media pantalla (`breakpoints: [0, 0.5, 0.95]`, `initialBreakpoint: 0.5`). Esto permite que el usuario siga viendo parte del contexto de la pantalla anterior y pueda deslizarlo hacia abajo para cerrarlo de forma natural.

## Archivos a Modificar
* [Page.tsx](file:///Users/jongonzalez/Documents/personal/arin/src/pages/Page.tsx)
