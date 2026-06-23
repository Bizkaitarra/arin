# Propuesta 4: Animaciones y Experiencia del Asistente de Configuración (`SetupWizard.tsx`)

## Descripción del Problema
El asistente de configuración inicial (`SetupWizard.tsx`) cambia entre pantallas de manera instantánea y brusca. Además, el diseño se renderiza como una tarjeta flotante que deja visible el fondo de la app, en lugar de sentirse como un proceso inicial nativo e inmersivo.

## Solución Propuesta
1. **Transiciones Deslizantes con Swiper:**
   * Utilizar la librería Swiper (integrada en las dependencias de Ionic) para permitir transiciones deslizantes laterales (*slide transitions*) entre pasos. El usuario podrá avanzar pulsando los botones o arrastrando suavemente hacia los lados.
2. **Onboarding Inmersivo a Pantalla Completa:**
   * Ajustar el diseño del contenedor para que ocupe todo el viewport del dispositivo móvil y ocultar temporalmente la barra de navegación inferior (`IonTabBar`) para evitar distracciones durante la configuración inicial.
3. **Indicador de Progreso Mejorado:**
   * Rediseñar la barra de puntos superior para que muestre el progreso actual con pequeñas microanimaciones al cambiar de paso.

## Archivos a Modificar
* [SetupWizard.tsx](file:///Users/jongonzalez/Documents/personal/arin/src/components/SetupWizard/SetupWizard.tsx)
* [SetupWizard.css](file:///Users/jongonzalez/Documents/personal/arin/src/components/SetupWizard/SetupWizard.css)
* [GuidedSetup.tsx](file:///Users/jongonzalez/Documents/personal/arin/src/pages/GuidedSetup.tsx)
