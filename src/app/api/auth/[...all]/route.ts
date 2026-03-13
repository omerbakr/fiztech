import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";
import arcjet, {
  BotOptions,
  detectBot,
  EmailOptions,
  protectSignup,
  shield,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from "@arcjet/next";
import { findIp } from "@arcjet/ip";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userIdOrIp"],
  rules: [shield({ mode: "LIVE" })],
});

const botSettings = { mode: "LIVE", allow: [] } satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 10,
  interval: "5m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const laxRateLimitSettings = {
  mode: "LIVE",
  max: 50,
  interval: "5m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: "LIVE",
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export const POST = async (request: Request) => {
  const clonedRequest = request.clone();
  const decision = await checkArcjet(request);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response("Too many requests", { status: 429 });
    } else if (decision.reason.isBot()) {
      return new Response("Bot detected", { status: 403 });
    } else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes?.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed";
      } else if (decision.reason.emailTypes?.includes("INVALID")) {
        message = "Email address format is invalid.";
      } else if (decision.reason.emailTypes?.includes("NO_MX_RECORDS")) {
        message = "Email domain is not valid";
      } else {
        message = "Email validation failed";
      }

      return Response.json({ error: message }, { status: 400 });
    } else {
      return Response.json({ error: "Unknown error" }, { status: 400 });
    }
  }
  return authHandlers.POST(clonedRequest);
};

export const checkArcjet = async (request: Request) => {
  const body = (await request.json()) as unknown;
  const session = await auth.api.getSession({ headers: request.headers });
  const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1";

  const { pathname } = new URL(request.url);
  if (pathname.endsWith("/auth/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          })
        )
        .protect(request, { email: body.email, userIdOrIp });
    } else {
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, { userIdOrIp });
    }
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp });
};
