// https://prismic.io/docs/migration-api-technical-reference
// https://prismic.io/docs/custom-types-api

import * as prismic from "@prismicio/client";
import { downloadAsset ,uploadAsset} from "@/lib/assets";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default async function handler(req, res) {
  try {
  //  await downloadAsset()
  //  return res.status(200).json({ok:true})
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

    await uploadAsset("testkkkpl",token)
    //return res.status(200).json({ok:true})
    //Get all types
    const typesRes = await fetch("https://customtypes.prismic.io/customtypes", {
      headers: {
        repository: "happy-puzzling",
        Authorization: `Bearer ${token}`,
      },
    });
    const types = await typesRes.json();
    console.log(types, "done");

    // migrate all types
    // for (let i = 0; i < types.length; i++) {
    //   await fetch("https://customtypes.prismic.io/customtypes/insert", {
    //     method: "POST",
    //     headers: {
    //       repository: "testkkkpl",
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(types[i]),
    //   });
    // }

    //Get all documents
    const client = prismic.createClient("happy-puzzling", {});
    let allDocuments = await client.dangerouslyGetAll();

    console.log(allDocuments.length);
    //Get all assets
    const myHeaders = new Headers();
    myHeaders.append("repository", "testkkkpl");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const rrr = await fetch(
      "https://asset-api.prismic.io/assets",
      requestOptions
    );
    const assets = await rrr.text();
    //Upload assets
   // return res.status(200).json({ name: JSON.parse(assets) });
    for (let i = 0; i < allDocuments.length; i++) {
      allDocuments[0].data.thumb = {};
      const r = await fetch("https://migration.prismic.io/documents", {
        method: "POST",
        headers: {
          repository: "testkkkpl",
          "x-api-key": "CCNIlI0Vz41J66oFwsHUXaZa6NYFIY6z7aDF62Bc",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          ...allDocuments[i],
          title: `document ${i}`,
        }),
      });
      const ans = await r.text();
      console.log(ans);
      await delay(1500);
    }
    return res.status(200).json({ name: allDocuments[0] });
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ name: "John Doe" });
}
