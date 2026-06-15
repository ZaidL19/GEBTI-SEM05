from flask import Flask, render_template, jsonify, request
from datetime import datetime
import sys

app = Flask(__name__)

# 1. Simulación de Base de Datos del CRM (Ciudadanos de la Red Pacífico Norte)
CIUDADANOS = [
    {"id": 1, "nombre": "Juan Pérez", "edad": 65, "zona": "Chimbote Centro", "telefono": "945123456", "riesgo": "Adulto Mayor"},
    {"id": 2, "nombre": "María Baca", "edad": 24, "zona": "Coishco", "telefono": "987654321", "riesgo": "Ninguno"},
    {"id": 3, "nombre": "Carlos Flores", "edad": 3, "zona": "Nuevo Chimbote", "telefono": "912345678", "riesgo": "Pediátrico"},
    {"id": 4, "nombre": "Ana Flores", "edad": 72, "zona": "Coishco", "telefono": "955667788", "riesgo": "Adulto Mayor"},
    {"id": 5, "nombre": "Luis Milla", "edad": 28, "zona": "Santa", "telefono": "933221144", "riesgo": "Ninguno"}
]

# 2. Configuración de Campañas Preventivas Automatizadas
CAMPANAS_CONFIG = {
    "DENGUE": {
        "titulo": "Campaña de Prevención Contra el Dengue",
        "mensaje": "Alerta Red Pacífico Norte: Se registran brotes en tu zona. Elimina recipientes con agua estancada. Usa repelente.",
        "filtro_zona": ["Coishco", "Santa", "Chimbote Centro"] # Zonas críticas
    },
    "INFLUENZA": {
        "titulo": "Vacunación Neumococo e Influenza 2026",
        "mensaje": "Red Pacífico Norte: Protege tu salud este invierno. Acude al puesto de salud más cercano para tu vacunación gratuita.",
        "filtro_riesgo": ["Adulto Mayor", "Pediátrico"] # Población vulnerable
    }
}

# Historial de envíos del CRM
historial_envios = []

@app.route('/crm')
def crm_page():
    return render_template('crm.html', ciudadanos=CIUDADANOS, campanas=CAMPANAS_CONFIG, historial=historial_envios)

@app.route('/disparar_campana', methods=['POST'])
def disparar_campana():
    tipo = request.json.get('tipo_campana')
    if tipo not in CAMPANAS_CONFIG:
        return jsonify({"status": "error", "message": "Campaña no válida"}), 400
    
    config = CAMPANAS_CONFIG[tipo]
    beneficiarios_filtrados = []
    
    # Lógica de segmentación automática del CRM
    for c in CIUDADANOS:
        if tipo == "DENGUE":
            # Filtra automáticamente por zonas afectadas
            if c["zona"] in config["filtro_zona"]:
                beneficiarios_filtrados.append(c)
        elif tipo == "INFLUENZA":
            # Filtra automáticamente por grupos de riesgo
            if c["riesgo"] in config["filtro_riesgo"]:
                beneficiarios_filtrados.append(c)

    # Simulación del disparo automático (envío de SMS/Notificaciones)
    fecha_envio = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    for b in beneficiarios_filtrados:
        historial_envios.insert(0, {
            "fecha": fecha_envio,
            "campana": config["titulo"],
            "ciudadano": b["nombre"],
            "zona": b["zona"],
            "contacto": b["telefono"],
            "mensaje_enviado": config["mensaje"]
        })

    return jsonify({
        "status": "success", 
        "enviados": len(beneficiarios_filtrados),
        "detalles": config["titulo"]
    })

import socket  # 🔥 Librería nativa para revisar los puertos de Windows


def encontrar_puerto_libre():
    # Puertos que queremos intentar en orden de preferencia
    puertos_a_probar = [5000, 3000, 5500, 8000]

    for p in puertos_a_probar:
        # Creamos un conector temporal para ver si el puerto está libre
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            # Si se puede amarrar al puerto, significa que está libre
            sock.bind(("127.0.0.1", p))
            sock.close()
            return p  # Retorna el primer puerto libre que encuentre
        except OSError:
            # Si da error, es porque el puerto está ocupado (ej: por Live Server)
            continue

    # Si todos están ocupados, dejamos que el sistema operativo asigne uno al azar
    return 0


if __name__ == "__main__":
    puerto_libre = encontrar_puerto_libre()

    print("\n" + "=" * 50)
    print(f"🚀 CRM DETECTÓ PUERTO LIBRE: {puerto_libre}")
    print(f"🔗 Abre en tu navegador: http://127.0.0.1:{puerto_libre}/crm")
    print("=" * 50 + "\n")

    # Corre Flask exactamente en el puerto que encontró libre
    app.run(host="127.0.0.1", port=puerto_libre, debug=True, use_reloader=False)

    #app.run(debug=True)