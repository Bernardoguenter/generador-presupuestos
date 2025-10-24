export interface User {
  id: string;
  email: string;
  role: "superadmin" | "admin_empresa" | "usuario";
  created_at: Date;
  isPasswordChanged: boolean;
  fullName: string;
  company_id: string;
}

export interface Role {
  id: "superadmin" | "admin_empresa" | "usuario";
  label: string;
  description: string;
}

export interface Company {
  id: string;
  company_name: string;
  logo_url: string | null;
  phone: string;
  address: Address;
  hasPdfAddress: boolean;
  pdfAddress?: string;
  email: string | null;
  created_at: Date;
}

export interface Preferences {
  company_id: string;
  dollar_quote: number;
  default_markup: number;
  km_price: number;
  colored_sheet_difference: number;
  u_profile_cost: number;
  twisted_iron_cost: number;
  enclousure_cost: number;
  gutter_price: number;
  gate_price: number;
  iva_percentage: number;
  twisted_iron_column_cost: number;
  u_profile_column_cost: number;
  solid_web_price_list: SolidWebPriceMap;
  solid_web_columns_price_list: SolidWebPriceMap;
  feeder_silos: FeederSilosPriceMap;
  airbase_silos: AirbaseSilosPriceMap;
  cone_base_45: number;
  cone_base_55: number;
}

export interface StructureBudget {
  id: string;
  created_by: string | CreatedByObject;
  created_at: string;
  customer: string;
  material: string;
  structure_type: string;
  width: number;
  length: number;
  height: number;
  enclousure_height: number;
  includes_freight: boolean;
  freight_price: number;
  address: Address | null;
  color_roof_sheet: boolean;
  color_side_sheet: boolean;
  includes_taxes: boolean;
  total: number;
  details: string;
  includes_gate: boolean;
  number_of_gates: number;
  gates_measurements: GatesMeasurements[] | null;
  has_gutter: boolean;
  gutter_metters: number;
  description: string;
  paymentMethods: string;
  caption: string;
  budget_markup: number;
  distance: number | null;
}

export interface SiloBudget {
  id: string;
  created_by: string | CreatedByObject;
  created_at: string;
  customer: string;
  includes_freight: boolean;
  freight_price: number;
  address: Address | null;
  distance: number | null;
  includes_taxes: boolean;
  total: number;
  totals: SilosTotals;
  description: string;
  paymentMethods: string;
  caption: string;
  budget_markup: number;
  silos: Silos;
}

export interface SilosTotals {
  silos: number[];
  freight_price: number;
  extra_product_price?: number;
  total: number;
}

export interface Silo {
  type: string;
  capacity: string;
  cone_base?: string;
}

export type Silos = Silo[];

export type GatesMeasurements = {
  width: number;
  height: number;
};

type CreatedByObject = {
  id: string;
  fullName: string;
};

export type Address = {
  address: string;
  lat: number;
  lng: number;
};

export interface SiloPDFInfo {
  customer: string;
  includes_taxes: boolean;
  freight_price: number;
  includes_freight: boolean;
  total: number;
  distance?: number | null;
  customer_address?: string | null;
  dataToSubmit: Omit<SiloBudget, "created_at" | "id">;
}

export interface StructurePDFInfo {
  customer: string;
  details: string;
  structure_type: string;
  width: number;
  length: number;
  height: number;
  enclousure_height: number;
  includes_gate: boolean;
  includes_taxes: boolean;
  freight_price: number;
  includes_freight: boolean;
  total: number;
  distance?: number | null;
  customer_address?: string | null;
  dataToSubmit: Omit<StructureBudget, "created_at" | "id">;
}

export interface Totals {
  finalPriceInDollars: number;
}

export type WidthSolidWeb = 8 | 12 | 16 | 20 | 25 | 30;
export type SolidWebPriceMap = Record<WidthSolidWeb, number>;
export type AirbaseSilosPriceMap = Record<string, number>;
export type FeederSilosPriceMap = Record<string, number>;
