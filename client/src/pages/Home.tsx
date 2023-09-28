import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { t } from "@/lib/trpc";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function Home() {
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
    <div className="min-h-screen flex flex-col gap-2 justify-center items-center">
      <h1 className="text-xl">
        {user.isLoading ? <Loading /> : user.data?.email}
      </h1>
      <Button variant="destructive" onClick={() => logoutUser.mutate()}>
        Log out
      </Button>
    </div>
  );
}
