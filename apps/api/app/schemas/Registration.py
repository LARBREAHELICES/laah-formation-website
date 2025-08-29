from pydantic import BaseModel, EmailStr

class RegistrationRequest(BaseModel):
    name: str
    email: EmailStr
    motivation: str
    captcha_token: str   # jeton reçu du front (Google reCAPTCHA, hCaptcha…)
