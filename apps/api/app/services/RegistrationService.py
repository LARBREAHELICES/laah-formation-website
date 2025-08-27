# app/application/registration_service.py
import uuid
from datetime import datetime
from sqlmodel import Session, select
from app.models.RegistrationRequest import RegistrationRequest

def send_verification_email(email: str, token: str):
    # Placeholder for sending email logic
    print(f"Sending verification email to {email} with token {token}")

class RegistrationService:
    def __init__(self, session: Session):
        self.session = session

    def create_request(self, name: str, email: str, motivation: str) -> RegistrationRequest:
        token = str(uuid.uuid4())
        request = RegistrationRequest(
            name=name,
            email=email,
            motivation=motivation,
            verification_token=token,
            status="pending"
        )
        self.session.add(request)
        self.session.commit()
        self.session.refresh(request)

        send_verification_email(email, token)
        return request

    def verify_email(self, token: str) -> bool:
        statement = select(RegistrationRequest).where(RegistrationRequest.verification_token == token)
        result = self.session.exec(statement).first()
        if not result:
            return False
        result.status = "email_verified"
        result.updated_at = datetime.now()
        self.session.add(result)
        self.session.commit()
        return True

    def approve(self, request_id: uuid.UUID) -> bool:
        request = self.session.get(RegistrationRequest, request_id)
        if not request:
            return False
        request.status = "approved"
        request.updated_at = datetime.now()
        self.session.add(request)
        self.session.commit()
        return True

    def reject(self, request_id: uuid.UUID) -> bool:
        request = self.session.get(RegistrationRequest, request_id)
        if not request:
            return False
        request.status = "rejected"
        request.updated_at = datetime.now()
        self.session.add(request)
        self.session.commit()
        return True
