import jwt from "jsonwebtoken";

// Generate a JSON Web Token (JWT) with the provided payload
export async function generateToken(payload) {
  const generatedToken = jwt.sign(payload, "IIVSIUVISUBCIBUIWVFYUVWVY", {
    expiresIn: "24h",
  });
  return generatedToken;
}

// Verify and decode a JWT to extract the payload
export async function verifyToken(generatedToken) {
  return jwt.verify(generatedToken, "IIVSIUVISUBCIBUIWVFYUVWVY");
}
