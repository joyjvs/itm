---
name: itm-development
description: >
  Buenas practicas de desarrollo para la aplicacion ITM con React, TypeScript, Vite, Zustand y Axios.
  Trigger: usar en cada funcionalidad nueva, correccion de bug o error, refactor, cambio de API, estado, formulario o componente.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Desarrollo ITM

## Cuando usar esta skill

Cargar esta skill antes de analizar, diseñar, implementar o revisar cualquier cambio en la aplicacion ITM. Aplica a:

- funcionalidades nuevas y cambios de comportamiento;
- bugs, errores de compilacion, lint o runtime;
- cambios en endpoints, autenticacion, servicios, stores, hooks, formularios o componentes;
- refactors, optimizacion de rendimiento y cambios de dependencias;
- cambios que puedan afectar seguridad, datos, navegacion o experiencia responsive.

## Reglas no negociables

1. Entender primero el flujo local: pagina/componente -> hook -> store -> servicio -> cliente HTTP -> tipos.
2. Localizar la capa que decide el comportamiento y corregir la causa raiz; no ocultar errores con `any`, casts innecesarios, silenciamiento de lint o estados globales adicionales.
3. Mantener una sola responsabilidad por modulo y dependencias unidireccionales:
   - `src/pages` compone vistas y flujos de usuario.
   - `src/components` contiene UI reutilizable y no debe llamar directamente a Axios.
   - `src/hooks` expone contratos de uso para la UI.
   - `src/store` coordina estado de dominio, asincronia y efectos asociados al dominio.
   - `src/api/services` encapsula llamadas HTTP.
   - `src/api/client.ts` centraliza configuracion transversal de Axios.
   - `src/types` define contratos compartidos.
   - `src/utils` contiene funciones puras y utilidades transversales.
4. Reutilizar componentes, hooks, validadores, tipos y utilidades existentes antes de crear duplicados.
5. Tipar entradas, salidas, errores, respuestas paginadas y estados de carga. Evitar `any`; usar `unknown` y estrechamiento cuando la fuente sea externa.
6. Preservar estados completos de UI: carga, exito, vacio, error, reintento, deshabilitado y responsive cuando correspondan.
7. No poner secretos, tokens ni URLs sensibles en el codigo. Usar la configuracion existente y respetar el manejo centralizado de autenticacion.
8. No introducir una dependencia o una abstraccion global sin justificar su beneficio, impacto de bundle, mantenimiento y alternativa local.
9. Mantener compatibilidad con TypeScript estricto, React y las convenciones de imports existentes.
10. No mezclar refactors no relacionados con el cambio solicitado.

## Flujo obligatorio

### 1. Comprender y acotar

- Identificar el comportamiento esperado y el comportamiento actual.
- Buscar implementaciones vecinas y los tipos involucrados.
- Escribir mentalmente una hipotesis falsable sobre la causa o el punto de extension.
- Definir el cambio minimo que puede confirmar o descartar esa hipotesis.
- Revisar efectos sobre permisos, autenticacion, paginacion, filtros, cache, navegacion y formularios si aplican.

### 2. Elegir el punto de extension

| Necesidad                             | Ubicacion preferida                                     |
| ------------------------------------- | ------------------------------------------------------- |
| Endpoint o transformacion HTTP        | `src/api/services`                                      |
| Base URL, headers o interceptores     | `src/api/client.ts` o `src/api/endpoints.ts`            |
| Contrato de datos                     | `src/types`                                             |
| Estado de dominio y operaciones async | `src/store`                                             |
| API simplificada para componentes     | `src/hooks`                                             |
| Validacion de entrada                 | `src/validators` o validador existente                  |
| Formulario                            | `src/components/forms` o patron de formulario existente |
| UI reutilizable                       | `src/components`                                        |
| Composicion de una ruta               | `src/pages`                                             |
| Logica pura sin efectos               | `src/lib` o `src/utils`                                 |

No saltarse capas para ahorrar unas lineas: una vista no debe conocer detalles de Axios y un servicio no debe modificar directamente componentes.

### 3. Implementar con escalabilidad

- Definir o actualizar tipos antes de propagar datos.
- Mantener funciones pequenas y contratos explicitos.
- Separar presentacion, estado, efectos y acceso a datos.
- Preferir configuracion y composicion sobre condicionales repetidos.
- Para listas, respetar paginacion, filtros, limites, estados de carga y estabilidad visual.
- Evitar renders innecesarios: no crear estado global para estado local, no duplicar datos derivados y no añadir optimizaciones prematuras.
- Diseñar errores recuperables y mensajes consistentes; preservar el error tecnico para depuracion sin exponer datos sensibles al usuario.
- En cambios visuales, respetar los componentes comunes, accesibilidad, teclado, foco, iconos existentes y responsive.

### 4. Verificar

Ejecutar como minimo los comandos que correspondan:

```bash
pnpm lint:typescript
pnpm lint:eslint
pnpm build
```

Para cambios de comportamiento, añadir o actualizar una prueba enfocada si existe infraestructura de pruebas. Si no existe una prueba automatizada aplicable, documentar en la respuesta la validacion manual realizada y el riesgo residual.

Comprobar tambien:

- que no haya imports muertos ni parametros sin usar;
- que los errores de red y estados vacios tengan una salida clara;
- que el cambio no rompa rutas, permisos, autenticacion o contratos API;
- que los cambios de UI funcionen en viewport estrecho y ancho;
- que el diff no incluya archivos generados, secretos ni refactors ajenos.

## Procedimientos por tipo de tarea

### Funcionalidad nueva

1. Identificar el caso de uso y sus estados.
2. Reusar patrones de una funcionalidad equivalente.
3. Definir tipos y contrato de API.
4. Implementar servicio, store/hook y UI solo donde sea necesario.
5. Integrar rutas, permisos, feedback y estados de carga.
6. Validar compilacion, lint y flujo principal y alternativo.

### Bug o error

1. Reproducir o localizar el fallo con el mensaje, stack trace o flujo exacto.
2. Distinguir si el origen es datos, contrato, asincronia, estado, renderizado, navegacion o configuracion.
3. Añadir una comprobacion o caso de prueba que falle antes del arreglo cuando sea viable.
4. Corregir la causa raiz en la capa que controla el comportamiento.
5. Verificar el caso que fallaba y al menos un caso vecino para evitar regresiones.
6. No capturar errores solo para ignorarlos ni convertirlos en valores silenciosos.

### Refactor u optimizacion

1. Confirmar que el comportamiento observable debe conservarse.
2. Medir o identificar el coste antes de optimizar.
3. Mantener contratos publicos y cambios pequenos.
4. Comparar lint, build y flujo afectado antes y despues.
5. Eliminar la abstraccion si no reduce complejidad real.

## Criterio de finalizacion

Un cambio esta listo solo cuando:

- cumple el comportamiento solicitado y sus estados de error/vacio/carga;
- sigue las capas y contratos de esta aplicacion;
- no introduce `any`, secretos, duplicacion evitable ni deuda obvia;
- pasa `pnpm lint:typescript`, `pnpm lint:eslint` y `pnpm build`, o deja documentado por que un comando no pudo ejecutarse;
- incluye una nota breve de archivos modificados, validacion y riesgos pendientes.
