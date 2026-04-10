import { isEnclosureUniform } from "./formatData";
import type {
  Address,
  GatesMeasurements,
  Preferences,
  Silos,
  SolidWebPriceMap,
  StructureBudgetParams,
} from "@/types";

/**
 * Calculates the total price for gates based on measurements and unit price.
 *
 * @param {GatesMeasurements[]} gates_measurements - Array of gate measurements.
 * @param {number} gate_price - Price per square meter of gate.
 * @returns {number} Total gate price.
 */
const calculateGatePrice = (
  gates_measurements: GatesMeasurements[],
  gate_price: number,
) => {
  const square_meters = gates_measurements
    .map((gate) => gate.height * gate.width)
    .reduce((sum, acc) => sum + acc, 0);

  if (square_meters <= 22.5) return 0;

  return (square_meters - 22.5) * gate_price;
};

/**
 * Calculates the total price for gutters.
 *
 * @param {number} gutter_metters - Length of gutters in meters.
 * @param {number} gutter_price - Price per meter of gutter.
 * @returns {number} Total gutter price.
 */
const calculalteGutterPrice = (
  gutter_metters: number,
  gutter_price: number,
) => {
  return gutter_metters * gutter_price;
};

/**
 * Calculates driving distance between two addresses using Google Maps API.
 *
 * @param {Address} originAddress - Origin address with lat/lng.
 * @param {Address} destinationAddress - Destination address with lat/lng.
 * @returns {Promise<number>} Distance in kilometers (rounded up).
 */
