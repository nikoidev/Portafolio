from sqlalchemy.orm import Session
from app.models.cv import CV
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class CVService:
    """
    Service for managing CV operations
    
    This service ensures only one CV exists in the system at any time.
    The CV is stored directly in the database as binary data.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def get_cv(self) -> Optional[CV]:
        """
        Get the current CV (only one can exist)
        
        Returns:
            CV object if exists, None otherwise
        """
        return self.db.query(CV).first()

    def create_or_replace_cv(self, filename: str, file_data: bytes, file_size: int) -> CV:
        """
        Create a new CV or replace the existing one
        
        This method ensures only one CV exists at any time.
        If a CV already exists, it will be deleted and replaced.
        
        Args:
            filename: Name of the PDF file
            file_data: Binary content of the PDF
            file_size: Size of the file in bytes
            
        Returns:
            The newly created CV object
        """
        # Delete existing CV if present
        existing_cv = self.get_cv()
        if existing_cv:
            logger.info(f"Replacing existing CV (id: {existing_cv.id})")
            self.db.delete(existing_cv)
            self.db.flush()
        
        # Create new CV
        cv = CV(
            filename=filename,
            file_data=file_data,
            file_size=file_size
        )
        self.db.add(cv)
        self.db.commit()
        self.db.refresh(cv)
        
        logger.info(f"Created new CV (id: {cv.id}, filename: {filename})")
        return cv

    def delete_cv(self) -> bool:
        """
        Delete the current CV
        
        Returns:
            True if CV was deleted, False if no CV exists
        """
        cv = self.get_cv()
        if not cv:
            logger.warning("Attempted to delete CV but none exists")
            return False
        
        self.db.delete(cv)
        self.db.commit()
        
        logger.info(f"Deleted CV (id: {cv.id})")
        return True

    def cv_exists(self) -> bool:
        """
        Check if a CV exists in the system
        
        Returns:
            True if CV exists, False otherwise
        """
        return self.db.query(CV).count() > 0
    
    def get_cv_file_data(self) -> Optional[tuple[bytes, str]]:
        """
        Get the CV file binary data and filename
        
        Returns:
            Tuple of (file_data, filename) if CV exists, None otherwise
        """
        cv = self.get_cv()
        if cv:
            return (cv.file_data, cv.filename)
        return None

