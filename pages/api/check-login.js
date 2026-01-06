import { getCookie } from "cookies-next";

export default function handler(req, res) {
  const isLoggedIn = getCookie("admin_logged_in", { req, res }) === "true";
  res.status(200).json({ loggedIn: isLoggedIn });
}