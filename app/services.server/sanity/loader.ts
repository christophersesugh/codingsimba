import * as queryStore from "@sanity/react-loader";
import { createClient, type ClientConfig } from "@sanity/client";

const { SANITY_STUDIO_DATASET, SANITY_STUDIO_PROJECT_ID } = process.env;

const config: ClientConfig = {
  projectId: SANITY_STUDIO_PROJECT_ID,
  dataset: SANITY_STUDIO_DATASET,
  apiVersion: "2025-03-31",
  useCdn: true,
};

const client = createClient(config);

queryStore.setServerClient(client);
export const { loadQuery } = queryStore;
