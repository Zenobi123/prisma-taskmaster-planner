
interface TotalAmountDisplayProps {
  amount: number;
}

const TotalAmountDisplay = ({ amount }: TotalAmountDisplayProps) => {
  return (
    <div className="flex justify-between p-4 bg-gray-50 rounded-md border">
      <h3 className="font-semibold text-lg">Montant total:</h3>
      <p className="font-bold text-lg">{amount.toLocaleString('fr-FR')} XAF</p>
    </div>
  );
};

export default TotalAmountDisplay;
