
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
    const permissions = [...currentPermissions];
    const existingPermissionIndex = permissions.findIndex(p => p.module === module);
    
    if (existingPermissionIndex >= 0) {
      permissions[existingPermissionIndex] = { module, niveau };
    } else {
      permissions.push({ module, niveau });
    }
    
    onChange("permissions", permissions);
  };

  return (
    <div className="space-y-4">
      <Label>Permissions d'accès</Label>
      {modules.map((module) => (
        <div key={module} className="flex items-center space-x-4 p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium capitalize">{module}</h4>
          </div>
          <div className="space-x-4 flex items-center">
            {permissions.map((permission) => {
              const isChecked = currentPermissions.some(
                p => p.module === module && p.niveau === permission
              );
              return (
                <label key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handlePermissionChange(module, permission);
                      }
                    }}
                  />
                  <span className="text-sm capitalize">{permission}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
