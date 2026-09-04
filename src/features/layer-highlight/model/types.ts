export type LayerItem = {
  id: string;
  label: string;
  note?: string;
  // Ids this layer may depend on; they light up while the layer is active.
  reaches?: Array<string>;
};
