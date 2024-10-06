"use client";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AuthLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Redirect to dashboard or another page after successful login
        router.push("/dashboard");
      } else {
        // Display error message
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            type="email"
            sizing="md"
            className="form-control form-rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="userpwd"
            type="password"
            sizing="md"
            className="form-control form-rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember this Device
            </Label>
          </div>
          <Link href={"/"} className="text-primary text-sm font-medium">
            Forgot Password?
          </Link>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4">
            {error}
          </p>
        )}

        <Button
          type="submit"
          color={"primary"}
          className="w-full bg-primary text-white rounded-xl"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
