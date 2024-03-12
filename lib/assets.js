const fs = require("fs");
const path = require("path");
const https = require("https");
var request = require("request");

// The path of the directory to save the image
const dirPath = "./images";

export const downloadAsset = async (imageUrl,imageName) => {
  const file = fs.createWriteStream(path.join(dirPath, imageName));
  https
    .get(imageUrl, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`Image downloaded as ${imageName}`);
      });
    })
    .on("error", (err) => {
      fs.unlink(imageName);
      console.error(`Error downloading image: ${err.message}`);
    });
};

export const uploadAsset = async (repo, token) => {
  var options = {
    method: "POST",
    url: "https://asset-api.prismic.io/assets",
    headers: {
      repository: repo,
      Authorization: `Bearer ${token}`,
    },
    formData: {
      file: {
        value: fs.createReadStream("/Dev/prismic-migrator/images/sudokus.jpg"),
        options: {
          filename: "/Dev/prismic-migrator/images/sudokus.jpg",
          contentType: null,
        },
      },
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};

export const getToken = async () => {
  // Get an auth token
  const authResponse = await fetch("https://auth.prismic.io/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: process.env.Repo_Login_Email,
      password: process.env.Repo_Login_Password,
    }),
  });

  const token = await authResponse.text();
  return token;
};
