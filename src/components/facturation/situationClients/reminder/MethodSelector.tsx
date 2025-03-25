
import { Mail, MessageSquare, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MethodSelectorProps } from "./types";

export const MethodSelector = ({ 
  selectedReminderMethod, 
  onMethodChange 
}: MethodSelectorProps) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Méthode de rappel</h4>
      <Select 
        defaultValue={selectedReminderMethod}
        onValueChange={(value) => onMethodChange(value as 'email' | 'sms' | 'both')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir une méthode" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="email" className="flex items-center">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                <span>Email</span>
              </div>
            </SelectItem>
            <SelectItem value="sms" className="flex items-center">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                <span>SMS</span>
              </div>
            </SelectItem>
            <SelectItem value="both" className="flex items-center">
              <div className="flex items-center">
                <Send className="h-4 w-4 mr-2 text-purple-500" />
                <span>Email et SMS</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
