# app/interfaces/controllers/registration_controller.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.database import get_db

from app.services.RegistrationService import RegistrationService

router = APIRouter(prefix="/api/registration", tags=["registration"])

@router.post("/")
def submit_registration(name: str, email: str, motivation: str, captcha_token: str, session: Session = Depends(get_db)):
    # TODO: vérifier captcha via Google/hCaptcha
    if captcha_token != "ok":  # MOCK
        raise HTTPException(status_code=400, detail="Captcha invalide")
    
    service = RegistrationService(session)
    request = service.create_request(name, email, motivation)
    return {"message": "Demande enregistrée. Vérifiez vos emails pour confirmer."}

@router.get("/verify/{token}")
def verify_registration(token: str, session: Session = Depends(get_db)):
    service = RegistrationService(session)
    if not service.verify_email(token):
        raise HTTPException(status_code=400, detail="Token invalide")
    return {"message": "Email vérifié avec succès !"}

# --- Admin endpoints ---
@router.post("/{request_id}/approve")
def approve_registration(request_id: str, session: Session = Depends(get_db)):
    service = RegistrationService(session)
    if not service.approve(request_id):
        raise HTTPException(status_code=404, detail="Demande introuvable")
    return {"message": "Demande approuvée"}

@router.post("/{request_id}/reject")
def reject_registration(request_id: str, session: Session = Depends(get_db)):
    service = RegistrationService(session)
    if not service.reject(request_id):
        raise HTTPException(status_code=404, detail="Demande introuvable")
    return {"message": "Demande rejetée"}
