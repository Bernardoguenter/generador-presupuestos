import type { Address, GatesMeasurements, Preferences } from "./types";

const calculateGatePrice = (
  gates_measurements: GatesMeasurements[],
  gate_price: number
) => {
  const square_meters = gates_measurements
    .map((gate) => gate.height * gate.width)
    .reduce((sum, acc) => sum + acc, 0);

  if (square_meters <= 22.5) return 0;

  return (square_meters - 22.5) * gate_price;
};

const calculalteGutterPrice = (
  gutter_metters: number,
  gutter_price: number
) => {
  return gutter_metters * gutter_price;
};

export const calculateDistance = async (
  originAddress: Address,
  destinationAddress: Address
): Promise<number> => {
  const service = new google.maps.DistanceMatrixService();

  const origin1 = { lat: originAddress.lat, lng: originAddress.lng };
  const origin2 = originAddress.address;
  const destinationA = destinationAddress.address;
  const destinationB = {
    lat: destinationAddress.lat,
    lng: destinationAddress.lng,
  };

  const request = {
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

  const response = await service.getDistanceMatrix(request);
  return Math.ceil(response.rows[0].elements[0].distance.value / 1000);
};

export const calculateFreightPrice = (
  distance: number,
  price_per_km: number
) => {
  return distance * price_per_km;
};

export const getBudgetTotal = (
  preferences: Preferences,
  width: number,
  length: number,
  height: number,
  enclousure_height: number,
  structure_type: string,
  material: string,
  color_roof_sheet: boolean,
  color_side_sheet: boolean,
  gutter_metters: number,
  gates_measurements: GatesMeasurements[] | [],
  includes_gate: boolean,
  includes_taxes: boolean,
  freight_price: number,
  has_gutter: boolean
) => {
  const {
    colored_sheet_difference,
    default_markup,
    gate_price,
    gutter_price,
    enclousure_cost,
    solid_web_cost,
    twisted_iron_cost,
    u_profile_cost,
    iva_percentage,
    solid_web_column_cost,
    twisted_iron_column_cost,
    u_profile_column_cost,
  } = preferences;

  const floorArea = width * length;
  const perimeter = 2 * (width + length);
  const enclousureArea = perimeter * enclousure_height;

  const price_per_meter =
    material === "Hierro torsionado"
      ? twisted_iron_cost
      : material === "Perfil u Ángulo"
      ? u_profile_cost
      : solid_web_cost;

  //CALCULAR PRECIO DE ESTRUCTURA
  const structure_cost = floorArea * price_per_meter;

  //CALCULAR COLUMNAS
  const numberOfColumns = Math.floor(length / 5) + 1;
  const totalColumns = numberOfColumns * 2;

  const columnsPrice =
    material === "Hierro torsionado"
      ? twisted_iron_column_cost
      : material === "Perfil U Ángulo"
      ? u_profile_column_cost
      : solid_web_column_cost;

  const columnsCost =
    height === 5
      ? 0
      : totalColumns *
        Math.abs(height - 5) *
        columnsPrice *
        (height > 5 ? 1 : -1);

  //CALCULAR COSTO CERRAMIENTO
  const enclousureCost =
    structure_type === "Tinglado" ? 0 : enclousureArea * enclousure_cost;

  //CALCULAR COSTO CERRAMIENTO COLOR
  const enclousureColorCost = color_side_sheet
    ? enclousureArea * colored_sheet_difference
    : 0;

  //CAMBIO DE COSTO TECHO POR CHAPA A COLOR
  const roofShettColor = color_roof_sheet
    ? floorArea * colored_sheet_difference
    : 0;

  //CALCULAR COSTO DE CANALETAS
  const gutterCost = has_gutter
    ? calculalteGutterPrice(gutter_metters, gutter_price)
    : 0;

  //CALCULAR COSTO DE PORTÓN
  const gateCost = includes_gate
    ? calculateGatePrice(gates_measurements, gate_price)
    : 0;

  //CALCULAR PRECIO TOTAL
  const totalPrice =
    structure_cost +
    columnsCost +
    enclousureCost +
    enclousureColorCost +
    roofShettColor +
    freight_price +
    gutterCost +
    gateCost;

  const priceBeforeTaxes = includes_taxes
    ? totalPrice
    : (totalPrice * (100 - iva_percentage)) / 100;

  const finalPriceInDollars =
    default_markup > 0
      ? priceBeforeTaxes * (1 + default_markup / 100)
      : priceBeforeTaxes;

  return finalPriceInDollars;
};
