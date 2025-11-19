export default async function handler(req, res) {
  const VERIFY_TOKEN = "zuj7erv!ngy1xtf2PKZ";  // Gleicher Token wie in Meta
 
  // Parameter auslesen
  const target = req.query.target;
 
  // 1. GET Request = Meta Verification
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
 
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
 
    return res.status(403).send("Verification failed");
  }
  // Ab hier: POST Requests (Lead Events) → Weiterleitung an Zoho Flow
  if (req.method === "POST") {
    if (!target) {
      return res.status(400).json({ error: "Missing target URL" });
    }
 
    try {
      await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      });
 
      // Meta verlangt keine bestimmte Antwort
      return res.status(200).send("Forwarded");
    } catch (error) {
      console.error("Forwarding error:", error);
      return res.status(500).send("Forwarding failed");
    }
  }
 
  return res.status(405).send("Method not allowed");
}
