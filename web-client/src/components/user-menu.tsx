import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { logout } from "../auth/api";
import { useGetUser } from "../auth/user-store";
import { useConfirmationDialog } from "../zustand-stores";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function UserMenu() {
  const user = useGetUser();
  const navigate = useNavigate();

  const { openConfirmationDialog, closeConfirmationDialog } =
    useConfirmationDialog((store) => ({
      openConfirmationDialog: store.openConfirmationDialog,
      closeConfirmationDialog: store.closeConfirmationDialog,
    }));

  const handleLogoutClick = () => {
    openConfirmationDialog({
      title: "Logout",
      content: <p>You will be logged out from QuesGenie ✨</p>,
      onConfirm: () => {
        logout();
        navigate("/auth/login", { replace: true });
        closeConfirmationDialog();
      },
      onCancel: () => {
        closeConfirmationDialog();
      },
      confirmButtonText: "Logout",
    });
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="border border-white hover:border-primary transition-colors duration-200">
          <AvatarFallback>{user.email.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-8 w-[180px]">
        <DropdownMenuLabel>
          <h6 className="text-sm text-slate-600">My Account</h6>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/setting">
          <DropdownMenuItem className="flex items-center cursor-pointer">
            <Settings className="w-4 h-4 mr-2 text-slate-500" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="flex items-center cursor-pointer"
          onClick={handleLogoutClick}
        >
          <LogOut className="w-4 h-4 mr-2 text-slate-500" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
