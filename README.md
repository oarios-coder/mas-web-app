# Control Recategorizacion Monotributo 2026

Web app local para controlar recategorizaciones de Monotributo del periodo enero-junio 2026.

## Funciones

- Carga y edicion de clientes.
- Calculo de facturacion semestral y anualizada.
- Estimacion de junio por IPC cuando no hay dato real.
- Categoria sugerida por ingresos y parametros fisicos.
- Deteccion de pase a Responsable Inscripto.
- Diferencia entre cuota actual y cuota estimada.
- Resumen ejecutivo.
- Importacion y exportacion CSV.
- Guardado automatico en el navegador.

## Como abrirla

Con Node.js instalado:

```powershell
node server.js
```

Despues abrir:

```text
http://localhost:4173
```

Tambien se puede abrir `index.html` directamente en el navegador.

## Publicar en GitHub Pages

1. Crear un repositorio en GitHub.
2. Subir estos archivos al repo.
3. Entrar en `Settings` > `Pages`.
4. En `Build and deployment`, elegir `Deploy from a branch`.
5. Seleccionar la rama principal y la carpeta `/root`.
6. Guardar.

GitHub publicara la app como sitio estatico.

## Datos base

Los valores de categorias y cuotas fueron tomados de la planilla:

`Control_Recategorizacion_Monotributo_2026.xlsx`

Tabla vigente: febrero 2026.

## Nota

La app funciona como herramienta de control interno. Conviene revisar valores oficiales de AFIP/ARCA e IPC antes de presentar una recategorizacion.
