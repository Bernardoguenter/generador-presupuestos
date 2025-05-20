import {
  AuthProvider,
  CompanyProvider,
  PreferencesProvider,
} from "./common/context";
import AppRoutes from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <CompanyProvider>
          <AppRoutes />
        </CompanyProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
};

export default App;
