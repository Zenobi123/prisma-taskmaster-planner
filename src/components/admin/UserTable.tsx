
import { User } from "@/services/userService";

interface UserTableProps {
  credentials: {email: string, role: string}[];
}

export const UserTable = ({ credentials }: UserTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-neutral-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Rôle</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {credentials.map((cred, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{cred.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 capitalize">{cred.role}</td>
            </tr>
          ))}
          {credentials.length === 0 && (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-sm text-neutral-500">Aucun identifiant trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
