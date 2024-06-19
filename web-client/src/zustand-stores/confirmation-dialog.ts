import { create } from "zustand";
import { ConfirmationDialogProps } from "../components/confirmation-dialog";

type ConfirmationDialogStoreState = {
  props: ConfirmationDialogProps | null;
  openConfirmationDialog: (props: ConfirmationDialogProps) => void;
  closeConfirmationDialog: () => void;
};

export const useConfirmationDialog = create<ConfirmationDialogStoreState>()(
  (set) => ({
    props: null,
    openConfirmationDialog: (props) => set(() => ({ props })),
    closeConfirmationDialog: () => set(() => ({ props: null })),
  }),
);
