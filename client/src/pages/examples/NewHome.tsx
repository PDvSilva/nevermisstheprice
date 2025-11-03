import NewHome from "../NewHome";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function NewHomeExample() {
  return (
    <ThemeProvider>
      <NewHome />
    </ThemeProvider>
  );
}
