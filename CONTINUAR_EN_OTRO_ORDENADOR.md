# 🔄 Guía: Mover a Otro Ordenador

**Última actualización:** 23 Noviembre 2025  
**Tiempo total:** ~2 minutos

---

## ✅ PASOS A SEGUIR

### 1️⃣ Clonar el repositorio

```bash
cd ~/CURSOR\ -\ AVIONES/  # O el directorio que prefieras
git clone https://github.com/ivantintore/sexyfly-reservas.git
cd sexyfly-reservas
```

### 2️⃣ Instalar dependencias

```bash
pip3 install -r requirements.txt
```

**Tiempo:** ~30 segundos

### 3️⃣ ¡Listo!

```bash
code .  # Si usas VS Code/Cursor
```

---

## ❓ ¿Necesito copiar algo del .gitignore?

### ❌ NO necesitas copiar NADA

Todo lo que está en `.gitignore` es:

| Archivo/Carpeta | ¿Copiar? | Razón |
|----------------|----------|-------|
| `venv/` | ❌ NO | Se recrea con `pip install` |
| `.env` | ❌ NO | Variables están en Railway/código |
| `__pycache__/` | ❌ NO | Se regenera automáticamente |
| `.pytest_cache/` | ❌ NO | Se regenera automáticamente |
| `*.log` | ❌ NO | Archivos temporales |

**Conclusión:** Git clone + pip install es suficiente ✅

---

## 🧪 (Opcional) Verificar que todo funciona

### Tests unitarios:

```bash
TPV_CLAVE_SHA256_TEST=sq7HjrUOBfKmC576ILgskD5srU870gJ7 \
TPV_CLAVE_SHA256_PRODUCTION=Kmxl0wQuJmXiaukCGWTurOwhc+8Z9sAB \
TPV_TEST_MODE=true PYTHONPATH=. pytest tests/test_app.py -v
```

**Resultado esperado:** ✅ 6/6 passed

### Tests E2E:

```bash
TPV_CLAVE_SHA256_TEST=sq7HjrUOBfKmC576ILgskD5srU870gJ7 \
TPV_CLAVE_SHA256_PRODUCTION=Kmxl0wQuJmXiaukCGWTurOwhc+8Z9sAB \
TPV_TEST_MODE=true PYTHONPATH=. pytest tests/test_e2e.py -v
```

**Resultado esperado:** ✅ 4/4 passed, 1 skipped

---

## 📊 Estado del proyecto (commit a4a4aec)

### ✅ Lo que está en GitHub:

- ✅ Todo el código actualizado
- ✅ Tests funcionando (10/10 pasando)
- ✅ GitHub Actions configurado
- ✅ Tooltips con desglose de precios
- ✅ Festivos de Barcelona (14 días)
- ✅ 3 días bloqueados (25 Dic, 1 Ene, 6 Ene)
- ✅ Festivos en GRIS con icono 🎉
- ✅ Calendario de 2 meses con separadores
- ✅ Valores por defecto en horas (09:00/18:00)

### 🔗 URLs importantes:

- **GitHub:** https://github.com/ivantintore/sexyfly-reservas
- **Frontend:** https://sexyfly-reservas.vercel.app
- **Backend:** https://web-production-a113a.up.railway.app

---

## 🎯 Resumen

```bash
# Solo necesitas 2 comandos:
git clone https://github.com/ivantintore/sexyfly-reservas.git
cd sexyfly-reservas && pip3 install -r requirements.txt

# ¡Y listo! 🎉
```

**Tiempo total:** ~1-2 minutos  
**Copiar archivos:** NO necesario  
**Todo está en GitHub:** ✅

---

## 📝 Mejoras implementadas HOY (10 commits)

1. ✅ Tests unitarios arreglados
2. ✅ Tests E2E arreglados
3. ✅ GitHub Actions funcionando
4. ✅ Valores por defecto en horas
5. ✅ Tooltips con desglose
6. ✅ Festivos Barcelona
7. ✅ Días bloqueados
8. ✅ Festivos en GRIS
9. ✅ Calendario 2 meses
10. ✅ Separadores de mes

**¡Todo sincronizado y listo!** 🚀

