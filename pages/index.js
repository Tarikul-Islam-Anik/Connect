import { ProtectedRoute } from "../components/Utilities/protectedRoute";
import Container from "./../components/Container/container";

export default function Home() {
  return (
    <ProtectedRoute>
      <Container />
    </ProtectedRoute>
  );
}
