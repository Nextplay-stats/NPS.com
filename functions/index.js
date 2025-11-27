const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

admin.initializeApp();

const app = express();
app.use(express.json());     // ✅ parse JSON bodies
app.use(cookieParser());     // ✅ parse cookies

// 🔑 Session cookie max age (7 days)
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// Helper to resolve HTML file paths reliably
const resolveHtml = (filename) => path.join(__dirname, "../public", filename);

// STEP 1: Function to set the session cookie after login
app.post("/setSession", async (req, res) => {
  const idToken = req.body?.idToken;
  if (!idToken) return res.status(400).send("Missing ID token");

  try {
    await admin.auth().verifyIdToken(idToken);
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE });

    res.cookie("__session", sessionCookie, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: true, // required on HTTPS
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).send({ status: "ok" });
  } catch (error) {
    console.error("setSession error:", error);
    return res.status(401).send("Unauthorized");
  }
});

// STEP 2: Protect homepage (any logged-in user)
app.get("/homepage", async (req, res) => {
  const sessionCookie = req.cookies?.__session;
  if (!sessionCookie) return res.redirect("/index.html");

  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    return res.sendFile(resolveHtml("homepage.html"));
  } catch (error) {
    console.error("authCheckHomepage error:", error);
    return res.redirect("/index.html");
  }
});

// STEP 3: Role-based protection for coach
app.get("/coach", async (req, res) => {
  const sessionCookie = req.cookies?.__session;
  if (!sessionCookie) return res.redirect("/index.html");

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    if (decoded.role === "coach") {
      return res.sendFile(resolveHtml("coach.html"));
    } else {
      return res.redirect("/index.html");
    }
  } catch (error) {
    console.error("authCheckCoach error:", error);
    return res.redirect("/index.html");
  }
});

// STEP 4: Role-based protection for admin
app.get("/admin", async (req, res) => {
  const sessionCookie = req.cookies?.__session;
  if (!sessionCookie) return res.redirect("/index.html");

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    if (decoded.role === "admin") {
      return res.sendFile(resolveHtml("admin.html"));
    } else {
      return res.redirect("/index.html");
    }
  } catch (error) {
    console.error("authCheckAdmin error:", error);
    return res.redirect("/index.html");
  }
});

// STEP 5: Callable function to assign roles (admin only)
exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can set roles");
  }

  const { uid, role } = data;
  await admin.auth().setCustomUserClaims(uid, { role });
  return { message: `Role ${role} set for user ${uid}` };
});

// Export the Express app as a Cloud Function
exports.app = functions.https.onRequest(app);