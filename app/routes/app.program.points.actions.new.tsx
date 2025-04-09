import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "@remix-run/react";
import { SignupAction } from "~/components/actions/SignupAction";
import { BirthdayAction } from "~/components/actions/BirthdayAction";
import { PlaceOrderAction } from "~/components/actions/PlaceOrderAction";
import { Loading } from "@shopify/polaris";

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

  // 处理创建action
  const handleCreateAction = (actionData: any) => {
    console.log("Creating action:", {
      type: actionType,
      ...actionData,
    });

    // 在实际应用中，这将是一个API调用来创建action
    // 例如：
    // API.createAction({
    //   type: actionType,
    //   ...actionData
    // })
    //   .then(() => navigate("/app/program/points/actions"))
    //   .catch(error => console.error("Failed to create action:", error));

    // 模拟API调用
    setTimeout(() => {
      navigate("/app/program/points/actions");
    }, 500);
  };

  // Render the appropriate component based on action type
  const renderActionComponent = () => {
    if (loading) {
      return <Loading />;
    }

    switch (actionType) {
      case ActionType.SIGNUP:
        return <SignupAction onSave={handleCreateAction} />;
      case ActionType.BIRTHDAY:
        return <BirthdayAction onSave={handleCreateAction} />;
      case ActionType.PLACE_ORDER:
        return <PlaceOrderAction onSave={handleCreateAction} />;
      default:
        navigate("/app/program/points/actions");
        return null;
    }
  };

  return renderActionComponent();
}
