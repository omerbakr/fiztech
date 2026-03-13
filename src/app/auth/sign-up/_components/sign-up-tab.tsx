"use client";

import z from "zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Input } from "@/components/ui/input";

const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUpTab = () => {
  const router = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSignUp = async (data: SignUpForm) => {
    await authClient.signUp.email(
      { ...data },
      {
        onSuccess: ctx => {
          const userId = ctx.data.user.id;
          toast.success("Sign up successful");
          router.push(`/dashboard/physiotherapist/${userId}`);
        },
        onError: error => {
          toast.error(error.error.message || "Failed to sign up");
        },
      }
    );
  };
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...field} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
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

        <Button type="submit" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Sign Up</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default SignUpTab;
