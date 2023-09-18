import { t } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";

export function Home() {
  const utils = t.useContext();
  const userQuery = t.users.helloClient.useQuery(undefined, {
    initialData: "Say hello to the Server first!",
  });
  const userMutation = t.users.helloServer.useMutation({
    onSuccess: async () => {
      utils.users.helloClient.setData(undefined, "Hi Client!");
      utils.users.helloClient.invalidate(undefined, { exact: true });
    },
  });

  return (
    <div className="h-[100vh] flex flex-col gap-2 justify-center items-center">
      <h1 className="text-xl">
        {userQuery.isLoading ? "Loading..." : userQuery.data}
      </h1>

      <Button onClick={() => userMutation.mutate({ message: "Hello Server!" })}>
        Say hello to the Server!
      </Button>
    </div>
  );
}
