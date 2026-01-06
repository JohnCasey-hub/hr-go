import { getCookie } from "cookies-next";

export default function handler(req, res) {
  const loggedIn = getCookie("admin_logged_in", { req, res }) === "true";
  res.status(200).json({ loggedIn });
}
