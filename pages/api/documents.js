import * as prismic from "@prismicio/client";

import { getToken } from "@/lib/assets";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const { newAssets } = req.body;


      const token = await getToken();
      //Get all types
      const typesRes = await fetch(
        "https://customtypes.prismic.io/customtypes",
        {
          headers: {
            repository: process.env.Source_Repo,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const types = await typesRes.json();
      console.log(types, "done");

      // migrate all types
      for (let i = 0; i < types.length; i++) {
        await fetch("https://customtypes.prismic.io/customtypes/insert", {
          method: "POST",
          headers: {
            repository: process.env.Destination_Repo,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(types[i]),
        });
      }

      //Get all documents
      const client = prismic.createClient(process.env.Source_Repo, {});
      let allDocuments = await client.dangerouslyGetAll();

      console.log(allDocuments.length);
      //Migrate documents
      for (let i = 0; i < allDocuments.length; i++) {
        const document = JSON.stringify(allDocuments[i]);
        //Update assets id with new one
        newAssets.forEach((asset) => {
          document.replaceAll(asset.prevID, asset.id);
        });

        const r = await fetch("https://migration.prismic.io/documents", {
          method: "POST",
          headers: {
            repository: process.env.Destination_Repo,
            "x-api-key": process.env.Migration_Api_Key,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...JSON.parse(document),
            title: `document ${i}`,
          }),
        });
        const ans = await r.text();
        console.log(ans);
        await delay(1500);
      }

      return res.status(200).json({ done: true });
    default:
      return res.status(500).json({ reason: "Not allowed" });
  }
}
