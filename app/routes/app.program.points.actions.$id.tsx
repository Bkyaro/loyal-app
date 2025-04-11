import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { SignupAction } from "~/components/actions/SignupAction";
import { BirthdayAction } from "~/components/actions/BirthdayAction";
import { PlaceOrderAction } from "~/components/actions/PlaceOrderAction";
import { WayToEarn, mockWaysToEarnData } from "~/mock/programData";
import { Loading } from "@shopify/polaris";

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
    // 确保更新数据包含active状态
    // 这里我们使用扩展运算符合并原始数据和更新的数据
    const dataToSave = {
      ...actionData,
      ...updatedData,
    };

    console.log("Saving action:", dataToSave);

    // 在实际应用中，这将是一个API调用来更新action
    // 例如：
    // API.updateAction(id, dataToSave)
    //   .then(() => navigate("/app/program/points/actions"))
    //   .catch(error => console.error("Failed to update action:", error));

    // 模拟API调用的延迟
    setTimeout(() => {
      navigate("/app/program/points/actions");
    }, 500);
  };

  const handleDelete = () => {
    console.log("Deleting action:", id);

    // In a real app, this would be an API call to delete the action
    // 例如：
    // API.deleteAction(id)
    //   .then(() => navigate("/app/program/points/actions"))
    //   .catch(error => console.error("Failed to delete action:", error));

    setTimeout(() => {
      navigate("/app/program/points/actions");
    }, 500);
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
