interface Props {
  value?: string;
  onClick?: () => void;
}
export default function Square({ value, onClick }: Props) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}
