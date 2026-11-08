import type { StructureRenders } from "@/helpers";

interface Props {
  renders: StructureRenders | null;
  isLoading: boolean;
}

/** Fotos 3D y croquis del galpón, debajo del presupuesto. */
export const StructureRendersSection = ({ renders, isLoading }: Props) => {
  if (isLoading) {
    return <p className="mt-6">Generando fotos 3D y croquis...</p>;
  }
  if (
    !renders ||
    (!renders.principal && renders.fotos.length === 0 && renders.croquis.length === 0)
  ) {
    return null;
  }

  return (
    <section className="mt-6 flex flex-col gap-6 lg:w-1/2 max-w-[20cm]">
      {renders.principal && (
        <div>
          <h2 className="mb-2 font-bold text-lg">Medidas</h2>
          <img
            src={renders.principal.src}
            alt="Galpón con medidas"
            className="w-full rounded"
          />
        </div>
      )}
      {renders.fotos.length > 0 && (
        <div>
          <h2 className="mb-2 font-bold text-lg">Fotos 3D</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renders.fotos.map((foto) => (
              <figure key={foto.title}>
                <img
                  src={foto.src}
                  alt={foto.title}
                  className="w-full rounded"
                />
                <figcaption className="text-sm mt-1">{foto.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
      {renders.croquis.length > 0 && (
        <div>
          <h2 className="mb-2 font-bold text-lg">Croquis</h2>
          <div className="flex flex-col gap-3">
            {renders.croquis.map((croquis, i) => (
              <img
                key={i}
                src={croquis.src}
                alt={`Croquis ${i + 1}`}
                className="w-full bg-white rounded"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
