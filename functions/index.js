const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const cookieParser = require("cookie-parser");

admin.initializeApp();

// 🔑 Session cookie max age (7 days)
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// STEP 1: Function to set the session cookie after login
exports.setSession = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const idToken = req.body?.idToken;
    if (!idToken) {
      return res.status(400).send("Missing ID token");
    }

    try {
      // Verify the ID token from client
      await admin.auth().verifyIdToken(idToken);

      // Create a session cookie
      const sessionCookie = await admin.auth().createSessionCookie(idToken, {
        expiresIn: SESSION_MAX_AGE,
      });

      // Set cookie in response
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
});

// STEP 2: Function to protect homepage (any logged-in user)
exports.authCheckHomepage = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, async () => {
    const sessionCookie = req.cookies?.__session;

    if (!sessionCookie) {
      return res.redirect("/index.html");
    }

    try {
      await admin.auth().verifySessionCookie(sessionCookie, true);
      const homepagePath = path.join(process.cwd(), "../public/homepage.html");
      return res.sendFile(homepagePath);
    } catch (e) {
      console.error("authCheckHomepage error:", e);
      return res.redirect("/index.html");
    }
  });
});

// STEP 3: Callable function to assign roles (admin only)
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Only allow admins to assign roles
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can set roles");
  }

  const { uid, role } = data; // uid of the user, and role string
  await admin.auth().setCustomUserClaims(uid, { role });
  return { message: `Role ${role} set for user ${uid}` };
});

// STEP 4: Role-based page protection examples
exports.authCheckCoach = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, async () => {
    const sessionCookie = req.cookies?.__session;
    if (!sessionCookie) return res.redirect("/index.html");

    try {
      const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
      if (decoded.role === "coach") {
        const coachPath = path.join(process.cwd(), "../public/coach.html");
        return res.sendFile(coachPath);
      } else {
        return res.redirect("/index.html");
      }
    } catch (e) {
      console.error("authCheckCoach error:", e);
      return res.redirect("/index.html");
    }
  });
});

exports.authCheckAdmin = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, async () => {
    const sessionCookie = req.cookies?.__session;
    if (!sessionCookie) return res.redirect("/index.html");

    try {
      const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
      if (decoded.role === "admin") {
        const adminPath = path.join(process.cwd(), "../public/admin.html");
        return res.sendFile(adminPath);
      } else {
        return res.redirect("/index.html");
      }
    } catch (e) {
      console.error("authCheckAdmin error:", e);
      return res.redirect("/index.html");
    }
  });
});