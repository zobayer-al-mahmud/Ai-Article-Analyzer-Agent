from pydantic import BaseModel, EmailStr, HttpUrl


class RequestModel(BaseModel):
    """
    Model for validating incoming article analysis requests.
    """
    email: EmailStr
    article_url: HttpUrl


class ResponseModel(BaseModel):
    """
    Model for successful response.
    """
    success: bool
    session_id: str
    forwarded: bool
