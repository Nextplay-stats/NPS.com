const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");

admin.initializeApp();

const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const resolveHtml = (filename) => path.join(__dirname, "../public", filename);

exports.setSession = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, async () => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const idToken = req.body?.idToken;
    if (!idToken) return res.status(400).send("Missing ID token");

    try {
      await admin.auth().verifyIdToken(idToken);
      const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE });

      res.cookie("__session", sessionCookie, {
        maxAge: SESSION_MAX_AGE,
        httpOnly: true,
        secure: true,
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

exports.authCheckHomepage = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, async () => {
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
});

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can set roles");
  }

  const { uid, role } = data;
  await admin.auth().setCustomUserClaims(uid, { role });
  return { message: `Role ${role} set for user ${uid}` };
});

exports.authCheckCoach = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, async () => {
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
});

exports.authCheckAdmin = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, async () => {
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
});