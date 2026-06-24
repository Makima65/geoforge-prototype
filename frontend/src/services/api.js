export const runVectorMatch = async (payload) => {
  // Simulate network latency of the Agora edge cascade & Vector search
  await new Promise(resolve => setTimeout(resolve, 1500));

  let project_title = payload.project_name || "Custom Hardware Build";
  let thumbnail_url = "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
  let author_name = "Hardware Creator";

  if (payload.url && (payload.url.includes("youtube.com") || payload.url.includes("youtu.be"))) {
    project_title = "Extracted YouTube Build";
    author_name = "YouTube Maker";
  } else if (payload.mode === "maker") {
    project_title = "Extracted Build Specs";
    author_name = "Maker";
  }

  let components = [];
  if (project_title.includes("Solar Water Pump") || payload.project_name?.includes("Solar Water Pump")) {
    components = [
      { orig: "Grundfos SQFlex Pump", local: "Monarch 12V Submersible Pump", notes: "Same flow rate (4.5 m³/h)", price: 4500 },
      { orig: "Victron 100/30 MPPT", local: "EPEver 30A MPPT", notes: "Equivalent efficiency", price: 3200 },
      { orig: "HDPE Float Tank 500L", local: "Den Braven 500L Poly Tank", notes: "Same spec", price: 1500 },
      { orig: "Sensirion SHT31 Sensor", local: "DHT22 Module", notes: "Adequate precision", price: 250 }
    ];
  } else if (project_title.includes("Emergency Shelter") || payload.project_name?.includes("Emergency Shelter")) {
    components = [
      { orig: "Standard Aluminum Extrusion 2020", local: "Local Aluminum Profile 2020", notes: "Readily available", price: 600 },
      { orig: "Waterproof Canvas 500GSM", local: "Trapal (Heavy Duty Tarpaulin)", notes: "Cheaper and adapted", price: 800 },
    ];
  } else {
    components = [
      { orig: "Arduino Uno R3", local: "ESP32-WROOM", notes: "Better for IoT", supplier: "Makerlab Electronics", price: 350 },
      { orig: "NEMA 17 Stepper", local: "Generic NEMA 17 (1.5A)", notes: "Standard torque", supplier: "Makerlab Electronics", price: 450 },
      { orig: "L298N Motor Driver", local: "A4988 Stepper Driver", notes: "More efficient", supplier: "E-Gizmo", price: 120 },
      { orig: "12V Power Supply", local: "12V 5A Switching Power Supply", notes: "Enough current for steppers", supplier: "Makerlab Electronics", price: 350 },
      { orig: "Standard 5V Relay", local: "5V Dual Channel Relay Module", notes: "Standard 5V logic relay", supplier: "E-Gizmo", price: 95 },
      { orig: "16x2 LCD", local: "16x2 I2C LCD Display (5V)", notes: "Requires 5V I2C logic lines", supplier: "CircuitRocks", price: 180 },
      { orig: "DHT22 Sensor", local: "DHT22 Temperature & Humidity Sensor", notes: "Wide temp range", supplier: "Makerlab Electronics", price: 250 },
      { orig: "Jumper Wires", local: "Premium Jumper Wires (40pcs)", notes: "Assorted M-M, M-F, F-F", supplier: "E-Gizmo", price: 85 },
      { orig: "Push Buttons", local: "Tactile Push Buttons (10pcs)", notes: "Standard 6x6x5mm", supplier: "Makerlab Electronics", price: 30 },
    ];
  }

  const match_quality = components.length >= 3 ? "High" : "Medium";

  return {
    project_title,
    original_parts_count: components.length,
    local_alternatives_count: components.length,
    match_quality,
    components,
    thumbnail_url,
    author_name
  };
};
