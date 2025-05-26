
import { formatMontant } from "@/utils/formatUtils";

interface TotalAmountDisplayProps {
  amount: number;
}

const TotalAmountDisplay = ({ amount }: TotalAmountDisplayProps) => {
  return (
    <div className="flex justify-between p-2 bg-gray-50 rounded-md border border-gray-300 shadow-sm mt-2">
      <h3 className="font-semibold text-sm">Montant total:</h3>
      <p className="font-bold text-sm text-[#3C6255]">{formatMontant(amount)}</p>
    </div>
  );
};

export default TotalAmountDisplay;
