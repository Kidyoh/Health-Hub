import { Button } from "flowbite-react";
import { AiOutlineEdit } from "react-icons/ai"; // For the edit icon

interface ProfileFieldProps {
    label: string;
    value: string | number | undefined;
    onEdit: () => void;
  }
  
  const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, onEdit }) => (
    <div className="flex justify-between items-center border-b pb-3 mb-4">
      <div>
        <h3 className="text-lg font-medium">{label}</h3>
        <p className="text-gray-600">{value || "N/A"}</p>
      </div>
      <Button onClick={onEdit} className="flex items-center gap-1 text-blue-500">
        <AiOutlineEdit />
        Edit
      </Button>
    </div>
  );

export default ProfileField;