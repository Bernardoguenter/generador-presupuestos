export function interp1d(area: number[], price: number[]) {
  return function (floor_area: number) {
    console.log("floor_area", floor_area);
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
