import type { PDFImage, StructureBudget } from "@/types";

/**
 * Renders 3D y croquis de galpones/tinglados.
 *
 * Usa el generador de Remeco que está en /public/generador/galpon.html.
 * Se abre en un iframe oculto con las medidas del presupuesto, y el
 * generador devuelve las fotos y los croquis como imágenes JPG.
 */

type GeneradorBudget = Pick<
  StructureBudget,
  | "structure_type"
  | "material"
  | "width"
  | "length"
  | "height"
  | "enclousure_height"
  | "color_side_sheet"
  | "includes_gate"
  | "number_of_gates"
  | "gates_measurements"
>;

type GeneradorImagen = { titulo: string; src: string; w: number; h: number };
type GeneradorResultado = {
  principal?: GeneradorImagen;
  fotos: GeneradorImagen[];
  croquis: GeneradorImagen[];
};

export type StructureRenders = {
  /** Foto 3/4 con las medidas (cotas) dibujadas encima */
  principal: PDFImage | null;
  fotos: PDFImage[];
  croquis: PDFImage[];
};

const GENERADOR_URL = "/generador/galpon.html";
const TIMEOUT_MS = 30000;

/** Solo la empresa Remeco tiene el logo y el rótulo en los croquis. */
export const companyHasRenders = (companyName?: string | null) =>
  /remeco/i.test(companyName ?? "");

const sistemaPorMaterial: Record<string, string> = {
  "Hierro torsionado": "torsionado",
  "Perfil u Ángulo": "perfil",
  "Alma llena": "alma",
};

/** Arma los parámetros del link del generador a partir del presupuesto. */
export const getGeneradorParams = (budget: GeneradorBudget) => {
  const params = new URLSearchParams();
  params.set("ancho", String(budget.width));
  params.set("largo", String(budget.length));
  params.set("alto", String(budget.height));
  params.set("aguas", "2");
  params.set("pend", "10");
  params.set("sistema", sistemaPorMaterial[budget.material] ?? "torsionado");

  // Chapa lateral: el generador pide desde qué altura arranca la chapa.
  // El presupuesto guarda cuántos metros de chapa lleva (desde arriba).
  let cerr = budget.height;
  if (budget.structure_type === "Galpón") {
    const alturas = (budget.enclousure_height ?? []).filter((n) => n > 0);
    const chapa = alturas.length ? Math.max(...alturas) : budget.height;
    cerr = Math.max(0, +(budget.height - chapa).toFixed(2));
  }
  params.set("cerr", String(cerr));

  const gate = budget.gates_measurements?.[0];
  const hasGate =
    budget.structure_type === "Galpón" &&
    budget.includes_gate &&
    budget.number_of_gates > 0 &&
    gate &&
    gate.width > 0;
  params.set("porton", hasGate ? `${gate.width}x${gate.height}` : "0");

  params.set("color", budget.color_side_sheet ? "gris" : "cincalum");
  return params;
};

export const getGeneradorURL = (budget: GeneradorBudget) =>
  `${GENERADOR_URL}?${getGeneradorParams(budget).toString()}`;

/**
 * Abre el generador en un iframe oculto y devuelve las fotos y los croquis.
 * Si algo falla devuelve listas vacías, así el presupuesto sale igual.
 */
export async function getStructureRenders(
  budget: GeneradorBudget,
): Promise<StructureRenders> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  Object.assign(iframe.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: "1800px",
    height: "1200px",
    border: "0",
  });
  iframe.src = getGeneradorURL(budget);
  document.body.appendChild(iframe);

  try {
    const win = await new Promise<Window & { remecoImagenes?: () => Promise<GeneradorResultado> }>(
      (resolve, reject) => {
        const inicio = Date.now();
        const check = () => {
          const w = iframe.contentWindow as
            | (Window & { remecoListo?: boolean; remecoImagenes?: () => Promise<GeneradorResultado> })
            | null;
          if (w?.remecoListo && w.remecoImagenes) return resolve(w);
          if (Date.now() - inicio > TIMEOUT_MS)
            return reject(new Error("El generador de renders no respondió"));
          setTimeout(check, 200);
        };
        check();
      },
    );

    const { principal, fotos, croquis } = await win.remecoImagenes!();
    return {
      principal: principal
        ? {
            src: principal.src,
            title: principal.titulo,
            width: principal.w,
            height: principal.h,
          }
        : null,
      fotos: fotos.map((f) => ({
        src: f.src,
        title: f.titulo,
        width: f.w,
        height: f.h,
        layout: "half",
      })),
      croquis: croquis.map((c) => ({
        src: c.src,
        width: c.w,
        height: c.h,
        layout: "landscape",
      })),
    };
  } catch (error) {
    console.error(error);
    return { principal: null, fotos: [], croquis: [] };
  } finally {
    iframe.remove();
  }
}

/** Fotos y croquis en el orden en que van en el PDF, debajo del presupuesto. */
export const getStructurePDFImages = async (
  budget: GeneradorBudget,
): Promise<PDFImage[]> => {
  const { fotos, croquis } = await getStructureRenders(budget);
  return [...fotos, ...croquis];
};
