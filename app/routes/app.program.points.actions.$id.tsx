import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { SignupAction } from "~/components/actions/SignupAction";
import { BirthdayAction } from "~/components/actions/BirthdayAction";
import { PlaceOrderAction } from "~/components/actions/PlaceOrderAction";
import { WayToEarn, mockWaysToEarnData } from "~/mock/programData";
import { Loading } from "@shopify/polaris";
// Action type mapping based on action title
const actionTypeMap: Record<string, string> = {
  "Signup": "signup",
  "Celebrate a birthday": "birthday",
  "Place an order": "order",
};

export default function EditAction() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [actionData, setActionData] = useState<WayToEarn | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock API call to fetch action data
    const fetchActionData = () => {
      setLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // Find the action with the matching ID
        const actionId = parseInt(id || "0", 10);
        const foundAction = mockWaysToEarnData.find(
          (action) => action.id === actionId,
        );

        if (foundAction) {
          setActionData(foundAction);
        } else {
          // If action not found, navigate back to list
          navigate("/app/program/points/actions");
        }

        setLoading(false);
      }, 800);
    };

    if (id) {
      fetchActionData();
    }
  }, [id, navigate]);

  const handleSave = (updatedData: any) => {
    console.log("Saving action:", { id, ...updatedData });

    // In a real app, this would be an API call to update the action
    // For now, we'll just navigate back to the list
    setTimeout(() => {
      navigate("/app/program/points/actions");
    }, 500);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this action?")) {
      console.log("Deleting action:", id);

      // In a real app, this would be an API call to delete the action
      // For now, we'll just navigate back to the list
      setTimeout(() => {
        navigate("/app/program/points/actions");
      }, 500);
    }
  };

  // Render loading skeleton while fetching data
  if (loading) {
    return <Loading />;
  }

  // Handle action not found
  if (!actionData) {
    return <div>Action not found</div>;
  }

  // Render the appropriate component based on action type
  const renderActionComponent = () => {
    switch (actionData.title) {
      case "Signup":
        return (
          <SignupAction
            isEditing={true}
            initialData={actionData}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      case "Celebrate a birthday":
        return (
          <BirthdayAction
            isEditing={true}
            initialData={actionData}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      case "Place an order":
        return (
          <PlaceOrderAction
            isEditing={true}
            initialData={actionData}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      default:
        return <div>Unsupported action type: {actionData.title}</div>;
    }
  };

  return renderActionComponent();
}
