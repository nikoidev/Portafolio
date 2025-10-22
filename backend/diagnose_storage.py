"""
Script para diagnosticar el almacenamiento de uploads
Ejecutar en Railway: railway run python diagnose_storage.py
"""
import os
from pathlib import Path
from app.core.config import settings

def get_directory_size(path):
    """Calcular el tamaño total de un directorio"""
    total = 0
    try:
        for entry in os.scandir(path):
            if entry.is_file():
                total += entry.stat().st_size
            elif entry.is_dir():
                total += get_directory_size(entry.path)
    except Exception as e:
        print(f"Error al leer {path}: {e}")
    return total

def format_bytes(bytes):
    """Formatear bytes a formato legible"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024
    return f"{bytes:.2f} TB"

def diagnose():
    print("=" * 80)
    print("DIAGNOSTICO DE ALMACENAMIENTO")
    print("=" * 80)
    
    upload_dir = Path(settings.UPLOAD_DIR)
    
    print(f"\n1. CONFIGURACION:")
    print(f"   UPLOAD_DIR: {settings.UPLOAD_DIR}")
    print(f"   Ruta absoluta: {upload_dir.absolute()}")
    print(f"   Existe: {upload_dir.exists()}")
    
    if not upload_dir.exists():
        print(f"\n   ERROR: El directorio no existe!")
        return
    
    print(f"\n2. ESPACIO USADO:")
    
    # Calcular tamaño por subdirectorio
    subdirs = {}
    total_size = 0
    total_files = 0
    
    for subdir in upload_dir.iterdir():
        if subdir.is_dir():
            size = get_directory_size(subdir)
            files = len(list(subdir.rglob("*.*")))
            subdirs[subdir.name] = {"size": size, "files": files}
            total_size += size
            total_files += files
    
    # Ordenar por tamaño
    sorted_dirs = sorted(subdirs.items(), key=lambda x: x[1]["size"], reverse=True)
    
    for dirname, info in sorted_dirs:
        print(f"   {dirname:30s} {format_bytes(info['size']):>12s}  ({info['files']} archivos)")
    
    print(f"\n   {'TOTAL':30s} {format_bytes(total_size):>12s}  ({total_files} archivos)")
    
    print(f"\n3. INFORMACION DEL SISTEMA DE ARCHIVOS:")
    try:
        stat = os.statvfs(upload_dir)
        total_space = stat.f_blocks * stat.f_frsize
        free_space = stat.f_bavail * stat.f_frsize
        used_space = total_space - free_space
        
        print(f"   Espacio total: {format_bytes(total_space)}")
        print(f"   Espacio usado: {format_bytes(used_space)} ({used_space/total_space*100:.1f}%)")
        print(f"   Espacio libre: {format_bytes(free_space)} ({free_space/total_space*100:.1f}%)")
    except Exception as e:
        print(f"   No se pudo obtener info del sistema: {e}")
    
    print(f"\n4. ULTIMOS 20 ARCHIVOS (mas recientes):")
    all_files = []
    for file_path in upload_dir.rglob("*.*"):
        if file_path.is_file():
            try:
                stat = file_path.stat()
                all_files.append({
                    "path": file_path.relative_to(upload_dir),
                    "size": stat.st_size,
                    "mtime": stat.st_mtime
                })
            except:
                pass
    
    # Ordenar por fecha de modificación (más recientes primero)
    all_files.sort(key=lambda x: x["mtime"], reverse=True)
    
    from datetime import datetime
    for f in all_files[:20]:
        mtime = datetime.fromtimestamp(f["mtime"]).strftime("%Y-%m-%d %H:%M:%S")
        print(f"   {mtime}  {format_bytes(f['size']):>10s}  {f['path']}")
    
    if len(all_files) > 20:
        print(f"   ... y {len(all_files) - 20} archivos mas")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    diagnose()

