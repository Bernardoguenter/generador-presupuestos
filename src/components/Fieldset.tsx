interface FieldsetProps {
  title: string;
  children: React.ReactNode;
}

export const Fieldset = ({ title, children }: FieldsetProps) => (
  <fieldset className="border border-amber-500 rounded mt-2 p-4 lg:p-8">
    <legend className="px-2 text-2xl">{title}</legend>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {children}
    </div>
  </fieldset>
);
