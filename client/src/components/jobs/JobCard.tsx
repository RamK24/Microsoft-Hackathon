import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Building, DollarSign, MapPin } from 'lucide-react';

export interface JobData {
    title: string;
    company_name: string;
    job_id: string;
    location: string;
    share_link: string;
    thumbnail?: string;
    extensions?: string[];
    detected_extensions?: {
        salary?: string;
        schedule_type?: string;
        qualifications?: string;
    };
    description?: string;
    job_highlights?: {
        title: string;
        items: string[];
    }[];
}

interface JobCardProps {
    job: JobData;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
    const salary = job.detected_extensions?.salary || job.extensions?.find(ext => ext.includes('$') || ext.includes('hour') || ext.includes('salary')) || '';

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    {job.thumbnail && (
                        <div className="shrink-0 w-12 h-12 rounded overflow-hidden">
                            <img
                                src={job.thumbnail}
                                alt={`${job.company_name} logo`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-lg truncate">{job.title}</h3>

                        <div className="flex flex-col space-y-1 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Building size={14} className="mr-1 shrink-0" />
                                <span className="truncate">{job.company_name}</span>
                            </div>

                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin size={14} className="mr-1 shrink-0" />
                                <span className="truncate">{job.location}</span>
                            </div>

                            {salary && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <DollarSign size={14} className="mr-1 shrink-0" />
                                    <span className="truncate">{salary}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {job.extensions && job.extensions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {job.extensions
                            .filter(ext => ext !== salary)
                            .map((extension, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-primary/5 text-xs"
                                >
                                    {extension}
                                </Badge>
                            ))
                        }
                    </div>
                )}

                {job.description && (
                    <div className="mt-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                        </p>
                    </div>
                )}

                <div className="mt-3 text-right">
                    <a href={job.share_link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-1">
                            <span>Apply</span>
                            <ExternalLink size={14} />
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};