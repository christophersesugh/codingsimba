import React from "react";
import { Clock, ChevronRight } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  tags: string[];
  hasVideo: boolean;
  date: string;
}

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  return (
    <Card className="h-full overflow-hidden pt-0 transition-shadow duration-300 hover:shadow-md">
      <div className="relative h-1/2">
        <img
          src={
            "https://img.freepik.com/free-photo/group-elephants-big-green-tree-wilderness_181624-16897.jpg?semt=ais_hybrid&w=740"
          }
          alt={tutorial.title}
          className="h-full w-full object-cover"
        />
        {/* {tutorial.hasVideo && (
          <div className="absolute right-3 top-3 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white">
            Video
          </div>
        )} */}
      </div>
      <CardContent className="px-5 pt-5">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{tutorial.duration}</span>
          </div>
          <span className="mx-2">•</span>
          <Badge variant="outline" className="text-xs font-normal">
            {tutorial.level}
          </Badge>
          <span className="mx-2">•</span>
          <span>{tutorial.date}</span>
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          {tutorial.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {tutorial.description}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {tutorial.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="-mb-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
          Read tutorial
          <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
