import React from "react";
import { useConfirmationDialog } from "../zustand-stores";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export type ConfirmationDialogProps = {
  title: string;
  content: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  hideCancelButton?: boolean;
  confirmButtonText?: string;
  confirmButtonVariant?:
    | "destructive"
    | "link"
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  cancelButtonText?: string;
  twoFactorConfirm?: boolean;
  twoFactorConfirmText?: string;
};

export default function ConfirmationDialog() {
  const props = useConfirmationDialog((store) => store.props);
  const [twoFactorConfirmFieldText, setTwoFactorConfirmFieldText] =
    React.useState("");

  React.useEffect(() => {
    return () => {
      setTwoFactorConfirmFieldText("");
    };
  }, [props]);

  if (!props) return null;

  const {
    title,
    content,
    onCancel,
    onConfirm,
    hideCancelButton = false,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    confirmButtonVariant = "default",
    twoFactorConfirm = false,
    twoFactorConfirmText = "confirm",
  } = props;

  const handleOpenChange = (open: boolean) => {
    if (!open) onCancel();
  };

  return (
    <Dialog open={Boolean(props)} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="text-sm text-zinc-600">{content}</div>

          {twoFactorConfirm ? (
            <div className="flex flex-col gap-3">
              <Label htmlFor="confirmation-text" className="text-zinc-600">
                Enter the text <b>{twoFactorConfirmText}</b> to continue
              </Label>
              <Input
                value={twoFactorConfirmFieldText}
                onChange={(e) => setTwoFactorConfirmFieldText(e.target.value)}
                id="confirmation-text"
              />
            </div>
          ) : null}
        </div>
        <DialogFooter>
          {hideCancelButton ? null : (
            <Button onClick={onCancel} className="w-full" variant="outline">
              {cancelButtonText}
            </Button>
          )}
          <Button
            onClick={onConfirm}
            className="w-full"
            variant={confirmButtonVariant}
            disabled={
              twoFactorConfirm &&
              twoFactorConfirmFieldText !== twoFactorConfirmText
            }
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
