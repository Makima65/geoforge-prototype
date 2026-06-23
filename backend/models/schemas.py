from pydantic import BaseModel
from typing import List, Optional

class MatchRequest(BaseModel):
    project_name: Optional[str] = None
    url: Optional[str] = None
    country: str
    region: str
    city: str
    mode: str

class Component(BaseModel):
    orig: str
    local: str
    notes: str
    spec_rating: Optional[int] = None
    supplier: Optional[str] = None
    price: Optional[float] = None

class MatchResponse(BaseModel):
    project_title: str
    original_parts_count: int
    local_alternatives_count: int
    match_quality: str
    components: List[Component]
    thumbnail_url: Optional[str] = None
    author_name: Optional[str] = None
