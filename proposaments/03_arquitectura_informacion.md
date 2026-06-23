# Propuesta 3: Arquitectura de la Información y Organización de Pantallas

## Análisis del Modelo Actual
Actualmente, la aplicación utiliza un modelo **"Favorites-First" fragmentado**:
1. **Pantallas Principales:** Son los "Visores" (favoritos) divididos por medio de transporte (Bizkaibus, Metro Bilbao, etc.) a través de pestañas superiores (`NavigationTabs`).
2. **Acciones Ocultas:** Acciones fundamentales como "Añadir parada", "Buscar línea" o "Planificador" están relegadas a un Menú Global oculto tras un botón de hamburguesa, o a un botón flotante (FAB).

**Problemas detectados con este enfoque:**
* **Síndrome de la pantalla vacía:** Un usuario nuevo abre la app y ve un "Visor" vacío. Las acciones para poblarlo (añadir parada) no son el elemento principal de la pantalla, lo que genera confusión inicial.
* **Falta de contexto:** Si un usuario quiere buscar los horarios de una línea puntual (sin guardarla), tiene que abrir el menú global, buscar la sección del transporte correspondiente, e ir a la búsqueda.
* **Sobrecarga del menú:** El menú principal (`Page.tsx`) tiene una lista larguísima de opciones agrupadas, mezclando navegación principal con acciones específicas.

---

## Alternativas de Organización

### Alternativa 1: "Transport Hubs" (Paneles de Control por Transporte) - *Recomendado a corto plazo*
En lugar de que la pantalla principal de un transporte (ej. Bizkaibus) sea *solo* una lista de visores, convertirla en un **Panel de Control (Dashboard)** de ese transporte.

**¿Cómo funcionaría?**
* Al entrar en la pestaña de Bizkaibus, la pantalla mostraría varias secciones:
  1. **Tus Favoritos (Visores):** En la parte superior. Si está vacío, un mensaje claro con un botón grande para "Añadir tu primera parada".
  2. **Acciones Rápidas (Botones en pantalla):** Justo debajo de los visores, botones anclados como "Buscar por Línea", "Buscar por Municipio", "Planificador de Rutas".
* **Ventajas:** Mantiene la separación por transportes (que ya tenéis programada en el código), pero saca las opciones ocultas del menú hamburguesa y las pone a simple vista. El usuario sabe que todo lo relacionado con Bizkaibus está en esa pestaña. Elimina la necesidad del FAB y reduce el tamaño del menú principal.

### Alternativa 2: Navegación por Funcionalidad (Estándar App Moderna) - *Recomendado a largo plazo*
Cambiar el paradigma de organizar por "Transporte" a organizar por "Intención del usuario", usando una barra de navegación inferior (`Bottom Navigation`).

**¿Cómo funcionaría?**
* **Pestaña 1 (Inicio/Favoritos):** Un feed unificado donde aparecen TODOS tus visores mezclados (el bus que coges, seguido del metro). Perfecto para el día a día.
* **Pestaña 2 (Explorar/Buscar):** Una pantalla central para buscar cualquier línea o parada. Primero eliges qué quieres buscar, y luego filtras por transporte si es necesario.
* **Pestaña 3 (Planificador):** Un planificador de viajes global.
* **Pestaña 4 (Ajustes).**
* **Ventajas:** Es el patrón más estándar en aplicaciones móviles de transporte (ej. Moovit, Citymapper). Mejora drásticamente la experiencia de usuarios esporádicos y simplifica el modelo mental de la app.
* **Desventajas:** Requiere una refactorización mayor del enrutamiento (`App.tsx`) y de cómo se guardan/muestran los visores.

### Alternativa 3: Enfoque "Mapa Principal" (Search-First)
La aplicación se abre directamente mostrando un mapa con las paradas cercanas (usando geolocalización) de todos los transportes activos.
* **Ventajas:** Extremadamente visual y útil para saber "qué tengo cerca ahora mismo".
* **Desventajas:** Requiere mucha integración de mapas y no siempre es lo que quiere el usuario diario que ya sabe a dónde va y solo quiere ver a qué hora pasa su tren.

---

## Conclusión y Recomendación

El planteamiento actual asume que todos los usuarios ya tienen sus visores configurados y solo abren la app para mirarlos. 

**Recomiendo encarecidamente transicionar hacia la Alternativa 1 ("Transport Hubs")**. Es la evolución más natural de vuestro código actual. 
Transformar `BizkaibusDisplays.tsx` en `BizkaibusDashboard.tsx` permitiendo que coexistan los visores guardados junto con los botones de búsqueda (ej. `BizkaibusAddStopsButton`, `SearchLines`, etc.) en la misma vista vertical. Esto os permitirá vaciar el `Page.tsx` de opciones de menú y dar una experiencia de usuario mucho más fluida e intuitiva.
