import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpTab from "./_components/sign-up-tab";
import SignInTab from "./_components/sign-in-tab";

const Page = () => {
  return (
    <Tabs defaultValue="signin" className="mx-auto my-6 max-w-lg px-4">
      <TabsList>
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <Card>
        <TabsContent value="signin">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInTab />
          </CardContent>
        </TabsContent>
        <TabsContent value="signup">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Sign up to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpTab />
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default Page;
