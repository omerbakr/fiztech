import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SignUpTab from "./_components/sign-up-tab";

const Page = () => {
  return (
    <div className="mx-auto my-6 max-w-lg px-4">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpTab />
          <p className="text-muted-foreground mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-primary underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
