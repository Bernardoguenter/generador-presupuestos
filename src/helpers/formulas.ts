import type {
  Address,
  GatesMeasurements,
  Preferences,
  Silos,
  SolidWebPriceMap,
} from "./types";

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

const calculateSolidWebStructure = (
  width: number,
  solid_web_price_list: SolidWebPriceMap
) => {
  return width <= 8
    ? solid_web_price_list["8"]
    : width <= 12
    ? solid_web_price_list["12"]
    : width <= 16
    ? solid_web_price_list["16"]
    : width <= 20
    ? solid_web_price_list["20"]
    : width <= 25
    ? solid_web_price_list["25"]
    : solid_web_price_list["30"];
};

export const getStructureBudgetTotal = (
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
    twisted_iron_cost,
    u_profile_cost,
    iva_percentage,
    twisted_iron_column_cost,
    u_profile_column_cost,
    solid_web_price_list,
    solid_web_columns_price_list,
  } = preferences;

  const floorArea = width * length;
  const perimeter = 2 * (width + length);
  const enclousureArea = perimeter * enclousure_height;

  const price_per_meter =
    material === "Hierro torsionado"
      ? twisted_iron_cost
      : material === "Perfil u Ángulo"
      ? u_profile_cost
      : calculateSolidWebStructure(width, solid_web_price_list!);

  //CALCULAR PRECIO DE ESTRUCTURA
  const structure_cost = floorArea * price_per_meter;

  //CALCULAR COLUMNAS
  const numberOfColumns = Math.floor(length / 5) + 1;
  const totalColumns = numberOfColumns * 2;

  const columnsPrice =
    material === "Hierro torsionado"
      ? twisted_iron_column_cost
      : material === "Perfil u Ángulo"
      ? u_profile_column_cost
      : calculateSolidWebStructure(width, solid_web_columns_price_list);

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

export const getSiloBudgetTotal = (
  preferences: Preferences,
  includes_taxes: boolean,
  freight_price: number,
  silos: Silos
) => {
  const { default_markup, iva_percentage } = preferences;

  if (!silos || silos.length === 0) return 0;
  const totalSilosPrice = calculateSilosSubtotal(preferences, silos);

  const totalPrice = totalSilosPrice + freight_price;

  const priceBeforeTaxes = includes_taxes
    ? totalPrice
    : (totalPrice * (100 - iva_percentage)) / 100;

  const finalPriceInDollars =
    default_markup > 0
      ? priceBeforeTaxes * (1 + default_markup / 100)
      : priceBeforeTaxes;

  return finalPriceInDollars;
};

export const calculateSilosSubtotal = (
  preferences: Preferences,
  silos: Silos
): number => {
  const { airbase_silos, feeder_silos, cone_base_45, cone_base_55 } =
    preferences;

  if (!silos || silos.length === 0) return 0;

  return silos.reduce((acc, silo) => {
    const { type, capacity, cone_base } = silo;

    const priceList = type === "airbase_silos" ? airbase_silos : feeder_silos;

    const basePrice =
      priceList && priceList[capacity] ? priceList[capacity] : 0;

    let finalSiloPrice = basePrice;

    if (type === "airbase_silos" && cone_base && cone_base !== "estandar") {
      if (cone_base === "45") {
        finalSiloPrice = basePrice * (1 + (cone_base_45 ?? 0) / 100);
      } else if (cone_base === "55") {
        finalSiloPrice = basePrice * (1 + (cone_base_55 ?? 0) / 100);
      }
    }

    return acc + finalSiloPrice;
  }, 0);
};

export const calculateFreightArsPriceWithTaxesAndMarkup = (
  freight_price: number,
  dollar_quote: number,
  default_markup: number,
  budget_markup: number,
  includes_taxes: boolean,
  iva_percentage: number
) => {
  const totalPrice =
    freight_price *
    dollar_quote *
    (1 + default_markup / 100) *
    (1 + budget_markup / 100);

  return includes_taxes
    ? totalPrice
    : (totalPrice * (100 - iva_percentage)) / 100;
};

export const getSilosPricestArsPriceWithTaxesAndMarkup = (
  silosPrices: number[],
  dollar_quote: number,
  default_markup: number,
  budget_markup: number,
  includes_taxes: boolean,
  iva_percentage: number
) => {
  const result = silosPrices.map((silo) => {
    const totalPrice =
      silo *
      dollar_quote *
      (1 + default_markup / 100) *
      (1 + budget_markup / 100);

    return includes_taxes
      ? totalPrice
      : (totalPrice * (100 - iva_percentage)) / 100;
  });

  return result;
};

export const getSilosPricesListDollars = (
  silosPrices: number[],
  dollar_quote: number,
  default_markup: number,
  budget_markup: number,
  includes_taxes: boolean,
  iva_percentage: number
) => {
  const result = silosPrices.map((silo) => {
    const totalPrice =
      silo /
      dollar_quote /
      (1 + default_markup / 100) /
      (1 + budget_markup / 100);

    return includes_taxes
      ? totalPrice
      : (totalPrice * (100 - iva_percentage)) / 100;
  });

  return result;
};

export const getIndividualSiloPrices = (
  silos: Silos,
  preferences: Preferences
) => {
  const siloPrices = silos.map((silo) => {
    const prices = (
      preferences as unknown as Record<string, Record<string, number>>
    )[silo.type];
    const price = prices ? prices[silo.capacity as keyof typeof prices] : 0;
    return price || 0;
  });

  return siloPrices;
};
