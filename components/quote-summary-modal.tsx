import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Quote {
  clientName: string;
  product: string;
  amount: string;
  status: string;
}

interface QuoteSummaryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  quote: Quote | null;
  onConfirm: () => void;
  onPrint: () => void;
}

export const QuoteSummaryModal = ({ isOpen, onOpenChange, quote, onConfirm, onPrint }: QuoteSummaryModalProps) => {
  if (!quote) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quote Summary</DialogTitle>
        </DialogHeader>
        <div>
          <p><strong>Client:</strong> {quote.clientName}</p>
          <p><strong>Product:</strong> {quote.product}</p>
          <p><strong>Amount:</strong> {quote.amount}</p>
          <p><strong>Status:</strong> {quote.status}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Edit</Button>
          <Button onClick={onPrint}>Print</Button>
          <Button onClick={onConfirm}>Finish</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};