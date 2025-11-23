"""
SexyFly - Módulo TPV Redsys/MAITSA
Version: 3.1.0
Descripción: Genera firmas SHA256 y parámetros para TPV virtual Redsys

Documentación: https://canales.redsys.es/canales/ayuda/documentacion/
"""

import json
import base64
import hmac
import hashlib
from datetime import datetime
import secrets
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


class TPVRedsys:
    """
    Clase para gestionar integración con TPV Redsys/MAITSA
    """
    
    # Datos del comercio (de los PDFs y panel Redsys)
    MERCHANT_CODE = '340829647'  # Mismo en TEST y PRODUCCIÓN
    TERMINAL = '1'               # Mismo en TEST y PRODUCCIÓN
    CURRENCY = '978'             # EUR
    
    # Claves SHA256 (SENSIBLES - Leer desde variables de entorno)
    CLAVE_SHA256_TEST = os.getenv('TPV_CLAVE_SHA256_TEST', '')
    CLAVE_SHA256_PRODUCTION = os.getenv('TPV_CLAVE_SHA256_PRODUCTION', '')
    
    # URLs Redsys
    URL_TEST = 'https://sis-t.redsys.es:25443/sis/realizarPago'
    URL_PRODUCTION = 'https://sis.redsys.es/sis/realizarPago'
    
    # Tipos de transacción
    TIPO_AUTORIZACION = '0'  # Autorización
    
    def __init__(self, test_mode=True):
        """
        Inicializar TPV
        
        Args:
            test_mode (bool): True para entorno de pruebas, False para producción
        """
        self.test_mode = test_mode
        
        # Configurar según modo
        self.merchant_code = self.MERCHANT_CODE
        self.terminal = self.TERMINAL
        
        if test_mode:
            self.clave_secreta = self.CLAVE_SHA256_TEST
            self.url_tpv = self.URL_TEST
            print('⚠️  MODO TEST - Solo tarjetas de prueba')
        else:
            self.clave_secreta = self.CLAVE_SHA256_PRODUCTION
            self.url_tpv = self.URL_PRODUCTION
            print('🔴 MODO PRODUCCIÓN - Aceptando pagos reales')
    
    def generar_numero_pedido(self):
        """
        Genera un número de pedido único
        Formato: timestamp + random (12 caracteres max)
        
        Returns:
            str: Número de pedido único
        """
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_part = secrets.token_hex(2)  # 4 caracteres
        
        # Máximo 12 caracteres para Redsys
        numero_pedido = (timestamp + random_part)[:12]
        
        return numero_pedido
    
    def crear_merchant_parameters(self, datos_reserva):
        """
        Crea los parámetros del comercio en formato JSON
        
        Args:
            datos_reserva (dict): Datos de la reserva
                - importe (float): Importe en euros
                - numero_pedido (str): Número de pedido
                - titular (str): Nombre del cliente
                - url_ok (str): URL de retorno si OK
                - url_ko (str): URL de retorno si KO
                - url_notificacion (str): URL para notificaciones
        
        Returns:
            str: Merchant parameters en base64
        """
        # Convertir importe a céntimos (Redsys lo requiere)
        importe_centimos = int(datos_reserva['importe'] * 100)
        
        # Crear objeto con parámetros según documentación Redsys
        merchant_data = {
            'DS_MERCHANT_AMOUNT': str(importe_centimos),
            'DS_MERCHANT_ORDER': datos_reserva['numero_pedido'],
            'DS_MERCHANT_MERCHANTCODE': self.merchant_code,
            'DS_MERCHANT_CURRENCY': self.CURRENCY,
            'DS_MERCHANT_TRANSACTIONTYPE': self.TIPO_AUTORIZACION,
            'DS_MERCHANT_TERMINAL': self.terminal,
            'DS_MERCHANT_MERCHANTURL': datos_reserva.get('url_notificacion', ''),
            'DS_MERCHANT_URLOK': datos_reserva['url_ok'],
            'DS_MERCHANT_URLKO': datos_reserva['url_ko'],
            'DS_MERCHANT_TITULAR': datos_reserva.get('titular', 'Cliente')[:60],  # Max 60 chars
            'DS_MERCHANT_PRODUCTDESCRIPTION': datos_reserva.get('descripcion', 'Reserva Piloto')[:125],
        }
        
        # Convertir a JSON y luego a base64
        json_data = json.dumps(merchant_data, separators=(',', ':'))
        merchant_parameters_b64 = base64.b64encode(json_data.encode()).decode()
        
        return merchant_parameters_b64
    
    def generar_firma(self, merchant_parameters_b64, numero_pedido):
        """
        Genera la firma SHA256 según documentación Redsys
        
        Args:
            merchant_parameters_b64 (str): Merchant parameters en base64
            numero_pedido (str): Número de pedido
        
        Returns:
            str: Firma en base64
        """
        if not self.clave_secreta:
            raise ValueError('Clave secreta no configurada')
        
        # 1. Decodificar clave secreta de base64
        clave_bytes = base64.b64decode(self.clave_secreta)
        
        # 2. Crear clave derivada usando 3DES
        from Crypto.Cipher import DES3
        
        # Padding del número de pedido a 16 bytes
        numero_pedido_bytes = numero_pedido.encode('utf-8')
        padding_length = 16 - (len(numero_pedido_bytes) % 16)
        numero_pedido_padded = numero_pedido_bytes + (bytes([0]) * padding_length)
        
        # Cifrar con 3DES
        cipher = DES3.new(clave_bytes, DES3.MODE_CBC, IV=bytes(8))
        clave_derivada = cipher.encrypt(numero_pedido_padded)[:16]
        
        # 3. Generar HMAC SHA256
        firma = hmac.new(
            clave_derivada,
            merchant_parameters_b64.encode('utf-8'),
            hashlib.sha256
        ).digest()
        
        # 4. Convertir a base64
        firma_b64 = base64.b64encode(firma).decode()
        
        return firma_b64
    
    def crear_parametros_tpv(self, datos_reserva):
        """
        Crea todos los parámetros necesarios para enviar a Redsys
        
        Args:
            datos_reserva (dict): Datos de la reserva
        
        Returns:
            dict: Parámetros completos para el formulario TPV
                - Ds_SignatureVersion: 'HMAC_SHA256_V1'
                - Ds_MerchantParameters: Parámetros en base64
                - Ds_Signature: Firma en base64
                - url_tpv: URL del TPV
                - numero_pedido: Número de pedido generado
        """
        # Generar número de pedido si no viene
        if 'numero_pedido' not in datos_reserva:
            datos_reserva['numero_pedido'] = self.generar_numero_pedido()
        
        # Crear merchant parameters
        merchant_parameters = self.crear_merchant_parameters(datos_reserva)
        
        # Generar firma
        firma = self.generar_firma(merchant_parameters, datos_reserva['numero_pedido'])
        
        # Devolver todos los parámetros
        return {
            'Ds_SignatureVersion': 'HMAC_SHA256_V1',
            'Ds_MerchantParameters': merchant_parameters,
            'Ds_Signature': firma,
            'url_tpv': self.url_tpv,
            'numero_pedido': datos_reserva['numero_pedido']
        }
    
    def verificar_respuesta(self, params_response, firma_response):
        """
        Verifica la firma de la respuesta de Redsys
        
        Args:
            params_response (str): Ds_MerchantParameters de la respuesta
            firma_response (str): Ds_Signature de la respuesta
        
        Returns:
            dict: Datos decodificados si la firma es válida
        
        Raises:
            ValueError: Si la firma no es válida
        """
        # Decodificar parámetros
        params_json = base64.b64decode(params_response).decode('utf-8')
        params_data = json.loads(params_json)
        
        # Obtener número de pedido de la respuesta
        numero_pedido = params_data.get('Ds_Order')
        
        # Generar firma esperada
        firma_esperada = self.generar_firma(params_response, numero_pedido)
        
        # Comparar firmas
        if firma_response != firma_esperada:
            raise ValueError('Firma inválida - posible intento de fraude')
        
        return params_data
    
    def obtener_estado_operacion(self, params_data):
        """
        Obtiene el estado de la operación
        
        Args:
            params_data (dict): Datos decodificados de la respuesta
        
        Returns:
            dict: Estado de la operación
                - success (bool): True si pago autorizado
                - codigo_respuesta (str): Código de respuesta
                - mensaje (str): Mensaje descriptivo
        """
        codigo_respuesta = params_data.get('Ds_Response', '')
        
        # Códigos de respuesta Redsys:
        # 0000-0099 = Autorizada
        # Resto = Denegada
        try:
            codigo_int = int(codigo_respuesta)
            autorizada = 0 <= codigo_int <= 99
        except:
            autorizada = False
        
        mensajes_error = {
            '0101': 'Tarjeta caducada',
            '0102': 'Tarjeta en excepción transitoria',
            '0104': 'Operación no permitida',
            '0106': 'Intentos de PIN excedidos',
            '0116': 'Disponible insuficiente',
            '0118': 'Tarjeta no registrada',
            '0125': 'Tarjeta no efectiva',
            '0129': 'Código de seguridad (CVV2) incorrecto',
            '0180': 'Tarjeta ajena al servicio',
            '0184': 'Error en la autenticación del titular',
            '0190': 'Denegación del emisor sin especificar motivo',
            '0191': 'Fecha de caducidad errónea',
            '9064': 'Número de posiciones de la tarjeta incorrecto',
            '9078': 'No existe método de pago válido',
            '9093': 'Tarjeta no existente',
            '9094': 'Rechazo servidores internacionales',
            '9104': 'Comercio no seguro'
        }
        
        mensaje = mensajes_error.get(
            codigo_respuesta,
            'Autorizada' if autorizada else f'Operación denegada (código: {codigo_respuesta})'
        )
        
        return {
            'success': autorizada,
            'codigo_respuesta': codigo_respuesta,
            'mensaje': mensaje,
            'numero_autorizacion': params_data.get('Ds_AuthorisationCode', ''),
            'numero_pedido': params_data.get('Ds_Order', ''),
            'importe': params_data.get('Ds_Amount', ''),
            'tarjeta': params_data.get('Ds_Card_Number', '')
        }


