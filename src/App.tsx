import {
  AuthProvider,
  CompanyProvider,
  PDFProvider,
  PreferencesProvider,
} from "./common/context";
import AppRoutes from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <CompanyProvider>
          <PDFProvider>
            <AppRoutes />
          </PDFProvider>
        </CompanyProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
};

export default App;
