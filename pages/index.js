import { Button, Container, Heading } from "@chakra-ui/react";
import * as prismic from "@prismicio/client";
import { useState } from "react";
const repositoryName = "tsts";

import AssetsFetcher from "@/components/AssetsFetcher";
import AssetsDownloader from "@/components/AssetsDownloader";
import AssetsUploader from "@/components/AssetsUploader";
import DocumentsMigrator from "@/components/DocumentsMigrator";

export default function Home() {
  const [assets, setAssets] = useState([]);
  const[newAssets,setNewAssets]=useState([])
  const[isEnabled,setEnabled]=useState({})
console.log(newAssets)
  const [documents, setDocuments] = useState();
  const fetchDocuments = async () => {
    const client = prismic.createClient(repositoryName, {});
    const allDocuments = await client.dangerouslyGetAll();
    console.log(allDocuments);
    setDocuments(allDocuments);
  };

  const migrateDocuments = async () => {
    const a = await fetch("/api/hello");
    const n = await a.json();
    console.log(n, "bbbbb");
  };
  return (
    <Container maxW={"5xl"}>
      <Heading textAlign={"center"}>Prismic Migration Tool</Heading>
      <AssetsFetcher assets={assets} setAssets={setAssets} setEnabled={setEnabled} />
      <AssetsDownloader assets={assets} isEnabled={isEnabled} setEnabled={setEnabled} />
      <AssetsUploader assets={assets} setNewAssets={setNewAssets} isEnabled={isEnabled} setEnabled={setEnabled}/>
      <DocumentsMigrator newAssets={newAssets} isEnabled={isEnabled} />
      <Button onClick={fetchDocuments}>Fetch dicuments</Button>
      <Button onClick={migrateDocuments}>Migrate</Button>
    </Container>
  );
}
