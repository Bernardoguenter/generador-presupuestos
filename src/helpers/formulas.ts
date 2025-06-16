import type { Address, GatesMeasurements, Preferences } from "./types";

export function interp1d(area: number[], price: number[]) {
  return function (floor_area: number) {
    if (floor_area <= area[0]) return price[0];
    if (floor_area >= price[area.length - 1]) return price[price.length - 1];
    let i = 1;
    while (floor_area > area[i]) i++;
    const xL: number = area[i - 1],
      yL: number = price[i - 1],
      xR: number = area[i],
      yR: number = price[i];

    const price_per_meter = yL + ((floor_area - xL) / (xR - xL)) * (yR - yL);

    return price_per_meter;
  };
}

const calculateGatePrice = (
  gates_measurements: GatesMeasurements[],
  gate_price: number
) => {
  const square_meters = gates_measurements
    .map((gate) => gate.height * gate.width)
    .reduce((sum, acc) => sum + acc, 0);
  return square_meters * gate_price;
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
    shed_prices,
    solid_web_difference,
    u_profile_difference,
    wharehouse_prices,
    iva_percentage,
    solid_web_column_cost,
    twisted_iron_column_cost,
    u_profile_column_cost,
  } = preferences;

  const wharehouse_priceList = {
    area: Object.keys(wharehouse_prices).map(Number),
    price: Object.values(wharehouse_prices),
  };
  const shed_priceList = {
    area: Object.keys(shed_prices).map(Number),
    price: Object.values(shed_prices),
  };

  const floorArea = width * length;
  const perimeter = 2 * (width + length);
  const wallsArea = perimeter * height;
  const enclousureArea = perimeter * enclousure_height;
  const totalArea = floorArea + wallsArea;

  //SELECCINOAR LISTA DE PRECIOS
  const priceList =
    structure_type === "Galpón" ? wharehouse_priceList : shed_priceList;
  const interp = interp1d(priceList.area, priceList.price);
  let pricePerMeter = interp(floorArea);

  if (material === "Perfil U Ángulo") {
    pricePerMeter += u_profile_difference;
  } else if (material === "Alma Llena") {
    pricePerMeter += solid_web_difference;
  }

  //CALCULAR COLUMNAS
  const numberOfColumns = Math.floor(length / 5) + 1;
  const totalColumns = numberOfColumns * 2;

  const columnsPrice =
    material === "Hierro Torsionado"
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
    structure_type === "Tinglado"
      ? 0
      : Math.abs(enclousure_height - 4.5) *
        perimeter *
        25 *
        (enclousure_height > 4.5 ? 1 : -1);

  //CALCULAR COSTO CERRAMIENTO COLOR
  const enclousureColorCost = color_side_sheet
    ? enclousureArea * colored_sheet_difference
    : 0;

  //CALCULO COSTO PISO
  const floorCost = floorArea * pricePerMeter;

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
    floorCost +
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

  const priceWithMarkup =
    default_markup > 0
      ? priceBeforeTaxes * (1 + default_markup / 100)
      : priceBeforeTaxes;

  //CALCULO DE TOTALES EN USD
  const finalPriceInDollars = priceWithMarkup;

  return { priceWithMarkup, finalPriceInDollars, totalArea };
};
