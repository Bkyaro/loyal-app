import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "@remix-run/react";
import { SignupAction } from "~/components/actions/SignupAction";
import { BirthdayAction } from "~/components/actions/BirthdayAction";
import { PlaceOrderAction } from "~/components/actions/PlaceOrderAction";
import { Layout, Spinner } from "@shopify/polaris";
import { Page } from "@shopify/polaris";

// Define action types as an enum
enum ActionType {
  SIGNUP = "1",
  BIRTHDAY = "2",
  PLACE_ORDER = "3",
}

export default function NewAction() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Get action type from URL parameter
    const create = searchParams.get("create");
    setActionType(create);

    // If no action type is specified, navigate to the default
    if (!create) {
      navigate(`/app/program/points/actions/new?create=${ActionType.SIGNUP}`);
    }

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  // Render the appropriate component based on action type
  const renderActionComponent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center p-8'>
          <Spinner size='large' />
        </div>
      );
    }

    switch (actionType) {
      case ActionType.SIGNUP:
        return <SignupAction />;
      case ActionType.BIRTHDAY:
        return <BirthdayAction />;
      case ActionType.PLACE_ORDER:
        return <PlaceOrderAction />;
      default:
        navigate("/app/program/points/actions");
        return null;
    }
  };

  return renderActionComponent();
}
