export const datasetDefinitions = [
  {
    name: 'oeuvres',
    load: async () => {
      const module = await import('./oeuvres.mjs');
      return module.oeuvresDataset;
    },
  },
];

export const datasetNames = datasetDefinitions.map(({ name }) => name);

export async function loadDatasets() {
  return Promise.all(datasetDefinitions.map(({ load }) => load()));
}