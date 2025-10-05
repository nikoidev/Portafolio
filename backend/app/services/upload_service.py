"""
Service for managing file uploads and deletions
"""
import os
import shutil
from pathlib import Path
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class UploadService:
    """Service for handling file upload operations"""
    
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.projects_dir = self.upload_dir / "projects"
    
    def delete_project_folder(self, project_id: int) -> bool:
        """
        Delete entire project folder and all its contents
        
        Args:
            project_id: ID of the project
            
        Returns:
            True if folder was deleted, False if folder doesn't exist
        """
        project_folder = self.projects_dir / f"project_{project_id}"
        
        if not project_folder.exists():
            logger.info(f"Project folder not found: {project_folder}")
            return False
        
        try:
            shutil.rmtree(project_folder)
            logger.info(f"Deleted project folder: {project_folder}")
            return True
        except Exception as e:
            logger.error(f"Error deleting project folder {project_folder}: {str(e)}")
            return False
    
    def get_project_folder(self, project_id: int) -> Path:
        """
        Get the path to a project's folder
        
        Args:
            project_id: ID of the project
            
        Returns:
            Path object to the project folder
        """
        return self.projects_dir / f"project_{project_id}"
    
    def ensure_project_folder(self, project_id: int) -> Path:
        """
        Ensure project folder exists, create if not
        
        Args:
            project_id: ID of the project
            
        Returns:
            Path object to the project folder
        """
        project_folder = self.get_project_folder(project_id)
        project_folder.mkdir(parents=True, exist_ok=True)
        return project_folder

