import { getCookie } from "cookies-next";

export default function handler(req, res) {
  const cookie = getCookie("admin_logged_in", { req, res });
  res.status(200).json({ loggedIn: cookie === "true" });
}
