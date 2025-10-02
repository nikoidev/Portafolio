"""
Endpoints para manejo de archivos y uploads
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin_user
from app.services.upload_service import UploadService

router = APIRouter()


@router.post("/images", response_model=dict)
async def upload_image(
    file: UploadFile = File(...),
    optimize: bool = Form(True),
    max_width: int = Form(1920),
    quality: int = Form(85),
    project_slug: Optional[str] = Form(None),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Subir una imagen (solo admin)"""
    upload_service = UploadService()
    
    try:
        result = await upload_service.upload_image(
            file=file,
            optimize=optimize,
            max_width=max_width,
            quality=quality,
            project_slug=project_slug
        )
        
        return {
            "message": "Imagen subida correctamente",
            "success": True,
            "data": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.post("/images/multiple", response_model=dict)
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    optimize: bool = Form(True),
    project_slug: Optional[str] = Form(None),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Subir múltiples imágenes (solo admin)"""
    upload_service = UploadService()
    
    if len(files) > 10:  # Límite de 10 archivos por request
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Máximo 10 archivos por solicitud"
        )
    
    try:
        results = await upload_service.upload_multiple_images(
            files=files,
            optimize=optimize,
            project_slug=project_slug
        )
        
        successful_uploads = [r for r in results if "error" not in r]
        failed_uploads = [r for r in results if "error" in r]
        
        return {
            "message": f"{len(successful_uploads)} imágenes subidas correctamente",
            "success": True,
            "data": {
                "successful": successful_uploads,
                "failed": failed_uploads,
                "total": len(files),
                "successful_count": len(successful_uploads),
                "failed_count": len(failed_uploads)
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.post("/files", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    file_type: str = Form("general"),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Subir un archivo general (solo admin)"""
    upload_service = UploadService()
    
    try:
        result = await upload_service.upload_file(
            file=file,
            file_type=file_type
        )
        
        return {
            "message": "Archivo subido correctamente",
            "success": True,
            "data": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.get("/images", response_model=dict)
async def list_images(
    limit: int = Query(50, ge=1, le=100),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Listar imágenes subidas (solo admin)"""
    upload_service = UploadService()
    
    try:
        images = upload_service.list_files(subdirectory="images", limit=limit)
        
        return {
            "message": "Imágenes obtenidas correctamente",
            "success": True,
            "data": {
                "images": images,
                "total": len(images)
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.get("/files", response_model=dict)
async def list_files(
    file_type: str = Query("files", regex="^(files|cv_pdfs)$"),
    limit: int = Query(50, ge=1, le=100),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Listar archivos subidos (solo admin)"""
    upload_service = UploadService()
    
    try:
        files = upload_service.list_files(subdirectory=file_type, limit=limit)
        
        return {
            "message": "Archivos obtenidos correctamente",
            "success": True,
            "data": {
                "files": files,
                "total": len(files),
                "type": file_type
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.get("/images/{filename}")
async def get_image(filename: str):
    """Obtener imagen (público)"""
    upload_service = UploadService()
    
    file_info = upload_service.get_file_info(filename, "images")
    if not file_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )
    
    return FileResponse(
        path=file_info["file_path"],
        media_type="image/jpeg",
        filename=filename
    )


@router.get("/files/{filename}")
async def get_file(filename: str, file_type: str = Query("files")):
    """Obtener archivo (público)"""
    upload_service = UploadService()
    
    file_info = upload_service.get_file_info(filename, file_type)
    if not file_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado"
        )
    
    return FileResponse(
        path=file_info["file_path"],
        filename=file_info.get("original_filename", filename)
    )


@router.delete("/images/{filename}")
async def delete_image(
    filename: str,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Eliminar imagen (solo admin)"""
    upload_service = UploadService()
    
    file_info = upload_service.get_file_info(filename, "images")
    if not file_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )
    
    success = upload_service.delete_file(file_info["file_path"])
    
    if success:
        return {
            "message": "Imagen eliminada correctamente",
            "success": True
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar la imagen"
        )


@router.delete("/files/{filename}")
async def delete_file(
    filename: str,
    file_type: str = Query("files"),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Eliminar archivo (solo admin)"""
    upload_service = UploadService()
    
    file_info = upload_service.get_file_info(filename, file_type)
    if not file_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado"
        )
    
    success = upload_service.delete_file(file_info["file_path"])
    
    if success:
        return {
            "message": "Archivo eliminado correctamente",
            "success": True
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el archivo"
        )


@router.get("/info/{filename}")
async def get_file_info(
    filename: str,
    file_type: str = Query("images", regex="^(images|files|cv_pdfs)$"),
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Obtener información de un archivo (solo admin)"""
    upload_service = UploadService()
    
    file_info = upload_service.get_file_info(filename, file_type)
    if not file_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado"
        )
    
    return {
        "message": "Información obtenida correctamente",
        "success": True,
        "data": file_info
    }

