"""
Tests unitarios para la API de SexyFly
"""
import pytest
from app import app

@pytest.fixture
def client():
    """Cliente de test para Flask"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test del endpoint /api/health"""
    response = client.get('/api/health')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['status'] == 'ok'
    assert 'merchant_code' in data
    assert 'tpv_mode' in data

def test_health_check_structure(client):
    """Verificar estructura de respuesta del health check"""
    response = client.get('/api/health')
    data = response.get_json()
    
    # Verificar campos obligatorios
    required_fields = ['status', 'tpv_mode', 'merchant_code', 'version']
    for field in required_fields:
        assert field in data, f"Campo '{field}' faltante en respuesta"

def test_iniciar_pago_sin_datos(client):
    """Test de iniciar pago sin datos (debe fallar)"""
    response = client.post('/api/tpv/iniciar-pago',
                           json={},
                           content_type='application/json')
    
    assert response.status_code == 400
    data = response.get_json()
    assert data['success'] == False
    assert 'error' in data

def test_iniciar_pago_datos_completos(client):
    """Test de iniciar pago con datos completos"""
    datos = {
        'client': {
            'name': 'Test Usuario',
            'email': 'test@test.com',
            'phone': '+34666777888'
        },
        'pricing': {
            'total': 500
        },
        'airports': {
            'origin': 'LELL',
            'destination': 'LEBL'
        }
    }
    
    response = client.post('/api/tpv/iniciar-pago',
                           json=datos,
                           content_type='application/json')
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] == True
    assert 'numero_pedido' in data
    assert 'parametros_tpv' in data

def test_iniciar_pago_importe_invalido(client):
    """Test con importe inválido"""
    datos = {
        'client': {'name': 'Test', 'email': 'test@test.com'},
        'pricing': {'total': -100}  # Importe negativo
    }
    
    response = client.post('/api/tpv/iniciar-pago',
                           json=datos,
                           content_type='application/json')
    
    assert response.status_code == 400
    data = response.get_json()
    assert data['success'] == False

def test_iniciar_pago_importe_excesivo(client):
    """Test con importe que excede límite"""
    datos = {
        'client': {'name': 'Test', 'email': 'test@test.com'},
        'pricing': {'total': 60000}  # Excede 50.000€
    }
    
    response = client.post('/api/tpv/iniciar-pago',
                           json=datos,
                           content_type='application/json')
    
    assert response.status_code == 400
    data = response.get_json()
    assert data['success'] == False
    assert '50.000' in data['error']

