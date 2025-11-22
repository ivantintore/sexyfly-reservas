"""
SexyFly - Backend API para TPV
Version: 3.1.0
Descripción: API Flask para gestionar pagos con TPV Redsys/MAITSA

Uso:
    python backend/app.py
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime
from tpv_redsys import TPVRedsys, crear_pago_tpv

app = Flask(__name__, static_folder='../public', static_url_path='')
CORS(app)  # Permitir CORS para desarrollo

# Configuración
TEST_MODE = True  # Cambiar a False en producción
tpv = TPVRedsys(test_mode=TEST_MODE)

# Almacenamiento temporal de reservas (en producción usar base de datos)
reservas_pendientes = {}


@app.route('/')
def index():
    """Servir index.html"""
    return send_from_directory('../public', 'index.html')


@app.route('/api/tpv/iniciar-pago', methods=['POST'])
def iniciar_pago():
    """
    Endpoint para iniciar un pago
    Genera los parámetros necesarios para Redsys
    """
    try:
        # Obtener datos de la reserva
        datos_cliente = request.json
        
        print(f'\n📥 Solicitud de pago recibida:')
        print(f'   Cliente: {datos_cliente.get("client", {}).get("name")}')
        print(f'   Importe: {datos_cliente.get("pricing", {}).get("total")}€')
        
        # Preparar datos para TPV
        importe = float(datos_cliente.get('pricing', {}).get('total', 0))
        titular = datos_cliente.get('client', {}).get('name', 'Cliente')
        
        # Descripción del vuelo
        airports = datos_cliente.get('airports', {})
        descripcion = f"Piloto {airports.get('origin', '')} → {airports.get('destination', '')}"
        
        # URLs de callback (deben ser accesibles públicamente)
        base_url = request.host_url.rstrip('/')
        url_ok = f"{base_url}/public/pago-ok.html"
        url_ko = f"{base_url}/public/pago-ko.html"
        url_notificacion = f"{base_url}/api/tpv/notificacion"
        
        # Generar parámetros TPV
        parametros_tpv = crear_pago_tpv(
            importe=importe,
            titular=titular,
            descripcion=descripcion,
            url_ok=url_ok,
            url_ko=url_ko,
            test_mode=TEST_MODE
        )
        
        # Guardar reserva temporalmente
        numero_pedido = parametros_tpv['numero_pedido']
        reservas_pendientes[numero_pedido] = {
            'datos_cliente': datos_cliente,
            'importe': importe,
            'timestamp': datetime.now().isoformat(),
            'estado': 'pendiente'
        }
        
        print(f'\n✅ Parámetros TPV generados:')
        print(f'   Número pedido: {numero_pedido}')
        print(f'   URL TPV: {parametros_tpv["url_tpv"]}')
        print(f'   Firma generada: ✅')
        
        return jsonify({
            'success': True,
            'parametros_tpv': parametros_tpv,
            'numero_pedido': numero_pedido
        })
    
    except Exception as e:
        print(f'\n❌ Error generando pago: {str(e)}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/tpv/callback-ok', methods=['GET', 'POST'])
def callback_ok():
    """
    Callback cuando el pago es exitoso
    Redsys redirige aquí después de pago OK
    """
    params = request.values.get('Ds_MerchantParameters', '')
    firma = request.values.get('Ds_Signature', '')
    
    print(f'\n✅ Callback OK recibido')
    print(f'   Params: {params[:50]}...')
    print(f'   Firma: {firma[:50]}...')
    
    try:
        # Verificar firma
        datos = tpv.verificar_respuesta(params, firma)
        estado = tpv.obtener_estado_operacion(datos)
        
        numero_pedido = estado['numero_pedido']
        
        # Actualizar estado de reserva
        if numero_pedido in reservas_pendientes:
            reservas_pendientes[numero_pedido]['estado'] = 'pagado'
            reservas_pendientes[numero_pedido]['autorizacion'] = estado['numero_autorizacion']
        
        print(f'   ✅ Pago autorizado')
        print(f'   Pedido: {numero_pedido}')
        print(f'   Autorización: {estado["numero_autorizacion"]}')
        
        return jsonify({
            'success': True,
            'estado': estado
        })
    
    except Exception as e:
        print(f'   ❌ Error verificando firma: {str(e)}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@app.route('/api/tpv/callback-ko', methods=['GET', 'POST'])
def callback_ko():
    """
    Callback cuando el pago falla o es cancelado
    """
    params = request.values.get('Ds_MerchantParameters', '')
    
    print(f'\n❌ Callback KO recibido')
    
    try:
        # Decodificar parámetros
        params_json = base64.b64decode(params).decode('utf-8')
        datos = json.loads(params_json)
        
        numero_pedido = datos.get('Ds_Order', '')
        codigo = datos.get('Ds_Response', '')
        
        # Actualizar estado
        if numero_pedido in reservas_pendientes:
            reservas_pendientes[numero_pedido]['estado'] = 'cancelado'
            reservas_pendientes[numero_pedido]['codigo_error'] = codigo
        
        print(f'   Pedido: {numero_pedido}')
        print(f'   Código: {codigo}')
        
        return jsonify({
            'success': False,
            'codigo': codigo
        })
    
    except Exception as e:
        print(f'   ❌ Error: {str(e)}')
        return jsonify({'error': str(e)}), 400


@app.route('/api/tpv/notificacion', methods=['POST'])
def notificacion_servidor():
    """
    Notificación servidor a servidor de Redsys
    Esta es la confirmación definitiva del pago
    """
    params = request.form.get('Ds_MerchantParameters', '')
    firma = request.form.get('Ds_Signature', '')
    
    print(f'\n📨 Notificación servidor recibida')
    
    try:
        # Verificar firma
        datos = tpv.verificar_respuesta(params, firma)
        estado = tpv.obtener_estado_operacion(datos)
        
        numero_pedido = estado['numero_pedido']
        
        # Actualizar estado definitivo
        if numero_pedido in reservas_pendientes:
            reservas_pendientes[numero_pedido]['estado'] = 'confirmado'
            reservas_pendientes[numero_pedido]['confirmado_servidor'] = True
            reservas_pendientes[numero_pedido]['datos_pago'] = estado
        
        print(f'   ✅ Pago confirmado por servidor')
        print(f'   Pedido: {numero_pedido}')
        print(f'   Autorización: {estado["numero_autorizacion"]}')
        
        # Redsys espera OK como respuesta
        return 'OK', 200
    
    except Exception as e:
        print(f'   ❌ Error: {str(e)}')
        return 'KO', 400


@app.route('/api/tpv/estado/<numero_pedido>', methods=['GET'])
def consultar_estado(numero_pedido):
    """
    Consultar estado de un pedido
    """
    if numero_pedido in reservas_pendientes:
        return jsonify({
            'success': True,
            'reserva': reservas_pendientes[numero_pedido]
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Pedido no encontrado'
        }), 404


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check del API
    """
    return jsonify({
        'status': 'ok',
        'tpv_mode': 'test' if TEST_MODE else 'production',
        'merchant_code': tpv.merchant_code,
        'version': '3.1.0'
    })


if __name__ == '__main__':
    print('=' * 70)
    print('🚀 SexyFly Backend API - TPV MAITSA/Redsys')
    print('=' * 70)
    print(f'Modo: {"TEST" if TEST_MODE else "PRODUCCIÓN"}')
    print(f'Merchant Code: {tpv.merchant_code}')
    print(f'Terminal: {tpv.terminal}')
    print(f'URL TPV: {tpv.url_tpv}')
    print('=' * 70)
    print('\n💡 Servidor corriendo en http://localhost:5000')
    print('   API disponible en http://localhost:5000/api/')
    print('\n🔧 Endpoints:')
    print('   POST /api/tpv/iniciar-pago')
    print('   GET  /api/health')
    print('\n⚠️  Para desarrollo local, usa ngrok para URLs públicas')
    print('   ngrok http 5000\n')
    
    # Ejecutar servidor
    app.run(debug=True, port=5000, host='0.0.0.0')

