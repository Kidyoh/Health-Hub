import { Button } from "flowbite-react";

interface ProfileFieldProps {
    label: string;
    value: string | number;
    editable: boolean;
    onEdit: () => void;
    onSave: () => void;
    onChange: (value: string) => void;
  }
  
  const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, editable, onEdit, onSave, onChange }) => {
    return (
      <div className="flex items-center space-x-4">
        <label className="font-semibold w-1/4">{label}:</label>
        {editable ? (
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-3/4"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <p className="w-3/4">{value}</p>
        )}
        <Button onClick={editable ? onSave : onEdit}>{editable ? "Save" : "Edit"}</Button>
      </div>
    );
  };

export default ProfileField;