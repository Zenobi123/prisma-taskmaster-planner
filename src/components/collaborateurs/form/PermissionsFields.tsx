
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ModuleAcces, Permission, CollaborateurPermissions } from "@/types/collaborateur";

interface PermissionsFieldsProps {
  permissions: CollaborateurPermissions[];
  onChange: (field: string, value: CollaborateurPermissions[]) => void;
}

const modules: ModuleAcces[] = [
  "clients",
  "taches",
  "facturation",
  "rapports",
  "planning",
];

const permissions: Permission[] = ["lecture", "ecriture", "administration"];

export function PermissionsFields({
  permissions: currentPermissions,
  onChange,
}: PermissionsFieldsProps) {
  const handlePermissionChange = (module: ModuleAcces, niveau: Permission) => {
    const permissions = currentPermissions.filter(p => p.module !== module);
    permissions.push({ module, niveau });
    onChange("permissions", permissions);
  };

  const getModulePermission = (module: ModuleAcces): Permission | undefined => {
    return currentPermissions.find(p => p.module === module)?.niveau;
  };

  return (
    <div className="space-y-4">
      <Label>Permissions d'accès</Label>
      {modules.map((module) => (
        <div key={module} className="flex items-center space-x-4 p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium capitalize">{module}</h4>
          </div>
          <RadioGroup
            value={getModulePermission(module)}
            onValueChange={(value: Permission) => handlePermissionChange(module, value)}
            className="flex items-center space-x-4"
          >
            {permissions.map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                <RadioGroupItem value={permission} id={`${module}-${permission}`} />
                <Label htmlFor={`${module}-${permission}`} className="text-sm capitalize">
                  {permission}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
