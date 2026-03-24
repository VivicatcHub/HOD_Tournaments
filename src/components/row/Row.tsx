interface RowData {
  [key: string]: string | number;
}

interface RowProps {
  enchanted: boolean;
  index: number;
  value: string | number;
}

function Row({ enchanted, index, value }: RowProps) {
  const classNames = `relative z-7 text-xs sm:text-base lg:text-xl ${enchanted ? "enchanted-text" : ""}`;

  return (
    <div
      className={classNames}
      style={enchanted ? { animationDelay: `${index * 0.05}s` } : undefined}
    >
      {value}
    </div>
  );
}

interface RowPlaceProps {
  enchanted: boolean;
  index: number;
}

function RowPlace({ enchanted, index }: RowPlaceProps) {
  const value =
    index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
  return <Row enchanted={enchanted} index={index} value={value} />;
}

interface RowNameProps {
  enchanted: boolean;
  index: number;
  row: RowData;
  value?: string | number;
}

function RowName({ enchanted, index, row, value }: RowNameProps) {
  const displayValue = value !== undefined ? value : row[Object.keys(row)[0]];
  return <Row enchanted={enchanted} index={index} value={displayValue} />;
}

interface RowScoreProps {
  enchanted: boolean;
  index: number;
  row: RowData;
  value?: string | number;
}

function RowScore({ enchanted, index, row, value }: RowScoreProps) {
  const displayValue = value !== undefined ? value : row[Object.keys(row)[1]];
  return <Row enchanted={enchanted} index={index} value={displayValue} />;
}

export { RowPlace, RowName, RowScore, RowData };
