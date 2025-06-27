interface Props {
  inputString: string;
  textSize?: "text-xs" | "text-sm" | "text-md" | "text-base";
}

export const StringToList = ({
  inputString,
  textSize = "text-base",
}: Props) => {
  const itemsArray = inputString
    .split(";")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return (
    <ul className={`flex flex-col list-disc list-inside ${textSize}`}>
      {itemsArray.map((item, index) => (
        <li
          key={index}
          className="flex items-center list-disc list-inside">
          {item}
        </li>
      ))}
    </ul>
  );
};
