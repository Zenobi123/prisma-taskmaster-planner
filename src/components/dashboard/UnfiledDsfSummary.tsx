
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client } from '@/types/client';

interface UnfiledDsfSummaryProps {
  clients: Client[];
  isLoading: boolean;
  onViewAllClick: () => void;
}

const UnfiledDsfSummary: React.FC<UnfiledDsfSummaryProps> = ({ 
  clients, 
  isLoading,
  onViewAllClick 
}) => {
  return (
    <Card className="border-[#B4D6FA] bg-[#F0F7FF] shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">DSF non déposées</h3>
              {isLoading ? (
                <div className="h-5 bg-blue-100 animate-pulse rounded w-24 mt-1"></div>
              ) : (
                <p className="text-sm text-gray-600">
                  {clients.length} {clients.length > 1 ? "clients concernés" : "client concerné"}
                </p>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onViewAllClick}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <span>Voir tous</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnfiledDsfSummary;
