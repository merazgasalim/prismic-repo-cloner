export default async function handler(req, res) {
  try {
    // Get an auth token
    const authResponse = await fetch("https://auth.prismic.io/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "merazgasalim@gmail.com",
        password: "v77n7p5kVy8frUi",
      }),
    });

    const token = await authResponse.text();
    console.log(token, "ok", authResponse.status);

    const r = fetch("https://customtypes.prismic.io/customtypes", {
      headers: {
        repository: "tutorial-series",
        Authorization: `Bearer ${token}`,
      },
    });
    const ans = await r.json();
    console.log(ans, "done");
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ name: "John Doe" });
}
