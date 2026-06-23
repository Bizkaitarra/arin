# Propuesta 1: Optimización de la Barra de Navegación (`NavigationTabs.tsx`)

## Descripción del Problema
Actualmente, la barra de pestañas inferior (`IonTabBar`):
1. Añade dinámicamente las pestañas según la configuración de accesos directos (*atajos*), incluyendo un botón dinámico de "Añadir Servicio".
2. Si el usuario selecciona el número máximo de visores (4), el botón "Añadir Servicio" desaparece por completo, lo que dificulta que el usuario pueda cambiar o reconfigurar los accesos directos desde la navegación principal.
3. Rellena las pestañas con un texto secundario (`subtext`) colocado verticalmente sobre el icono y la etiqueta, lo que provoca que se amontone en pantallas pequeñas.

## Solución Propuesta
1. **Pestaña Fija de Ajustes:**
   * Cambiar el botón dinámico por una pestaña fija llamada **Ajustes** (apuntando a `/configuration` o un menú general).
   * Esta pestaña siempre estará visible a la derecha, facilitando la reconfiguración rápida sin importar cuántos atajos estén activos.
2. **Simplificar el Diseño de Pestaña:**
   * Eliminar el elemento `subtext` de la barra inferior o integrarlo en una vista más compacta.
   * Usar el layout nativo de Ionic con un icono limpio (`IonIcon`) y una sola línea de texto (`IonLabel`), asegurando que no se solape ni se corte.

## Archivos a Modificar
* [NavigationTabs.tsx](file:///Users/Users/jongonzalez/Documents/personal/arin/src/components/NavigationTabs.tsx)
