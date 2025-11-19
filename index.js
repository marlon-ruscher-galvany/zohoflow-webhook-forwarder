export default async function handler(req, res) {

  const VERIFY_TOKEN = "zuj7erv!ngy1xtf2PKZ"; // dein Token
 
  // 1. GET-Request → Meta-Verifizierung

  if (req.method === "GET") {

    const mode = req.query["hub.mode"];

    const token = req.query["hub.verify_token"];

    const challenge = req.query["hub.challenge"];
 
    if (mode === "subscribe" && token === VERIFY_TOKEN) {

      return res.status(200).send(challenge);

    } else {

      return res.status(403).send("Verify token mismatch");

    }

  }
 
  // 2. POST → Lead-Daten an Zoho Flow weiterleiten

  if (req.method === "POST") {

    try {

      await fetch("DEINE_ZOHO_FLOW_URL", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(req.body),

      });
 
      return res.status(200).send("OK");

    } catch (err) {

      console.error(err);

      return res.status(500).send("Error forwarding to Zoho");

    }

  }
 
  // andere Methoden blocken

  return res.status(405).send("Method not allowed");

}

 