export const calculateDistance = async (
  originAddress: Address,
  destinationAddress: Address,
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

/**
 * Calculates freight price based on distance and price per kilometer.
 *
 * @param {number} distance - Distance in kilometers.
 * @param {number} price_per_km - Price per kilometer.
 * @returns {number} Freight price.
 */
export const calculateFreightPrice = (
  distance: number,
  price_per_km: number,
) => {
  return distance * price_per_km;
};

/**
 * Determines the price per meter for solid web structures based on width.
 *
 * @param {number} width - Width of the structure.
 * @param {SolidWebPriceMap} solid_web_price_list - Price list mapping widths to prices.
 * @returns {number} Price per meter.
 */
const calculateSolidWebStructure = (
  width: number,
  solid_web_price_list: SolidWebPriceMap,
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

/**
 * Retrieves the factor for sheet options, handling special cases.
 *
 * @param {string} sheets_option - Selected sheet option.
 * @param {Preferences} preferences - User preferences containing sheet factors.
 * @returns {number} Sheet factor.
 */
export const getSheetsFactor = (
  sheets_option: string,
  preferences: Preferences,
) => {
  if (
    sheets_option === "Cincalum n°25 acanalada" ||
    sheets_option === "Cincalum n°25 trapezoidal"
  ) {
    return 0;
  }
  return preferences.sheets_options[sheets_option];
};

/**
 * Calculates the enclosure area based on structure dimensions and enclosure heights.
 *
 * @param {number} width - Width of the structure.
 * @param {number} length - Length of the structure.
 * @param {number[]} enclousure_height - Array of enclosure heights.
 * @returns {number} Enclosure area.
 */
export const calculateEnclousureArea = (
  width: number,
  length: number,
  enclousure_height: number[],
) => {
  const isUniform = isEnclosureUniform(enclousure_height);

  if (isUniform) {
    const perimeter = 2 * (width + length);
    return perimeter * enclousure_height[0];
  }

  const [left, right, front, back] = enclousure_height;
  return length * (left + right) + width * (front + back);
};

/**
 * Determines the price per meter based on material and structure width.
 *
 * @param {string} material - Selected material.
 * @param {number} width - Width of the structure.
 * @param {Preferences} preferences - User preferences containing costs.
 * @returns {number} Price per meter.
 */
export const calculatePricePerMeter = (
  material: string,
  width: number,
  preferences: Preferences,
) => {
  const { twisted_iron_cost, u_profile_cost, solid_web_price_list } =
    preferences;

  return material === "Hierro torsionado"
    ? twisted_iron_cost
    : material === "Perfil u Ángulo"
      ? u_profile_cost
      : calculateSolidWebStructure(width, solid_web_price_list!);
};

/**
 * Calculates the cost for columns if the height differs from the default 5 meters.
 *
 * @param {string} material - Selected material.
 * @param {number} width - Width of the structure.
 * @param {number} length - Length of the structure.
 * @param {number} height - Free height of the structure.
 * @param {Preferences} preferences - User preferences containing column costs.
 * @returns {number} Columns cost.
 */
export const calculateColumnsCost = (
  material: string,
  width: number,
  length: number,
  height: number,
  preferences: Preferences,
) => {
  if (height === 5) return 0;

  const {
    twisted_iron_column_cost,
    u_profile_column_cost,
    solid_web_columns_price_list,
  } = preferences;

  const numberOfColumns = Math.floor(length / 5) + 1;
  const totalColumns = numberOfColumns * 2;

  const columnsPrice =
    material === "Hierro torsionado"
      ? twisted_iron_column_cost
      : material === "Perfil u Ángulo"
        ? u_profile_column_cost
        : calculateSolidWebStructure(width, solid_web_columns_price_list);

  return (
    totalColumns * Math.abs(height - 5) * columnsPrice * (height > 5 ? 1 : -1)
  );
};

/**
 * Calculates the total cost for enclosure, including membrane and color extras.
 *
 * @param {string} structure_type - Type of the structure.
 * @param {number} enclousureArea - Enclosure area.
 * @param {number} sideSheetFactor - Factor for selected side sheets.
 * @param {boolean} has_sides_membrane - Whether side membrane is included.
 * @param {boolean} color_side_sheet - Whether side sheets are colored.
 * @param {Preferences} preferences - User preferences containing costs.
 * @returns {number} Total enclosure cost.
 */
export const calculateEnclousureTotalCost = (
  structure_type: string,
  enclousureArea: number,
  sideSheetFactor: number,
  has_sides_membrane: boolean,
  color_side_sheet: boolean,
  preferences: Preferences,
) => {
  if (structure_type === "Tinglado") return 0;

  const { enclousure_cost, membrane_cost, colored_sheet_difference } =
    preferences;

  const newMembrane_cost = has_sides_membrane ? membrane_cost : 0;
  const unitEnclousureCost =
    enclousure_cost + sideSheetFactor + newMembrane_cost;

  const baseEnclousureCost = enclousureArea * unitEnclousureCost;
  const colorCost = color_side_sheet
    ? enclousureArea * colored_sheet_difference
    : 0;

  return baseEnclousureCost + colorCost;
};

/**
 * Calculates the total cost for roof extras (sheet factors, membrane, color).
 *
 * @param {number} floorArea - Floor area of the structure.
 * @param {number} roofSheetFactor - Factor for selected roof sheets.
 * @param {boolean} has_roof_membrane - Whether roof membrane is included.
 * @param {boolean} color_roof_sheet - Whether roof sheets are colored.
 * @param {Preferences} preferences - User preferences containing costs.
 * @returns {number} Total roof extras cost.
 */
export const calculateRoofExtrasCost = (
  floorArea: number,
  roofSheetFactor: number,
  has_roof_membrane: boolean,
  color_roof_sheet: boolean,
  preferences: Preferences,
) => {
  const { membrane_cost, colored_sheet_difference } = preferences;

  const roofSheetExtraCost =
    roofSheetFactor > 0 ? floorArea * roofSheetFactor : 0;
  const roofMembraneCost = has_roof_membrane ? floorArea * membrane_cost : 0;
  const roofColorCost = color_roof_sheet
    ? floorArea * colored_sheet_difference
    : 0;

  return roofSheetExtraCost + roofMembraneCost + roofColorCost;
};

/**
 * Applies taxes and markup to a total price.
 *
 * @param {number} totalPrice - Base total price.
 * @param {boolean} includes_taxes - Whether taxes are included.
 * @param {Preferences} preferences - User preferences containing tax and markup settings.
 * @returns {number} Final price.
 */
export const applyTaxAndMarkup = (
  totalPrice: number,
  includes_taxes: boolean,
  preferences: Preferences,
) => {
  const { iva_percentage, default_markup } = preferences;

  const priceBeforeTaxes = includes_taxes
    ? totalPrice
    : (totalPrice * (100 - iva_percentage)) / 100;

  return default_markup > 0
    ? priceBeforeTaxes * (1 + default_markup / 100)
    : priceBeforeTaxes;
};

/**
 * Calculates the total budget for a structure.
 *
 * @param {StructureBudgetParams} params - Parameters for budget calculation.
 * @returns {number} Total price in dollars.
 */
export const getStructureBudgetTotal = ({
  preferences,
  width,
  length,
  height,
  enclousure_height,
  structure_type,
  material,
  color_roof_sheet,
  color_side_sheet,
  gutter_metters,
  gates_measurements,
  includes_gate,
  includes_taxes,
  freight_price,
  has_gutter,
  has_roof_membrane,
  has_sides_membrane,
  sideSheetFactor,
  roofSheetFactor,
}: StructureBudgetParams) => {
  const { gate_price, gutter_price } = preferences;

  const floorArea = width * length;

  const enclousureArea = calculateEnclousureArea(
    width,
    length,
    enclousure_height,
  );

  const price_per_meter = calculatePricePerMeter(
    material,
    width,
    preferences,
  );

  // CALCULAR PRECIO DE ESTRUCTURA
  const baseStructureAndRoofCost = floorArea * price_per_meter;

  // CALCULAR COLUMNAS
  const columnsCost = calculateColumnsCost(
    material,
    width,
    length,
    height,
    preferences,
  );

  // CALCULAR COSTO CERRAMIENTO
  const enclousureCost = calculateEnclousureTotalCost(
    structure_type,
    enclousureArea,
    sideSheetFactor,
    has_sides_membrane,
    color_side_sheet,
    preferences,
  );

  // CALCULAR COSTO TECHO
  const roofExtrasCost = calculateRoofExtrasCost(
    floorArea,
    roofSheetFactor,
    has_roof_membrane,
    color_roof_sheet,
    preferences,
  );

  // CALCULAR COSTO DE CANALETAS
  const gutterCost = has_gutter
    ? calculalteGutterPrice(gutter_metters, gutter_price)
    : 0;

  // CALCULAR COSTO DE PORTÓN
  const gateCost = includes_gate
    ? calculateGatePrice(gates_measurements, gate_price)
    : 0;

  // CALCULAR PRECIO TOTAL
  const totalPrice =
    baseStructureAndRoofCost +
    roofExtrasCost +
    columnsCost +
    enclousureCost +
    freight_price +
    gutterCost +
    gateCost;

  return applyTaxAndMarkup(totalPrice, includes_taxes, preferences);
};

/**
 * Calculates the total budget for silos.
 *
 * @param {Preferences} preferences - Preferences containing pricing.
 * @param {boolean} includes_taxes - Whether taxes are included.
 * @param {number} freight_price - Freight price.
 * @param {Silos} silos - Array of silos.
 * @returns {number} Total silo budget in dollars.
 */
export const getSiloBudgetTotal = (
  preferences: Preferences,
  includes_taxes: boolean,
  freight_price: number,
  silos: Silos,
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

/**
 * Calculates the subtotal price for a list of silos.
 *
 * @param {Preferences} preferences - Preferences containing pricing.
 * @param {Silos} silos - Array of silos.
 * @returns {number} Subtotal price.
 */
export const calculateSilosSubtotal = (
  preferences: Preferences,
  silos: Silos,
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

/**
 * Calculates freight price in ARS with taxes and markup.
 *
 * @param {number} freight_price - Freight price in dollars.
 * @param {number} dollar_quote - USD to ARS exchange rate.
 * @param {number} default_markup - Default markup percentage.
 * @param {number} budget_markup - Budget markup percentage.
 * @param {boolean} includes_taxes - Whether taxes are included.
 * @param {number} iva_percentage - IVA percentage.
 * @returns {number} Freight price in ARS.
 */
export const calculateFreightArsPriceWithTaxesAndMarkup = (
  freight_price: number,
  dollar_quote: number,
  default_markup: number,
  budget_markup: number,
  includes_taxes: boolean,
  iva_percentage: number,
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

/**
 * Converts silo prices to ARS with taxes and markup.
 *
 * @param {number[]} silosPrices - Array of silo prices in USD.
 * @param {number} dollar_quote - USD to ARS exchange rate.
 * @param {number} default_markup - Default markup percentage.
 * @param {number} budget_markup - Budget markup percentage.
 * @param {boolean} includes_taxes - Whether taxes are included.
 * @param {number} iva_percentage - IVA percentage.
 * @returns {number[]} Array of silo prices in ARS.
 */
export const getSilosPricestArsPriceWithTaxesAndMarkup = (
  silosPrices: number[],
  dollar_quote: number,
  default_markup: number,
  budget_markup: number,
  includes_taxes: boolean,
  iva_percentage: number,
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

/**
 * Converts silo prices to dollars applying markups.
 *
 * @param {number[]} silosPrices - Array of silo prices in ARS.
 * @param {number} dollar_quote - USD to ARS exchange rate.
 * @param {number} default_markup - Default markup percentage.
 * @param {number} budget_markup - Budget markup percentage.
 * @param {boolean} includes_taxes - Whether taxes are included.
 * @param {number} iva_percentage - IVA percentage.
 * @returns {number[]} Array of silo prices in dollars.
 */
export const getSilosPricesListDollars = (
  silosPrices: number[],
  dollar_quote: number,
  default_markup: number,
  budget_markup: number,
  includes_taxes: boolean,
  iva_percentage: number,
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

/**
 * Calculates individual silo prices based on type and capacity.
 *
 * @param {Silos} silos - Array of silos.
 * @param {Preferences} preferences - Preferences containing pricing.
 * @returns {number[]} Array of individual silo prices.
 */
export const getIndividualSiloPrices = (
  silos: Silos,
  preferences: Preferences,
) => {
  const siloPrices = silos.map((silo) => {
    const prices = (
      preferences as unknown as Record<string, Record<string, number>>
    )[silo.type];

    let price = prices ? prices[silo.capacity as keyof typeof prices] : 0;

    if (silo.type === "airbase_silos" && silo.cone_base !== "estandar") {
      price =
        silo.cone_base === "45"
          ? price * (1 + preferences.cone_base_45 / 100)
          : price * (1 + preferences.cone_base_55 / 100);
    }

    if (silo.type === "feeder_silos" && silo.has_fiber_base) {
      price = price + preferences.fiber_base_cost;
    }

    return price || 0;
  });

  return siloPrices;
};
