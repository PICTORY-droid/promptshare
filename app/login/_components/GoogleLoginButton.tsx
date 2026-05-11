import { signInWithGoogleAction } from "../actions";
import Button from "@/shared/ui/button";

export default function GoogleLoginButton() {
  return (
    <form action={signInWithGoogleAction}>
      <Button type="submit" className="w-full">
        Google로 로그인
      </Button>
    </form>
  );
}
