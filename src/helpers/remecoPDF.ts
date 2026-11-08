import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Company, StructureBudget } from "@/types";
import { getStructureRenders, type StructureRenders } from "./structureRenders";

/**
 * PDF de presupuesto de galpón/tinglado con el diseño de Remeco:
 *  - Hoja 1: presupuesto con un solo precio (el cotizado).
 *  - Hoja 2: "Cómo quedaría": foto principal con las medidas encima y 4 fotos 3D.
 *
 * Las hojas se arman en HTML (A4 a 96 dpi) y se pasan a imagen con html2canvas.
 */

const LOGO = "/generador/logo-remeco.png";
const PAGE_W = 794; // 210 mm a 96 dpi
const PAGE_H = 1123; // 297 mm a 96 dpi

export interface RemecoPDFOptions {
  dollarQuote: number;
  ivaPercentage: number;
  company?: Company | null;
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const num = (n: number) =>
  new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(n);
const pesos = (n: number) => "$ " + num(Math.round(n));
const fecha = (d: Date) =>
  d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

/** Mismo cálculo que la tabla del presupuesto en pantalla. */
export const getStructureTotalArs = (
  budget: Pick<StructureBudget, "total" | "budget_markup">,
  dollarQuote: number,
) =>
  Math.floor(
    (budget.total * (1 + budget.budget_markup / 100) * dollarQuote) / 1000,
  ) * 1000;

const materialTexto: Record<string, string> = {
  "Hierro torsionado": "hierro torsionado",
  "Perfil u Ángulo": "perfil U y ángulo",
  "Alma llena": "alma llena (perfil W)",
};

/** Separa el "Detalle de materiales" (lista con ;) en filas Título / Texto. */
export const detailsToRows = (details: string): [string, string][] => {
  const items = (details ?? "")
    .split(";")
    .map((i) => i.trim())
    .filter(Boolean);
  const rows: [string, string][] = [];
  items.forEach((item, i) => {
    const idx = item.indexOf(":");
    if (idx > 0 && idx < 40) {
      const label = item.slice(0, idx).trim();
      const value = item.slice(idx + 1).trim();
      if (!value) {
        // "Materiales:" sin texto: lo que sigue se suma a la fila anterior
        rows.push([label, ""]);
        return;
      }
      rows.push([label, value.charAt(0).toUpperCase() + value.slice(1)]);
      return;
    }
    const prev = rows[rows.length - 1];
    if (prev && prev[1] === "") {
      prev[1] = item;
      return;
    }
    if (prev && prev[0] === "Materiales") {
      prev[1] += " · " + item;
      return;
    }
    let label = "";
    if (i === 0) label = "Estructura";
    else if (/^port[oó]n/i.test(item)) label = "Portón";
    else if (/canaleta/i.test(item)) label = "Canaletas";
    rows.push([label, item]);
  });
  return rows.filter(([l, v]) => l || v);
};

const enclosureText = (b: StructureBudget) => {
  if (b.structure_type !== "Galpón") return "";
  const hs = b.enclousure_height ?? [];
  if (!hs.length) return "";
  const uniform = hs.every((h) => h === hs[0]);
  if (uniform) {
    const h = hs[0];
    return h >= b.height
      ? "chapa hasta el piso"
      : `${num(h)} m de chapa desde ${num(b.height - h)} m del piso`;
  }
  const [izq, der, fr, fo] = hs;
  return `chapa: ${num(izq)} m lateral izq., ${num(der)} m lateral der., ${num(fr ?? 0)} m frente y ${num(fo ?? 0)} m fondo`;
};

function pageOne(b: StructureBudget, o: RemecoPDFOptions) {
  const total = getStructureTotalArs(b, o.dollarQuote);
  const m2 = b.width * b.length;
  const created = b.created_at ? new Date(b.created_at) : new Date();
  const valid = new Date(created.getTime() + 10 * 24 * 3600 * 1000);
  const isGalpon = b.structure_type === "Galpón";
  // Remeco: en dos aguas el 10 % es sobre el ancho total (20 % por faldón)
  const cumbrera = b.height + b.width * 0.1;
  const nombre = (b.customer ?? "").trim().split(/\s+/)[0] ?? "";
  const chapa = b.color_side_sheet || b.color_roof_sheet ? "chapa color" : "chapa Cincalum";
  const cerr = enclosureText(b);
  const lead = isGalpon
    ? `un galpón metálico cerrado a dos aguas de <b>${num(b.width)} m × ${num(b.length)} m × ${num(b.height)} m de alto</b>, con estructura de ${esc(materialTexto[b.material] ?? b.material.toLowerCase())} y cerramiento de ${chapa}${cerr ? ` (${esc(cerr)})` : ""}.`
    : `un tinglado metálico a dos aguas de <b>${num(b.width)} m × ${num(b.length)} m × ${num(b.height)} m de alto</b>, con estructura de ${esc(materialTexto[b.material] ?? b.material.toLowerCase())}.`;

  const incluye: [boolean, string][] = [
    [true, "Fabricación y materiales"],
    [true, "Montaje completo en obra"],
    [b.includes_taxes, b.includes_taxes ? "IVA incluido" : "IVA"],
    [b.includes_freight, b.includes_freight ? "Flete incluido" : "Flete (según ubicación)"],
    [false, "Hormigón de las bases"],
  ];

  const rows: [string, string][] = [
    [
      "Medidas",
      `${num(b.width)} m de ancho × ${num(b.length)} m de largo. ${num(b.height)} m de alto en los laterales y ${num(cumbrera)} m en la cumbrera (pendiente 10 %).`,
    ],
    ...detailsToRows(b.details),
  ];
  if (cerr && !rows.some(([l]) => /cerramiento/i.test(l)))
    rows.push(["Cerramiento", cerr.charAt(0).toUpperCase() + cerr.slice(1) + "."]);
  if (b.estimatedDelivery) rows.push(["Plazo de entrega", b.estimatedDelivery]);

  const pagos = (b.paymentMethods ?? "")
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  const localidad = b.address?.address ?? "A confirmar";
  const trabajo = `${isGalpon ? "Galpón" : "Tinglado"} ${num(b.width)} × ${num(b.length)} m`;

  return `
  <div class="hd"><img class="lg" src="${LOGO}" crossorigin="anonymous">
    <div class="meta"><b>PRESUPUESTO</b>Fecha <strong>${fecha(created)}</strong><br>Válido hasta <strong>${fecha(valid)}</strong></div></div>
  <div class="boxes">
    <div><span>Cliente</span><b>${esc(b.customer)}</b></div>
    <div><span>Localidad de la obra</span><b>${esc(localidad)}</b></div>
    <div><span>Trabajo</span><b>${esc(trabajo)}</b></div>
  </div>
  <p class="lead">Estimado ${esc(nombre)}: gracias por su consulta. Le acercamos la cotización para la <b>fabricación, provisión de materiales y montaje</b> de ${lead}</p>
  <div class="price">
    <div class="pbox"><div class="l">Precio total</div><div class="v">${pesos(total)}</div>
      <div class="s">${b.includes_taxes ? `IVA ${num(o.ivaPercentage)} % incluido` : `No incluye IVA (${num(o.ivaPercentage)} %)`} · ${num(m2)} m² cubiertos<br>Equivale a ${pesos(total / m2)} por m²</div></div>
    <div class="inc">${incluye.map(([ok, t]) => `<div><i class="${ok ? "ok" : "no"}">${ok ? "✓" : "✕"}</i>${esc(t)}</div>`).join("")}</div>
  </div>
  <h2>Qué incluye el ${isGalpon ? "galpón" : "tinglado"}</h2>
  <table class="det">${rows.map(([l, v]) => `<tr><td>${esc(l)}</td><td>${esc(v)}</td></tr>`).join("")}</table>
  ${pagos.length ? `<h2>Formas de pago</h2><ul class="pagos">${pagos.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}`;
}

function pageTwo(b: StructureBudget, r: StructureRenders) {
  const mat = materialTexto[b.material] ?? b.material.toLowerCase();
  const cap: Record<string, string> = {
    "Portón abierto": "Frente con el portón corredizo abierto.",
    "Vista esquina": "Vista desde la otra esquina.",
    Estructura: `Estructura: pórticos de ${mat} y correas galvanizadas.`,
    Interior: "Interior: cabreadas y portón vistos desde adentro.",
    "Vista frente": "Vista general.",
  };
  const grid = (r.fotos.length >= 5 || !r.principal
    ? r.fotos.filter((f) => f.title !== "Vista frente")
    : r.fotos
  ).slice(0, 4);
  const big = r.principal ?? r.fotos[0];
  return `
  <div class="hd"><img class="lg" src="${LOGO}" crossorigin="anonymous">
    <div class="meta"><b>PRESUPUESTO</b>${esc(b.customer)}</div></div>
  <h2>Cómo quedaría</h2>
  ${big ? `<img class="big" src="${big.src}"><div class="cap">Medidas principales del ${b.structure_type === "Galpón" ? "galpón" : "tinglado"}.</div>` : ""}
  <div class="grid">${grid.map((f) => `<div><img src="${f.src}"><div class="cap">${esc(cap[f.title ?? ""] ?? f.title)}</div></div>`).join("")}</div>
  <p class="note">Imágenes ilustrativas generadas con las medidas del presupuesto. La ubicación del portón y las terminaciones se acuerdan con el cliente.</p>`;
}

const BIG_W = PAGE_W - 112;
const BIG_H = 400;
const GRID_W = (BIG_W - 10) / 2;
const GRID_H = 165;

const CSS = `
.rp{width:${PAGE_W}px;height:${PAGE_H}px;padding:52px 56px 0;box-sizing:border-box;position:relative;background:#fff;color:#1d2427;font-family:Inter,"Helvetica Neue",Arial,sans-serif;font-size:13.5px;line-height:1.4;overflow:hidden}
.rp *{box-sizing:border-box}
.rp .hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #1f2b45;padding-bottom:10px}
.rp .lg{height:68px}
.rp .meta{text-align:right;font-size:12px;color:#5a666c;line-height:1.55}.rp .meta b{color:#1f2b45;font-size:24px;letter-spacing:.1em;display:block;font-weight:800}.rp .meta strong{color:#1d2427}
.rp .boxes{display:flex;border:1px solid #d5dbe2;border-radius:6px;margin-top:20px}
.rp .boxes div{flex:1;padding:9px 14px;border-left:1px solid #d5dbe2}.rp .boxes div:first-child{border-left:0}
.rp .boxes span{display:block;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#5a666c}.rp .boxes b{font-size:14.5px}
.rp .lead{font-size:14.5px;line-height:1.5;margin:16px 0 0}
.rp .price{display:flex;margin-top:18px;border:1px solid #d5dbe2;border-radius:8px;overflow:hidden}
.rp .pbox{flex:1.15;background:#1f2b45;color:#fff;padding:20px 24px}
.rp .pbox .l{font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.8}.rp .pbox .v{font-size:38px;font-weight:800;margin-top:4px;line-height:1.1}.rp .pbox .s{font-size:12px;opacity:.88;margin-top:6px;line-height:1.5}
.rp .inc{flex:1;background:#eef3f7;padding:16px 22px;font-size:13.5px;line-height:1.75}
.rp .inc i{font-style:normal;font-weight:700;display:inline-block;width:20px}.rp .ok{color:#2f7d4f}.rp .no{color:#a5282c}
.rp h2{font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;margin:24px 0 6px;color:#1f2b45;font-weight:800;border-bottom:1px solid #d5dbe2;padding-bottom:7px}
.rp table{width:100%;border-collapse:collapse;font-size:13.5px}.rp td{padding:7px 8px;border-bottom:1px solid #e3e8ec;vertical-align:top}
.rp td:first-child{width:28%;color:#5a666c;font-weight:600}
.rp .pagos{margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.6}
.rp .ft{position:absolute;left:56px;right:56px;bottom:30px;border-top:1px solid #d5dbe2;padding-top:7px;font-size:11px;color:#5a666c;display:flex;justify-content:space-between}
.rp .big{width:100%;height:${BIG_H}px;border-radius:5px;display:block;margin-top:10px}
.rp .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.rp .grid img{width:100%;height:${GRID_H}px;border-radius:5px;display:block}
.rp .cap{font-size:11.5px;color:#5a666c;margin-top:4px}
.rp .note{font-size:11.5px;color:#5a666c;margin-top:10px;line-height:1.45}
`;

/**
 * Recorta una foto a la proporción del recuadro (html2canvas no respeta
 * object-fit y estiraba las fotos, quedaban "petisas").
 */
function recortar(src: string, ratio: number, posY = 0.5): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      let cw = w;
      let ch = Math.round(w / ratio);
      if (ch > h) {
        ch = h;
        cw = Math.round(h * ratio);
      }
      const sx = Math.round((w - cw) / 2);
      const sy = Math.round((h - ch) * posY);
      const c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      c.getContext("2d")!.drawImage(img, sx, sy, cw, ch, 0, 0, cw, ch);
      resolve(c.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

async function recortarFotos(r: StructureRenders): Promise<StructureRenders> {
  return {
    ...r,
    principal: r.principal
      ? { ...r.principal, src: await recortar(r.principal.src, BIG_W / BIG_H, 0.7) }
      : null,
    fotos: await Promise.all(
      r.fotos.map(async (f) => ({
        ...f,
        src: await recortar(f.src, GRID_W / GRID_H, 0.6),
      })),
    ),
  };
}

const footer = (n: number, total: number) =>
  `<div class="ft"><span>Metalúrgica Remeco · Colonia Menonita, La Pampa · metalurgicaremeco1@gmail.com</span><span>Página ${n} de ${total}</span></div>`;

/** Arma el PDF (jsPDF) con el presupuesto y, si hay, la hoja de fotos. */
export async function buildRemecoStructurePDF(
  budget: StructureBudget,
  options: RemecoPDFOptions,
  renders?: StructureRenders | null,
): Promise<jsPDF> {
  const r = renders ?? (await getStructureRenders(budget));
  const hasPhotos = !!r.principal || r.fotos.length > 0;
  const pages = [pageOne(budget, options)];
  if (hasPhotos) pages.push(pageTwo(budget, await recortarFotos(r)));

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  Object.assign(host.style, { position: "fixed", left: "-20000px", top: "0" });
  host.innerHTML =
    `<style>${CSS}</style>` +
    pages
      .map((p, i) => `<div class="rp">${p}${footer(i + 1, pages.length)}</div>`)
      .join("");
  document.body.appendChild(host);

  try {
    await Promise.all(
      Array.from(host.querySelectorAll("img")).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            }),
      ),
    );
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const els = Array.from(host.querySelectorAll<HTMLElement>(".rp"));
    for (let i = 0; i < els.length; i++) {
      const canvas = await html2canvas(els[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: PAGE_W,
        height: PAGE_H,
        windowWidth: PAGE_W,
      });
      if (i > 0) doc.addPage("a4", "portrait");
      doc.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
    }
    return doc;
  } finally {
    host.remove();
  }
}

/** Descarga el PDF de Remeco. */
export async function downloadRemecoStructurePDF(
  budget: StructureBudget,
  options: RemecoPDFOptions,
  renders?: StructureRenders | null,
) {
  const doc = await buildRemecoStructurePDF(budget, options, renders);
  doc.save(`presupuesto ${budget.customer}.pdf`);
}
