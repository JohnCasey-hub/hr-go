import { getCookie } from "cookies-next";

export default function handler(req, res) {
  const loggedIn = getCookie("adminLoggedIn", { req, res }) === "true";
  res.status(200).json({ loggedIn });
}