"""
Endpoints for file uploads (images, videos, files)
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from datetime import datetime
from pathlib import Path
import logging

from app.core.deps import get_db, get_current_admin_user
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


# Allowed file types
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
ALLOWED_VIDEO_EXTENSIONS = {'.mp4', '.webm', '.mov'}
ALLOWED_FILE_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.zip'}

# Max file sizes (in bytes)
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB


def get_file_extension(filename: str) -> str:
    """Get file extension in lowercase"""
    return Path(filename).suffix.lower()


def validate_file(
    file: UploadFile,
    allowed_extensions: set,
    max_size: int,
    file_type: str = "file"
) -> None:
    """Validate uploaded file"""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No filename provided"
        )
    
    # Check extension
    ext = get_file_extension(file.filename)
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid {file_type} format. Allowed: {', '.join(allowed_extensions)}"
        )


def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename with timestamp and UUID"""
    ext = get_file_extension(original_filename)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())
    return f"{timestamp}_{unique_id}{ext}"


def save_upload_file(
    file: UploadFile,
    upload_dir: Path,
    filename: str
) -> str:
    """Save uploaded file and return relative URL"""
    try:
        # Ensure directory exists
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Full path to save file
        file_path = upload_dir / filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
        
        # Return relative URL from /uploads/
        relative_path = file_path.relative_to(Path(settings.UPLOAD_DIR))
        url = f"/uploads/{relative_path.as_posix()}"
        
        logger.info(f"File saved: {file_path} -> {url}")
        return url
        
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )


@router.post("/images", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    optimize: Optional[bool] = Form(False),
    project_slug: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Upload an image file (Admin only)
    
    Supports: jpg, jpeg, png, webp, gif
    Max size: 10MB
    """
    # Validate file
    validate_file(file, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, "image")
    
    # Determine upload directory
    if project_slug:
        upload_dir = Path(settings.UPLOAD_DIR) / "projects" / f"project_{project_slug}"
    else:
        upload_dir = Path(settings.UPLOAD_DIR) / "images"
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    
    # Save file
    url = save_upload_file(file, upload_dir, unique_filename)
    
    # Get file size
    file_path = Path(settings.UPLOAD_DIR) / url.lstrip('/uploads/')
    file_size = file_path.stat().st_size if file_path.exists() else 0
    
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "url": url,
            "filename": unique_filename,
            "original_filename": file.filename,
            "size": file_size,
            "message": "Image uploaded successfully"
        }
    )


@router.post("/images/multiple", status_code=status.HTTP_201_CREATED)
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    optimize: Optional[bool] = Form(False),
    project_slug: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Upload multiple image files (Admin only)
    
    Supports: jpg, jpeg, png, webp, gif
    Max size per file: 10MB
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided"
        )
    
    uploaded_images = []
    errors = []
    
    for file in files:
        try:
            # Validate file
            validate_file(file, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, "image")
            
            # Determine upload directory
            if project_slug:
                upload_dir = Path(settings.UPLOAD_DIR) / "projects" / f"project_{project_slug}"
            else:
                upload_dir = Path(settings.UPLOAD_DIR) / "images"
            
            # Generate unique filename
            unique_filename = generate_unique_filename(file.filename)
            
            # Save file
            url = save_upload_file(file, upload_dir, unique_filename)
            
            # Get file size
            file_path = Path(settings.UPLOAD_DIR) / url.lstrip('/uploads/')
            file_size = file_path.stat().st_size if file_path.exists() else 0
            
            uploaded_images.append({
                "url": url,
                "filename": unique_filename,
                "original_filename": file.filename,
                "size": file_size
            })
            
        except HTTPException as e:
            errors.append({
                "filename": file.filename,
                "error": e.detail
            })
        except Exception as e:
            errors.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return JSONResponse(
        status_code=status.HTTP_201_CREATED if uploaded_images else status.HTTP_400_BAD_REQUEST,
        content={
            "images": uploaded_images,
            "errors": errors,
            "total_uploaded": len(uploaded_images),
            "total_failed": len(errors)
        }
    )


@router.post("/videos", status_code=status.HTTP_201_CREATED)
async def upload_video(
    file: UploadFile = File(...),
    project_slug: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Upload a video file (Admin only)
    
    Supports: mp4, webm, mov
    Max size: 100MB
    """
    # Validate file
    validate_file(file, ALLOWED_VIDEO_EXTENSIONS, MAX_VIDEO_SIZE, "video")
    
    # Determine upload directory
    if project_slug:
        upload_dir = Path(settings.UPLOAD_DIR) / "projects" / f"project_{project_slug}" / "videos"
    else:
        upload_dir = Path(settings.UPLOAD_DIR) / "videos"
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    
    # Save file
    url = save_upload_file(file, upload_dir, unique_filename)
    
    # Get file size
    file_path = Path(settings.UPLOAD_DIR) / url.lstrip('/uploads/')
    file_size = file_path.stat().st_size if file_path.exists() else 0
    
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "url": url,
            "filename": unique_filename,
            "original_filename": file.filename,
            "size": file_size,
            "message": "Video uploaded successfully"
        }
    )


@router.post("/files", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Upload a general file (Admin only)
    
    Supports: pdf, doc, docx, txt, zip
    Max size: 20MB
    """
    # Validate file
    validate_file(file, ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE, "file")
    
    # Upload directory
    upload_dir = Path(settings.UPLOAD_DIR) / "files"
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    
    # Save file
    url = save_upload_file(file, upload_dir, unique_filename)
    
    # Get file size
    file_path = Path(settings.UPLOAD_DIR) / url.lstrip('/uploads/')
    file_size = file_path.stat().st_size if file_path.exists() else 0
    
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "url": url,
            "filename": unique_filename,
            "original_filename": file.filename,
            "size": file_size,
            "message": "File uploaded successfully"
        }
    )


@router.delete("/files")
async def delete_file(
    file_url: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Delete a file by URL (Admin only)
    """
    try:
        # Convert URL to file path
        # URL format: /uploads/images/filename.jpg or /uploads/projects/project_1/filename.jpg
        if not file_url.startswith('/uploads/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file URL"
            )
        
        relative_path = file_url.lstrip('/uploads/')
        file_path = Path(settings.UPLOAD_DIR) / relative_path
        
        if not file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        # Delete file
        file_path.unlink()
        logger.info(f"File deleted: {file_path}")
        
        return {
            "message": "File deleted successfully",
            "url": file_url
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )

