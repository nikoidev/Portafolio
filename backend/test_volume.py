"""
Script para diagnosticar problemas con el volumen
Ejecutar: railway run python backend/test_volume.py
"""
import os
from pathlib import Path

def test_volume():
    print("=" * 80)
    print("DIAGNOSTICO DEL VOLUMEN")
    print("=" * 80)
    
    # 1. Working directory
    cwd = os.getcwd()
    print(f"\n1. WORKING DIRECTORY:")
    print(f"   Current: {cwd}")
    
    # 2. Variable de entorno
    upload_dir_env = os.getenv('UPLOAD_DIR', 'NOT SET')
    print(f"\n2. VARIABLE DE ENTORNO:")
    print(f"   UPLOAD_DIR = {upload_dir_env}")
    
    # 3. Verificar rutas posibles
    print(f"\n3. VERIFICANDO RUTAS:")
    
    possible_paths = [
        "/app/backend/uploads",
        "/app/uploads",
        "uploads",
        "./uploads",
        "../uploads"
    ]
    
    for path_str in possible_paths:
        path = Path(path_str)
        exists = path.exists()
        is_dir = path.is_dir() if exists else False
        absolute = path.absolute()
        
        status = "✓ EXISTS" if exists else "✗ NOT FOUND"
        print(f"   {status:12s} | {path_str:30s} | Absolute: {absolute}")
        
        if exists and is_dir:
            try:
                # Intentar crear un archivo de prueba
                test_file = path / "test_write.txt"
                test_file.write_text("test")
                test_file.unlink()
                print(f"                | → WRITABLE ✓")
            except Exception as e:
                print(f"                | → NOT WRITABLE ✗ ({e})")
    
    # 4. Intentar importar settings
    print(f"\n4. CONFIGURACION DE LA APP:")
    try:
        from app.core.config import settings
        print(f"   settings.UPLOAD_DIR = {settings.UPLOAD_DIR}")
        
        upload_path = Path(settings.UPLOAD_DIR)
        print(f"   Absolute path: {upload_path.absolute()}")
        print(f"   Exists: {upload_path.exists()}")
        print(f"   Is directory: {upload_path.is_dir() if upload_path.exists() else 'N/A'}")
        
        if upload_path.exists():
            # Listar contenido
            items = list(upload_path.iterdir())
            print(f"   Items inside: {len(items)}")
            for item in items[:5]:
                print(f"      - {item.name}")
            if len(items) > 5:
                print(f"      ... and {len(items) - 5} more")
        
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # 5. Verificar mounts
    print(f"\n5. MOUNTED VOLUMES:")
    try:
        with open('/proc/mounts', 'r') as f:
            mounts = f.read()
            if 'uploads' in mounts:
                print("   Found 'uploads' in mounts:")
                for line in mounts.split('\n'):
                    if 'uploads' in line or 'volume' in line:
                        print(f"      {line}")
            else:
                print("   No 'uploads' mount found")
    except Exception as e:
        print(f"   Cannot read /proc/mounts: {e}")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    test_volume()

