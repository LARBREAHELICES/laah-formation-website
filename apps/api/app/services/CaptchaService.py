import httpx
import os
from fastapi import HTTPException, status
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from app.Settings import settings
from app.schemas.Registration import RegistrationRequest

async def verify_captcha(captcha_token: str):
    secret = settings.recaptcha_secret_key  # clé privée Google
    url = settings.url_captcha  # URL de vérification Google
    data = {"secret": secret, "response": captcha_token}

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, data=data)
        result = resp.json()

    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid captcha"
        )


conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",  # ou autre
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True
)

async def send_registration_email(data: RegistrationRequest):
    message = MessageSchema(
        subject="Nouvelle demande d’inscription",
        recipients=["admin@monsite.com"],  # à configurer
        body=f"""
        Nom: {data.name}
        Email: {data.email}
        Message: {data.message}
        """,
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
