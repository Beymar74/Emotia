import os
import re

updates = {
    r"src\app\admin\page.tsx": "Aquí puedes ver un resumen global de las métricas clave de Emotia, incluyendo ingresos, pedidos completados, usuarios activos y el rendimiento general de las empresas.",
    r"src\app\admin\usuarios\page.tsx": "En esta sección puedes gestionar a todos los usuarios registrados, revisar sus roles, editar sus datos y controlar su acceso a la plataforma.",
    r"src\app\admin\empresas\actividad\page.tsx": "Aquí puedes supervisar la actividad reciente de las empresas, revisar sus publicaciones, actualizaciones y el movimiento de sus catálogos.",
    r"src\app\admin\empresas\rendimiento\page.tsx": "En esta sección puedes analizar el rendimiento financiero y operativo de las empresas proveedoras, incluyendo ventas, calificaciones y tiempos de respuesta.",
    r"src\app\admin\productos\page.tsx": "En esta sección puedes gestionar los productos disponibles, revisar su estado, actualizar precios, controlar stock y administrar la información visible para los clientes.",
    r"src\app\admin\categorias\page.tsx": "Aquí puedes administrar las categorías del catálogo, crear nuevas clasificaciones y organizar la forma en que los productos se presentan a los usuarios.",
    r"src\app\admin\pedidos\page.tsx": "En esta sección puedes gestionar los pedidos de los clientes, revisar su estado actual, verificar los pagos y coordinar con los proveedores para asegurar entregas exitosas.",
    r"src\app\admin\carritos\page.tsx": "Aquí puedes visualizar los carritos de compra activos y abandonados por los usuarios, permitiendo tomar decisiones estratégicas de recuperación de ventas.",
    r"src\app\admin\pagos\page.tsx": "En esta sección puedes supervisar los métodos de pago, revisar transacciones, verificar comprobantes y gestionar las liquidaciones a las empresas.",
    r"src\app\admin\notificaciones\page.tsx": "Aquí puedes enviar y gestionar notificaciones push y alertas para los usuarios y empresas, informando sobre novedades o actualizaciones del sistema.",
    r"src\app\admin\recordatorios\page.tsx": "En esta sección puedes configurar recordatorios automáticos para fechas importantes, seguimientos de pedidos o renovaciones de suscripciones.",
    r"src\app\admin\calificaciones\page.tsx": "Aquí puedes moderar las reseñas y calificaciones que los clientes dejan sobre los productos, asegurando la calidad y el cumplimiento de las normas de la comunidad.",
    r"src\app\admin\reportes\page.tsx": "En esta sección puedes acceder a todos los reportes detallados y análisis del sistema para tomar decisiones informadas sobre ventas, clientes y calidad.",
    r"src\app\admin\reportes\calidad\page.tsx": "Aquí puedes analizar las métricas de calidad del servicio, evaluaciones de productos y el nivel de satisfacción general de los clientes.",
    r"src\app\admin\reportes\fidelizacion\page.tsx": "En esta sección puedes revisar el impacto de las campañas de fidelización, el comportamiento de compras recurrentes y la retención de usuarios.",
    r"src\app\admin\reportes\ventas\page.tsx": "Aquí puedes analizar en detalle el volumen de transacciones, ingresos generados y el crecimiento de las ventas en periodos específicos.",
    r"src\app\admin\reportes\clientes\page.tsx": "En esta sección puedes evaluar el crecimiento de la base de usuarios, demografía y el comportamiento de consumo de tus clientes.",
    r"src\app\admin\reportes\empresas\page.tsx": "Aquí puedes examinar las métricas de afiliación de nuevas empresas, su distribución y nivel de actividad dentro del marketplace.",
    r"src\app\admin\reportes\pedidos\page.tsx": "En esta sección puedes visualizar estadísticas completas sobre los estados de los pedidos, tiempos de entrega y volumen logístico.",
    r"src\app\admin\reportes\productos\page.tsx": "Aquí puedes ver los análisis de los productos más vendidos, visualizaciones del catálogo y la gestión del stock global.",
    r"src\app\admin\reportes\global\page.tsx": "En esta sección puedes obtener una perspectiva holística de la salud de Emotia, uniendo las métricas de todas las áreas clave en un solo lugar.",
    r"src\app\admin\configuracion\page.tsx": "Aquí puedes ajustar las variables globales del sistema, parámetros de seguridad y preferencias de la plataforma administrativa."
}

def process_file(filepath, description):
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'(<h1[^>]*>.*?</h1>)'
    
    if 'max-w-3xl' in content and 'mt-2 text-sm text-[#7A5260]' in content:
        print(f"Already updated: {filepath}")
        return

    replacement = r'\1\n        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">\n          ' + description + r'\n        </p>'
    
    new_content, count = re.subn(pattern, replacement, content, count=1, flags=re.DOTALL)
    
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")
    else:
        print(f"Could not find <h1> tag in {filepath}")

def update_dashboard():
    dashboard_path = r"src\app\admin\page.tsx"
    if not os.path.exists(dashboard_path):
        return
    with open(dashboard_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'max-w-3xl' in content and 'text-[#7A5260]' in content and 'Aquí puedes ver un resumen global' in content:
        return
        
    pattern = r'(<h2 className="text-\[9px\] tracking-\[2\.5px\] uppercase text-\[#7A5260\] font-bold mb-4 opacity-80">\s*Resumen.*?</h2>)'
    description = updates[dashboard_path]
    replacement = r'\1\n        <p className="mt-2 mb-6 text-sm text-[#7A5260] max-w-3xl leading-relaxed">\n          ' + description + r'\n        </p>'
    
    new_content, count = re.subn(pattern, replacement, content, count=1, flags=re.DOTALL)
    if count > 0:
        with open(dashboard_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {dashboard_path}")
    else:
        print(f"Could not find Resumen in {dashboard_path}")

for filepath, description in updates.items():
    if 'admin\\page.tsx' in filepath:
        update_dashboard()
    else:
        process_file(filepath, description)
