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
  solid_web_cost: number;
  u_profile_cost: number;
  twisted_iron_cost: number;
  enclousure_cost: number;
  gutter_price: number;
  gate_price: number;
  iva_percentage: number;
  twisted_iron_column_cost: number;
  solid_web_column_cost: number;
  u_profile_column_cost: number;
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
  silo_type: string;
  includes_freight: boolean;
  freight_price: number;
  address: Address | null;
  includes_taxes: boolean;
  total: number;
  details: string;
  description: string;
  paymentMethods: string;
  caption: string;
  budget_markup: number;
  cone_base: string;
}

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

export interface PDFBudget {
  budget_id: string;
  customer: string;
  details: string;
  payment_method: string;
  width: number;
  length: number;
  height: number;
  enclousure_height: number;
  structure_type: string;
  material: string;
  color_roof_sheet: boolean;
  color_side_sheet: boolean;
  gutter_metters: number;
  gates_measurements: GatesMeasurements[] | [];
  includes_gate: boolean;
  includes_taxes: boolean;
  freight_price: number;
  has_gutter: boolean;
}

export interface PDFInfo {
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
