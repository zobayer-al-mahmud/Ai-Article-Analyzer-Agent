from uuid import uuid4


def generate_session_id() -> str:
    """
    Generate a unique session ID using UUID4.
    
    Returns:
        str: A unique session identifier
    """
    return str(uuid4())