# Funciones helper para uso directo
def crear_pago_tpv(importe, titular, descripcion, url_ok, url_ko, test_mode=True):
    """
    Función helper para crear un pago TPV
    
    Args:
        importe (float): Importe en euros
        titular (str): Nombre del cliente
        descripcion (str): Descripción del producto/servicio
        url_ok (str): URL de retorno si OK
        url_ko (str): URL de retorno si KO
        test_mode (bool): True para pruebas
    
    Returns:
        dict: Parámetros para el formulario TPV
    """
    tpv = TPVRedsys(test_mode=test_mode)
    
    datos_reserva = {
        'importe': importe,
        'titular': titular,
        'descripcion': descripcion,
        'url_ok': url_ok,
        'url_ko': url_ko
    }
    
    return tpv.crear_parametros_tpv(datos_reserva)


if __name__ == '__main__':
    # Test del módulo
    print('🧪 Testing TPV Redsys Module...\n')
    
    # Crear instancia de prueba
    tpv = TPVRedsys(test_mode=True)
    
    # Datos de ejemplo
    datos_test = {
        'importe': 1080.50,
        'titular': 'Ivan Tintore TEST',
        'descripcion': 'Reserva Piloto LELL-LEBL',
        'url_ok': 'http://localhost:8000/public/pago-ok.html',
        'url_ko': 'http://localhost:8000/public/pago-ko.html'
    }
    
    # Generar parámetros
    params = tpv.crear_parametros_tpv(datos_test)
    
    print(f"✅ Parámetros generados correctamente:")
    print(f"   Número pedido: {params['numero_pedido']}")
    print(f"   URL TPV: {params['url_tpv']}")
    print(f"   Signature Version: {params['Ds_SignatureVersion']}")
    print(f"   Merchant Parameters: {params['Ds_MerchantParameters'][:50]}...")
    print(f"   Signature: {params['Ds_Signature'][:50]}...")
    print('\n✅ Módulo TPV funcionando correctamente')

