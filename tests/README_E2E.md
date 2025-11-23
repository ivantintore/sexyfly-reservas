# 🧪 Tests E2E (End-to-End) Automáticos

## 🎯 Qué son estos tests

Los tests E2E prueban el **flujo completo del usuario** desde el frontend hasta el backend:

```
Usuario → Frontend → Backend → TPV Redsys
```

---

## 📋 Tests Implementados

### Test 1: `test_frontend_loads`
✅ Verifica que la página carga correctamente
- Abre la URL de Vercel
- Verifica que el título contiene "SexyFly"
- Verifica que existe el formulario

### Test 2: `test_form_fields_present`
✅ Verifica que todos los campos del formulario están presentes
- Busca cada campo requerido
- Verifica que existen en el DOM

### Test 3: `test_complete_form_cliente_test`
✅ Completa el formulario con "CLIENTE TEST"
- Rellena todos los campos
- Usa "CLIENTE TEST" como nombre
- Verifica que los datos se guardaron

### Test 4: `test_submit_button_enabled`
✅ Verifica que el botón de submit se habilita
- Completa el formulario
- Acepta términos
- Verifica que el botón existe

### Test 5: `test_full_e2e_flow` (MANUAL)
⏸️ Flujo completo hasta Redsys (requiere ejecución manual)
- Actualmente marcado con `@pytest.mark.skip`
- Prueba la redirección a Redsys
- Verifica datos en página TPV

---

## 🚀 Cómo Ejecutar

### Requisitos Previos

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Chrome instalado** (Selenium usa Chrome)

### Ejecutar Tests

**Todos los tests E2E:**
```bash
pytest tests/test_e2e.py -v
```

**Un test específico:**
```bash
pytest tests/test_e2e.py::test_frontend_loads -v
```

**Con más detalle:**
```bash
pytest tests/test_e2e.py -vv -s
```

**Solo tests que NO estén marcados como skip:**
```bash
pytest tests/test_e2e.py -v -m "not skip"
```

---

## 📝 Ejemplo de Salida

```
$ pytest tests/test_e2e.py -v

tests/test_e2e.py::test_frontend_loads PASSED         [25%]
tests/test_e2e.py::test_form_fields_present PASSED    [50%]
tests/test_e2e.py::test_complete_form_cliente_test PASSED [75%]
tests/test_e2e.py::test_submit_button_enabled PASSED  [100%]

====== 4 passed, 1 skipped in 15.32s ======
```

---

## ⚠️ IMPORTANTE

### Test Manual (test_full_e2e_flow)

El test `test_full_e2e_flow` está marcado con `@pytest.mark.skip` porque:

**Razones:**
1. Requiere seleccionar fechas en calendario (complejo con Selenium)
2. Requiere esperar redirección a Redsys (página externa)
3. Requiere verificar datos en sitio de terceros
4. Puede fallar si Redsys cambia su estructura HTML

**Para ejecutarlo manualmente:**

1. Edita `tests/test_e2e.py`
2. Comenta la línea:
   ```python
   # @pytest.mark.skip(reason="...")
   ```
3. Ejecuta:
   ```bash
   pytest tests/test_e2e.py::test_full_e2e_flow -vv -s
   ```

---

## 🔧 Configuración

### URLs

Si necesitas cambiar las URLs de test, edita las constantes en `test_e2e.py`:

```python
FRONTEND_URL = "https://sexyfly-reservas.vercel.app"
BACKEND_URL = "https://web-production-a113a.up.railway.app"
```

### Opciones de Chrome

Puedes modificar las opciones del navegador en la fixture `driver()`:

```python
chrome_options.add_argument("--headless")  # Quitar para ver el navegador
chrome_options.add_argument("--window-size=1920,1080")  # Cambiar resolución
```

---

## 🐛 Troubleshooting

### Error: "ChromeDriver not found"
**Solución:** El test descargará ChromeDriver automáticamente con `webdriver-manager`

### Error: "Element not found"
**Solución:** Aumenta los timeouts en `WebDriverWait(driver, 10)` → `(driver, 20)`

### Test muy lento
**Solución:** Los tests E2E son naturalmente lentos. Considera ejecutar solo los necesarios.

---

## ✅ CI/CD (GitHub Actions)

Estos tests están configurados para ejecutarse automáticamente en GitHub Actions.

Ver: `.github/workflows/test.yml`

**Nota:** El test manual (`test_full_e2e_flow`) NO se ejecuta automáticamente.

---

## 📚 Recursos

- **Selenium Docs:** https://www.selenium.dev/documentation/
- **Pytest Docs:** https://docs.pytest.org/
- **WebDriver Manager:** https://github.com/SergeyPirogov/webdriver_manager

---

**🎊 ¡Tests E2E automáticos listos para usar!**

