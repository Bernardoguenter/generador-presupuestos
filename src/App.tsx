import { AuthProvider } from "./common/context/AuthContext/AuthProvider";
import AppRoutes from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
