import type { TCredit } from "../models/types/TCredit";
import { formatCRC } from "../utils/currency";

type Props = {
  credit: TCredit;
};

export default function CreditBalance({ credit }: Props) {
  return (
    <div className="">
      <p className="font-Lato text-lg">
        Balance: <span className="font-bold">{formatCRC(credit.remaining)}</span>
        {" "}de{" "}
        <span className="font-bold">{formatCRC(credit.assigned)}</span>
      </p>
    </div>
  );
}
