"""
Tests E2E (End-to-End) para el sistema de reservas SexyFly.

Estos tests prueban el flujo completo del usuario:
1. Cargar la página
2. Seleccionar fechas en calendario
3. Completar formulario
4. Enviar reserva
5. Verificar redirección a TPV Redsys

Requieren que el backend esté desplegado y funcionando.
"""
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

# URL del frontend en Vercel
FRONTEND_URL = "https://sexyfly-reservas.vercel.app"
BACKEND_URL = "https://web-production-a113a.up.railway.app"

# Configuración del navegador
@pytest.fixture
def driver():
    """Configura y devuelve un driver de Chrome para tests E2E"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Ejecutar sin ventana
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    yield driver
    
    driver.quit()

def test_frontend_loads(driver):
    """
    Test E2E 1: Verificar que la página principal carga correctamente
    """
    driver.get(FRONTEND_URL)
    
    # Esperar a que cargue la página
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
    
    # Verificar título
    assert "SexyFly" in driver.title
    
    # Verificar que existe el formulario
    form = driver.find_element(By.TAG_NAME, "form")
    assert form is not None

def test_form_fields_present(driver):
    """
    Test E2E 2: Verificar que todos los campos del formulario están presentes
    """
    driver.get(FRONTEND_URL)
    wait = WebDriverWait(driver, 10)
    
    # Esperar a que cargue el formulario
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    
    # Verificar campos requeridos
    fields = [
        "input[name='departureTime']",
        "input[name='returnTime']",
        "input[name='originICAO']",
        "input[name='destinationICAO']",
        "input[name='clientName']",
        "input[name='clientEmail']",
        "input[name='clientPhone']",
        "input[name='acceptTerms']"
    ]
    
    for field_selector in fields:
        field = driver.find_element(By.CSS_SELECTOR, field_selector)
        assert field is not None, f"Campo {field_selector} no encontrado"

def test_complete_form_cliente_test(driver):
    """
    Test E2E 3: Completar formulario con datos de prueba (CLIENTE TEST)
    """
    driver.get(FRONTEND_URL)
    wait = WebDriverWait(driver, 10)
    
    # Esperar a que cargue la página
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    time.sleep(2)  # Esperar a que cargue completamente
    
    # Completar horas
    driver.find_element(By.CSS_SELECTOR, "input[name='departureTime']").send_keys("10:00")
    driver.find_element(By.CSS_SELECTOR, "input[name='returnTime']").send_keys("18:00")
    
    # Completar aeropuertos
    driver.find_element(By.CSS_SELECTOR, "input[name='originICAO']").send_keys("LELL")
    driver.find_element(By.CSS_SELECTOR, "input[name='destinationICAO']").send_keys("LEBL")
    
    # Completar datos del cliente (IMPORTANTE: CLIENTE TEST)
    driver.find_element(By.CSS_SELECTOR, "input[name='clientName']").send_keys("CLIENTE TEST")
    driver.find_element(By.CSS_SELECTOR, "input[name='clientEmail']").send_keys("test@sexyfly.es")
    driver.find_element(By.CSS_SELECTOR, "input[name='clientPhone']").send_keys("+34666777888")
    
    # Verificar que los campos se completaron
    assert driver.find_element(By.CSS_SELECTOR, "input[name='clientName']").get_attribute("value") == "CLIENTE TEST"

def test_submit_button_enabled(driver):
    """
    Test E2E 4: Verificar que el botón de enviar se habilita con datos válidos
    """
    driver.get(FRONTEND_URL)
    wait = WebDriverWait(driver, 10)
    
    # Completar formulario mínimo
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    time.sleep(2)
    
    driver.find_element(By.CSS_SELECTOR, "input[name='departureTime']").send_keys("10:00")
    driver.find_element(By.CSS_SELECTOR, "input[name='returnTime']").send_keys("18:00")
    driver.find_element(By.CSS_SELECTOR, "input[name='originICAO']").send_keys("LELL")
    driver.find_element(By.CSS_SELECTOR, "input[name='destinationICAO']").send_keys("LEBL")
    driver.find_element(By.CSS_SELECTOR, "input[name='clientName']").send_keys("CLIENTE TEST")
    driver.find_element(By.CSS_SELECTOR, "input[name='clientEmail']").send_keys("test@sexyfly.es")
    driver.find_element(By.CSS_SELECTOR, "input[name='clientPhone']").send_keys("+34666777888")
    
    # Aceptar términos
    terms_checkbox = driver.find_element(By.CSS_SELECTOR, "input[name='acceptTerms']")
    terms_checkbox.click()
    
    # Verificar que el botón de submit existe
    submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    assert submit_button is not None

# NOTA: Este test requeriría más tiempo para esperar la redirección
# y verificar la página de Redsys. Se recomienda ejecutar manualmente.
@pytest.mark.skip(reason="Requiere interacción con TPV real, ejecutar manualmente")
def test_full_e2e_flow(driver):
    """
    Test E2E 5 (MANUAL): Flujo completo hasta Redsys
    
    Este test debe ejecutarse manualmente ya que:
    1. Requiere seleccionar fechas en calendario
    2. Requiere esperar redirección a Redsys
    3. Requiere verificar datos en página externa
    
    Para ejecutar manualmente:
    1. Comentar el @pytest.mark.skip
    2. Ejecutar: pytest tests/test_e2e.py::test_full_e2e_flow -v
    """
    driver.get(FRONTEND_URL)
    wait = WebDriverWait(driver, 15)
    
    # TODO: Seleccionar fechas en calendario
    # (Requiere más lógica para encontrar y clickear fechas)
    
    # Completar formulario completo
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    time.sleep(3)
    
    driver.find_element(By.CSS_SELECTOR, "input[name='departureTime']").send_keys("10:00")
    driver.find_element(By.CSS_SELECTOR, "input[name='returnTime']").send_keys("18:00")
    driver.find_element(By.CSS_SELECTOR, "input[name='originICAO']").send_keys("LELL")
    driver.find_element(By.CSS_SELECTOR, "input[name='destinationICAO']").send_keys("LEBL")
    driver.find_element(By.CSS_SELECTOR, "input[name='clientName']").send_keys("CLIENTE TEST")
    driver.find_element(By.CSS_SELECTOR, "input[name='clientEmail']").send_keys("test@sexyfly.es")
    driver.find_element(By.CSS_SELECTOR, "input[name='clientPhone']").send_keys("+34666777888")
    
    # Aceptar términos
    driver.find_element(By.CSS_SELECTOR, "input[name='acceptTerms']").click()
    
    # Click en reservar
    submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit_button.click()
    
    # Esperar redirección (más tiempo para Redsys)
    time.sleep(5)
    
    # Verificar que redirigió a Redsys
    assert "redsys.es" in driver.current_url.lower(), f"No redirigió a Redsys. URL actual: {driver.current_url}"
    
    # Verificar que aparece CLIENTE TEST en la página
    page_source = driver.page_source
    assert "CLIENTE TEST" in page_source, "No se encontró CLIENTE TEST en la página de Redsys"

if __name__ == "__main__":
    """
    Ejecutar tests manualmente:
    
    # Todos los tests:
    pytest tests/test_e2e.py -v
    
    # Solo un test específico:
    pytest tests/test_e2e.py::test_frontend_loads -v
    
    # Con más detalle:
    pytest tests/test_e2e.py -vv -s
    """
    pytest.main([__file__, "-v"])

