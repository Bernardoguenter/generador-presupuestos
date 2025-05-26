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
  fullAddress: string;
  email: string | null;
  created_at: Date;
}

export interface Preferences {
  company_id: string;
  dollar_quote: number;
  default_markup: number;
  wharehouse_prices: WharehousePriceMap;
  shed_prices: ShedhousePriceMap;
  gate_price: number;
  km_price: number;
  colored_sheet_difference: number;
  solid_web_difference: number;
  u_profile_difference: number;
}

type AreaWharehouse =
  | 50
  | 75
  | 100
  | 150
  | 200
  | 250
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 1000;

export type WharehousePriceMap = Partial<Record<AreaWharehouse, number>>;

type AreaShed =
  | 50
  | 75
  | 100
  | 150
  | 200
  | 250
  | 300
  | 400
  | 500
  | 600
  | 800
  | 1000;

export type ShedhousePriceMap = Partial<Record<AreaShed, number>>;

export interface Budget {
  id: string;
  created_by: string;
  created_at: string;
  customer: string;
  material: string;
  structure_type: string;
  width: number;
  length: number;
  height: number;
  enclousure_height: number;
  includes_freight: boolean;
  city: string;
  color_roof_sheet: boolean;
  color_side_sheet: boolean;
  gate_width: number;
  gate_height: number;
  includes_taxes: number;
  total: number;
  details: string;
}
