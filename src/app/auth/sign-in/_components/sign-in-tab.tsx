"use client";

import z from "zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/auth-client";

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignInForm = z.infer<typeof signInSchema>;

const SignInTab = () => {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: SignInForm) => {
    await authClient.signIn.email(
      { ...data },
      {
        onSuccess: ctx => {
          const userId = ctx.data.user.id;
          toast.success("Signed in successfully");
          router.push(`/dashboard/physiotherapist/${userId}`);
        },
        onError: error => {
          toast.error(error.error.message || "Failed to sign in");
        },
      }
    );
  };
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...field} type="email" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input {...field} type="password" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Button type="submit">Sign In</Button>
      </FieldGroup>
    </form>
  );
};

export default SignInTab;
