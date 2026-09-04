import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useInformation } from "@/hooks/useInformation";

const DEFAULT_LOGO = "/logo.jpeg";

const AuthLogo = () => {
  const { information, fetchInformation } = useInformation();

  useEffect(() => {
    void fetchInformation();
  }, [fetchInformation]);

  return (
    <Link to="/" aria-label="Ir al inicio">
      <img
        src={information?.logo || DEFAULT_LOGO}
        alt="IberoMax"
        className="mx-auto block h-20 w-auto sm:h-24 md:h-28"
        onError={(event) => {
          if (event.currentTarget.src.endsWith(DEFAULT_LOGO)) return;
          event.currentTarget.src = DEFAULT_LOGO;
        }}
      />
    </Link>
  );
};

export default AuthLogo;
