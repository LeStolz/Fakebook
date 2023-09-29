import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { t } from "@/lib/trpc";
import toast from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import { Facebook, LogOut, User2 } from "lucide-react";

export function NavbarLayout() {
  const navigate = useNavigate();

  const user = t.users.getCurrent.useQuery();
  const logoutUser = t.users.logout.useMutation({
    onSuccess: async () => {
      navigate("/login");
    },
    onError: async (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Card className="flex w-full rounded-none border-x-0 border-t-0 px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="logo.webp" />
                <AvatarFallback>
                  <Facebook />
                </AvatarFallback>
              </Avatar>
              Fakebook
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu className="ml-auto">
          <NavigationMenuList className="w-full flex items-center gap-4">
            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
            <NavigationMenuItem>
              {user.isLoading ? (
                <Loading />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="hover:cursor-pointer hover:brightness-125"
                    asChild
                  >
                    <Avatar>
                      <AvatarImage src={user.data?.email} />
                      <AvatarFallback>
                        <User2 />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="mt-3" align="end">
                    <DropdownMenuItem onClick={() => {}}>
                      <NavigationMenuLink className="flex items-center gap-2">
                        <User2 className="w-4 h-4" />
                        {user.data?.email}
                      </NavigationMenuLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => logoutUser.mutate()}
                      className="flex items-center gap-2 text-destructive focus:bg-destructive focus:text-white"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Card>
      <Outlet />
    </div>
  );
}
