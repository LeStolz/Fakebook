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

export function Signup() {
  const navigate = useNavigate();

  const utils = t.useContext();
  const signupUser = t.users.signup.useMutation({
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

    signupUser.mutate({ email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="grow max-w-sm">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Sign up to start exploring!</CardDescription>
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
              disabled={signupUser.isLoading}
              className="mt-6 w-full text-md"
            >
              {signupUser.isLoading ? <Loading /> : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          Already have an account?
          <Button variant="link" className="pl-1">
            <Link to="/login">Log in now!</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
