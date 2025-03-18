import NumberFlow from "@number-flow/react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import React from "react";

interface QRCodeDisplayProps {
  data: string;
  currentIndex: number;
  totalChunks: number;
  fileName: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ data, currentIndex, totalChunks, fileName }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-center mb-4">
        <p className="text-lg whitespace-pre">
          Chunk <NumberFlow value={currentIndex + 1} /> of <NumberFlow value={totalChunks} />
        </p>
        <p className="text-sm text-zinc-400">Filename: {fileName}</p>
      </div>

      <div className="bg-white p-4 rounded">
        <QRCode value={data} size={256} level="M" className="mx-auto" />
      </div>
    </div>
  );
};
