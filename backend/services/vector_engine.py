import asyncio
import urllib.request
import json
from models.schemas import MatchRequest, MatchResponse, Component

class VectorEngine:
    async def run_match(self, request: MatchRequest) -> MatchResponse:
        # Simulate network latency of the Agora edge cascade & Vector search
        await asyncio.sleep(1.5)

        thumbnail_url = None
        author_name = None
        project_title = request.project_name or "Custom Hardware Build"

        if request.url and ("youtube.com" in request.url or "youtu.be" in request.url):
            try:
                # Scrape real YouTube metadata via oEmbed API
                oembed_url = f"https://www.youtube.com/oembed?url={request.url}&format=json"
                req = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response:
                    data = json.loads(response.read().decode())
                    project_title = data.get("title", "Extracted YouTube Build")
                    thumbnail_url = data.get("thumbnail_url")
                    author_name = data.get("author_name")
            except Exception as e:
                print(f"YouTube scrape error: {e}")
                project_title = "Extracted YouTube Build"
                thumbnail_url = "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                author_name = "Hardware Creator"
        elif request.mode == "maker":
            project_title = "Extracted Build Specs"
            thumbnail_url = "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            author_name = "Maker"

        # Mock database mapping based on project type
        components = []
        if project_title and "Solar Water Pump" in project_title:
            components = [
                Component(orig="Grundfos SQFlex Pump", local="Monarch 12V Submersible Pump", notes="Same flow rate (4.5 m³/h), available at Handyman PH"),
                Component(orig="Victron 100/30 MPPT", local="EPEver 30A MPPT", notes="Equivalent efficiency, stocked on Lazada PH"),
                Component(orig="HDPE Float Tank 500L", local="Den Braven 500L Poly Tank", notes="Same spec, local distributor in Cebu"),
                Component(orig="Sensirion SHT31 Sensor", local="DHT22 Module", notes="Adequate precision for PH outdoor climate")
            ]
        elif project_title and "Emergency Shelter" in project_title:
            components = [
                Component(orig="Standard Aluminum Extrusion 2020", local="Local Aluminum Profile 2020", notes="Readily available at local hardware stores"),
                Component(orig="Waterproof Canvas 500GSM", local="Trapal (Heavy Duty Tarpaulin)", notes="Cheaper and culturally adapted for PH weather"),
            ]
        else:
            components = [
                Component(orig="Arduino Uno R3", local="ESP32-WROOM", notes="Better for IoT, readily available locally", supplier="Makerlab Electronics", price=350.0),
                Component(orig="NEMA 17 Stepper", local="Generic NEMA 17 (1.5A)", notes="Standard torque, Makerlab Electronics", supplier="Makerlab Electronics", price=450.0),
                Component(orig="L298N Motor Driver", local="A4988 Stepper Driver", notes="More efficient for 3D printer builds", supplier="E-Gizmo", price=120.0),
            ]

        match_quality = "High" if len(components) >= 3 else "Medium"

        return MatchResponse(
            project_title=project_title,
            original_parts_count=len(components),
            local_alternatives_count=len(components),
            match_quality=match_quality,
            components=components,
            thumbnail_url=thumbnail_url,
            author_name=author_name
        )
