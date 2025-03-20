
interface TotalAmountDisplayProps {
  amount: number;
}

const TotalAmountDisplay = ({ amount }: TotalAmountDisplayProps) => {
  return (
    <div className="flex justify-between p-4 bg-gray-100 rounded-md border border-gray-300 shadow-sm mt-4">
      <h3 className="font-semibold text-lg">Montant total:</h3>
      <p className="font-bold text-xl text-[#3C6255]">{amount.toLocaleString('fr-FR')} XAF</p>
    </div>
  );
};

export default TotalAmountDisplay;
