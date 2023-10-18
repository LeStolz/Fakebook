import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { t } from "@/lib/trpc";
import { Loading } from "@/components/ui/Loading";
import { InputPlaceholder } from "@/components/ui/InputPlaceholder";

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.stopPropagation();
      toast.error("Invalid information");
      return;
    }

    const formData = new FormData(event.currentTarget).entries();
    const data = Object.fromEntries(formData) as {
      firstname: string;
      lastname: string;
      email: string;
      repeatedEmail: string;
      password: string;
      birthdate: string;
    };

    const { firstname, lastname, email, repeatedEmail, password, birthdate } =
      data;

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!repeatedEmail || repeatedEmail !== email) {
      toast.error("Emails do not match");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (!firstname || !lastname) {
      toast.error("Name is required");
      return;
    }

    if (!birthdate) {
      toast.error("Birthdate is required");
      return;
    }

    signupUser.mutate({
      firstname,
      lastname,
      email,
      password,
      birthdate,
    });
  };

  return (
    <Card className="grow max-w-md">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>It's quick and easy!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-3">
            <Input
              type="text"
              name="firstname"
              required
              placeholder="First name"
            />
            <Input
              type="text"
              name="lastname"
              required
              placeholder="Last name"
            />
          </div>
          <Input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="mb-3"
          />
          <Input
            type="email"
            name="repeatedEmail"
            required
            placeholder="Repeat email address"
            className="mb-3"
          />
          <Input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="mb-3"
          />
          <InputPlaceholder
            type="date"
            name="birthdate"
            required
            placeholder="Birthdate"
            className="mb-3"
          />
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
  );
}
