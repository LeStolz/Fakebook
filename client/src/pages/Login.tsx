import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, createRef } from "react";
import toast from "react-hot-toast";
import { t } from "@/lib/trpc";
import { Loading } from "@/components/ui/Loading";

export function Login() {
  const navigate = useNavigate();

  const utils = t.useContext();
  const loginUser = t.users.login.useMutation({
    onSuccess: async (user) => {
      utils.users.getCurrent.invalidate(undefined, { exact: true });
      utils.users.getCurrent.setData(undefined, user);

      navigate("/");
    },
    onError: async (error) => {
      toast.error(error.message);
    },
  });

  const emailRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.stopPropagation();
      return;
    }

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email == null || email === "") {
      toast.error("Email is required");
      return;
    }

    if (password == null || password === "") {
      toast.error("Password is required");
      return;
    }

    loginUser.mutate({ email, password });
  };

  return (
    <Card className="grow max-w-sm">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Log in to start exploring!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Label>
            Email
            <Input type="email" required ref={emailRef} className="mb-2" />
          </Label>
          <Label>
            Password
            <Input type="password" required ref={passwordRef} />
          </Label>
          <Button
            type="submit"
            disabled={loginUser.isLoading}
            className="mt-6 w-full text-md"
          >
            {loginUser.isLoading ? <Loading /> : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        Don't have an account?
        <Button variant="link" className="pl-1">
          <Link to="/signup">Sign up now!</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
