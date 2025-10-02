"""
Servicio para manejo de archivos y uploads
"""
import os
import uuid
from datetime import datetime
from typing import List, Optional, Tuple
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from PIL import Image
import aiofiles

from app.core.config import settings


class UploadService:
    def __init__(self):
        self.upload_dir = Path("uploads")
        self.max_file_size = settings.MAX_FILE_SIZE  # 10MB por defecto
        self.allowed_image_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
        self.allowed_file_types = {
            "application/pdf", "text/plain", "application/zip",
            "application/x-zip-compressed", "application/json"
        }
        
        # Crear directorios si no existen
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Crear directorios necesarios"""
        directories = [
            self.upload_dir / "images",
            self.upload_dir / "files", 
            self.upload_dir / "cv_pdfs",
            self.upload_dir / "temp"
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
    
    def _generate_filename(self, original_filename: str) -> str:
        """Generar nombre único para archivo"""
        file_extension = Path(original_filename).suffix.lower()
        unique_id = str(uuid.uuid4())
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"{timestamp}_{unique_id}{file_extension}"
    
    def _validate_file_size(self, file: UploadFile):
        """Validar tamaño del archivo"""
        if hasattr(file, 'size') and file.size and file.size > self.max_file_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"El archivo es demasiado grande. Máximo permitido: {self.max_file_size / 1024 / 1024:.1f}MB"
            )
    
    def _validate_image_type(self, file: UploadFile):
        """Validar tipo de imagen"""
        if file.content_type not in self.allowed_image_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tipo de archivo no permitido. Tipos permitidos: {', '.join(self.allowed_image_types)}"
            )
    
    def _validate_file_type(self, file: UploadFile):
        """Validar tipo de archivo general"""
        allowed_types = self.allowed_image_types.union(self.allowed_file_types)
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tipo de archivo no permitido. Tipos permitidos: {', '.join(allowed_types)}"
            )
    
    async def _save_file(self, file: UploadFile, file_path: Path) -> None:
        """Guardar archivo en disco"""
        try:
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al guardar archivo: {str(e)}"
            )
    
    def _optimize_image(self, file_path: Path, max_width: int = 1920, quality: int = 85) -> None:
        """Optimizar imagen (redimensionar y comprimir)"""
        try:
            with Image.open(file_path) as img:
                # Convertir a RGB si es necesario
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                # Redimensionar si es necesario
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Guardar con compresión
                img.save(file_path, format='JPEG', quality=quality, optimize=True)
        except Exception as e:
            # Si falla la optimización, mantener archivo original
            print(f"Warning: No se pudo optimizar la imagen {file_path}: {e}")
    
    async def upload_image(
        self, 
        file: UploadFile, 
        optimize: bool = True,
        max_width: int = 1920,
        quality: int = 85,
        project_slug: Optional[str] = None
    ) -> dict:
        """
        Subir y procesar imagen
        
        Args:
            file: Archivo de imagen
            optimize: Si optimizar la imagen
            max_width: Ancho máximo en píxeles
            quality: Calidad JPEG (1-100)
            project_slug: Slug del proyecto (para organizar imágenes por proyecto)
            
        Returns:
            dict: Información del archivo subido
        """
        # Validaciones
        self._validate_file_size(file)
        self._validate_image_type(file)
        
        # Determinar directorio de destino
        if project_slug:
            # Crear carpeta específica para el proyecto (usar ID como nombre de carpeta)
            # project_slug puede ser el ID del proyecto como string
            project_dir = self.upload_dir / "projects" / f"project_{project_slug}"
            project_dir.mkdir(parents=True, exist_ok=True)
            file_path = project_dir / self._generate_filename(file.filename or "image.jpg")
            url = f"/uploads/projects/project_{project_slug}/{file_path.name}"
        else:
            # Carpeta genérica (para otros usos)
            filename = self._generate_filename(file.filename or "image.jpg")
            file_path = self.upload_dir / "images" / filename
            url = f"/uploads/images/{filename}"
        
        # Guardar archivo
        await self._save_file(file, file_path)
        
        # Optimizar imagen si se solicita
        if optimize:
            self._optimize_image(file_path, max_width, quality)
        
        # Obtener información del archivo
        file_stats = file_path.stat()
        
        return {
            "filename": file_path.name,
            "original_filename": file.filename,
            "url": url,
            "file_path": str(file_path),
            "size": file_stats.st_size,
            "content_type": file.content_type,
            "uploaded_at": datetime.now().isoformat()
        }
    
    def delete_file(self, file_url: str) -> bool:
        """
        Eliminar un archivo del sistema
        
        Args:
            file_url: URL del archivo (ej: /uploads/images/archivo.jpg)
            
        Returns:
            bool: True si se eliminó correctamente
        """
        try:
            # Convertir URL a ruta del sistema
            if file_url.startswith("/uploads/"):
                file_path = self.upload_dir / file_url.replace("/uploads/", "")
            else:
                # Asumir que es una ruta relativa
                file_path = Path(file_url)
            
            # Verificar que el archivo existe
            if file_path.exists() and file_path.is_file():
                file_path.unlink()
                print(f"Archivo eliminado: {file_path}")
                return True
            else:
                print(f"Archivo no encontrado: {file_path}")
                return False
        except Exception as e:
            print(f"Error al eliminar archivo {file_url}: {e}")
            return False
    
    def delete_files(self, file_urls: List[str]) -> int:
        """
        Eliminar múltiples archivos
        
        Args:
            file_urls: Lista de URLs de archivos
            
        Returns:
            int: Cantidad de archivos eliminados exitosamente
        """
        deleted_count = 0
        for file_url in file_urls:
            if self.delete_file(file_url):
                deleted_count += 1
        return deleted_count
    
    def delete_project_folder(self, project_id: int) -> bool:
        """
        Eliminar toda la carpeta de un proyecto
        
        Args:
            project_id: ID del proyecto
            
        Returns:
            bool: True si se eliminó correctamente
        """
        try:
            import shutil
            project_dir = self.upload_dir / "projects" / f"project_{project_id}"
            
            if project_dir.exists() and project_dir.is_dir():
                shutil.rmtree(project_dir)
                print(f"Carpeta del proyecto eliminada: {project_dir}")
                return True
            else:
                print(f"Carpeta del proyecto no encontrada: {project_dir}")
                return False
        except Exception as e:
            print(f"Error al eliminar carpeta del proyecto {project_id}: {e}")
            return False
    
    async def upload_file(self, file: UploadFile, file_type: str = "general") -> dict:
        """
        Subir archivo general
        
        Args:
            file: Archivo a subir
            file_type: Tipo de archivo (general, cv_pdf, etc.)
            
        Returns:
            dict: Información del archivo subido
        """
        # Validaciones
        self._validate_file_size(file)
        self._validate_file_type(file)
        
        # Determinar directorio según tipo
        if file_type == "cv_pdf":
            subdirectory = "cv_pdfs"
        else:
            subdirectory = "files"
        
        # Generar nombre único
        filename = self._generate_filename(file.filename or "file")
        file_path = self.upload_dir / subdirectory / filename
        
        # Guardar archivo
        await self._save_file(file, file_path)
        
        # Obtener información del archivo
        file_stats = file_path.stat()
        
        return {
            "filename": filename,
            "original_filename": file.filename,
            "url": f"/uploads/{subdirectory}/{filename}",
            "file_path": str(file_path),
            "size": file_stats.st_size,
            "content_type": file.content_type,
            "uploaded_at": datetime.now().isoformat()
        }
    
    async def upload_video(
        self,
        file: UploadFile,
        project_slug: Optional[str] = None
    ) -> dict:
        """
        Subir un video al servidor
        """
        if not file.content_type or not file.content_type.startswith('video/'):
            raise ValueError("El archivo no es un video válido")
        
        # Determinar directorio de destino
        if project_slug:
            project_dir = self.upload_dir / "projects" / f"project_{project_slug}" / "videos"
            project_dir.mkdir(parents=True, exist_ok=True)
            file_path = project_dir / self._generate_filename(file.filename or "video.mp4")
            url = f"/uploads/projects/project_{project_slug}/videos/{file_path.name}"
        else:
            video_dir = self.upload_dir / "videos"
            video_dir.mkdir(parents=True, exist_ok=True)
            file_path = video_dir / self._generate_filename(file.filename or "video.mp4")
            url = f"/uploads/videos/{file_path.name}"
        
        # Guardar archivo
        await self._save_file(file, file_path)
        
        # Obtener información del archivo
        file_stats = file_path.stat()
        
        return {
            "filename": file_path.name,
            "original_filename": file.filename,
            "url": url,
            "file_path": str(file_path),
            "size": file_stats.st_size,
            "content_type": file.content_type,
            "uploaded_at": datetime.now().isoformat(),
            "thumbnail": None  # Se puede generar después si es necesario
        }
    
    async def upload_multiple_images(
        self, 
        files: List[UploadFile],
        optimize: bool = True,
        project_slug: Optional[str] = None
    ) -> List[dict]:
        """Subir múltiples imágenes"""
        results = []
        
        for file in files:
            try:
                result = await self.upload_image(
                    file, 
                    optimize=optimize,
                    project_slug=project_slug
                )
                results.append(result)
            except HTTPException as e:
                results.append({
                    "filename": file.filename,
                    "error": e.detail,
                    "status": "failed"
                })
        
        return results
    
    def delete_file(self, file_path: str) -> bool:
        """
        Eliminar archivo del sistema
        
        Args:
            file_path: Ruta del archivo a eliminar
            
        Returns:
            bool: True si se eliminó correctamente
        """
        try:
            full_path = Path(file_path)
            if full_path.exists() and full_path.is_file():
                full_path.unlink()
                return True
            return False
        except Exception as e:
            print(f"Error al eliminar archivo {file_path}: {e}")
            return False
    
    def get_file_info(self, filename: str, subdirectory: str = "images") -> Optional[dict]:
        """
        Obtener información de un archivo
        
        Args:
            filename: Nombre del archivo
            subdirectory: Subdirectorio (images, files, cv_pdfs)
            
        Returns:
            dict: Información del archivo o None si no existe
        """
        file_path = self.upload_dir / subdirectory / filename
        
        if not file_path.exists():
            return None
        
        file_stats = file_path.stat()
        
        return {
            "filename": filename,
            "url": f"/uploads/{subdirectory}/{filename}",
            "file_path": str(file_path),
            "size": file_stats.st_size,
            "created_at": datetime.fromtimestamp(file_stats.st_ctime).isoformat(),
            "modified_at": datetime.fromtimestamp(file_stats.st_mtime).isoformat()
        }
    
    def list_files(self, subdirectory: str = "images", limit: int = 50) -> List[dict]:
        """
        Listar archivos en un directorio
        
        Args:
            subdirectory: Subdirectorio a listar
            limit: Límite de archivos a retornar
            
        Returns:
            List[dict]: Lista de archivos
        """
        directory_path = self.upload_dir / subdirectory
        
        if not directory_path.exists():
            return []
        
        files = []
        for file_path in directory_path.iterdir():
            if file_path.is_file() and len(files) < limit:
                file_info = self.get_file_info(file_path.name, subdirectory)
                if file_info:
                    files.append(file_info)
        
        # Ordenar por fecha de modificación (más reciente primero)
        files.sort(key=lambda x: x['modified_at'], reverse=True)
        
        return files

